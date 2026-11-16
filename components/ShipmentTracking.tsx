'use client';
import {useEffect,useState,type FormEvent} from 'react';

type Mode='ocean'|'air'|'road';
type Shipment={reference:string;mode:Mode;origin:string;destination:string;cargo:string;current:number;events:{title:string;place:string;description:string}[]};
const modeNames:Record<Mode,string>={ocean:'Ocean freight',air:'Air freight',road:'Road transport'};
const samples:Record<Mode,Shipment>={
  ocean:{reference:'4PL-DEMO-001',mode:'ocean',origin:'Singapore',destination:'Rotterdam',cargo:'Containerised general cargo',current:2,events:[
    {title:'Shipment booked',place:'Origin',description:'The illustrative shipment has been registered.'},
    {title:'Cargo collected',place:'Singapore',description:'Sample collection and port handoff completed.'},
    {title:'In transit',place:'Ocean transport',description:'The sample shipment is moving between origin and destination.'},
    {title:'Delivered',place:'Rotterdam',description:'Awaiting the final milestone in this demonstration.'}]},
  air:{reference:'4PL-DEMO-002',mode:'air',origin:'Karachi',destination:'Dubai',cargo:'Time-sensitive general cargo',current:2,events:[
    {title:'Shipment booked',place:'Origin',description:'The illustrative air shipment has been registered.'},
    {title:'Cargo accepted',place:'Origin airport',description:'Sample acceptance and handling completed.'},
    {title:'In transit',place:'Air transport',description:'The sample cargo is on the main transport leg.'},
    {title:'Delivered',place:'Destination',description:'Awaiting the final milestone in this demonstration.'}]},
  road:{reference:'4PL-DEMO-003',mode:'road',origin:'Dubai',destination:'Riyadh',cargo:'Palletised general cargo',current:2,events:[
    {title:'Transport planned',place:'Origin',description:'The illustrative road movement has been registered.'},
    {title:'Collected',place:'Collection site',description:'Sample vehicle loading and collection completed.'},
    {title:'In transit',place:'Road transport',description:'The sample consignment is on its transport leg.'},
    {title:'Delivered',place:'Delivery site',description:'Awaiting the final milestone in this demonstration.'}]}
};
const shipments=Object.values(samples);
export default function ShipmentTracking(){
  const [mode,setMode]=useState<Mode>('ocean');
  const [reference,setReference]=useState('');
  const [result,setResult]=useState<Shipment|null>(null);
  const [error,setError]=useState('');
  const [ready,setReady]=useState(false);
  // With JavaScript disabled, the form stays inert and cannot submit a reference to a URL.
  useEffect(()=>{setReady(true);},[]);
  function lookup(e:FormEvent<HTMLFormElement>){
    e.preventDefault();const value=reference.trim().toUpperCase();
    const match=shipments.find(s=>s.reference===value);
    if(!match){setResult(null);setError(value?'Live tracking is not connected. This preview recognises only the three demo references shown below.':'Enter a shipment reference or choose “Explore demo shipment”.');return;}
    setMode(match.mode);setReference(match.reference);setError('');setResult(match);
  }
  function chooseMode(next:Mode){setMode(next);setReference('');setResult(null);setError('');}
  function explore(){const sample=samples[mode];setReference(sample.reference);setResult(sample);setError('');}
  return <main id="main">
    <section className="tracking-hero"><div className="wrap"><nav className="breadcrumbs tracking-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Track shipment</span></nav><div className="tracking-heading"><div><div className="eyebrow">Know the next milestone</div><h1>Your shipment.<br/><em>A clearer picture.</em></h1><p>Follow the journey from collection to delivery. Explore how shipment updates will appear when live tracking is connected.</p></div><div className="tracking-hero-art" aria-hidden="true"><img src="/assets/ocean.svg" width="250" height="150" alt=""/><span>ORIGIN <i>→</i> DESTINATION</span></div></div></div></section>
    <section className="tracking-workspace wrap" aria-label="Shipment tracking">
      <div className="tracking-main"><div className="tracking-search-panel"><div className="tracking-panel-heading"><h2>Find your shipment</h2><span className="demo-badge">Demo mode</span></div><p className="tracking-intro">Live carrier updates are not connected. Use a sample reference to explore the experience.</p><div className="tracking-modes" role="group" aria-label="Choose a sample transport mode">{(['ocean','air','road'] as Mode[]).map(m=><button key={m} type="button" aria-pressed={mode===m} onClick={()=>chooseMode(m)}>{modeNames[m]}</button>)}</div><form id="shipment-lookup" onSubmit={lookup}><label htmlFor="shipment-reference">Shipment reference</label><div className="tracking-input-row"><input id="shipment-reference" value={reference} onChange={e=>{setReference(e.target.value);setResult(null);setError('');}} autoComplete="off" maxLength={80} placeholder={samples[mode].reference} aria-invalid={Boolean(error)} aria-describedby={error?'tracking-error':'tracking-reference-help'}/><button className="btn navy" type="submit" disabled={!ready}>View shipment <span className="arrow" aria-hidden="true">→</span></button></div><p id="tracking-reference-help" className="tracking-reference-help">Sample reference: <code>{samples[mode].reference}</code></p><noscript><p className="formnote">JavaScript is needed to explore this local tracking demonstration.</p></noscript></form><button className="tracking-demo-action" type="button" onClick={explore} disabled={!ready}>Explore demo shipment <span aria-hidden="true">↗</span></button>{error?<p id="tracking-error" className="tracking-error" role="alert">{error}</p>:null}</div>
      <div aria-live="polite" aria-atomic="true">{result?<article className="shipment-result"><div className="shipment-result-top"><div><span className="tracking-label">Illustrative shipment</span><h2>{result.reference}</h2></div><span className="shipment-status">In transit</span></div><div className="shipment-route"><div><span>Origin</span><strong>{result.origin}</strong></div><span className="shipment-route-line" aria-hidden="true">→</span><div><span>Destination</span><strong>{result.destination}</strong></div></div><div className="shipment-facts"><div><span>Transport</span><strong>{modeNames[result.mode]}</strong></div><div><span>Cargo</span><strong>{result.cargo}</strong></div></div><h3 className="milestone-heading">Shipment milestones</h3><ol className="shipment-milestones">{result.events.map((event,i)=><li key={event.title} className={i<result.current?'complete':i===result.current?'current':'upcoming'} aria-current={i===result.current?'step':undefined}><span className="milestone-marker" aria-hidden="true">{i<result.current?'✓':i===result.current?'•':''}</span><div><div className="milestone-title"><h4>{event.title}</h4><span>{i<result.current?'Completed':i===result.current?'Current stage':'Upcoming'}</span></div><small>{event.place}</small><p>{event.description}</p></div></li>)}</ol><p className="shipment-demo-note">Sample data only. These routes do not establish service coverage, and the milestones are not live carrier updates.</p></article>:<div className="tracking-empty"><span aria-hidden="true">A <i>→</i> B</span><h3>Every journey has a next step.</h3><p>Enter a demo reference or choose a sample shipment to see its route, status and milestones.</p></div>}</div></div>
      <aside className="tracking-sidebar"><div className="tracking-help-panel"><div className="eyebrow">A simple starting point</div><h2>What happens<br/>when you track?</h2><ol><li><b>01</b><div><strong>Identify the shipment.</strong><p>A reference identifies the consignment you want to follow.</p></div></li><li><b>02</b><div><strong>Find the latest event.</strong><p>With live tracking, updates come from the connected logistics system.</p></div></li><li><b>03</b><div><strong>See the next milestone.</strong><p>Review the route and progress before planning the next handoff.</p></div></li></ol></div><div className="tracking-assistance"><span className="tracking-label">Planning something new?</span><h3>Start with<br/>your next move.</h3><p>Capture your route and cargo requirements in a shipment brief.</p><a className="btn white" href="/contact">Plan a shipment <span className="arrow" aria-hidden="true">↗</span></a></div><p className="tracking-privacy-note">Demo references are checked within this page. <a href="/privacy-policy">Read the Privacy Policy</a>.</p></aside>
    </section>
  </main>;
}
