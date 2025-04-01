'use client'

export default function ResetPasswordLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-50">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
        {children}
      </div>
    </div>
  )
}
