import type {MetadataRoute} from 'next';
import {pages} from '@/lib/pages';
export default function sitemap():MetadataRoute.Sitemap{return Object.entries(pages).filter(([,page])=>!page.noindex).map(([route])=>({url:'https://4pl.com.pk'+route}));}
