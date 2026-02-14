import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "TULIP GARDEN — Тюльпани на 14 лютого та 8 березня | Вінниця, Жмеринка, Бар",
  description:
    "Замовте свіжі тюльпани у Вінниці, Жмеринці та Барі. Доставка на 14 лютого і 8 березня. Вибір сортів, приємні ціни.",
  keywords: [
    "купити тюльпани Вінниця",
    "тюльпани 14 лютого",
    "тюльпани 8 березня",
    "доставка квітів Жмеринка",
    "квіти Бар",
  ],
  openGraph: {
    title: "TULIP GARDEN — Тюльпани | Вінниця, Жмеринка, Бар",
    description:
      "Замовте свіжі тюльпани. Доставка на 14 лютого і 8 березня.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body
        className={`${nunitoSans.variable} font-sans antialiased`}
      >
        <LocalBusinessJsonLd />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
