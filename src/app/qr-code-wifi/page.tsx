export const metadata = {
  title: "QR Code WiFi — Partagez votre WiFi en un scan — LeQR.fr",
  description:
    "Créez un QR code WiFi gratuit. Vos invités, clients ou collaborateurs se connectent en un scan. Plus besoin de dicter le mot de passe.",
  alternates: {
    canonical: "/qr-code-wifi",
  },
};

export default function QRCodeWifi() {
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
          QR Code WiFi — partagez votre réseau en un scan
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Fini les mots de passe WiFi gribouillés sur un bout de papier. Créez un QR code WiFi et vos invités, clients ou collègues se connectent instantanément en scannant avec leur téléphone.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: "🏠",
              title: "À la maison",
              desc: "Affichez-le dans l'entrée. Vos invités se connectent sans vous déranger.",
            },
            {
              icon: "☕",
              title: "Café / Restaurant",
              desc: "Imprimez-le sur les tables ou au comptoir. Expérience client moderne.",
            },
            {
              icon: "🏢",
              title: "Bureau / Coworking",
              desc: "Affichez-le en salle de réunion. Nouveaux collaborateurs connectés en 2 secondes.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white border border-gray-100 rounded-xl p-6"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-4">Comment ça marche</h2>
        <ol className="space-y-4 mb-8">
          {[
            "Sur LeQR.fr, choisissez l'onglet « WiFi »",
            "Entrez le nom de votre réseau (SSID) et le mot de passe",
            "Sélectionnez le type de sécurité (WPA/WPA2 dans la plupart des cas)",
            "Téléchargez et imprimez votre QR code",
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                {i + 1}
              </span>
              <span className="text-gray-700 pt-1">{step}</span>
            </li>
          ))}
        </ol>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-amber-900 mb-2">
            Compatibilité
          </h3>
          <p className="text-amber-800 text-sm">
            Les QR codes WiFi fonctionnent nativement sur tous les iPhones (iOS 11+) et la quasi-totalité des smartphones Android. L&apos;utilisateur n&apos;a qu&apos;à ouvrir l&apos;appareil photo et scanner — aucune application tierce nécessaire.
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Créez votre QR code WiFi maintenant
          </h2>
          <p className="text-blue-100 mb-6">
            Le QR WiFi peut être téléchargé gratuitement sans compte. Utilisez le
            dynamique seulement si vous voulez garder un QR dans votre espace.
          </p>
          <a
            href="/"
            className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-xl hover:shadow-xl transition-all"
          >
            Créer mon QR code WiFi →
          </a>
        </div>
      </article>
    </div>
  );
}
