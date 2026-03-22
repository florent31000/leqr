export const metadata = {
  title: "QR Code pour Carte de Visite — LeQR.fr",
  description:
    "Créez un QR code pour votre carte de visite. Lien vers votre site, LinkedIn, portfolio. Dynamique : modifiez l'URL après impression.",
};

export default function QRCodeCarteVisite() {
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
          QR Code pour carte de visite
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Ajoutez un QR code à votre carte de visite pour créer un pont entre le papier et le digital. Vos contacts scannent, et accèdent instantanément à votre site web, votre profil LinkedIn, ou votre portfolio.
        </p>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-blue-900 mb-2">
            Pourquoi un QR code dynamique ?
          </h2>
          <p className="text-blue-800">
            Vous changez de poste ? Votre site web évolue ? Avec un QR code dynamique LeQR, modifiez la destination <strong>après impression</strong>. Vos cartes de visite ne deviennent jamais obsolètes.
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-4">
          Comment créer un QR code pour votre carte de visite
        </h2>
        <ol className="space-y-4 mb-8">
          {[
            "Allez sur LeQR.fr et collez l'URL de votre site web ou profil LinkedIn",
            "Personnalisez les couleurs pour matcher votre charte graphique",
            "Téléchargez en PNG (impression) ou SVG (redimensionnable sans perte)",
            "Intégrez le QR code dans votre design de carte de visite",
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                {i + 1}
              </span>
              <span className="text-gray-700 pt-1">{step}</span>
            </li>
          ))}
        </ol>

        <h2 className="text-2xl font-bold mb-4">Taille recommandée</h2>
        <p className="text-gray-600 mb-8">
          Pour une carte de visite standard (85×55mm), un QR code de <strong>20×20mm minimum</strong> est recommandé. Téléchargez en haute résolution sur LeQR.fr pour un rendu net, même en petit format. Laissez toujours un espace blanc (marge) autour du QR code pour faciliter le scan.
        </p>

        <h2 className="text-2xl font-bold mb-4">Vers quoi pointer votre QR code ?</h2>
        <ul className="space-y-2 mb-8 text-gray-600">
          <li className="flex gap-2"><span>🔗</span> Votre site web ou portfolio</li>
          <li className="flex gap-2"><span>💼</span> Votre profil LinkedIn</li>
          <li className="flex gap-2"><span>📄</span> Votre CV en ligne</li>
          <li className="flex gap-2"><span>📞</span> Votre vCard (contact téléphonique)</li>
          <li className="flex gap-2"><span>📅</span> Votre lien de prise de rendez-vous (Calendly, Cal.com)</li>
        </ul>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Prêt à créer votre QR code ?</h2>
          <p className="text-blue-100 mb-6">Gratuit, sans inscription, haute résolution.</p>
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
