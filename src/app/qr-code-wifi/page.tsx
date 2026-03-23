import UseCaseLanding from "@/components/UseCaseLanding";

export const metadata = {
  title: "QR Code WiFi — Partagez votre WiFi en un scan — LeQR.fr",
  description:
    "Créez un QR code WiFi gratuit. Vos invités, clients ou collaborateurs se connectent en un scan. Plus besoin de dicter le mot de passe.",
  alternates: {
    canonical: "/qr-code-wifi",
  },
};

export default function QRCodeWifi() {
  return (
    <UseCaseLanding
      eyebrow="Pour cafés, restaurants, bureaux et accueil"
      title="Créez votre QR code WiFi"
      subtitle="Partagez votre réseau en un scan, sans dicter le mot de passe à chaque nouveau client, invité ou collaborateur."
      whyTitle="Pourquoi c'est utile pour le WiFi"
      whyText="Le QR WiFi est l'un des usages les plus simples et les plus utiles: un scan, et la connexion est lancée. C'est parfait pour l'accueil, la salle ou le comptoir."
      benefits={[
        {
          icon: "📶",
          title: "Connexion immédiate",
          desc: "Le client scanne et rejoint le réseau sans ressaisie fastidieuse.",
        },
        {
          icon: "☕",
          title: "Très pratique en accueil",
          desc: "Parfait pour restaurant, café, coworking, salle d'attente ou bureau.",
        },
        {
          icon: "🖨️",
          title: "Prêt à imprimer",
          desc: "Téléchargez le QR en PNG ou SVG pour l'afficher proprement.",
        },
      ]}
      placementsTitle="Où afficher votre QR WiFi"
      placements={[
        "Sur un comptoir",
        "Sur une table",
        "À l'accueil",
        "En salle de réunion",
        "Dans une salle d'attente",
        "Sur une affichette murale",
      ]}
      faq={[
        {
          q: "Puis-je le générer sans compte ?",
          a: "Oui. Le QR WiFi peut être généré et téléchargé immédiatement depuis cette page.",
        },
        {
          q: "Est-ce compatible smartphone ?",
          a: "Oui. Les QR WiFi sont pris en charge nativement par la plupart des iPhone et Android récents.",
        },
        {
          q: "Ai-je besoin d'un QR modifiable pour le WiFi ?",
          a: "Pas forcément. Pour un réseau stable, le téléchargement simple suffit souvent très bien.",
        },
      ]}
      ctaTitle="Créez votre QR WiFi"
      ctaText="Générez-le ici et affichez-le tout de suite à l'accueil, sur table ou au comptoir."
    />
  );
}
