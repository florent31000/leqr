import UseCaseLanding from "@/components/UseCaseLanding";

export const metadata = {
  title:
    "QR Code pour comédien, photographe, musicien — Lien vers votre bande démo — LeQR.fr",
  description:
    "Mettez un QR code modifiable sur votre carte de comédien, CV artistique ou book photo. Changez le lien vers votre bande démo sans réimprimer vos supports.",
  alternates: {
    canonical: "/qr-code-portfolio-creatif",
  },
};

export default function QRCodePortfolioCreatif() {
  return (
    <UseCaseLanding
      eyebrow="Pour comédiens, photographes, musiciens, auteurs"
      title="Un QR code modifiable pour votre portfolio créatif"
      subtitle="Sur votre carte de comédien, votre book, votre CV artistique : un seul QR qui pointe toujours vers votre dernière bande démo, même après impression."
      whyTitle="Pensé pour les professionnels créatifs"
      whyText="Vous venez de sortir une nouvelle bande démo, un nouveau clip, un nouveau shooting ? Votre carte imprimée la semaine dernière est déjà dépassée. Avec un QR modifiable, vous changez le lien en 10 secondes et toutes vos cartes se mettent à jour, partout."
      benefits={[
        {
          icon: "🎭",
          title: "Pour votre bande démo",
          desc: "Pointez vers votre dernière vidéo Vimeo, YouTube ou Google Drive. Changez-la quand vous voulez, le QR reste le même.",
        },
        {
          icon: "📸",
          title: "Pour votre portfolio",
          desc: "Photographes, vidéastes, illustrateurs : un seul QR sur vos cartes, dirigé vers votre site ou dossier de référence du moment.",
        },
        {
          icon: "🔄",
          title: "Zéro réimpression",
          desc: "Vos 500 cartes sont imprimées ? Pas grave, vous gardez le même QR et vous mettez à jour le lien directement depuis votre espace.",
        },
      ]}
      placementsTitle="Où glisser votre QR"
      placements={[
        "Carte de visite comédien / photographe",
        "CV artistique ou book imprimé",
        "Flyer de concert, affiche de spectacle",
        "Jaquette de CD, livret de démo",
        "Signature email ou page contact",
        "Dossier de presse papier",
      ]}
      faq={[
        {
          q: "Je peux changer la vidéo vers laquelle mon QR pointe ?",
          a: "Oui, c'est exactement l'intérêt. Votre premier QR modifiable est offert : vous modifiez la destination en 10 secondes, sans recréer de QR et sans réimprimer vos cartes.",
        },
        {
          q: "Ça marche pour Vimeo, YouTube, Google Drive ?",
          a: "Oui. Le QR pointe vers n'importe quelle URL : vidéo Vimeo/YouTube non listée, fichier Google Drive, page de votre site, dossier Dropbox, etc.",
        },
        {
          q: "Je pourrai voir combien de directeurs de casting ont scanné ?",
          a: "Oui. Votre QR avec compte affiche le nombre total de scans. En Pro, vous voyez aussi les dates, appareils et sources.",
        },
        {
          q: "Je fais imprimer plusieurs cartes différentes, je peux toutes les lier au même QR ?",
          a: "Oui. Un seul QR suffit, vous pouvez l'imprimer autant de fois que vous voulez, sur tous les supports que vous voulez.",
        },
      ]}
      ctaTitle="Votre bande démo ne sera plus jamais dépassée"
      ctaText="Créez le QR ici, téléchargez-le, posez-le sur vos cartes. Vous mettrez à jour le lien aussi souvent que vous changez de projet."
    />
  );
}
