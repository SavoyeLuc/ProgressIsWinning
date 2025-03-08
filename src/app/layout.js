import { Geist_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const geistSans = Geist_Sans({ 
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

export const metadata = {
  title: 'Reddit Clone',
  description: 'A simple Reddit-like website built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable}`}>
        <Header />
        <main className="min-h-screen max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
} 