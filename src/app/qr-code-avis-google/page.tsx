export const metadata = {
  title: "QR Code Avis Google — Boostez vos avis clients — LeQR.fr",
  description:
    "Créez un QR code qui pointe vers votre page d'avis Google. Collectez plus d'avis 5 étoiles facilement.",
};

export default function QRCodeAvisGoogle() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="text-xl font-extrabold text-gray-900">
            Le<span className="text-blue-600">QR</span>
            <span className="text-xs text-gray-400 ml-1">.fr</span>
          </a>
          <a
            href="/"
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Créer mon QR code
          </a>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-6">
          QR Code pour collecte d&apos;avis Google
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Les avis Google sont le premier critère de choix pour 87% des consommateurs français. Un QR code bien placé multiplie par 3 le nombre d&apos;avis reçus.
        </p>

        <h2 className="text-2xl font-bold mb-4">Pourquoi ça marche</h2>
        <p className="text-gray-600 mb-8">
          Le problème n&apos;est pas que vos clients ne veulent pas laisser un avis. C&apos;est qu&apos;ils oublient, ou que c&apos;est trop compliqué. Un QR code scanné en caisse, sur l&apos;addition ou le ticket de caisse supprime toute friction : <strong>1 scan → page d&apos;avis Google → écrire → publier</strong>.
        </p>

        <h2 className="text-2xl font-bold mb-4">Comment trouver votre lien d&apos;avis Google</h2>
        <ol className="space-y-4 mb-8">
          {[
            "Allez sur Google Maps et cherchez votre établissement",
            "Cliquez sur « Écrire un avis »",
            "Copiez l'URL de la page",
            "Collez cette URL dans LeQR.fr et générez votre QR code",
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                {i + 1}
              </span>
              <span className="text-gray-700 pt-1">{step}</span>
            </li>
          ))}
        </ol>

        <h2 className="text-2xl font-bold mb-4">Où placer votre QR code</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {[
            "Comptoir / caisse enregistreuse",
            "Ticket de caisse / facture",
            "Carte de visite",
            "Vitrine du magasin",
            "Emballage produit",
            "Email de confirmation / remerciement",
          ].map((place) => (
            <div
              key={place}
              className="bg-white border border-gray-100 rounded-lg p-4 text-sm text-gray-700"
            >
              ✓ {place}
            </div>
          ))}
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-green-900 mb-2">
            Astuce Pro : utilisez un QR dynamique
          </h3>
          <p className="text-green-800 text-sm">
            Avec un QR dynamique LeQR, vous pouvez suivre le nombre de scans et ainsi mesurer l&apos;efficacité de chaque emplacement. Vous pouvez aussi changer l&apos;URL de destination si vous changez d&apos;établissement ou de page d&apos;avis.
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Boostez vos avis Google dès maintenant
          </h2>
          <p className="text-blue-100 mb-6">
            Créez votre QR code avis Google en 30 secondes. Gratuit.
          </p>
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
