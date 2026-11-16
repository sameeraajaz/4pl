import {deliverEnquiry,getMailSettings,makeEnquiryHandlers} from '@/lib/enquiries';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=30;
const handlers=makeEnquiryHandlers({settings:()=>getMailSettings(),deliver:deliverEnquiry});
export const GET=handlers.GET;
export const POST=handlers.POST;
