// Fichier : app/layout.tsx
import './globals.css'
import ClientProvider from './ClientProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <ClientProvider>
          {children}
        </ClientProvider>
      </body>
    </html>
  )
}
