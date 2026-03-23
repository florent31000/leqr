import QRGenerator from "@/components/QRGenerator";

type Benefit = {
  icon: string;
  title: string;
  desc: string;
};

type FaqItem = {
  q: string;
  a: string;
};

type UseCaseLandingProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  whyTitle: string;
  whyText: string;
  benefits: Benefit[];
  placementsTitle: string;
  placements: string[];
  faq: FaqItem[];
  ctaTitle: string;
  ctaText: string;
};

export default function UseCaseLanding({
  eyebrow,
  title,
  subtitle,
  whyTitle,
  whyText,
  benefits,
  placementsTitle,
  placements,
  faq,
  ctaTitle,
  ctaText,
}: UseCaseLandingProps) {
  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="LeQR" className="h-8 w-8 rounded-lg" />
            <span className="text-xl font-extrabold text-gray-900">
              Le<span className="text-blue-600">QR</span>
              <span className="ml-1 text-xs text-gray-400">.fr</span>
            </span>
          </a>
          <div className="flex items-center gap-6">
            <a
              href="#pricing"
              className="hidden text-sm text-gray-600 hover:text-gray-900 md:block"
            >
              Tarifs
            </a>
            <a
              href="/connexion"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700"
            >
              Connexion
            </a>
          </div>
        </div>
      </nav>

      <section id="generator" className="px-4 pb-8 pt-16">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
            {eyebrow}
          </div>
          <h1 className="mb-4 text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
            {title}
          </h1>
          <p className="mx-auto max-w-xl text-lg text-gray-500">{subtitle}</p>
        </div>

        <QRGenerator />
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold">{whyTitle}</h2>
          <p className="mx-auto mb-12 max-w-3xl text-center text-gray-500">
            {whyText}
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-100 bg-white p-7"
              >
                <div className="mb-3 text-3xl">{item.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold">
            {placementsTitle}
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {placements.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-gray-100 bg-white p-5 text-sm text-gray-700"
              >
                ✓ {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-3xl font-bold">
            Des tarifs simples
          </h2>
          <p className="mb-12 text-center text-gray-500">
            Gratuit pour télécharger tout de suite. Compte gratuit pour votre
            premier QR modifiable. Pro à partir du deuxième.
          </p>
          <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-8">
              <h3 className="mb-1 text-lg font-bold">Gratuit</h3>
              <p className="mb-6 text-sm text-gray-500">Pour démarrer simplement</p>
              <div className="mb-6 text-4xl font-extrabold">
                0€
                <span className="text-base font-normal text-gray-400">/mois</span>
              </div>
              <ul className="mb-8 space-y-3 text-sm text-gray-600">
                {[
                  "QR gratuits sans compte",
                  "1 QR modifiable offert avec compte",
                  "Téléchargement PNG et SVG",
                  "Compteur total de scans",
                  "Usage commercial autorisé",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-green-500">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#generator"
                className="block w-full rounded-xl bg-gray-100 py-3 text-center font-semibold text-gray-800 transition-all hover:bg-gray-200"
              >
                Tester maintenant
              </a>
            </div>
            <div className="relative rounded-2xl border-2 border-blue-600 bg-white p-8 shadow-xl">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-bold text-white">
                POPULAIRE
              </div>
              <h3 className="mb-1 text-lg font-bold">Pro</h3>
              <p className="mb-6 text-sm text-gray-500">Pour vos QR modifiables</p>
              <div className="mb-1 text-4xl font-extrabold">
                14,90€
                <span className="text-base font-normal text-gray-400">/mois</span>
              </div>
              <p className="mb-6 text-xs text-gray-400">ou 149€/an (2 mois offerts)</p>
              <ul className="mb-8 space-y-3 text-sm text-gray-600">
                {[
                  "À partir du 2e QR modifiable",
                  "Modifier l'URL après impression",
                  "50 QR modifiables",
                  "Analytics détaillés",
                  "Redirection instantanée sans overlay",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-blue-500">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="/inscription"
                className="block w-full rounded-xl bg-blue-600 py-3 text-center font-semibold text-white transition-all shadow-md hover:bg-blue-700"
              >
                Passer au Pro
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Questions fréquentes
          </h2>
          <div className="space-y-6">
            {faq.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-gray-100 bg-white p-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-gray-800">
                  {item.q}
                  <span className="text-gray-400 transition-transform group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-16 text-center text-white">
        <h2 className="mb-4 text-3xl font-bold">{ctaTitle}</h2>
        <p className="mb-8 text-blue-100">{ctaText}</p>
        <a
          href="#generator"
          className="inline-block rounded-xl bg-white px-8 py-4 text-lg font-bold text-blue-600 transition-all hover:shadow-xl"
        >
          Créer mon QR code →
        </a>
      </section>
    </div>
  );
}
