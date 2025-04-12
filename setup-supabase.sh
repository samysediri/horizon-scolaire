#!/bin/bash

echo "➡️ Installation de @supabase/auth-helpers-nextjs..."
npm install @supabase/auth-helpers-nextjs

echo "✅ Dépendance installée."

echo "📦 Vérification des autres dépendances..."
npm install

echo "🔨 Construction du projet localement..."
npm run build

echo "🚀 Déploiement vers Vercel..."
vercel --prod

echo "✅ Fini! Ton projet est maintenant prêt avec l'intégration Supabase."
