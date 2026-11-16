import nodemailer from 'nodemailer';
import {createHash} from 'node:crypto';

type Env=Record<string,string|undefined>;
export type MailSettings={host:string;port:number;user:string;pass:string;from:string;to:string};
export type Enquiry={name:string;company:string;email:string;origin:string;destination:string;service:string;weight:string;ready:string;details:string};
const emailPattern=/^[^\s<>@,;\r\n]+@[^\s<>@,;\r\n]+\.[^\s<>@,;\r\n]+$/;
const services:Record<string,string>={ocean:'Ocean freight',air:'Air freight',road:'Road transport',supply:'4PL & supply chain management',unsure:'Help me choose'};
export function getMailSettings(env:Env=process.env):MailSettings|null{
  if(env.ENQUIRIES_ENABLED!=='true')return null;
  const host=env.SMTP_HOST?.trim()||'',port=Number(env.SMTP_PORT||587),user=env.SMTP_USER||'',pass=env.SMTP_PASS||'',from=env.SMTP_FROM?.trim()||'',to=env.ENQUIRY_TO?.trim()||'info@4pl.com.pk';
  if(!host||/\s/.test(host)||host.length>255||!Number.isInteger(port)||port<1||port>65535||port===25||!user||!pass||/[\r\n]/.test(user)||!emailPattern.test(from)||!emailPattern.test(to))return null;
  return {host,port,user,pass,from,to};
}
export function validateEnquiry(raw:unknown):{ok:true;value:Enquiry}|{ok:false;error:string}{
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return {ok:false,error:'Please provide valid enquiry details.'};
  const input=raw as Record<string,unknown>;
  if(input._website)return {ok:false,error:'Unable to process this enquiry.'};
  const value={} as Enquiry;
  const lengths:Record<keyof Enquiry,number>={name:100,company:160,email:180,origin:180,destination:180,service:12,weight:24,ready:10,details:2000};
  for(const key of Object.keys(lengths) as (keyof Enquiry)[]){
    const field=input[key]??'';
    if(typeof field!=='string'||field.length>lengths[key]||(key!=='details'&&/[\r\n\x00-\x1f]/.test(field))||(key==='details'&&/\x00/.test(field)))return {ok:false,error:'Some enquiry details are invalid or too long.'};
    value[key]=field.trim();
  }
  if(!value.name||!value.origin||!value.destination||!emailPattern.test(value.email)||!services[value.service])return {ok:false,error:'Enter your name, valid email, origin, destination and logistics solution.'};
  if(value.weight&&(!Number.isFinite(Number(value.weight))||Number(value.weight)<=0))return {ok:false,error:'Cargo weight must be a positive number.'};
  if(value.ready&&(!/^\d{4}-\d{2}-\d{2}$/.test(value.ready)||Number.isNaN(Date.parse(value.ready))||new Date(value.ready).toISOString().slice(0,10)!==value.ready))return {ok:false,error:'Choose a valid cargo ready date.'};
  return {ok:true,value};
}
export function enquiryMessage(value:Enquiry,settings:MailSettings){
  const names:Record<keyof Enquiry,string>={name:'Contact name',company:'Company',email:'Reply email',origin:'Origin',destination:'Destination',service:'Solution',weight:'Approximate weight (kg)',ready:'Cargo ready date',details:'Cargo and handling details'};
  return {
    from:{name:'4PL website enquiries',address:settings.from},to:settings.to,
    replyTo:{name:value.name,address:value.email},
    subject:'4PL shipment enquiry — '+services[value.service],
    text:['A visitor submitted a 4PL shipment enquiry.','',...(Object.keys(names) as (keyof Enquiry)[]).map(k=>names[k]+': '+(k==='service'?services[value.service]:value[k]||'Not provided')),'','This is an enquiry, not a confirmed quotation or booking.'].join('\n'),
    disableFileAccess:true,disableUrlAccess:true,
  };
}
export async function deliverEnquiry(value:Enquiry,settings:MailSettings):Promise<void>{
  const transporter=nodemailer.createTransport({host:settings.host,port:settings.port,secure:settings.port===465,requireTLS:settings.port!==465,auth:{user:settings.user,pass:settings.pass},connectionTimeout:10000,greetingTimeout:10000,socketTimeout:15000,logger:false,debug:false});
  try{const result=await transporter.sendMail(enquiryMessage(value,settings));if(!result.accepted?.length)throw new Error('SMTP did not accept the recipient');}
  finally{transporter.close();}
}
export function makeEnquiryHandlers(deps:{settings:()=>MailSettings|null;deliver:(value:Enquiry,settings:MailSettings)=>Promise<void>;now?:()=>number}){
  // Per-instance, bounded best-effort throttle; not a distributed rate limiter.
  const attempts=new Map<string,{count:number;expires:number}>();
  const json=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
  return {
    GET:async()=>json({enabled:Boolean(deps.settings())}),
    POST:async(request:Request)=>{
      const settings=deps.settings();if(!settings)return json({error:'Email enquiries are not enabled. You can still download a shipment brief.'},503);
      if(request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Unable to process this request.'},403);
      if(!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))return json({error:'Send enquiry details as JSON.'},415);
      const now=deps.now?.()??Date.now();
      for(const [key,bucket] of attempts)if(bucket.expires<=now)attempts.delete(key);
      if(attempts.size>=1000)attempts.delete(attempts.keys().next().value as string);
      const client=request.headers.get('x-vercel-forwarded-for')||request.headers.get('x-forwarded-for')?.split(',')[0].trim()||'unknown';
      const key=createHash('sha256').update(client).digest('hex');const bucket=attempts.get(key)||{count:0,expires:now+600000};
      if(bucket.count>=5)return json({error:'Too many attempts. Please wait and try again later, or download your shipment brief.'},429);
      bucket.count++;attempts.set(key,bucket);
      let raw:unknown;
      try{if(Number(request.headers.get('content-length')||0)>12000)return json({error:'Enquiry details are too large.'},413);const text=await request.text();if(new TextEncoder().encode(text).length>12000)return json({error:'Enquiry details are too large.'},413);raw=JSON.parse(text);}catch{return json({error:'Unable to read the enquiry. Please try again.'},400);}
      const validation=validateEnquiry(raw);if(!validation.ok)return json({error:validation.error},400);
      try{await deps.deliver(validation.value,settings);return json({ok:true,message:'Your enquiry has been accepted for email delivery. This does not confirm a booking or price.'});}
      catch{console.error('4PL enquiry email could not be accepted by the SMTP service.');return json({error:'We could not confirm email acceptance. Your details are still here; check before resubmitting or download your brief.'},502);}
    }
  };
}
