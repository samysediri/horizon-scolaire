import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createServerActionClient({ cookies });
  const { email, nom, role } = await request.json();

  if (!email || !role || !nom) {
    return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
  }

  try {
    // Créer l'utilisateur invité
    const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email);

    if (inviteError) {
      return NextResponse.json({ error: inviteError.message }, { status: 500 });
    }

    const userId = inviteData.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "ID utilisateur introuvable après l'invitation." }, { status: 500 });
    }

    // Ajouter à la table profiles
    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      email,
      nom,
      role,
    });

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
