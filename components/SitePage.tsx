import { pages } from '@/lib/pages';
export default function SitePage({route}:{route:string}) {
  const page=pages[route];
  // This is trusted, version-controlled editorial markup. User form values are
  // never inserted here; the planning tool only writes them into a text download.
  return <>
    <div dangerouslySetInnerHTML={{__html:page.body}} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(page.schema).replace(/</g,'\\u003c')}} />
  </>;
}
