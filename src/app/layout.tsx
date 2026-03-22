import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import ChatBot from "@/components/ChatBot";

export const metadata: Metadata = {
  title: "LeQR.fr — Générateur de QR Codes Professionnel Gratuit",
  description:
    "Créez des QR codes professionnels en 30 secondes. Gratuit, français, sans inscription. QR codes dynamiques, analytics, personnalisation.",
  keywords:
    "QR code, générateur QR code, créer QR code, QR code gratuit, QR code dynamique, QR code professionnel",
  openGraph: {
    title: "LeQR.fr — Créez votre QR Code Pro en 30 secondes",
    description:
      "Générateur de QR codes professionnel français. Gratuit, simple, fiable.",
    type: "website",
    locale: "fr_FR",
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18033544712"
          strategy="afterInteractive"
        />
        <Script id="google-ads-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-18033544712');`}
        </Script>
      </body>
    </html>
  );
}
