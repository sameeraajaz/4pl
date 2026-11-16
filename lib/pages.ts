import type { Metadata } from 'next';
import source from '@/data/pages.json';
export type SiteContent = {title:string;description:string;noindex:boolean;body:string;schema:unknown};
export const pages: Record<string,SiteContent> = source;
export function pageMetadata(route:string):Metadata {
  const page=pages[route];
  if(!page)return {title:'Page not found | 4PL',robots:{index:false,follow:true}};
  return {
    title:page.title,description:page.description,
    alternates:{canonical:route},
    robots:{index:!page.noindex,follow:true},
    openGraph:{title:page.title,description:page.description,url:route,type:'website',siteName:'4PL',images:[{url:'/assets/social-cover.png',width:1200,height:630,alt:'4PL — connected logistics'}]},
    twitter:{card:'summary_large_image',title:page.title,description:page.description,images:['/assets/social-cover.png']}
  };
}
