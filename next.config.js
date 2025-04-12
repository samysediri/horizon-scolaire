/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {} // ✅ Corrigé : un objet vide au lieu de true
  },
  // ✅ Activation du middleware pour toutes les routes sauf les fichiers statiques
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}

module.exports = nextConfig
