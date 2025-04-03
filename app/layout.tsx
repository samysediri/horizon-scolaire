// app/layout.tsx

export const metadata = {
  title: 'Horizon Scolaire',
  description: 'Plateforme de tutorat en ligne',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0, fontFamily: 'sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
