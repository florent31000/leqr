import UseCaseLanding from "@/components/UseCaseLanding";

export const metadata = {
  title: "QR Code pour Événement — Billetterie, check-in, infos — LeQR.fr",
  description:
    "Créez des QR codes pour vos événements : check-in, programme, billetterie. QR dynamiques modifiables après impression des supports.",
  alternates: {
    canonical: "/qr-code-evenement",
  },
};

export default function QRCodeEvenement() {
  return (
    <UseCaseLanding
      eyebrow="Pour salons, conférences et événements"
      title="Créez votre QR code pour événement"
      subtitle="Utilisez un QR pour le programme, les infos pratiques, les inscriptions, les photos ou le feedback."
      whyTitle="Pourquoi c'est utile pour un événement"
      whyText="Un événement évolue vite avant, pendant et après la date. Le bon QR vous évite de changer vos supports à chaque mise à jour."
      benefits={[
        {
          icon: "🎟️",
          title: "Pour le programme",
          desc: "Renvoyez vers la page de l'événement, le planning ou les infos pratiques.",
        },
        {
          icon: "📍",
          title: "Sur tous les supports",
          desc: "Affiches, badges, flyers, chevalets, écrans ou signalétique.",
        },
        {
          icon: "🔄",
          title: "Modifiable si besoin",
          desc: "Gardez le même QR si l'URL change entre l'avant et l'après événement.",
        },
      ]}
      placementsTitle="Où utiliser votre QR événement"
      placements={[
        "Affiches d'accueil",
        "Badges ou billets",
        "Signalétique sur place",
        "Flyers ou programmes imprimés",
        "Tables ou stands",
        "Emails et pages d'inscription",
      ]}
      faq={[
        {
          q: "Puis-je créer le QR sans compte ?",
          a: "Oui. Vous pouvez générer et télécharger votre QR directement depuis cette page.",
        },
        {
          q: "Puis-je changer la destination plus tard ?",
          a: "Oui. Le premier QR modifiable est offert avec compte, ce qui est pratique si votre programme évolue.",
        },
        {
          q: "Puis-je suivre les scans ?",
          a: "Oui. Avec compte, vous obtenez un QR modifiable avec compteur de scans.",
        },
      ]}
      ctaTitle="Préparez votre QR événement"
      ctaText="Créez-le ici, imprimez-le, puis rendez-le modifiable si votre événement change."
    />
  );
}
