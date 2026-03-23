import UseCaseLanding from "@/components/UseCaseLanding";

export const metadata = {
  title: "QR Code Menu Restaurant — LeQR.fr",
  description:
    "Créez un QR code pour votre menu restaurant. Gardez le même QR sur vos tables et mettez à jour la carte sans réimprimer.",
  alternates: {
    canonical: "/qr-code-menu-restaurant",
  },
};

export default function QRCodeMenuRestaurant() {
  return (
    <UseCaseLanding
      eyebrow="Pour restaurants, cafés et traiteurs"
      title="Créez votre QR code de menu restaurant"
      subtitle="Affichez votre menu sur table, vitrine ou chevalet et mettez-le à jour plus tard sans refaire vos supports."
      whyTitle="Pourquoi c'est utile pour un restaurant"
      whyText="Le QR de menu ne sert pas juste à ouvrir une page. Il sert surtout à garder le même support imprimé même si la carte, les plats du jour ou les horaires changent."
      benefits={[
        {
          icon: "🍽️",
          title: "Menu toujours à jour",
          desc: "Faites évoluer votre carte, vos suggestions ou votre menu du soir sans réimprimer.",
        },
        {
          icon: "📱",
          title: "Scan immédiat",
          desc: "Vos clients scannent en un geste depuis la table, la vitrine ou le comptoir.",
        },
        {
          icon: "📊",
          title: "Suivi simple",
          desc: "Créez votre premier QR modifiable avec compte pour suivre les scans si besoin.",
        },
      ]}
      placementsTitle="Où utiliser votre QR de menu"
      placements={[
        "Sur chaque table",
        "À l'entrée du restaurant",
        "Sur un chevalet extérieur",
        "Sur la vitrine",
        "Sur vos flyers de vente à emporter",
        "Sur vos réseaux sociaux",
      ]}
      faq={[
        {
          q: "Puis-je commencer sans compte ?",
          a: "Oui. Vous pouvez générer et télécharger votre QR tout de suite depuis cette page.",
        },
        {
          q: "Puis-je changer mon menu plus tard ?",
          a: "Oui. C'est exactement l'intérêt du QR modifiable. Le premier est offert avec compte.",
        },
        {
          q: "Est-ce adapté à l'impression ?",
          a: "Oui. Vous pouvez télécharger votre QR en PNG ou SVG pour une impression nette sur table, affiche ou vitrine.",
        },
      ]}
      ctaTitle="Créez votre QR de menu maintenant"
      ctaText="Générez-le ici, téléchargez-le tout de suite, puis passez au modifiable si votre carte évolue."
    />
  );
}
