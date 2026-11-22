import {notFound} from 'next/navigation';
import SitePage from '@/components/SitePage';
import {pageMetadata, pages} from '@/lib/pages';

type Params = {slug: string[]};

export function generateStaticParams() {
  return Object.keys(pages)
    .filter((route) => route !== '/' && route !== '/404')
    .map((route) => ({slug: route.slice(1).split('/')}));
}

export async function generateMetadata({params}: {params: Promise<Params>}) {
  const {slug} = await params;
  return pageMetadata('/' + slug.join('/'));
}

export default async function ContentPage({params}: {params: Promise<Params>}) {
  const {slug} = await params;
  const route = '/' + slug.join('/');
  if (!pages[route] || route === '/404') notFound();
  return <SitePage route={route} />;
}
