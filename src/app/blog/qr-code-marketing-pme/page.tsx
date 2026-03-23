export const metadata = {
  title: "7 Façons d'Utiliser les QR Codes pour votre PME — LeQR.fr",
  description:
    "Découvrez 7 stratégies concrètes pour utiliser les QR codes dans votre petite entreprise : cartes de visite, vitrine, packaging, avis Google...",
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
        <h1>7 façons d&apos;utiliser les QR codes pour votre PME</h1>
        <p className="text-gray-500 text-sm">15 mars 2026 · 6 min de lecture</p>

        <p>
          Les QR codes ne sont pas réservés aux grandes entreprises. Voici 7 manières
          concrètes dont une petite entreprise française peut les utiliser dès aujourd&apos;hui.
        </p>

        <h2>1. Carte de visite augmentée</h2>
        <p>
          Ajoutez un QR code à votre carte de visite qui pointe vers votre site web,
          votre LinkedIn, ou un portfolio en ligne. Le papier rencontre le digital.
        </p>
        <p>
          <strong>Astuce :</strong> utilisez un QR modifiable pour pouvoir changer la
          destination si vous changez de poste.
        </p>

        <h2>2. Vitrine connectée</h2>
        <p>
          Un QR code en vitrine qui pointe vers vos promotions du moment, vos horaires
          actualisés, ou votre catalogue. Les passants scannent même quand le magasin
          est fermé.
        </p>

        <h2>3. Avis Google automatiques</h2>
        <p>
          Placez un QR code en caisse qui emmène directement sur votre page d&apos;avis Google.
          Multiplier les avis 5 étoiles n&apos;a jamais été aussi simple.
        </p>

        <h2>4. Menu digital</h2>
        <p>
          Restaurants, cafés, traiteurs : un QR code sur chaque table qui pointe vers
          votre menu en ligne. Mettez à jour les plats et les prix en temps réel.
        </p>

        <h2>5. Packaging intelligent</h2>
        <p>
          Un QR code sur l&apos;emballage de votre produit qui pointe vers un tutoriel vidéo,
          un guide d&apos;utilisation, ou une page de garantie. Réduisez les appels au SAV.
        </p>

        <h2>6. Flyers et affiches mesurables</h2>
        <p>
          Avec un QR via LeQR, vous savez exactement combien de personnes ont scanné
          votre flyer. Fini les campagnes print &quot;à l&apos;aveugle&quot;.
        </p>

        <h2>7. WiFi invité</h2>
        <p>
          Affichez un QR code WiFi dans votre salle d&apos;attente, votre salon de coiffure
          ou votre bureau. Vos clients se connectent en un scan — plus besoin de
          dicter le mot de passe.
        </p>

        <h2>Combien ça coûte ?</h2>
        <p>
          Sur LeQR.fr, vous pouvez télécharger un <strong>QR statique gratuit sans compte</strong>
          ou créer <strong>1 QR modifiable offert avec compte</strong>. Pour créer
          d&apos;autres QR modifiables, modifier l&apos;URL après impression et supprimer
          l&apos;overlay, le plan Pro est à 14,90€/mois.
        </p>

        <div className="bg-blue-600 text-white rounded-2xl p-8 text-center not-prose mt-8">
          <h2 className="text-2xl font-bold mb-3">
            Lancez-vous
          </h2>
          <p className="text-blue-100 mb-6">
            Créez votre premier QR code en 30 secondes. Statique gratuit ou dynamique avec compte.
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
