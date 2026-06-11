'use client';

import { LayoutDashboard, LogOut } from 'lucide-react';
import { useAuthStore } from '@/application/stores/auth.store';
import { useRouter } from 'next/navigation';

export function Header() {
  const { logout, user } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="bg-gopass-black-800 border-b border-gopass-black-600 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gopass-green-500 rounded-lg">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">GoPass</h1>
            <p className="text-xs text-gopass-green-400">Task Manager</p>
          </div>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{user.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gopass-black-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
