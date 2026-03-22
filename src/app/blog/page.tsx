export const metadata = {
  title: "Blog — LeQR.fr — Guides et conseils QR codes",
  description:
    "Guides, tutoriels et conseils pour utiliser les QR codes dans votre business. Apprenez à créer, personnaliser et exploiter les QR codes.",
};

const articles = [
  {
    slug: "qr-code-dynamique-vs-statique",
    title: "QR code dynamique vs statique : lequel choisir ?",
    excerpt:
      "Comprendre la différence fondamentale entre QR codes statiques et dynamiques, et quand utiliser chacun.",
    date: "14 mars 2026",
    readTime: "5 min",
  },
  {
    slug: "creer-qr-code-gratuit",
    title: "Comment créer un QR code gratuit en 2026",
    excerpt:
      "Guide étape par étape pour créer votre premier QR code professionnel gratuitement, sans inscription.",
    date: "14 mars 2026",
    readTime: "3 min",
  },
  {
    slug: "qr-code-marketing-pme",
    title: "7 façons d'utiliser les QR codes pour votre PME",
    excerpt:
      "Cartes de visite, flyers, vitrine, packaging : découvrez comment les QR codes boostent votre business.",
    date: "14 mars 2026",
    readTime: "6 min",
  },
];

export default function Blog() {
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

      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-extrabold mb-2">Blog LeQR</h1>
        <p className="text-gray-500 mb-12">
          Guides, tutoriels et bonnes pratiques autour des QR codes.
        </p>

        <div className="space-y-8">
          {articles.map((a) => (
            <a
              key={a.slug}
              href={`/blog/${a.slug}`}
              className="block bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-3 mb-3 text-sm text-gray-400">
                <span>{a.date}</span>
                <span>·</span>
                <span>{a.readTime} de lecture</span>
              </div>
              <h2 className="text-xl font-bold group-hover:text-blue-600 transition-colors mb-2">
                {a.title}
              </h2>
              <p className="text-gray-500">{a.excerpt}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
