import {pages} from '@/lib/pages';
export default function SiteShell({children}:Readonly<{children:React.ReactNode}>){
  const body=pages['/'].body;
  const start=body.indexOf('<main');const end=body.indexOf('</main>')+7;
  return <div className="site-root"><div className="shell-fragment" dangerouslySetInnerHTML={{__html:body.slice(0,start)}}/>{children}<div className="shell-fragment" dangerouslySetInnerHTML={{__html:body.slice(end)}}/></div>;
}
