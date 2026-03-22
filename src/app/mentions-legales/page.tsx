export const metadata = {
  title: "Mentions légales — LeQR.fr",
};

export default function MentionsLegales() {
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
        <h1>Mentions légales</h1>
        <p>Dernière mise à jour : mars 2026</p>

        <h2>Éditeur du site</h2>
        <p>
          LeQR.fr est édité par Florian Bolzinger<br />
          Email : contact@leqr.fr<br />
          Adresse : France
        </p>

        <h2>Hébergement</h2>
        <p>
          Ce site est hébergé par Vercel Inc.<br />
          340 S Lemon Ave #4133, Walnut, CA 91789, USA<br />
          Site web : <a href="https://vercel.com">vercel.com</a>
        </p>

        <h2>Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble du contenu du site LeQR.fr (textes, images, logos, code source) est protégé
          par le droit d&apos;auteur. Toute reproduction, même partielle, est interdite sans
          autorisation préalable.
        </p>
        <p>
          Les QR codes générés par les utilisateurs leur appartiennent intégralement.
          LeQR.fr ne revendique aucun droit sur les QR codes créés via le service.
        </p>

        <h2>Responsabilité</h2>
        <p>
          LeQR.fr s&apos;efforce de fournir un service fiable et disponible. Cependant, nous ne
          pouvons garantir un fonctionnement ininterrompu. LeQR.fr ne saurait être tenu
          responsable des dommages directs ou indirects résultant de l&apos;utilisation du service.
        </p>

        <h2>Liens hypertextes</h2>
        <p>
          Les QR codes dynamiques créés sur LeQR.fr redirigent vers des URL tierces.
          LeQR.fr n&apos;est pas responsable du contenu des sites vers lesquels les QR codes redirigent.
        </p>
      </div>
    </div>
  );
}
