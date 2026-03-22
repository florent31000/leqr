type UseCaseLandingProps = {
  title: string;
  subtitle: string;
  promise: string;
  staticWhen: string;
  dynamicWhen: string;
  steps: string[];
  placements: string[];
  ctaTitle: string;
  ctaText: string;
  ctaLabel: string;
};

export default function UseCaseLanding({
  title,
  subtitle,
  promise,
  staticWhen,
  dynamicWhen,
  steps,
  placements,
  ctaTitle,
  ctaText,
  ctaLabel,
}: UseCaseLandingProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <a href="/" className="text-xl font-extrabold text-gray-900">
            Le<span className="text-blue-600">QR</span>
            <span className="ml-1 text-xs text-gray-400">.fr</span>
          </a>
          <a
            href="/"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Créer mon QR code
          </a>
        </div>
      </nav>

      <article className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="mb-6 text-4xl font-extrabold">{title}</h1>
        <p className="mb-8 text-lg text-gray-600">{subtitle}</p>

        <div className="mb-8 rounded-xl border border-blue-100 bg-blue-50 p-6">
          <h2 className="mb-2 text-lg font-bold text-blue-900">La vraie promesse</h2>
          <p className="text-blue-800">{promise}</p>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-white p-6">
            <h2 className="mb-2 text-lg font-bold text-gray-900">Quand rester en statique</h2>
            <p className="text-sm text-gray-600">{staticWhen}</p>
          </div>
          <div className="rounded-xl border-2 border-blue-600 bg-white p-6">
            <h2 className="mb-2 text-lg font-bold text-gray-900">Quand passer en dynamique</h2>
            <p className="text-sm text-gray-600">{dynamicWhen}</p>
          </div>
        </div>

        <h2 className="mb-4 text-2xl font-bold">Comment le mettre en place</h2>
        <ol className="mb-10 space-y-4">
          {steps.map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {index + 1}
              </span>
              <span className="pt-1 text-gray-700">{step}</span>
            </li>
          ))}
        </ol>

        <h2 className="mb-4 text-2xl font-bold">Où le placer</h2>
        <div className="mb-10 grid gap-4 md:grid-cols-2">
          {placements.map((item) => (
            <div
              key={item}
              className="rounded-lg border border-gray-100 bg-white p-4 text-sm text-gray-700"
            >
              ✓ {item}
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-center text-white">
          <h2 className="mb-3 text-2xl font-bold">{ctaTitle}</h2>
          <p className="mb-6 text-blue-100">{ctaText}</p>
          <a
            href="/"
            className="inline-block rounded-xl bg-white px-8 py-3 font-bold text-blue-600 transition-all hover:shadow-xl"
          >
            {ctaLabel}
          </a>
        </div>
      </article>
    </div>
  );
}
