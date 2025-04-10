'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ThemesPage() {
  const [activeThemeId, setActiveThemeId] = useState<string | null>(null);
  const [themeName, setThemeName] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    const fetchActiveTheme = async () => {
      try {
        // Chamada para sua API interna que retorna o access token
        const tokenRes = await fetch('/api/token')
        const { accessToken } = await tokenRes.json()

        // Chamada para o endpoint de temas com Authorization
        const res = await fetch('https://themes.zironite.uk/themes', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
        if (!res.ok) throw new Error('Erro ao buscar tema ativo')

          const data = await res.json()
          setActiveThemeId(data.active)
          setThemeName(data.themeName)
        } catch (err) {
          console.error('Erro ao buscar tema ativo:', err)
        }
      }
    fetchActiveTheme()
  }, [])

  const handleEditClick = () => {
    if (activeThemeId) {
      router.push(`/store/themes/${activeThemeId}/edit`)
    }
  }

  return (
    <div>
    <h1 className="text-2xl font-bold mb-6">Temas Disponíveis</h1>

    {activeThemeId ? (
      <div className="bg-white rounded-xl border shadow p-6 max-w-md">
        <h2 className="text-lg mb-1">Tema Atual: {themeName}</h2>

        <button
          onClick={handleEditClick}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Editar
        </button>
      </div>
    ) : (
      <p className="text-sm text-gray-500 mb-4">Carregando tema atual...</p>
    )}

  </div>
  )
}