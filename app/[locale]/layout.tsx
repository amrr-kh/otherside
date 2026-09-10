import type { Metadata } from "next";
import { Fraunces, Inter, Amiri, Cairo } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import "../globals.css";

const fraunces = Fraunces({
  variable: "--font-display-en",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
});

const inter = Inter({
  variable: "--font-sans-en",
  subsets: ["latin"],
});

const amiri = Amiri({
  variable: "--font-display-ar",
  subsets: ["arabic"],
  style: ["normal", "italic"],
  weight: ["400", "700"],
});

const cairo = Cairo({
  variable: "--font-sans-ar",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "OtherSide — See the Reality Behind the Veil.",
  description:
    "OtherSide is a premium unisex fashion brand from Egypt. Oversized hoodies and wide-leg pants built for the full silhouette.",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale as Locale);
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${fraunces.variable} ${inter.variable} ${amiri.variable} ${cairo.variable} h-full antialiased`}
    >
      <body
        data-locale={locale}
        className="min-h-full flex flex-col bg-bg text-warm-white"
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
