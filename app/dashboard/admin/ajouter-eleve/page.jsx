"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AjouterEleve() {
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    lien_lessonspace: "",
    parent_nom: "",
    parent_prenom: "",
    parent_email: ""
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
      email: form.email,
      lien_lessonspace: form.lien_lessonspace,
      parent_nom: form.parent_nom,
      parent_prenom: form.parent_prenom,
      parent_email: form.parent_email,
      tuteur_id: user.id
    });

    if (error) {
      setMessage("Erreur Supabase : " + error.message);
    } else {
      setMessage("Élève ajouté avec succès!");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ajouter un élève</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="prenom" placeholder="Prénom de l'élève" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="text" name="nom" placeholder="Nom de l'élève" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="email" name="email" placeholder="Courriel de l'élève" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="text" name="lien_lessonspace" placeholder="Lien Lessonspace" onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="text" name="parent_prenom" placeholder="Prénom du parent" onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="text" name="parent_nom" placeholder="Nom du parent" onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="email" name="parent_email" placeholder="Courriel du parent" onChange={handleChange} className="w-full border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Ajouter l'élève</button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
