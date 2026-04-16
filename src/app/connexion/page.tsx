"use client";

import { useState, useEffect } from "react";
import { getSupabase } from "@/lib/supabase";
import {
  buildUserAcquisitionData,
  captureAcquisitionTouchpoint,
} from "@/lib/acquisition";

export default function Connexion() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [nextPath, setNextPath] = useState("/dashboard");

  const getSafeNextPath = () => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    if (next && next.startsWith("/") && !next.startsWith("//")) {
      return next;
    }
    return "/dashboard";
  };

  const getPublicAppUrl = () => {
    const publicUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    return publicUrl.replace(/\/$/, "");
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("signup") === "true") setIsSignUp(true);
    setNextPath(getSafeNextPath());
    captureAcquisitionTouchpoint();
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const supabase = getSupabase();
    if (isSignUp) {
      const signupNextPath = getSafeNextPath().startsWith("/dashboard")
        ? "/dashboard?signup=true"
        : getSafeNextPath();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: buildUserAcquisitionData(),
          emailRedirectTo: `${getPublicAppUrl()}${signupNextPath}`,
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess(
          "Compte créé ! Vérifiez votre email pour confirmer votre inscription."
        );
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError("Email ou mot de passe incorrect");
      } else {
        window.location.href = nextPath;
      }
    }
    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const supabase = getSupabase();
      captureAcquisitionTouchpoint();
      const base = getSafeNextPath().startsWith("/dashboard")
        ? "/dashboard?signup=true"
        : getSafeNextPath();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${getPublicAppUrl()}${base}`,
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });

      if (error) {
        setError(
          "Connexion Google indisponible. Vérifiez que le provider Google est bien activé dans Supabase."
        );
        setLoading(false);
      }
    } catch {
      setError(
        "Connexion Google indisponible. Vérifiez que le provider Google est bien activé dans Supabase."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-extrabold text-gray-900">
            Le<span className="text-blue-600">QR</span>
            <span className="text-xs text-gray-400 ml-1">.fr</span>
          </a>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h1 className="text-xl font-bold mb-6">
            {isSignUp ? "Créer un compte" : "Connexion"}
          </h1>

          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-60 text-gray-800 font-semibold py-3 rounded-xl transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.44a5.5 5.5 0 0 1-2.39 3.61v3h3.87c2.26-2.08 3.57-5.15 3.57-8.64Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.87-3c-1.07.72-2.44 1.15-4.08 1.15-3.13 0-5.78-2.11-6.72-4.96H1.28v3.09A12 12 0 0 0 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.28A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.55.38-2.28V6.63H1.28A12 12 0 0 0 0 12c0 1.93.46 3.75 1.28 5.37l4-3.09Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.77c1.76 0 3.35.61 4.59 1.8l3.44-3.44C17.95 1.17 15.24 0 12 0A12 12 0 0 0 1.28 6.63l4 3.09c.94-2.85 3.59-4.95 6.72-4.95Z"
              />
            </svg>
            Continuer avec Google
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px bg-gray-100 flex-1" />
            <span className="text-xs uppercase tracking-wide text-gray-400">
              ou
            </span>
            <div className="h-px bg-gray-100 flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="vous@exemple.fr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Min. 6 caractères"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition-all"
            >
              {loading
                ? "Chargement..."
                : isSignUp
                ? "Créer mon compte"
                : "Se connecter"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            {isSignUp ? "Déjà un compte ?" : "Pas encore de compte ?"}{" "}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
                setSuccess("");
              }}
              className="text-blue-600 hover:underline font-medium"
            >
              {isSignUp ? "Se connecter" : "Créer un compte"}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          En continuant, vous acceptez nos{" "}
          <a href="/cgv" className="underline">
            CGV
          </a>{" "}
          et notre{" "}
          <a href="/confidentialite" className="underline">
            politique de confidentialité
          </a>
          .
        </p>
      </div>
    </div>
  );
}
