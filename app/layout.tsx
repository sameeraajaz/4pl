import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL('https://4pl.com.pk'),
  title: '4PL | Freight Forwarding & Supply Chain Management',
  description: 'Connected freight forwarding and fourth-party logistics.',
  icons: {
    icon: [
      {url: '/assets/favicon.svg', type: 'image/svg+xml'},
      {url: '/assets/favicon.png', sizes: '512x512', type: 'image/png'},
    ],
    apple: '/assets/apple-touch-icon.png',
  },
};
export const viewport: Viewport = { themeColor: '#F36F21' };
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}<Script src="/assets/site.js" strategy="afterInteractive" /></body></html>;
}
