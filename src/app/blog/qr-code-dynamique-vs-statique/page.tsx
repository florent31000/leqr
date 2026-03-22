export const metadata = {
  title: "QR Code Dynamique vs Statique : Lequel Choisir ? — LeQR.fr",
  description:
    "Quelle est la différence entre un QR code statique et dynamique ? Avantages, inconvénients, cas d'usage. Guide complet.",
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
        <h1>QR code dynamique vs statique : lequel choisir ?</h1>
        <p className="text-gray-500 text-sm">22 mars 2026 · 5 min de lecture</p>

        <p>
          Quand vous créez un QR code, vous avez deux options : statique ou dynamique.
          Le choix dépend de votre usage. Voici un guide complet pour vous aider à choisir.
        </p>

        <h2>QR code statique : le basique fiable</h2>
        <p>
          Un QR code statique encode directement l&apos;information (URL, texte, WiFi) dans
          son image. Une fois créé, il ne change plus jamais.
        </p>
        <p><strong>Avantages :</strong></p>
        <ul>
          <li>Gratuit et illimité sur LeQR.fr</li>
          <li>Fonctionne même sans connexion internet (pour les données texte/WiFi)</li>
          <li>Aucune dépendance à un service tiers</li>
          <li>Pas besoin de compte</li>
        </ul>
        <p><strong>Inconvénients :</strong></p>
        <ul>
          <li>Impossible de modifier l&apos;URL après impression</li>
          <li>Pas de suivi des scans (analytics)</li>
          <li>Si l&apos;URL change, le QR code est mort</li>
        </ul>

        <h2>QR code dynamique : la flexibilité totale</h2>
        <p>
          Un QR code dynamique ne contient pas l&apos;URL finale. Il contient un lien court
          (ex: leqr.fr/r/abc123) qui redirige vers votre URL cible. Vous pouvez
          modifier cette destination à tout moment.
        </p>
        <p><strong>Avantages :</strong></p>
        <ul>
          <li>Modifiable après impression — vos supports ne deviennent jamais obsolètes</li>
          <li>Analytics détaillés : nombre de scans, appareils, géolocalisation</li>
          <li>QR code plus compact (URL courte = moins de modules = meilleur scan)</li>
        </ul>
        <p><strong>Inconvénients :</strong></p>
        <ul>
          <li>Nécessite un compte</li>
          <li>Dépend du service LeQR.fr (mais chez nous, vos QR ne meurent jamais)</li>
          <li>Fonctionnalité réservée aux plans Pro et Business</li>
        </ul>

        <h2>Quand utiliser chaque type ?</h2>
        <table>
          <thead>
            <tr>
              <th>Usage</th>
              <th>Recommandation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Test rapide / usage ponctuel</td>
              <td>Statique</td>
            </tr>
            <tr>
              <td>Carte de visite</td>
              <td><strong>Dynamique</strong> (vous changez de job ?)</td>
            </tr>
            <tr>
              <td>Menu restaurant</td>
              <td><strong>Dynamique</strong> (les menus changent)</td>
            </tr>
            <tr>
              <td>WiFi invité</td>
              <td>Statique (le WiFi ne change pas souvent)</td>
            </tr>
            <tr>
              <td>Campagne marketing</td>
              <td><strong>Dynamique</strong> (analytics + redirection)</td>
            </tr>
            <tr>
              <td>Packaging produit</td>
              <td><strong>Dynamique</strong> (mettez à jour les infos)</td>
            </tr>
          </tbody>
        </table>

        <h2>La promesse LeQR</h2>
        <p>
          Chez LeQR.fr, vos QR codes dynamiques <strong>ne meurent jamais</strong>.
          Si vous arrêtez de payer, un petit overlay &quot;Propulsé par LeQR.fr&quot; s&apos;affiche
          3 secondes avant la redirection. Mais vos QR codes continuent de fonctionner.
          Vos cartes de visite imprimées restent valides.
        </p>

        <div className="bg-blue-600 text-white rounded-2xl p-8 text-center not-prose mt-8">
          <h2 className="text-2xl font-bold mb-3">Essayez les deux</h2>
          <p className="text-blue-100 mb-6">QR statiques gratuits et illimités. QR dynamiques dès 9,99€/mois.</p>
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
