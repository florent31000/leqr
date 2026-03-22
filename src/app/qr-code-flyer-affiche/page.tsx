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
      title="QR Code pour flyer et affiche"
      subtitle="Ajoutez un QR à vos campagnes print pour envoyer vers une offre, une landing page ou une prise de rendez-vous, puis faites évoluer la destination si la campagne change."
      promise="Un flyer imprimé coûte plus cher qu'un QR. Le vrai gain est de ne pas devoir le refaire quand l'offre, le lien ou la campagne évoluent."
      staticWhen="Le statique convient pour une opération courte, un lien fixe ou un support jetable."
      dynamicWhen="Le dynamique est recommandé pour toute campagne suivie dans le temps, multi-emplacements ou liée à un budget d'acquisition."
      steps={[
        "Créez la landing page ou l'offre que votre flyer doit promouvoir.",
        "Générez un QR et téléchargez-le en haute définition.",
        "Imprimez le même QR sur vos affiches, flyers ou PLV.",
        "Suivez les scans et passez en Pro si vous devez changer la destination après diffusion.",
      ]}
      placements={[
        "Flyers distribués en boîte aux lettres",
        "Affiches vitrines",
        "PLV en magasin",
        "Affichage salon ou stand",
        "Chevalets de trottoir",
        "Coupons et bons de réduction imprimés",
      ]}
      ctaTitle="Préparez votre campagne print"
      ctaText="Téléchargez un QR statique tout de suite ou créez un QR dynamique pour piloter votre campagne sur la durée."
      ctaLabel="Créer mon QR print →"
    />
  );
}
