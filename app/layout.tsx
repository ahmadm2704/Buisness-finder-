
import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import clsx from 'clsx';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'Business Finder | Discover Businesses Without Websites',
  description: 'A premium tool to find local businesses that need a digital presence.',
  keywords: 'business finder, lead generation, digital marketing, seo, web design leads',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={clsx(outfit.variable, "scroll-smooth")}>
      <body className={clsx(outfit.className, "antialiased selection:bg-cyan-500/30 selection:text-cyan-200")}>
        {/* Background decorative elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px]" />
        </div>

        {children}
      </body>
    </html>
  );
}