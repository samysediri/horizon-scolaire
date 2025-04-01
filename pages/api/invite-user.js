const { createClient } = require('@supabase/supabase-js');

console.log('[DEBUG] SERVICE_ROLE_KEY present:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { email, role, metadata } = req.body;

    if (!email || !role) {
      return res.status(400).json({ error: 'Email ou rôle manquant' });
    }

    console.log('[API] Envoi invitation à :', email);
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: {
        role,
        ...metadata
      }
    });

    if (error) {
      console.error('[API] Erreur Supabase:', error.message);
      return res.status(500).json({ error: error.message });
    }

    console.log('[API] Invitation envoyée avec succès.');
    return res.status(200).json({ message: 'Invitation envoyée', data });
  } catch (err) {
    console.error('[API] Exception:', err.message);
    return res.status(500).json({ error: 'Erreur serveur : ' + err.message });
  }
}

module.exports = handler;
