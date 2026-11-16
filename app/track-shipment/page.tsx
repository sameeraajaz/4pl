import type {Metadata} from 'next';
import SiteShell from '@/components/SiteShell';
import ShipmentTracking from '@/components/ShipmentTracking';
export const metadata:Metadata={title:'Track Your Shipment — Tracking Preview | 4PL',description:'Explore the 4PL shipment tracking experience with sample ocean, air and road shipments. Live carrier tracking is not connected.',alternates:{canonical:'/track-shipment'},robots:{index:false,follow:true}};
export default function TrackShipmentPage(){return <SiteShell><ShipmentTracking/></SiteShell>;}
