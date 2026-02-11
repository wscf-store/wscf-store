'use client';

import { IoLogoWhatsapp } from 'react-icons/io5';
import { usePathname } from 'next/navigation';

export default function WhatsAppButton({ productName }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');
  if (isAdminPage) return null;

  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+92XXXXXXXXXX';
  const cleanPhone = phoneNumber.replace(/[^0-9+]/g, '');

  let message = 'Hi! I am interested in your products at WSCF Store.';
  if (productName) {
    message = `Hi! I am interested in "${productName}" from WSCF Store. Can you provide more details?`;
  }

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Chat on WhatsApp"
    >
      <div className="relative">
        {/* Pulse Ring */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25" />
        
        {/* Button */}
        <div className="relative w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 transition-all duration-300 hover:scale-110">
          <IoLogoWhatsapp className="h-7 w-7 text-white" />
        </div>

        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden group-hover:block animate-fade-in">
          <div className="bg-white text-gray-800 text-sm font-medium px-4 py-2 rounded-xl shadow-xl whitespace-nowrap">
            Chat with us!
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-8 border-transparent border-l-white" />
          </div>
        </div>
      </div>
    </a>
  );
}
