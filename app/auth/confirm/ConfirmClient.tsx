"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

export default function ConfirmClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createPagesBrowserClient();
  const token = searchParams.get("access_token");
  const type = searchParams.get("type");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !type) return;

    const handleConfirmation = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(token);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (type === "signup") {
        router.push("/creer-mot-de-passe");
      } else {
        router.push("/dashboard");
      }
    };

    handleConfirmation();
  }, [token, type]);

  if (loading) return <p>Confirmation du compte...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return null;
}
