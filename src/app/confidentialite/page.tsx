export const metadata = {
  title: "Politique de confidentialité — LeQR.fr",
};

export default function Confidentialite() {
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
        <h1>Politique de confidentialité</h1>
        <p>Dernière mise à jour : mars 2026</p>

        <h2>Données collectées</h2>
        <h3>Utilisateurs non inscrits</h3>
        <p>
          Aucune donnée personnelle nominative n&apos;est collectée pour la génération de QR codes
          sans compte. Aucune inscription n&apos;est requise.
        </p>

        <h3>Utilisateurs inscrits</h3>
        <p>Lors de la création d&apos;un compte, nous collectons :</p>
        <ul>
          <li>Adresse email</li>
          <li>Mot de passe (chiffré, nous n&apos;y avons pas accès)</li>
        </ul>

        <h3>Analytics de scans</h3>
        <p>
          Lorsqu&apos;un QR code est scanné, nous enregistrons de manière anonyme :
        </p>
        <ul>
          <li>Adresse IP (pour la géolocalisation approximative)</li>
          <li>Type d&apos;appareil (mobile/desktop)</li>
          <li>Date et heure du scan</li>
        </ul>
        <p>Ces données sont uniquement accessibles au propriétaire du QR code.</p>

        <h2>Utilisation des données</h2>
        <p>Vos données sont utilisées exclusivement pour :</p>
        <ul>
          <li>Gérer votre compte et vos QR codes</li>
          <li>Fournir les statistiques de scans</li>
          <li>Traiter les paiements (via Stripe)</li>
        </ul>
        <p>
          <strong>Nous ne vendons, ne louons et ne partageons jamais vos données</strong> avec des
          tiers à des fins commerciales.
        </p>

        <h2>Hébergement et sécurité</h2>
        <p>
          Vos données sont hébergées par Supabase (infrastructure AWS, région Europe)
          et Vercel. Les communications sont chiffrées via HTTPS.
        </p>

        <h2>Vos droits (RGPD)</h2>
        <p>Conformément au RGPD, vous disposez d&apos;un droit de :</p>
        <ul>
          <li>Accès à vos données personnelles</li>
          <li>Rectification de vos données</li>
          <li>Suppression de votre compte et de vos données</li>
          <li>Portabilité de vos données</li>
        </ul>
        <p>
          Pour exercer ces droits, contactez-nous à <strong>contact@leqr.fr</strong>.
        </p>

        <h2>Cookies</h2>
        <p>
          LeQR.fr utilise uniquement des cookies techniques nécessaires au fonctionnement
          du service (session d&apos;authentification). Aucun cookie publicitaire ou de tracking
          n&apos;est utilisé.
        </p>
      </div>
    </div>
  );
}
