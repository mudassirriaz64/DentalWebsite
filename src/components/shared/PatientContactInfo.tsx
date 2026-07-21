import React from 'react';
import { Phone } from 'lucide-react';

const WhatsAppIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-emerald-500 hover:fill-emerald-600 transition-colors">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.057 5.284 5.341 0 11.848 0c3.151.001 6.112 1.229 8.337 3.456 2.225 2.228 3.45 5.187 3.447 8.337-.006 6.564-5.29 11.848-11.795 11.848-1.996-.002-3.956-.508-5.717-1.472L0 24zm6.59-4.846c1.66.986 3.284 1.489 4.936 1.492 5.275 0 9.57-4.294 9.575-9.569.001-2.556-.994-4.959-2.802-6.77C16.549 2.506 14.156 1.5 11.603 1.5 6.326 1.5 2.03 5.794 2.025 11.07c0 1.748.47 3.456 1.36 4.966l-.994 3.633 3.722-.976-.066-.003zM16.75 14.15c-.27-.135-1.597-.788-1.845-.877-.249-.09-.43-.135-.61.135-.18.27-.697.877-.855 1.058-.158.18-.315.202-.585.067-2.704-1.35-3.37-2.502-4.04-3.66-.18-.31-.18-.54-.09-.675.09-.135.27-.315.405-.472.135-.157.18-.27.27-.45.09-.18.045-.337-.023-.472-.068-.135-.61-1.463-.836-2.003-.22-.53-.44-.457-.61-.466-.157-.008-.338-.01-.52-.01-.18 0-.473.067-.72.337-.248.27-.945.923-.945 2.25 0 1.327.968 2.61 1.103 2.79.135.18 1.905 2.91 4.613 4.08.644.278 1.147.444 1.538.568.648.206 1.237.177 1.702.108.518-.077 1.597-.653 1.823-1.283.225-.63.225-1.17.157-1.283-.068-.112-.248-.18-.518-.315z" />
  </svg>
);

interface PatientContactInfoProps {
  name: string;
  email: string;
  phone?: string | null;
  whatsapp?: string | null;
}

export default function PatientContactInfo({
  name,
  email,
  phone,
  whatsapp,
}: PatientContactInfoProps) {
  return (
    <>
      <span className="font-bold text-slate-900 text-sm leading-tight hover:underline">
        {name}
      </span>
      <span className="text-xs text-slate-500 font-sans mt-0.5 hover:underline">
        {email}
      </span>
      {(phone || whatsapp) && (
        <div className="flex gap-3 mt-1.5 items-center select-none" onClick={(e) => e.stopPropagation()}>
          {phone && (
            <a
              href={`tel:${phone.replace(/\D/g, '')}`}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:text-[#002020] transition-colors"
              title={`Call ${name}`}
            >
              <Phone className="w-3 h-3 text-primary" /> Call Phone
            </a>
          )}
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
              title={`WhatsApp message ${name}`}
            >
              <WhatsAppIcon /> WhatsApp
            </a>
          )}
        </div>
      )}
    </>
  );
}
