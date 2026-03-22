"use client";

import { useEffect, useState } from "react";
import QRGenerator from "@/components/QRGenerator";
import { getSupabase } from "@/lib/supabase";

export default function Home() {
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
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="LeQR" className="h-8 w-8 rounded-lg" />
            <span className="text-xl font-extrabold text-gray-900">
              Le<span className="text-blue-600">QR</span>
              <span className="text-xs text-gray-400 ml-1">.fr</span>
            </span>
          </a>
          <div className="flex items-center gap-6">
            <a
              href="#features"
              className="text-sm text-gray-600 hover:text-gray-900 hidden md:block"
            >
              Fonctionnalités
            </a>
            <a
              href="#pricing"
              className="text-sm text-gray-600 hover:text-gray-900 hidden md:block"
            >
              Tarifs
            </a>
            {loggedIn ? (
              <a
                href="/dashboard"
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
              >
                Mes QR codes
              </a>
            ) : (
              <a
                href="/connexion"
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
              >
                Connexion
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="generator" className="pt-16 pb-8 px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-blue-100">
            🇫🇷 100% français — gratuit — sans inscription
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            Créez votre QR Code
            <br />
            <span className="text-blue-600">professionnel en 30s</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Gratuit, sans filigrane, sans inscription. Téléchargez en haute
            résolution pour vos cartes de visite, flyers, menus et affiches.
          </p>
        </div>

        <QRGenerator />
      </section>

      {/* Trust bar */}
      <section className="py-8 px-4 border-y border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8 text-center">
          {[
            { num: "Gratuit", label: "QR via LeQR illimités" },
            { num: "HD", label: "Haute résolution sans filigrane" },
            { num: "0 pub", label: "Aucune publicité" },
            { num: "RGPD", label: "Données hébergées en France" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <span className="text-2xl font-bold text-blue-600">
                {item.num}
              </span>
              <span className="text-xs text-gray-500 mt-1">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tout ce dont vous avez besoin
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "⚡",
                title: "Rapide",
                desc: "Générez votre QR code en moins de 30 secondes. Collez votre URL, personnalisez, téléchargez.",
              },
              {
                icon: "🎨",
                title: "Personnalisable",
                desc: "Choisissez vos couleurs pour un QR code qui reflète votre marque. Export PNG et SVG.",
              },
              {
                icon: "📶",
                title: "Multi-usage",
                desc: "URL, WiFi, carte de visite, email, téléphone — un QR code pour chaque besoin.",
              },
              {
                icon: "🔄",
                title: "QR Dynamiques",
                desc: "Modifiez la destination après impression. Vos flyers restent à jour, toujours.",
              },
              {
                icon: "📊",
                title: "Analytics",
                desc: "Suivez le nombre de scans, les appareils, la géolocalisation. Mesurez vos campagnes.",
              },
              {
                icon: "🛡️",
                title: "Fiable et honnête",
                desc: "Vos QR codes ne meurent jamais. Pas de piège à l'abonnement, pas de scans limités.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why LeQR */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Pourquoi LeQR plutôt qu&apos;un autre ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="font-bold text-lg mb-2">
                🚫 Vos QR ne meurent JAMAIS
              </h3>
              <p className="text-blue-100 text-sm">
                Chez les concurrents, vos QR cessent parfois de fonctionner
                quand vous arrêtez de payer. Chez nous, ils reviennent sur leur
                URL initiale et restent utilisables.
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="font-bold text-lg mb-2">🇫🇷 Français et RGPD</h3>
              <p className="text-blue-100 text-sm">
                Interface française, support en français, données hébergées en
                Europe. Conforme RGPD nativement.
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="font-bold text-lg mb-2">💰 Le moins cher du marché</h3>
              <p className="text-blue-100 text-sm">
                Notre plan Pro à 9,99€/mois est le plus compétitif du marché
                français. Des QR codes pro sans se ruiner.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Des tarifs simples et honnêtes
          </h2>
          <p className="text-gray-500 text-center mb-12">
            Commencez gratuitement, passez en Pro quand vous êtes prêt.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h3 className="text-lg font-bold mb-1">Gratuit</h3>
              <p className="text-gray-500 text-sm mb-6">
                Pour commencer rapidement
              </p>
              <div className="text-4xl font-extrabold mb-6">
                0€
                <span className="text-base font-normal text-gray-400">
                  /mois
                </span>
              </div>
              <ul className="space-y-3 text-sm text-gray-600 mb-8">
                {[
                  "QR codes illimités",
                  "Personnalisation couleurs",
                  "Téléchargement PNG & SVG",
                  "Suivi du nombre de scans",
                  "Sans inscription",
                  "Usage commercial autorisé",
                ].map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-green-500">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#generator"
                className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-xl transition-all"
              >
                C&apos;est déjà gratuit ↑
              </a>
            </div>

            {/* Pro */}
            <div className="bg-white border-2 border-blue-600 rounded-2xl p-8 relative shadow-xl">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                POPULAIRE
              </div>
              <h3 className="text-lg font-bold mb-1">Pro</h3>
              <p className="text-gray-500 text-sm mb-6">
                Pour les professionnels
              </p>
              <div className="text-4xl font-extrabold mb-1">
                9,99€
                <span className="text-base font-normal text-gray-400">
                  /mois
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-6">
                ou 89,91€/an (3 mois offerts)
              </p>
              <ul className="space-y-3 text-sm text-gray-600 mb-8">
                {[
                  "Tout du plan Gratuit",
                  "Modifier l'URL après impression",
                  "50 QR modifiables",
                  "Analytics complets (géo, device, temps)",
                  "Aucun overlay à la redirection",
                  "Support prioritaire",
                ].map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-blue-500">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="/inscription"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md"
              >
                Passer au Pro
              </a>
            </div>

            {/* Business */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h3 className="text-lg font-bold mb-1">Business</h3>
              <p className="text-gray-500 text-sm mb-6">
                Pour les équipes et agences
              </p>
              <div className="text-4xl font-extrabold mb-1">
                29,99€
                <span className="text-base font-normal text-gray-400">
                  /mois
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-6">
                ou 269,91€/an (3 mois offerts)
              </p>
              <ul className="space-y-3 text-sm text-gray-600 mb-8">
                {[
                  "Tout du plan Pro",
                  "QR modifiables illimités",
                  "Domaine court personnalisé",
                  "Création en masse (CSV)",
                  "Support dédié",
                ].map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-purple-500">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="/inscription"
                className="block w-full text-center bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition-all"
              >
                Choisir Business
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Questions fréquentes
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Est-ce vraiment gratuit ?",
                a: "Oui. La génération de QR codes est 100% gratuite, sans limite, sans inscription et sans filigrane. Tous les QR passent par nos serveurs. Le plan Pro débloque la modification de l'URL après impression et les analytics détaillés.",
              },
              {
                q: "Quelle est la différence entre gratuit et Pro ?",
                a: "Avec le plan gratuit, votre QR code pointe vers l'URL que vous avez choisie, avec suivi des scans inclus. Avec le plan Pro, vous pouvez modifier l'URL de destination à tout moment — même après avoir imprimé vos flyers ou cartes de visite — et accéder aux analytics détaillés (géolocalisation, appareils, historique).",
              },
              {
                q: "Puis-je rendre un QR gratuit en dynamique plus tard ?",
                a: "Oui ! Tous les QR codes générés sur LeQR passent par nos serveurs. Si vous passez en Pro, vous pourrez modifier l'URL de destination de n'importe quel QR code que vous avez déjà créé et imprimé. Aucun besoin de refaire le QR code.",
              },
              {
                q: "Que se passe-t-il si j'arrête de payer ?",
                a: "Vos QR continuent de fonctionner. En revanche, ils reviennent automatiquement à leur URL initiale et un petit overlay « Propulsé par LeQR » s'affiche pendant 3 secondes avant la redirection. Vos flyers et cartes de visite restent fonctionnels.",
              },
              {
                q: "Puis-je utiliser les QR codes à des fins commerciales ?",
                a: "Absolument. Tous les QR codes générés sur LeQR sont libres de droits pour un usage commercial : affiches, flyers, cartes de visite, emballages, etc.",
              },
              {
                q: "Mes données sont-elles en sécurité ?",
                a: "Oui. Nos serveurs sont hébergés en Europe, nous sommes conformes RGPD et nous ne revendons aucune donnée. Vos analytics de scans restent privées.",
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="bg-white border border-gray-100 rounded-xl p-6 group"
              >
                <summary className="font-semibold text-gray-800 cursor-pointer list-none flex justify-between items-center">
                  {faq.q}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="mt-3 text-gray-500 text-sm leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Prêt à créer votre QR code ?
        </h2>
        <p className="text-blue-100 mb-8">
          Gratuit, sans inscription, en 30 secondes.
        </p>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="inline-block bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:shadow-xl transition-all text-lg"
        >
          Créer mon QR code →
        </a>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-gray-400">
        <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <span className="text-xl font-extrabold text-white">
              Le<span className="text-blue-400">QR</span>
              <span className="text-xs text-gray-500 ml-1">.fr</span>
            </span>
            <p className="text-sm mt-3">
              Générateur de QR codes professionnel français. Simple, honnête,
              fiable.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Produit</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">Tarifs</a>
              </li>
              <li>
                <a href="/blog" className="hover:text-white transition-colors">Blog</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Cas d&apos;usage</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/qr-code-carte-visite" className="hover:text-white transition-colors">Carte de visite</a>
              </li>
              <li>
                <a href="/qr-code-wifi" className="hover:text-white transition-colors">WiFi</a>
              </li>
              <li>
                <a href="/qr-code-avis-google" className="hover:text-white transition-colors">Avis Google</a>
              </li>
              <li>
                <a href="/qr-code-evenement" className="hover:text-white transition-colors">Événement</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Légal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</a>
              </li>
              <li>
                <a href="/confidentialite" className="hover:text-white transition-colors">Politique de confidentialité</a>
              </li>
              <li>
                <a href="/cgv" className="hover:text-white transition-colors">CGV</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-xs">
          © {new Date().getFullYear()} LeQR.fr — Fait avec ❤️ en France
        </div>
      </footer>
    </div>
  );
}
