export const metadata = {
  title: "Comment Créer un QR Code Gratuit en 2026 — LeQR.fr",
  description:
    "Guide étape par étape pour créer un QR code gratuit en haute résolution. Sans inscription, sans filigrane, en 30 secondes.",
};

export default function Article() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="text-xl font-extrabold text-gray-900">
            Le<span className="text-blue-600">QR</span>
            <span className="text-xs text-gray-400 ml-1">.fr</span>
          </a>
          <a href="/blog" className="text-sm text-gray-500 hover:text-gray-700">
            ← Blog
          </a>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-4 py-16 prose prose-gray prose-lg">
        <h1>Comment créer un QR code gratuit en 2026</h1>
        <p className="text-gray-500 text-sm">14 mars 2026 · 3 min de lecture</p>

        <p>
          Vous avez besoin d&apos;un QR code pour votre carte de visite, votre flyer ou votre
          vitrine ? Voici comment en créer un gratuitement, en haute résolution, en moins
          de 30 secondes.
        </p>

        <h2>Étape 1 : Allez sur LeQR.fr</h2>
        <p>
          Pas besoin de créer un compte. Pas besoin de télécharger une application.
          Ouvrez simplement <a href="https://leqr.fr">leqr.fr</a> dans votre navigateur.
        </p>

        <h2>Étape 2 : Choisissez le type de contenu</h2>
        <p>LeQR.fr supporte 5 types de QR codes :</p>
        <ul>
          <li><strong>URL</strong> — lien vers un site web</li>
          <li><strong>WiFi</strong> — connexion automatique au réseau</li>
          <li><strong>Texte</strong> — message libre</li>
          <li><strong>Email</strong> — ouvre l&apos;application de messagerie</li>
          <li><strong>Téléphone</strong> — lance un appel</li>
        </ul>

        <h2>Étape 3 : Entrez vos données</h2>
        <p>
          Collez votre URL, tapez votre texte, ou entrez les informations WiFi.
          Le QR code se génère automatiquement en temps réel à droite de l&apos;écran.
        </p>

        <h2>Étape 4 : Personnalisez (optionnel)</h2>
        <p>
          Choisissez la couleur de votre QR code pour l&apos;adapter à votre charte graphique.
          8 couleurs prédéfinies + un sélecteur de couleur personnalisé.
        </p>

        <h2>Étape 5 : Téléchargez</h2>
        <p>Deux formats disponibles :</p>
        <ul>
          <li><strong>PNG</strong> — idéal pour l&apos;impression et le web (haute résolution)</li>
          <li><strong>SVG</strong> — format vectoriel, redimensionnable sans perte de qualité</li>
        </ul>

        <h2>C&apos;est tout ?</h2>
        <p>
          Oui, c&apos;est tout. Pas de filigrane &quot;Powered by...&quot;, pas de limite de téléchargement,
          pas de pub intrusive. LeQR.fr est un outil simple et honnête, fait pour les
          professionnels pressés.
        </p>

        <div className="bg-blue-600 text-white rounded-2xl p-8 text-center not-prose mt-8">
          <h2 className="text-2xl font-bold mb-3">Prêt ?</h2>
          <p className="text-blue-100 mb-6">Créez votre QR code maintenant. 30 secondes. Gratuit.</p>
          <a
            href="/"
            className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-xl hover:shadow-xl transition-all"
          >
            Créer mon QR code →
          </a>
        </div>
      </article>
    </div>
  );
}
