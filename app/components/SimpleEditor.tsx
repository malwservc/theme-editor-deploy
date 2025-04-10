'use client'
import { useEffect, useState } from 'react'
import PreviewButton from './PreviewButton'

interface Props {
  themeId: string
  filePath: string
}

const isImage = (filename: string) =>
  /\.(png|jpe?g|gif|svg|webp|jpg)$/i.test(filename)

export default function SimpleEditor({ themeId, filePath }: Props) {
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [previewing, setPreviewing] = useState(false)

  // Carrega o conteúdo do arquivo
  useEffect(() => {
    if (!filePath) return

    const fetchFile = async () => {
      setLoading(true)
      setImageUrl(null)
      setContent('')

      try {
        // 1. Obter accessToken
        const tokenRes = await fetch('/api/token')
        const { accessToken } = await tokenRes.json()

        console.log(filePath);
        if (isImage(filePath)) {
          // Exemplo de URL pública com CDN:
          const fileName = filePath.split('/').pop()
          const imageCDN = `https://assets.zironite.uk/${themeId}/assets/${fileName}`
          setImageUrl(imageCDN)
        }else{
          const res = await fetch(
            `https://themes.zironite.uk/themes/files?path=${encodeURIComponent(filePath)}&theme=${themeId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            }
          )
  

          if (!res.ok) {
            console.error('Erro ao buscar arquivo')
            return
          }

          const text = await res.text()
          setContent(text)
        }
      } catch (err) {
        console.error('Erro ao buscar conteúdo:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFile()
  }, [filePath, themeId])

  const handleSave = async () => {
    setSaving(true)
    try {
      const tokenRes = await fetch('/api/token')
      const { accessToken } = await tokenRes.json()
  
      const res = await fetch('https://themes.zironite.uk/themes/files', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          themeId: themeId,
          path: filePath,
          content,
        }),
      })
  
      if (!res.ok) {
        console.error('Erro ao salvar o arquivo:', await res.text())
      } else {
        console.log('Arquivo salvo com sucesso!')
      }
    } catch (err) {
      console.error('Erro na requisição PUT:', err)
    } finally {
      setSaving(false)
    }
  }
  
  const handlePreview = async () => {
    setPreviewing(true)
    try {
      const tokenRes = await fetch('/api/token')
      const { accessToken } = await tokenRes.json()

      const res = await fetch(`https://themes.zironite.uk/themes/preview?theme=${themeId}&path=${filePath}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!res.ok) {
        console.error('Erro ao gerar preview')
        return
      }

      const html = await res.text()

      // Abre nova aba com HTML (sandboxed)
      const win = window.open()
      if (win) {
        win.document.open()
        win.document.write(html)
        win.document.close()
      } else {
        alert('Não foi possível abrir o preview (popup bloqueado?)')
      }
    } catch (err) {
      console.error('Erro no preview:', err)
    } finally {
      setPreviewing(false)
    }
  }

  if (!filePath) return <div className="p-4 text-sm text-gray-500">Selecione um arquivo</div>

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-4 py-2 border-b bg-gray-50 gap-2">
        <span className="text-sm font-medium truncate max-w-[60%]">{filePath}</span>
        <div className="flex gap-2">
          {!isImage(filePath) && (
            <button
              onClick={handleSave}
              className="bg-black text-white text-sm px-3 py-1 rounded"
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
            

          )}
          {!isImage(filePath) && filePath.startsWith('templates/') && (
            <PreviewButton themeName={themeId} openedFilePath={filePath} />
          )}
        </div>
      </div>

      {loading ? (
        <div className="p-4">Carregando conteúdo...</div>
      ) : isImage(filePath) ? (
        imageUrl ? (
          <div className="p-4 flex justify-center items-center h-full">
            <img src={imageUrl} alt={filePath} className="max-h-full max-w-full object-contain" />
          </div>
        ) : (
          <div className="p-4">Carregando imagem...</div>
        )
      ) : (
        <textarea
          className="flex-1 p-4 font-mono text-sm outline-none resize-none w-full h-full bg-white text-black border border-gray-300"
          style={{ minHeight: '100%', minWidth: '100%' }}
          value={content}
          onChange={e => setContent(e.target.value)}
        />
      )}


  
    </div>
  )
}
