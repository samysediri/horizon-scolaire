"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

export default function CreatePasswordClient() {
  const router = useRouter();
  const supabase = createPagesBrowserClient();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!data.session || error) {
        setErrorMsg("Lien invalide ou expiré.");
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }
  };

  if (loading) return <p className="text-center mt-20">Chargement...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-2xl font-semibold mb-4">Créer votre mot de passe</h1>

      {errorMsg && (
        <p className="text-red-500 mb-4">{errorMsg}</p>
      )}

      {success ? (
        <p className="text-green-600">Mot de passe créé! Redirection...</p>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Enregistrer le mot de passe
          </button>
        </form>
      )}
    </div>
  );
}
