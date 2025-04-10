'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'


const storeItems = [
  { label: 'Configurações', href: '/store/settings' },
  { label: 'Páginas customizáveis', href: '/store/pages' },
  { label: 'Navegação', href: '/store/navigation' },
  { label: 'Temas', href: '/store/themes' },
  { label: "Marca d'água", href: '/store/watermark' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <aside className={`bg-white shadow-md border-r transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b h-16">
          <span className="font-bold text-lg truncate">{!collapsed && 'Painel'}</span>
          <button onClick={() => setCollapsed(!collapsed)} className="text-gray-500 hover:text-gray-700">
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <div className={`mt-6 mb-2 px-4 text-xs uppercase text-gray-500 ${collapsed && 'hidden'}`}>
            Loja Online
          </div>

          {storeItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded px-4 py-2 text-sm font-medium hover:bg-gray-100 ${
                pathname === item.href ? 'bg-gray-200 text-blue-600' : 'text-gray-800'
              }`}
            >
              {!collapsed && item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
