export const metadata = {
  title: "QR Code pour Événement — Billetterie, check-in, infos — LeQR.fr",
  description:
    "Créez des QR codes pour vos événements : check-in, programme, billetterie. QR dynamiques modifiables après impression des supports.",
  alternates: {
    canonical: "/qr-code-evenement",
  },
};

export default function QRCodeEvenement() {
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
          QR Code pour événements
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Conférences, salons, mariages, concerts — les QR codes simplifient la logistique et enrichissent l&apos;expérience des participants.
        </p>

        <h2 className="text-2xl font-bold mb-4">Cas d&apos;usage pour vos événements</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {[
            {
              title: "Check-in rapide",
              desc: "Imprimez un QR code unique sur chaque billet. Scan à l'entrée = vérification instantanée.",
            },
            {
              title: "Programme & infos pratiques",
              desc: "Un QR code sur les affiches / flyers qui pointe vers le programme en ligne, actualisé en temps réel.",
            },
            {
              title: "Feedback post-événement",
              desc: "QR code sur les tables ou les sièges. Les participants scannent pour remplir un formulaire de satisfaction.",
            },
            {
              title: "WiFi du lieu",
              desc: "Facilitez la connexion WiFi de vos participants avec un QR code WiFi affiché à l'accueil.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white border border-gray-100 rounded-xl p-6"
            >
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-blue-900 mb-2">
            L&apos;avantage du QR dynamique pour les événements
          </h2>
          <p className="text-blue-800">
            Vos affiches et flyers sont déjà imprimés, mais le programme change ? Avec un QR dynamique, modifiez l&apos;URL de destination <strong>sans réimprimer</strong>. Pointez d&apos;abord vers le programme, puis vers les photos de l&apos;événement après coup.
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Préparez vos QR codes pour votre événement
          </h2>
          <p className="text-blue-100 mb-6">
            Testez un QR statique pour aller vite, ou créez un QR dynamique si
            votre programme, votre page d&apos;inscription ou vos contenus peuvent évoluer.
          </p>
          <a
            href="/"
            className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-xl hover:shadow-xl transition-all"
          >
            Créer mes QR codes →
          </a>
        </div>
      </article>
    </div>
  );
}
