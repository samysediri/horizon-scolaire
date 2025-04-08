"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

export default function ConfirmClient() {
  const router = useRouter();
  const supabase = createPagesBrowserClient();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace("#", ""));
    const access_token = params.get("access_token");
    const type = params.get("type");

    if (!access_token) {
      setError("Lien invalide ou expiré.");
      setLoading(false);
      return;
    }

    const confirmUser = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(access_token);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (type === "signup" || type === "invite") {
        router.push("/creer-mot-de-passe");
      } else {
        router.push("/dashboard");
      }
    };

    confirmUser();
  }, []);

  if (loading) return <p>Confirmation du compte...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return null;
}
