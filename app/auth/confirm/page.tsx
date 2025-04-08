"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

export default function ConfirmPage() {
  const router = useRouter();
  const supabase = createPagesBrowserClient();
  const searchParams = useSearchParams();
  const access_token = searchParams.get("access_token");
  const type = searchParams.get("type");
  const [password, setPassword] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!access_token) return;

    const updatePassword = async () => {
      const { data, error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        setConfirmed(true);
        setTimeout(() => router.push("/dashboard"), 2000);
      }
    };

    if (type === "invite" && password.length >= 6) {
      updatePassword();
    }
  }, [access_token, password]);

  if (confirmed) return <p>Mot de passe créé! Redirection...</p>;

  return (
    <div>
      <h1>Configurer votre mot de passe</h1>
      <input
        type="password"
        placeholder="Créer un mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
