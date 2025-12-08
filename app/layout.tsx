import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Business Finder - Find Businesses Without Websites",
  description: "Discover businesses worldwide that don't have a website yet",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}