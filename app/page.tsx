import SitePage from '@/components/SitePage';
import {pageMetadata} from '@/lib/pages';
export const metadata=pageMetadata('/');
export default function HomePage(){return <SitePage route="/" />;}
