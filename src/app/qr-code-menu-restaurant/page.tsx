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
      title="QR Code menu restaurant"
      subtitle="Affichez le même QR sur vos tables, chevalets et vitrine puis mettez à jour votre carte sans refaire vos supports."
      promise="Le bon usage du QR restaurant n'est pas de générer un carré de plus. C'est de garder le même QR même si vos plats, prix ou menus du jour changent."
      staticWhen="Le statique suffit si vous pointez vers un PDF figé ou un lien qui ne bougera jamais."
      dynamicWhen="Le dynamique devient la meilleure option dès que vous changez des plats, des horaires, un menu du soir ou un lien de réservation."
      steps={[
        "Préparez votre page menu, votre PDF ou votre page de réservation.",
        "Générez d'abord un QR statique si vous voulez tester immédiatement.",
        "Créez ensuite votre QR dynamique avec compte pour le poser durablement sur vos supports.",
        "Passez en Pro le jour où vous avez besoin de changer la destination sans réimprimer.",
      ]}
      placements={[
        "Sur chaque table",
        "À l'entrée du restaurant",
        "Sur les sets de table ou chevalets",
        "Sur les flyers de vente à emporter",
        "Sur vos stories et posts sociaux",
        "Sur votre vitrine pour les passants",
      ]}
      ctaTitle="Créez votre QR de menu maintenant"
      ctaText="Testez d'abord un QR statique gratuit ou préparez votre QR dynamique pour votre carte imprimée."
      ctaLabel="Créer mon QR menu →"
    />
  );
}
