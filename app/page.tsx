// app/page.tsx

export default function HomePage() {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Bienvenue sur Horizon Scolaire!</h1>
      <p>Page d’accueil temporaire pour tester le déploiement.</p>
      <p>
        👉 <a href="/auth/confirm?token=test123">Tester la page /auth/confirm</a>
      </p>
    </main>
  );
}
