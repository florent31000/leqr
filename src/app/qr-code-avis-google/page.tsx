import UseCaseLanding from "@/components/UseCaseLanding";

export const metadata = {
  title: "QR Code Avis Google — Boostez vos avis clients — LeQR.fr",
  description:
    "Créez un QR code qui pointe vers votre page d'avis Google. Placez-le en caisse, sur l'addition ou en boutique, puis faites évoluer votre destination si besoin.",
  alternates: {
    canonical: "/qr-code-avis-google",
  },
};

export default function QRCodeAvisGoogle() {
  return (
    <UseCaseLanding
      eyebrow="Pour commerces, cabinets et points de vente"
      title="Créez votre QR code pour avis Google"
      subtitle="Envoyez vos clients vers la bonne page d'avis au bon moment: en caisse, sur l'addition ou sur une carte de remerciement."
      whyTitle="Pourquoi ça marche pour les avis Google"
      whyText="Le vrai sujet n'est pas de demander un avis. Le vrai sujet est de supprimer la friction. Un QR bien placé évite à vos clients de chercher votre fiche Google."
      benefits={[
        {
          icon: "⭐",
          title: "Plus simple pour le client",
          desc: "Un scan suffit pour arriver directement sur votre page d'avis.",
        },
        {
          icon: "🏪",
          title: "Parfait en point de vente",
          desc: "Placez le QR en caisse, sur le comptoir, sur l'addition ou sur une carte.",
        },
        {
          icon: "📊",
          title: "Scans suivis",
          desc: "Créez votre premier QR modifiable avec compte pour suivre les scans et ajuster votre dispositif.",
        },
      ]}
      placementsTitle="Où placer votre QR avis Google"
      placements={[
        "Comptoir ou caisse",
        "Ticket de caisse",
        "Facture ou devis",
        "Carte de remerciement",
        "Carte de visite",
        "Vitrine du magasin",
      ]}
      faq={[
        {
          q: "Puis-je le créer sans compte ?",
          a: "Oui. Vous pouvez générer et télécharger votre QR immédiatement depuis cette page.",
        },
        {
          q: "Comment suivre les scans ?",
          a: "Créez un compte pour obtenir votre premier QR modifiable avec compteur de scans.",
        },
        {
          q: "Puis-je changer la page cible plus tard ?",
          a: "Oui. Si votre fiche ou votre page intermédiaire change, le QR modifiable sert précisément à ça.",
        },
      ]}
      ctaTitle="Boostez vos avis Google"
      ctaText="Créez votre QR maintenant, imprimez-le, puis passez au modifiable si vous voulez suivre les scans ou ajuster la destination."
    />
  );
}
