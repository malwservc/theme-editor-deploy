'use client'
import { useEffect, useState } from 'react'

interface Props {
  themeId: string
  onSelect: (path: string) => void
}

type FileItem = { path: string }

export default function FileTreeManual({ themeId, onSelect }: Props) {
  const [files, setFiles] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchTheme = async () => {
      try {

        const tokenRes = await fetch('/api/token')
        const { accessToken } = await tokenRes.json()

        // 2. Chamar sua API externa protegida
        const res = await fetch(`https://themes.zironite.uk/themes/editor?theme=${themeId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })

        if (!res.ok) {
          console.error('FALHA na chamada do tema.')
          return
        }

        const data = await res.json()
        const prefix = `${data.tenantId}/themes/${themeId}/`

        if (Array.isArray(data.files)) {
          const clean = data.files.map((f: any) =>
            f.fullPath.replace(prefix, '').replace(/\$/g, '')
          )
          setFiles(clean)
        } else {
          console.error('Formato inesperado da resposta:', data)
        }

      } catch (err) {
        console.error('Erro ao buscar tema:', err)
      } finally {
        setLoading(false)
      }
    }

      fetchTheme()
  }, [themeId]);

  return (
    <ul className="p-2 text-sm">
      {loading && <li className="text-gray-500">Carregando arquivos...</li>}
      {!loading && files.map(path => (
        <li
          key={path}
          className="cursor-pointer hover:bg-gray-200 px-2 py-1"
          onClick={() => onSelect(path)}
        >
          {path}
        </li>
      ))}
    </ul>
  )
}
