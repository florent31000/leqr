"use client";

import { useEffect, useState } from "react";
import QRGenerator from "@/components/QRGenerator";
import { getSupabase } from "@/lib/supabase";

const faqItems = [
  {
    q: "Puis-je créer un QR code sans compte ?",
    a: "Oui. Les QR statiques sont téléchargeables sans compte sur la homepage. Ils conviennent très bien pour un lien fixe, du WiFi, un texte, un email ou un numéro de téléphone.",
  },
  {
    q: "À quoi sert un QR dynamique ?",
    a: "Un QR dynamique passe par LeQR. Il vous permet de conserver le même QR imprimé, de suivre les scans et d'activer plus tard une modification d'URL sans refaire vos supports.",
  },
  {
    q: "Le QR dynamique est-il gratuit ?",
    a: "Oui. Avec un compte gratuit, vous pouvez créer jusqu'à 10 QR dynamiques et les imprimer. Le plan Pro devient utile le jour où vous voulez modifier la destination après impression ou retirer l'overlay de 3 secondes.",
  },
  {
    q: "Que se passe-t-il si je ne paie jamais ?",
    a: "Vos QR dynamiques gratuits continuent de fonctionner vers leur URL initiale. Ils restent imprimables et utilisables. Vous passez en Pro seulement si vous avez besoin d'éditer l'URL ou de retirer l'overlay.",
  },
  {
    q: "Que se passe-t-il si j'arrête de payer ?",
    a: "Vos QR dynamiques ne meurent jamais. Ils reviennent simplement à leur URL initiale et affichent un court overlay LeQR avant la redirection.",
  },
  {
    q: "Quelles statistiques sont incluses ?",
    a: "Le compte gratuit inclut déjà le nombre total de scans sur vos QR dynamiques. Le plan Pro ajoute le détail par appareil, source et historique des scans.",
  },
];

const useCases = [
  {
    href: "/qr-code-avis-google",
    title: "Avis Google",
    desc: "Collectez plus d'avis en caisse, sur l'addition ou sur vos cartes de remerciement.",
  },
  {
    href: "/qr-code-carte-visite",
    title: "Carte de visite",
    desc: "Ne réimprimez plus vos cartes quand votre site, votre portfolio ou votre LinkedIn changent.",
  },
  {
    href: "/qr-code-menu-restaurant",
    title: "Menu restaurant",
    desc: "Mettez à jour la carte, les plats du jour ou le menu du soir sans toucher à vos supports.",
  },
  {
    href: "/qr-code-flyer-affiche",
    title: "Flyers et affiches",
    desc: "Pilotez la même campagne print sur plusieurs destinations et mesurez les scans par emplacement.",
  },
  {
    href: "/qr-code-packaging-produit",
    title: "Packaging produit",
    desc: "Gardez le même QR sur vos emballages et faites évoluer notices, SAV ou contenus marketing.",
  },
  {
    href: "/qr-code-evenement",
    title: "Événement",
    desc: "Programme, infos pratiques, photos ou feedback : un même QR qui évolue avant, pendant et après l'événement.",
  },
];

