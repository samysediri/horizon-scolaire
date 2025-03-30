// app/layout.js
export const metadata = {
  title: 'Horizon Scolaire',
  description: 'Plateforme de tutorat personnalisée',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-gray-100 text-gray-800">{children}</body>
    </html>
  )
}
