"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import QRGenerator from "@/components/QRGenerator";

const faqItems = [
  {
    q: "Puis-je créer un QR code sans compte ?",
    a: "Oui. Vous pouvez créer et télécharger votre QR immédiatement, sans compte.",
  },
  {
    q: "Puis-je modifier mon lien plus tard ?",
    a: "Oui. Créez un compte pour obtenir un QR modifiable, avec suivi des scans et édition du lien plus tard.",
  },
  {
    q: "Le premier QR modifiable est-il gratuit ?",
    a: "Oui. Votre premier QR modifiable est offert avec compte. À partir du deuxième, vous passez en Pro.",
  },
  {
    q: "Que se passe-t-il si j'arrête de payer ?",
    a: "Votre QR continue de fonctionner vers son adresse initiale. Si vous aviez un plan Pro, l'édition du lien est désactivée et un court overlay LeQR s'affiche avant la redirection.",
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
            🇫🇷 Gratuit sans compte + 1 QR modifiable offert avec compte
          </div>
          <h1 className="mb-4 text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
            Créez votre QR code
            <br />
            <span className="text-blue-600">professionnel en 30s</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-gray-500">
            Collez votre lien, personnalisez, téléchargez. Si vous voulez suivre
            les scans ou pouvoir modifier l&apos;adresse plus tard, créez un compte
            pour obtenir votre premier QR modifiable offert.
          </p>
        </div>

        <QRGenerator />
      </section>

      <section className="border-y border-gray-100 bg-white px-4 py-8">
        <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-8 text-center">
          {[
            { num: "0€", label: "sans compte" },
            { num: "1", label: "QR modifiable offert" },
            { num: "HD", label: "PNG et SVG" },
            { num: "RGPD", label: "hébergé en Europe" },
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
            Simple au départ, plus puissant si besoin
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: "⚡",
                title: "Immédiat",
                desc: "Votre QR apparaît en direct et se télécharge tout de suite en PNG ou SVG.",
              },
              {
                icon: "📊",
                title: "Suivi inclus",
                desc: "Avec compte, vous obtenez un QR modifiable avec compteur de scans pour suivre son usage.",
              },
              {
                icon: "🔄",
                title: "Modifiable plus tard",
                desc: "Besoin de changer l'adresse après impression ? C'est exactement l'intérêt du QR modifiable.",
              },
            ].map((item) => (
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
                  "Modification du lien non incluse",
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
                Pour vos QR modifiables
              </p>
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
                  "Analytics détaillés : appareil, source, historique",
                  "Redirection instantanée sans overlay",
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
          Générez-le maintenant. Et si vous voulez le rendre modifiable, le
          premier est offert avec compte.
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
              Générez, téléchargez, puis passez au modifiable si vous en avez
              besoin.
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-white">Produit</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/qr-code-avis-google" className="transition-colors hover:text-white">
                  Avis Google
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
