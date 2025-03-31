// Fichier : app/auth/layout.jsx
'use client'

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded shadow p-6">
        {children}
      </div>
    </div>
  )
}
