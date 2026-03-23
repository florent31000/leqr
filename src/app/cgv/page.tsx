export const metadata = {
  title: "Conditions Générales de Vente — LeQR.fr",
};

export default function CGV() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <a href="/" className="text-xl font-extrabold text-gray-900">
            Le<span className="text-blue-600">QR</span>
            <span className="text-xs text-gray-400 ml-1">.fr</span>
          </a>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto px-4 py-12 prose prose-gray">
        <h1>Conditions Générales de Vente</h1>
        <p>Dernière mise à jour : mars 2026</p>

        <h2>1. Objet</h2>
        <p>
          Les présentes CGV régissent l&apos;utilisation du service LeQR.fr, un générateur
          de QR codes en ligne proposant des fonctionnalités gratuites et payantes.
        </p>

        <h2>2. Services proposés</h2>
        <h3>Plan Gratuit</h3>
        <ul>
          <li>Téléchargement de QR gratuit sans compte</li>
          <li>1 QR modifiable offert avec compte</li>
          <li>Personnalisation des couleurs</li>
          <li>Téléchargement en PNG et SVG</li>
          <li>Suivi du nombre total de scans</li>
          <li>Tableau de bord pour retrouver ses QR</li>
        </ul>
        <h3>Plan Pro (14,90€/mois ou 149€/an)</h3>
        <ul>
          <li>À partir du 2e QR modifiable</li>
          <li>Modification de l&apos;URL après impression</li>
          <li>50 QR codes modifiables</li>
          <li>Analytics détaillés (source, appareil, historique)</li>
          <li>Redirection instantanée sans overlay</li>
          <li>Support prioritaire</li>
        </ul>

        <h2>3. Tarifs et paiement</h2>
        <p>
          Les tarifs sont indiqués en euros TTC. Le paiement est effectué via Stripe
          par carte bancaire. L&apos;abonnement est renouvelé automatiquement sauf résiliation.
        </p>

        <h2>4. Droit de rétractation</h2>
        <p>
          Conformément à l&apos;article L221-28 du Code de la consommation, le droit de
          rétractation ne s&apos;applique pas aux services pleinement exécutés avant la fin
          du délai de rétractation. Vous pouvez cependant résilier votre abonnement
          à tout moment, effectif à la fin de la période en cours.
        </p>

        <h2>5. Comportement des QR codes après résiliation</h2>
        <p>
          <strong>Vos QR codes ne meurent jamais.</strong> Si vous résiliez votre abonnement Pro,
          vos QR codes continuent de fonctionner mais reviennent à leur URL initiale. Un overlay
          &quot;Propulsé par LeQR.fr&quot; s&apos;affichera pendant 3 secondes avant la redirection.
        </p>

        <h2>6. Responsabilité</h2>
        <p>
          LeQR.fr fournit un service de génération et de redirection de QR codes.
          L&apos;utilisateur est seul responsable du contenu vers lequel ses QR codes redirigent.
        </p>

        <h2>7. Résiliation</h2>
        <p>
          Vous pouvez résilier votre abonnement à tout moment depuis votre tableau de bord.
          La résiliation prend effet à la fin de la période d&apos;abonnement en cours.
        </p>

        <h2>8. Contact</h2>
        <p>
          Pour toute question, contactez-nous à <strong>contact@leqr.fr</strong>.
        </p>
      </div>
    </div>
  );
}
