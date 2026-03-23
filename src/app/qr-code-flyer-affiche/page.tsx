import UseCaseLanding from "@/components/UseCaseLanding";

export const metadata = {
  title: "QR Code pour Flyer et Affiche — LeQR.fr",
  description:
    "Créez un QR code pour flyer, affiche ou campagne print. Mesurez les scans et changez la destination sans réimprimer.",
  alternates: {
    canonical: "/qr-code-flyer-affiche",
  },
};

export default function QRCodeFlyerAffiche() {
  return (
    <UseCaseLanding
      eyebrow="Pour flyers, affiches et campagnes print"
      title="Créez votre QR code pour flyer ou affiche"
      subtitle="Envoyez vers une offre, une landing page ou une prise de rendez-vous, puis gardez la possibilité de faire évoluer le lien plus tard."
      whyTitle="Pourquoi c'est utile pour le print"
      whyText="Quand un flyer est imprimé, le coût n'est pas le QR. Le coût, c'est de devoir refaire les supports si l'offre ou la destination change."
      benefits={[
        {
          icon: "🧾",
          title: "Parfait pour le print",
          desc: "Téléchargez votre QR en PNG ou SVG pour vos flyers, affiches et PLV.",
        },
        {
          icon: "🎯",
          title: "Trafic ciblé",
          desc: "Renvoyez vers une landing précise, une offre locale ou une prise de rendez-vous.",
        },
        {
          icon: "🔄",
          title: "Lien modifiable",
          desc: "Créez un compte pour garder la possibilité de modifier le lien plus tard.",
        },
      ]}
      placementsTitle="Où utiliser votre QR print"
      placements={[
        "Flyers distribués en boîte aux lettres",
        "Affiches vitrines",
        "PLV en magasin",
        "Affichage salon ou stand",
        "Chevalets de trottoir",
        "Coupons ou bons imprimés",
      ]}
      faq={[
        {
          q: "Puis-je télécharger le QR tout de suite ?",
          a: "Oui. Cette page permet de générer et télécharger le QR immédiatement, sans compte.",
        },
        {
          q: "Puis-je suivre les scans ?",
          a: "Oui. Avec compte, vous obtenez un QR modifiable avec compteur de scans.",
        },
        {
          q: "Et si ma campagne change ?",
          a: "Passez au modifiable pour garder le même QR même si votre offre ou votre URL changent après impression.",
        },
      ]}
      ctaTitle="Préparez votre campagne print"
      ctaText="Créez votre QR ici, imprimez-le, puis rendez-le modifiable si la campagne doit évoluer."
    />
  );
}
