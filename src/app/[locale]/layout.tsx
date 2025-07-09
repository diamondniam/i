import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/main.css";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import ClientBootstrap from "@/components/ClientBootstrap";
import GlobalProvider from "@/contexts/GlobalContext";
import { twMerge } from "tailwind-merge";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Diamond Niam",
  description: "Let's create something together!",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body
        className={twMerge(`
        ${inter.variable} antialiased
        mainScrollbar
        `)}
      >
        <ClientBootstrap />

        <NextIntlClientProvider>
          <GlobalProvider>{children}</GlobalProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