export default function HomePageContent() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    getSupabase()
      .auth.getSession()
      .then(({ data: { session } }) => {
        if (session) setLoggedIn(true);
      });
  }, []);

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
              href="#uses"
              className="hidden text-sm text-gray-600 hover:text-gray-900 md:block"
            >
              Cas d&apos;usage
            </a>
            <a
              href="#pricing"
              className="hidden text-sm text-gray-600 hover:text-gray-900 md:block"
            >
              Tarifs
            </a>
            <a
              href={loggedIn ? "/dashboard" : "/connexion"}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700"
            >
              {loggedIn ? "Mes QR codes" : "Connexion"}
            </a>
          </div>
        </div>
      </nav>

      <section id="generator" className="px-4 pb-8 pt-16">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
            🇫🇷 QR statiques gratuits + QR dynamiques pensés pour le print
          </div>
          <h1 className="mb-4 text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
            Créez votre QR code
            <br />
            <span className="text-blue-600">et évitez de réimprimer plus tard</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-500">
            Téléchargez un QR statique gratuitement, sans compte. Si vous voulez
            un QR dynamique pour suivre les scans et garder le même code sur vos
            supports imprimés, créez simplement un compte.
          </p>
        </div>

        <QRGenerator />
      </section>

      <section className="border-y border-gray-100 bg-white px-4 py-8">
        <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-8 text-center">
          {[
            { num: "Statique", label: "gratuit sans compte" },
            { num: "10", label: "QR dynamiques gratuits" },
            { num: "HD", label: "PNG et SVG propres" },
            { num: "RGPD", label: "données hébergées en Europe" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <span className="text-2xl font-bold text-blue-600">{item.num}</span>
              <span className="mt-1 text-xs text-gray-500">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Statique pour aller vite, dynamique pour protéger vos supports
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                QR statique gratuit
              </p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900">
                Idéal pour un lien fixe
              </h3>
              <p className="mt-3 text-sm text-gray-600">
                Téléchargez un QR immédiatement, sans compte. Parfait pour du
                WiFi, un texte, un email, un numéro de téléphone ou une URL qui
                ne changera pas.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                {[
                  "Sans compte",
                  "Téléchargement PNG et SVG",
                  "Usage commercial autorisé",
                  "Aucune dépendance à un dashboard",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-green-500">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border-2 border-blue-600 bg-white p-8 shadow-xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                QR dynamique LeQR
              </p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900">
                Idéal pour le print et la durée
              </h3>
              <p className="mt-3 text-sm text-gray-600">
                Le même QR peut vivre sur vos cartes, affiches, flyers ou
                packagings. Vous l&apos;imprimez une fois, puis vous activez plus
                tard l&apos;édition d&apos;URL sans repartir de zéro.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                {[
                  "10 QR dynamiques gratuits avec compte",
                  "Compteur total de scans inclus",
                  "Upgrade possible plus tard sans réimprimer",
                  "Pro seulement si vous voulez modifier l'URL ou retirer l'overlay",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-blue-500">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="uses" className="bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold">
            Une landing page par vrai besoin métier
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-gray-500">
            Le moteur reste le même, mais la proposition de valeur change selon
            votre usage. Choisissez votre cas d&apos;usage pour voir la promesse la
            plus adaptée.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {useCases.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
                <span className="mt-4 inline-block text-sm font-medium text-blue-600">
                  Voir la landing →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-600 px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold">
            Pourquoi LeQR plutôt qu&apos;un simple générateur ?
          </h2>
          <div className="grid gap-8 text-left md:grid-cols-3">
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <h3 className="mb-2 text-lg font-bold">
                Ne perdez pas vos supports imprimés
              </h3>
              <p className="text-sm text-blue-100">
                Le vrai sujet n&apos;est pas de générer un QR. Le vrai sujet est de
                continuer à l&apos;utiliser quand votre lien change ou quand une
                campagne évolue.
              </p>
            </div>
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <h3 className="mb-2 text-lg font-bold">Passez en dynamique quand vous voulez</h3>
              <p className="text-sm text-blue-100">
                Commencez simple. Imprimez. Puis activez plus tard la modification
                d&apos;URL si votre usage le justifie.
              </p>
            </div>
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <h3 className="mb-2 text-lg font-bold">Simple, français, lisible</h3>
              <p className="text-sm text-blue-100">
                Pas de pricing incompréhensible, pas de jargon inutile, pas de QR
                qui meurent si vous arrêtez de payer.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-3xl font-bold">
            Des tarifs simples et utiles
          </h2>
          <p className="mb-12 text-center text-gray-500">
            Statique gratuit sans compte. Dynamique gratuit avec compte. Pro quand
            vous avez besoin de modifier après impression.
          </p>
          <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-8">
              <h3 className="mb-1 text-lg font-bold">Gratuit</h3>
              <p className="mb-6 text-sm text-gray-500">Pour démarrer proprement</p>
              <div className="mb-6 text-4xl font-extrabold">
                0€
                <span className="text-base font-normal text-gray-400">/mois</span>
              </div>
              <ul className="mb-8 space-y-3 text-sm text-gray-600">
                {[
                  "QR statiques gratuits sans compte",
                  "10 QR dynamiques gratuits avec compte",
                  "Téléchargement PNG et SVG",
                  "Compteur total de scans sur les QR dynamiques",
                  "Overlay 3 secondes sur les QR dynamiques gratuits",
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
                Tester gratuitement
              </a>
            </div>
            <div className="relative rounded-2xl border-2 border-blue-600 bg-white p-8 shadow-xl">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-bold text-white">
                POPULAIRE
              </div>
              <h3 className="mb-1 text-lg font-bold">Pro</h3>
              <p className="mb-6 text-sm text-gray-500">
                Pour faire vivre vos QR dans le temps
              </p>
              <div className="mb-1 text-4xl font-extrabold">
                14,90€
                <span className="text-base font-normal text-gray-400">/mois</span>
              </div>
              <p className="mb-6 text-xs text-gray-400">ou 149€/an (2 mois offerts)</p>
              <ul className="mb-8 space-y-3 text-sm text-gray-600">
                {[
                  "Modifier l'URL après impression",
                  "50 QR dynamiques",
                  "Analytics détaillés : appareil, source, historique",
                  "Redirection instantanée sans overlay",
                  "Même QR, même support, nouvelle destination",
                  "Support prioritaire",
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
            {faqItems.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-gray-100 bg-white p-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-gray-800">
                  {faq.q}
                  <span className="text-gray-400 transition-transform group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-16 text-center text-white">
        <h2 className="mb-4 text-3xl font-bold">Prêt à créer votre QR code ?</h2>
        <p className="mb-8 text-blue-100">
          Téléchargez un QR statique tout de suite ou créez un QR dynamique pour
          vos supports imprimés.
        </p>
        <a
          href="#generator"
          className="inline-block rounded-xl bg-white px-8 py-4 text-lg font-bold text-blue-600 transition-all hover:shadow-xl"
        >
          Créer mon QR code →
        </a>
      </section>

      <footer className="bg-gray-900 px-4 py-12 text-gray-400">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-4">
          <div>
            <span className="text-xl font-extrabold text-white">
              Le<span className="text-blue-400">QR</span>
              <span className="ml-1 text-xs text-gray-500">.fr</span>
            </span>
            <p className="mt-3 text-sm">
              QR statiques gratuits, QR dynamiques pensés pour les supports
              imprimés.
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-white">Produit</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#uses" className="transition-colors hover:text-white">
                  Cas d&apos;usage
                </a>
              </li>
              <li>
                <a href="#pricing" className="transition-colors hover:text-white">
                  Tarifs
                </a>
              </li>
              <li>
                <a href="/blog" className="transition-colors hover:text-white">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-white">Use cases</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/qr-code-avis-google" className="transition-colors hover:text-white">
                  Avis Google
                </a>
              </li>
              <li>
                <a href="/qr-code-carte-visite" className="transition-colors hover:text-white">
                  Carte de visite
                </a>
              </li>
              <li>
                <a href="/qr-code-menu-restaurant" className="transition-colors hover:text-white">
                  Menu restaurant
                </a>
              </li>
              <li>
                <a href="/qr-code-flyer-affiche" className="transition-colors hover:text-white">
                  Flyers et affiches
                </a>
              </li>
              <li>
                <a href="/qr-code-packaging-produit" className="transition-colors hover:text-white">
                  Packaging produit
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-white">Légal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/mentions-legales" className="transition-colors hover:text-white">
                  Mentions légales
                </a>
              </li>
              <li>
                <a href="/confidentialite" className="transition-colors hover:text-white">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a href="/cgv" className="transition-colors hover:text-white">
                  CGV
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-5xl border-t border-gray-800 pt-8 text-center text-xs">
          © {new Date().getFullYear()} LeQR.fr — Fait en France
        </div>
      </footer>
    </div>
  );
}
