import type { Metadata } from "next";
import "./globals.css";
import ChatBot from "@/components/ChatBot";
import CookieBanner from "@/components/CookieBanner";
import AnalyticsScripts from "@/components/AnalyticsScripts";

export const metadata: Metadata = {
  metadataBase: new URL("https://leqr.fr"),
  title: "LeQR.fr — Générateur de QR Code professionnel gratuit",
  description:
    "Créez votre QR code en 30 secondes. Téléchargement gratuit sans compte, puis premier QR modifiable offert avec compte.",
  keywords:
    "QR code, générateur QR code, QR code gratuit, QR code modifiable, QR code professionnel",
  openGraph: {
    title: "LeQR.fr — Générateur de QR Code professionnel gratuit",
    description:
      "Créez votre QR code en 30 secondes. Gratuit sans compte, puis QR modifiable offert avec compte.",
    type: "website",
    locale: "fr_FR",
    url: "https://leqr.fr",
    siteName: "LeQR.fr",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "LeQR.fr",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LeQR.fr — Générateur de QR Code professionnel",
    description:
      "Créez votre QR, téléchargez-le gratuitement et passez au modifiable si vous en avez besoin.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
        <ChatBot />
        <CookieBanner />
        <AnalyticsScripts />
      </body>
    </html>
  );
}
