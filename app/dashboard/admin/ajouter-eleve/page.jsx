// Fichier : app/dashboard/admin/ajouter-eleve/page.js
"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AjouterEleve() {
  const [form, setForm] = useState({ prenom: "", nom: "", lien_lessonspace: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMessage("Erreur : utilisateur non authentifié.");
      return;
    }

    const { error } = await supabase.from("eleves").insert({
      prenom: form.prenom,
      nom: form.nom,
      lien_lessonspace: form.lien_lessonspace,
      tuteur_id: user.id,
    });

    if (error) {
      setMessage("Erreur Supabase : " + error.message);
    } else {
      setMessage("Élève ajouté avec succès!");
      setForm({ prenom: "", nom: "", lien_lessonspace: "" });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ajouter un élève</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Prénom"
          value={form.prenom}
          onChange={(e) => setForm({ ...form, prenom: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Nom"
          value={form.nom}
          onChange={(e) => setForm({ ...form, nom: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="url"
          placeholder="Lien Lessonspace"
          value={form.lien_lessonspace}
          onChange={(e) => setForm({ ...form, lien_lessonspace: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Ajouter
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
