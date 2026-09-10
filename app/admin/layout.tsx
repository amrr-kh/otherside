import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

// Admin is a separate root layout (outside [locale]) — English-only,
// so it loads its own font instead of inheriting from the storefront.
const inter = Inter({
  variable: "--font-sans-en",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OtherSide Admin",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-screen bg-warm-white font-sans text-soft-black">
        {children}
      </body>
    </html>
  );
}
