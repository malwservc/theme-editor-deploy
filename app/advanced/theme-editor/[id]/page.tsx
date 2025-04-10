// app/advanced/theme-editor/[themeId]/page.tsx

'use client'
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
  
import { use, useEffect, useRef, useState, useLayoutEffect } from 'react'
import { Monitor, Smartphone, Eye, EyeOff, GripVertical } from 'lucide-react'
import { SectionEditor } from '../../../components/SectionEditor'



type TemplateOption = {
    template: string
    label: string
    hasJson: boolean
  }


interface SectionConfig {
    [sectionId: string]: {
      type: string
      settings: Record<string, any>
    }
  }


function SortableSection({
    id,
    type,
    visible,
    onToggle,
    onClick
  }: {
    id: string
    type: string
    visible: boolean
    onToggle: () => void
    onClick: () => void
  }) {
    const { attributes, listeners, setNodeRef, transform, transition,setActivatorNodeRef } = useSortable({ id })
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }
  
    return (
        <div
          ref={setNodeRef}
          style={style}
          className="flex items-center justify-between bg-gray-100 p-3 rounded border text-sm text-gray-800"
        >
          {/* Ícone de drag (handle) */}
          <div
            ref={setActivatorNodeRef}
            {...listeners}
            {...attributes}
            className="cursor-grab mr-2 text-gray-400 hover:text-gray-600"
          >
            <GripVertical size={16} />
          </div>
    
          {/* Tipo da seção */}
          <span className="flex-1 truncate">{type}</span>
    
          {/* Botão de visibilidade */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggle()
            }}
            className="text-gray-500 hover:text-gray-800"
          >
            {visible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
      )
}

