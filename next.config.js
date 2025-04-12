/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true, // requis si tu utilises les Server Actions (facultatif selon ton usage)
  },
  // Activation du middleware pour toutes les routes, sauf les fichiers statiques
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

module.exports = nextConfig
