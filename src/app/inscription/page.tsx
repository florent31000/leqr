"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Inscription() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/connexion?signup=true");
  }, [router]);
  return null;
}
