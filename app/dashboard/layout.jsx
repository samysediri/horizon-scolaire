'use client'

import { useRouter } from 'next/navigation'

export default function DashboardLayout({ children }) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('user_id')
    localStorage.removeItem('role')
    router.push('/login')
  }

  return (
    <div>
      <div className="flex justify-between items-center p-4 bg-gray-100 border-b border-gray-300">
        <h1 className="text-xl font-bold">Horizon Scolaire</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded"
        >
          Se déconnecter
        </button>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}
