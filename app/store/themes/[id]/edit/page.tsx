// /app/themes/[id]/edit/page.tsx

'use client'

import { use, useEffect, useState } from 'react'
import PreviewButton from '../../../../components/PreviewButton'
import ThemeEditor from '../../../../components/ThemeEditor'


type TreeNode = {
    name: string
    path: string
    type: 'folder' | 'file'
    children?: TreeNode[]
  }

export default function ThemeEditorPage(props: any) {
    const params = use(props.params) as { id: string } // tipa manualmente aqui
    const themeId = params.id
    return <ThemeEditor themeId={themeId} />
    

    // const [themeData, setThemeData] = useState<any>(null)

    // const [loading, setLoading] = useState(true)
    // const [tree, setTree] = useState<TreeNode[]>([])

    // const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null)
    // const [openFolders, setOpenFolders] = useState<Set<string>>(new Set())

    // const [fileContent, setFileContent] = useState<string | null>(null)
    // const [fileLoading, setFileLoading] = useState(false)

    // useEffect(() => {
    //     const fetchTheme = async () => {
    //     try {

    //         const tokenRes = await fetch('/api/token')
    //         const { accessToken } = await tokenRes.json()

    //         const res = await fetch(`https://themes.zironite.uk/themes/editor?theme=${themeId}`, {
    //         headers: {
    //             Authorization: `Bearer ${accessToken}`,
    //             'Content-Type': 'application/json',
    //         },
    //         })

    //         if (!res.ok){
    //             console.log('FALHA na chamada.');
    //         }

    //         const data = await res.json();
    //         setThemeData(data);

    //         const paths = data.files.map((f: any) => f.fullPath)
    //         const treeData = buildFileTree(paths)
    //         setTree(treeData)

    //     } catch (err) {
    //         console.error('Erro ao buscar tema:', err)
    //     } finally {
    //         setLoading(false)
    //     }
    //     }

    //     fetchTheme()
    // }, [themeId]);

    // const toggleFolder = (path: string) => {
    //     setOpenFolders((prev) => {
    //       const updated = new Set(prev)
    //       if (updated.has(path)) {
    //         updated.delete(path)
    //       } else {
    //         updated.add(path)
    //       }
    //       return updated
    //     })
    //   }

    // const buildFileTree = (paths: string[]): TreeNode[] => {
    //     const root: TreeNode[] = []
    
    //     for (const fullPath of paths) {
    //       const parts = fullPath.split('/').slice(3) // remove tenantId/themes/themeName
    //       let currentLevel = root
    
    //       parts.forEach((part, index) => {
    //         const isFile = index === parts.length - 1
    //         let existing = currentLevel.find((node) => node.name === part)
    
    //         if (!existing) {
    //           const newNode: TreeNode = {
    //             name: part,
    //             path: parts.slice(0, index + 1).join('/'),
    //             type: isFile ? 'file' : 'folder',
    //             ...(isFile ? {} : { children: [] }),
    //           }
    
    //           currentLevel.push(newNode)
    //           if (!isFile) currentLevel = newNode.children!
    //         } else if (!isFile && existing.children) {
    //           currentLevel = existing.children
    //         }
    //       })
    //     }
    
    //     return root
    // }

    // const FileTree = ({ nodes, onSelect }: { nodes: TreeNode[]; onSelect: (path: string) => void }) => {
    //     return (
    //         <ul className="text-sm">
    //         {nodes.map((node) => (
    //             <li key={node.path} className="pl-2">
    //             {node.type === 'folder' ? (
    //                 <details open={openFolders.has(node.path)}>
    //                 <summary
    //                     onClick={(e) => {
    //                     e.preventDefault()
    //                     toggleFolder(node.path)
    //                     }}
    //                     className="font-medium cursor-pointer"
    //                 >
    //                     📁 {node.name}
    //                 </summary>
    //                 <FileTree nodes={node.children!} onSelect={onSelect} />
    //                 </details>
    //             ) : (
    //                 <button
    //                 onClick={() => handleFileClick(node.path)}
    //                 className={`text-left hover:underline ${
    //                     selectedFilePath === node.path ? 'text-blue-600 font-semibold' : 'text-gray-800'
    //                 }`}
    //                 >
    //                 📄 {node.name}
    //                 </button>
    //             )}
    //             </li>
    //         ))}
    //         </ul>
    //     )
    // }

    // function isImage(fileName: string): boolean {
    //     const ext = fileName.split('.').pop()?.toLowerCase() || ''
    //     return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)
    //   }

    // const handleFileClick = async (path: string) => {
    //     setSelectedFilePath(path)
    //     setFileContent(null)
    //     setFileLoading(true)
      
    //     try {
    //       const tokenRes = await fetch('/api/token')
    //       const { accessToken } = await tokenRes.json()
      
    //       const res = await fetch(
    //         `https://themes.zironite.uk/themes/files?path=${encodeURIComponent(path)}&theme=${themeId}`,
    //         {
    //           headers: {
    //             Authorization: `Bearer ${accessToken}`,
    //             'Content-Type': 'application/json',
    //           },
    //         }
    //       )
      
    //       if (!res.ok) throw new Error('Erro ao buscar conteúdo do arquivo')
      
    //       const content  = await res.text()
    //       setFileContent(content  || '')
    //     } catch (err) {
    //       console.error('Erro ao buscar arquivo:', err)
    //       setFileContent('// Erro ao carregar arquivo')
    //     } finally {
    //       setFileLoading(false)
    //     }
    // }
      

    // function detectLanguage(path: string | null): 'html' | 'json' | 'css' {
    //     if (!path) return 'html'
    //     if (path.endsWith('.json')) return 'json'
    //     if (path.endsWith('.css')) return 'css'
    //     return 'html'
    // }
    
    // return (
    //     <div className="flex h-screen">
    //     {/* Coluna esquerda - Navegador de arquivos */}
    //     <aside className="w-72 bg-white border-r p-4 overflow-y-auto">
    //       <h2 className="text-lg font-semibold mb-2">Arquivos</h2>
    //       {loading ? (
    //         <p className="text-sm text-gray-500">Carregando...</p>
    //       ) : (
    //         <FileTree nodes={tree} onSelect={setSelectedFilePath} />
    //       )}
    //     </aside>
  
    //     {/* Coluna direita - Painel de edição */}
    //     <main className="flex-1 p-6 overflow-y-auto">
    //       <h1 className="text-2xl font-bold mb-4">Editor do Tema: {themeId}</h1>
  
    //         {selectedFilePath ? (
    //             <div className="bg-gray-50 border rounded-lg p-4 shadow">
    //             <p className="text-sm text-gray-600 mb-2">Arquivo selecionado:</p>
    //             <pre className="text-sm bg-white p-3 rounded border text-gray-800">{selectedFilePath}</pre>
    //             {/* Em breve: conteúdo do arquivo e botão de salvar */}
    //             {fileLoading ? (
    //                     <p className="text-gray-500">Carregando conteúdo...</p>
    //                 ) : (
    //                 // <textarea
    //                 //     value={fileContent || ''}
    //                 //     onChange={(e) => setFileContent(e.target.value)}
    //                 //     className="w-full h-96 p-3 border rounded font-mono text-sm"
    //                 // />
    //                 <CodeEditor
    //                     value={fileContent || ''}
    //                     onChange={setFileContent}
    //                     language={detectLanguage(selectedFilePath)}
    //                 />
    //                 )}
    //             </div>
    //         ) : (
    //             <p className="text-gray-500">Selecione um arquivo à esquerda para visualizar.</p>
    //         )}
    //         {selectedFilePath?.startsWith('templates/') && (
    //             <PreviewButton
    //                 themeName={themeId}
    //                 openedFilePath={selectedFilePath}
    //             />
    //         )}

    //     </main>
    //   </div>
    // )
}
