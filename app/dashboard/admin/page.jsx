"use client";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/dashboard/admin/ajouter-eleve">
          <div className="p-4 border rounded hover:bg-gray-100 cursor-pointer">
            <h2 className="text-xl font-semibold">Ajouter un élève</h2>
            <p className="text-sm text-gray-600">Créer un nouveau compte élève avec parent.</p>
          </div>
        </Link>
        <Link href="/dashboard/admin/ajouter-tuteur">
          <div className="p-4 border rounded hover:bg-gray-100 cursor-pointer">
            <h2 className="text-xl font-semibold">Ajouter un tuteur</h2>
            <p className="text-sm text-gray-600">Créer un nouveau compte tuteur et lui envoyer une invitation.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
