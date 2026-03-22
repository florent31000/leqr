import type { Metadata } from "next";
import HomePageContent from "@/components/HomePageContent";

export const metadata: Metadata = {
  title: "LeQR.fr — QR statiques gratuits et QR dynamiques pour le print",
  description:
    "Téléchargez un QR statique gratuit sans compte ou créez un QR dynamique pour vos supports imprimés. QR modifiables, analytics et continuité après impression.",
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
        text: "Oui. Les QR statiques sont téléchargeables sans compte sur la homepage. Ils conviennent bien pour un lien fixe, du WiFi, un texte, un email ou un numéro de téléphone.",
      },
    },
    {
      "@type": "Question",
      name: "À quoi sert un QR dynamique ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un QR dynamique passe par LeQR. Il permet de conserver le même QR imprimé, de suivre les scans et d'activer plus tard une modification d'URL sans refaire vos supports.",
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
    "QR statiques gratuits et QR dynamiques conçus pour garder le même code sur les supports imprimés.",
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
