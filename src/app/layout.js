import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/layout/Providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'Ankerhub - Premium Mobile Accessories in Pakistan',
    template: '%s | Ankerhub',
  },
  description:
    'Shop premium mobile accessories at Ankerhub. Smartphones, power banks, cables, chargers, phone cases, and earbuds. Free delivery across Pakistan on orders above PKR 5,000.',
  keywords: [
    'mobile accessories',
    'smartphones Pakistan',
    'power bank',
    'USB cables',
    'chargers',
    'phone cases',
    'earbuds',
    'Ankerhub',
    'online shopping Pakistan',
  ],
  authors: [{ name: 'Ankerhub' }],
  openGraph: {
    title: 'Ankerhub - Premium Mobile Accessories',
    description: 'Your trusted destination for premium mobile accessories in Pakistan.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Ankerhub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ankerhub - Premium Mobile Accessories',
    description: 'Your trusted destination for premium mobile accessories in Pakistan.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="font-sans min-h-screen flex flex-col bg-white text-gray-900 antialiased">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
