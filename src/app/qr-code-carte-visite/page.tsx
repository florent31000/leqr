import UseCaseLanding from "@/components/UseCaseLanding";

export const metadata = {
  title: "QR Code pour Carte de Visite — LeQR.fr",
  description:
    "Créez un QR code pour votre carte de visite. Lien vers votre site, LinkedIn, portfolio. Dynamique : modifiez l'URL après impression.",
  alternates: {
    canonical: "/qr-code-carte-visite",
  },
};

export default function QRCodeCarteVisite() {
  return (
    <UseCaseLanding
      eyebrow="Pour indépendants, commerciaux et consultants"
      title="Créez votre QR code pour carte de visite"
      subtitle="Ajoutez un QR sur votre carte pour envoyer vers votre site, LinkedIn, portfolio ou prise de rendez-vous."
      whyTitle="Pourquoi c'est utile sur une carte de visite"
      whyText="Une carte de visite imprimée dure souvent plus longtemps que le lien qu'elle contient. Le QR modifiable permet de garder la même carte même si votre site ou votre profil changent."
      benefits={[
        {
          icon: "💼",
          title: "Plus pro",
          desc: "Ajoutez un accès direct à votre site, LinkedIn ou portfolio.",
        },
        {
          icon: "🖨️",
          title: "Pensé pour l'impression",
          desc: "Téléchargez en PNG ou SVG pour un rendu net sur petit format.",
        },
        {
          icon: "🔄",
          title: "Lien modifiable",
          desc: "Passez au QR modifiable si vous voulez changer l'adresse plus tard.",
        },
      ]}
      placementsTitle="Vers quoi pointer votre QR"
      placements={[
        "Votre site web",
        "Votre profil LinkedIn",
        "Votre portfolio",
        "Votre page de prise de rendez-vous",
        "Votre vCard",
        "Votre CV en ligne",
      ]}
      faq={[
        {
          q: "Quelle taille prévoir sur la carte ?",
          a: "Pour une carte standard, prévoyez environ 20x20 mm minimum avec une marge blanche autour du QR.",
        },
        {
          q: "Puis-je commencer sans compte ?",
          a: "Oui. Vous pouvez générer et télécharger votre QR directement depuis cette page.",
        },
        {
          q: "Puis-je changer le lien plus tard ?",
          a: "Oui. Le premier QR modifiable est offert avec compte, puis le Pro prend le relais pour les QR suivants.",
        },
      ]}
      ctaTitle="Créez votre QR de carte de visite"
      ctaText="Générez-le ici, intégrez-le à votre design, puis passez au modifiable si votre lien doit évoluer."
    />
  );
}
