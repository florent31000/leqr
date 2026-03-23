import UseCaseLanding from "@/components/UseCaseLanding";

export const metadata = {
  title: "QR Code Packaging Produit — LeQR.fr",
  description:
    "Créez un QR code pour packaging produit, notice, SAV ou contenu marketing. Gardez le même QR sur vos emballages et faites évoluer la destination.",
  alternates: {
    canonical: "/qr-code-packaging-produit",
  },
};

export default function QRCodePackagingProduit() {
  return (
    <UseCaseLanding
      eyebrow="Pour packaging, notices et SAV"
      title="Créez votre QR code pour packaging produit"
      subtitle="Ajoutez un QR sur vos emballages pour renvoyer vers une notice, un tutoriel, une page SAV ou une fiche produit."
      whyTitle="Pourquoi c'est utile sur un packaging"
      whyText="Le packaging reste longtemps entre vos mains et celles de vos clients. Si le lien derrière doit évoluer, mieux vaut garder le même QR plutôt que refaire boîtes, notices ou étiquettes."
      benefits={[
        {
          icon: "📦",
          title: "Sur l'emballage",
          desc: "Ajoutez le QR sur boîte, notice, étiquette ou carte d'activation.",
        },
        {
          icon: "🎥",
          title: "Vers le bon contenu",
          desc: "Renvoyez vers un tutoriel, une notice PDF, une fiche produit ou une page SAV.",
        },
        {
          icon: "♻️",
          title: "Sans réimpression",
          desc: "Gardez le même QR si vos contenus évoluent après le lancement du produit.",
        },
      ]}
      placementsTitle="Où placer votre QR produit"
      placements={[
        "Boîte produit",
        "Étiquette de flacon ou pot",
        "Notice imprimée",
        "Packaging e-commerce",
        "Carton d'expédition",
        "Carte d'activation",
      ]}
      faq={[
        {
          q: "Puis-je l'utiliser pour une notice ?",
          a: "Oui. C'est l'un des usages les plus pratiques pour un QR sur packaging.",
        },
        {
          q: "Puis-je changer le contenu après impression ?",
          a: "Oui. Le QR modifiable sert précisément à ça. Le premier est offert avec compte.",
        },
        {
          q: "Le téléchargement est-il inclus ?",
          a: "Oui. Vous pouvez télécharger le QR en PNG ou SVG pour l'intégrer à votre maquette.",
        },
      ]}
      ctaTitle="Créez votre QR packaging"
      ctaText="Générez votre QR maintenant, puis gardez l'option modifiable si votre contenu produit évolue."
    />
  );
}