export default function ThemeEditor(props: any) {
    const iframeRef = useRef<HTMLIFrameElement>(null)

    const [html, setContent] = useState<string>('')
    const [version, setVersion] = useState(0)
    const [pages, setPages] = useState<string[]>([])
    const [templates, setTemplates] = useState<TemplateOption[]>([])

    const [selectedTemplate, setSelectedTemplate] = useState<string>('index')
    const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('desktop')

    const [sections, setSections] = useState<SectionConfig>({})
    const [sectionOrder, setSectionOrder] = useState<string[]>([])
    const [sectionsVisibility, setSectionsVisibility] = useState<Record<string, boolean>>({})
    const [availableSections, setAvailableSections] = useState<any[]>([])
    const [editingSectionId, setEditingSectionId] = useState<string | null>(null)


    const [panelMode, setPanelMode] = useState<'sections' | 'add' | 'edit-new'>('sections')

    const [pendingSection, setPendingSection] = useState<{
        id: string
        type: string
        settings: Record<string, any>
        settingsSchema?: {
          name: string
          label: string
          type: 'text' | 'textarea' | 'checkbox' | 'select'
          default?: any
        }[]
      } | null>(null)
      



    const params = use(props.params) as { id: string } // tipa manualmente aqui
    const themeId = params.id

    useEffect(() => {
        const fetchTemplates = async () => {
          try {
            const tokenRes = await fetch('/api/token')
            const { accessToken } = await tokenRes.json()

            const res = await fetch(
              `https://themes.zironite.uk/themes/templates?theme=${themeId}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            const json = await res.json()
            setTemplates(json)
          } catch (err) {
            console.error('Erro ao buscar templates:', err)
          }
        }
    
        fetchTemplates()
    }, [themeId])

    useEffect(() => {
        const fetchPreview = async () => {
            
            const tokenRes = await fetch('/api/token')
            const { accessToken } = await tokenRes.json()
    
            // 2. Chamar sua API externa protegida
            const res = await fetch(`https://themes.zironite.uk/themes/preview?theme=${themeId}&path=/${selectedTemplate}&t=${Date.now()}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            })
    
            const htmlText = await res.text()
            setContent(htmlText)
            setVersion((v) => v + 1) 
            }

            fetchPreview()
    }, [themeId, selectedTemplate])
    

    // Buscar seções do template selecionado
    useEffect(() => {
        const fetchSections = async () => {

            const tokenRes = await fetch('/api/token')
            const { accessToken } = await tokenRes.json()

            const res = await fetch(
                `https://themes.zironite.uk/themes/templates/config?theme=${themeId}&template=${selectedTemplate}`,
                {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
            })
            const json = await res.json()
            setSections(json.sections || {})
            setSectionOrder(json.order || Object.keys(json.sections || {}))
            setSectionsVisibility(
                Object.fromEntries(Object.keys(json.sections || {}).map((id) => [id, true]))
            )
        }

        fetchSections()
    }, [themeId, selectedTemplate])

    const fetchAvailableSections = async () => {
        try {
          const res = await fetch(
            `https://themes.zironite.uk/themes/sections`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
          const json = await res.json()
          setAvailableSections(json)
        } catch (err) {
          console.error('Erro ao buscar seções disponíveis:', err)
        }
      }


    useLayoutEffect(() => {
        if (iframeRef.current && html) {
          const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
          if (doc) {
            setTimeout(() => {
              doc.open()
              doc.write(html)
              doc.close()
            }, 0)
          }
        }
      }, [html])
    
    const handleSectionChange = (key: string, value: any) => {
        if (!editingSectionId) return
        setSections((prev) => ({
            ...prev,
            [editingSectionId]: {
                ...prev[editingSectionId],
                settings: {
                    ...prev[editingSectionId].settings,
                    [key]: value,
                },
            },
        }))
    }

    const sensors = useSensors(useSensor(PointerSensor))

    return (
        <div className="flex h-screen bg-gray-100">
        <aside className="w-80 bg-white p-4 border-r shadow-sm overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
                {panelMode === 'add'
                ? 'Adicionar seção'
                : panelMode === 'edit-new'
                ? 'Nova seção'
                : 'Seções'}
            </h2>

            {panelMode === 'sections' && (
                <>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={async ({ active, over }) => {
                    if (over && active.id !== over.id) {
                        const oldIndex = sectionOrder.indexOf(active.id as string)
                        const newIndex = sectionOrder.indexOf(over.id as string)
                        const newOrder = arrayMove(sectionOrder, oldIndex, newIndex)
                        setSectionOrder(newOrder)

                        try {
                        const tokenRes = await fetch('/api/token')
                        const { accessToken } = await tokenRes.json()

                        await fetch(
                            `https://themes.zironite.uk/themes/templates/config?theme=${themeId}&template=${selectedTemplate}&action=order`,
                            {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${accessToken}`,
                            },
                            body: JSON.stringify({ order: newOrder }),
                            }
                        )

                        const res = await fetch(
                            `https://themes.zironite.uk/themes/preview?theme=${themeId}&path=/${selectedTemplate}&t=${Date.now()}`,
                            {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                                'Content-Type': 'application/json',
                            },
                            }
                        )

                        const htmlText = await res.text()
                        setContent(htmlText)
                        } catch (err) {
                        console.error('Erro ao atualizar ordem das seções:', err)
                        }
                    }
                    }}
                >
                    <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                        {sectionOrder.map((sectionId) => (
                        <SortableSection
                            key={sectionId}
                            id={sectionId}
                            type={sections[sectionId]?.type || sectionId}
                            visible={sectionsVisibility[sectionId]}
                            onToggle={() =>
                            setSectionsVisibility((prev) => ({
                                ...prev,
                                [sectionId]: !prev[sectionId],
                            }))
                            }
                            onClick={() => setEditingSectionId(sectionId)}
                        />
                        ))}
                    </div>
                    </SortableContext>
                </DndContext>

                {editingSectionId && sections[editingSectionId] && (
                    <SectionEditor
                    sectionId={editingSectionId}
                    section={sections[editingSectionId]}
                    onChange={handleSectionChange}
                    onClose={() => setEditingSectionId(null)}
                    />
                )}

                <div className="mt-4">
                    <button
                    onClick={() => {
                        fetchAvailableSections()
                        setPanelMode('add')
                    }}
                    className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                    + Adicionar nova seção
                    </button>
                </div>
                </>
            )}

            {panelMode === 'add' && (
                <>
                <div className="space-y-2">
                    {availableSections.length === 0 ? (
                    <p className="text-sm text-gray-500">Carregando seções disponíveis...</p>
                    ) : (
                    availableSections.map((section) => (
                        <button
                        key={section.type}
                        onClick={() => {
                            const id = `${section.type}-${Date.now()}`
                            setPendingSection({
                            id,
                            type: section.type,
                            settings: section.settings || {},
                            settingsSchema: section.settingsSchema || [],
                            })
                            setPanelMode('edit-new')
                        }}
                        className="w-full text-left rounded border border-gray-200 bg-white hover:shadow-sm hover:border-gray-300 px-4 py-3 transition text-sm"
                        >
                        <div className="font-medium text-gray-800">{section.label || section.type}</div>
                        <div className="text-gray-500 text-xs">{section.type}</div>
                        </button>
                    ))
                    )}
                </div>

                <button
                    onClick={() => setPanelMode('sections')}
                    className="mt-4 text-sm text-gray-500 hover:text-gray-700"
                >
                    ← Voltar
                </button>
                </>
            )}

            {panelMode === 'edit-new' && pendingSection && (
                <>
                <SectionEditor
                    sectionId={pendingSection.id}
                    section={pendingSection}
                    onChange={(key, value) => {
                    setPendingSection((prev) =>
                        prev ? { ...prev, settings: { ...prev.settings, [key]: value } } : null
                    )
                    }}
                    onClose={() => {
                    setPendingSection(null)
                    setPanelMode('add')
                    }}
                />
                <button
                    onClick={async () => {
                    if (!pendingSection) return
                    const { type, settings } = pendingSection
            
                    try {
                        const tokenRes = await fetch('/api/token')
                        const { accessToken } = await tokenRes.json()
                        

                        const res = await fetch(
                        `https://themes.zironite.uk/themes/templates/config?theme=${themeId}&template=${selectedTemplate}`,
                        {
                            method: 'POST',
                            headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${accessToken}`,
                            },
                            body: JSON.stringify({ type, settings }),
                        })
            
                        if (!res.ok) throw new Error('Erro ao salvar nova seção no servidor.')
            
                        const newSectionId = `${type}-${Date.now()}`
            
                        setSections((prev) => ({
                        ...prev,
                        [newSectionId]: { type, settings },
                        }))
                        setSectionOrder((prev) => [...prev, newSectionId])
                        setSectionsVisibility((prev) => ({ ...prev, [newSectionId]: true }))
                        setPendingSection(null)
                        setPanelMode('sections')
                    } catch (err) {
                        console.error('Erro ao adicionar seção:', err)
                        alert('Erro ao salvar seção.')
                    }
                    }}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full text-sm"
                        >
                    Adicionar Seção
                </button>
                </>
            )}
            </aside>


        {/* Preview */}
        <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:justify-between items-center gap-4 p-4 bg-white border-b shadow-sm">
            <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring focus:ring-blue-300 bg-gray-100 text-gray-800"
            >
            {templates.map((tpl) => (
                <option key={tpl.template} value={tpl.template}>
                {tpl.label}
                </option>
            ))}
            </select>

            <div className="flex gap-2 justify-center">
            <button
                onClick={() => setViewMode('desktop')}
                className={`flex items-center gap-1 px-3 py-2 rounded text-sm font-medium transition-all border ${
                viewMode === 'desktop'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
            >
                <Monitor size={16} /> Desktop
            </button>
            <button
                onClick={() => setViewMode('mobile')}
                className={`flex items-center gap-1 px-3 py-2 rounded text-sm font-medium transition-all border ${
                viewMode === 'mobile'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
            >
                <Smartphone size={16} /> Mobile
            </button>
            </div>
        </header>

        {/* Preview */}
        <div className="flex-1 overflow-auto flex justify-center items-start p-6 bg-gray-50">
            <iframe
            ref={iframeRef}
            srcDoc={html} 
            className={`border rounded bg-white ${
                viewMode === 'mobile' ? 'w-[390px] h-[844px]' : 'w-full h-[calc(100vh-64px)]'
            }`}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
        </div>
        </main>
    </div>
    )


}
