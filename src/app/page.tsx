import type { Metadata } from "next";
import HomePageContent from "@/components/HomePageContent";

export const metadata: Metadata = {
  title: "LeQR.fr — Générateur de QR Code professionnel gratuit",
  description:
    "Créez votre QR code en 30 secondes. Téléchargement gratuit sans compte, puis premier QR modifiable offert avec compte.",
  alternates: {
    canonical: "/",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Puis-je créer un QR code sans compte ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Vous pouvez créer et télécharger votre QR immédiatement, sans compte.",
      },
    },
    {
      "@type": "Question",
      name: "Le premier QR modifiable est-il gratuit ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Votre premier QR modifiable est offert avec compte. A partir du deuxieme, vous passez en Pro.",
      },
    },
  ],
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "LeQR",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "0",
    highPrice: "14.90",
    priceCurrency: "EUR",
  },
  description:
    "Générateur de QR code avec téléchargement gratuit sans compte et QR modifiable offert avec compte.",
  url: "https://leqr.fr",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <HomePageContent />
    </>
  );
}
