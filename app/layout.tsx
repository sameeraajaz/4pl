import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL('https://4pl.com.pk'),
  title: '4PL | Freight Forwarding & Supply Chain Management',
  description: 'Connected freight forwarding and fourth-party logistics.',
  icons: {icon:'/assets/favicon.png',apple:'/assets/apple-touch-icon.png'},
};
export const viewport: Viewport = { themeColor: '#C2410C' };
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}<Script src="/assets/site.js" strategy="afterInteractive" /></body></html>;
}
