import type { Metadata } from "next";
import "./globals.css";
import ChatBot from "@/components/ChatBot";
import CookieBanner from "@/components/CookieBanner";
import AnalyticsScripts from "@/components/AnalyticsScripts";

export const metadata: Metadata = {
  metadataBase: new URL("https://leqr.fr"),
  title: "LeQR.fr — QR statiques gratuits et QR dynamiques pour le print",
  description:
    "Téléchargez un QR statique gratuit sans compte ou créez un QR dynamique pour vos supports imprimés. Analytics, modification d'URL et continuité sans réimpression.",
  keywords:
    "QR code, générateur QR code, QR code gratuit, QR code dynamique, QR code statique, QR code professionnel",
  openGraph: {
    title: "LeQR.fr — QR statiques gratuits et QR dynamiques pour le print",
    description:
      "Créez un QR statique gratuit sans compte ou un QR dynamique pensé pour vos supports imprimés.",
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
    title: "LeQR.fr — QR statiques gratuits et QR dynamiques",
    description:
      "Créez vos QR pour le print, suivez les scans et gardez le même code même si vos liens évoluent.",
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
