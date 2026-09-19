import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Amiri, Cairo } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/site-url";
import { SITE_NAME, absoluteUrl, DEFAULT_SHARE_IMAGE_PATH } from "@/lib/seo";
import "../globals.css";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-display-en",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["500", "600"],
});

const inter = Inter({
  variable: "--font-sans-en",
  subsets: ["latin"],
});

// Arabic fonts are large (~100 KB each). Preloading them made every English
// page download them too; without preload they are fetched only by pages that
// actually render Arabic text.
const amiri = Amiri({
  variable: "--font-display-ar",
  subsets: ["arabic"],
  style: ["normal", "italic"],
  weight: ["400", "700"],
  preload: false,
});

const cairo = Cairo({
  variable: "--font-sans-ar",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  preload: false,
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(getSiteUrl()),
    title: { default: t("homeTitle"), template: `%s | ${SITE_NAME}` },
    description: t("homeDescription"),
    applicationName: SITE_NAME,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: locale === "ar" ? "ar_EG" : "en_US",
      title: t("homeTitle"),
      description: t("homeDescription"),
      images: [{ url: absoluteUrl(DEFAULT_SHARE_IMAGE_PATH), width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      images: [absoluteUrl(DEFAULT_SHARE_IMAGE_PATH)],
    },
  };
}

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
      className={`${cormorantGaramond.variable} ${inter.variable} ${amiri.variable} ${cairo.variable} h-full antialiased`}
      style={{ colorScheme: "dark" }}
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
