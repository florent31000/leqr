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
      title="QR Code packaging produit"
      subtitle="Placez un QR sur vos emballages pour diriger vers une notice, un tutoriel, une page SAV, une fiche produit ou une offre complémentaire."
      promise="Le packaging vit plus longtemps qu'une campagne web. Un QR dynamique vous évite de jeter des emballages ou des notices dès qu'un lien doit évoluer."
      staticWhen="Le statique suffit si vous renvoyez vers une page immuable, comme une simple fiche PDF déjà finalisée."
      dynamicWhen="Le dynamique devient utile dès que vous voulez faire évoluer une notice, un contenu SAV, un tutoriel vidéo ou une offre commerciale."
      steps={[
        "Choisissez la destination prioritaire : notice, vidéo, page SAV ou fiche produit.",
        "Téléchargez un QR propre en PNG ou SVG pour votre maquette packaging.",
        "Imprimez et diffusez le même QR sur vos lots, boîtes ou notices.",
        "Activez ensuite le Pro si vous devez changer la destination après lancement.",
      ]}
      placements={[
        "Boîte produit",
        "Étiquette de flacon ou pot",
        "Notice imprimée",
        "Packaging e-commerce",
        "Carton d'expédition",
        "Carte de bienvenue ou d'activation",
      ]}
      ctaTitle="Créez votre QR packaging"
      ctaText="Testez gratuitement votre QR puis gardez la possibilité de faire évoluer la destination sans réimprimer vos emballages."
      ctaLabel="Créer mon QR packaging →"
    />
  );
}
