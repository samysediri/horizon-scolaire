const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, role, metadata } = req.body;

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: {
      role,
      ...metadata
    }
  });

  if (error) {
    console.error('Erreur invitation Supabase:', error.message);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ message: 'Invitation envoyée', data });
};
