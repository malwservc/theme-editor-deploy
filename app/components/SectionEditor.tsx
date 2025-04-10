// components/SectionEditor.tsx
import React from 'react'
import {ImageUploader} from "../components/ImageUploader"

interface SectionEditorProps {
  sectionId: string
  section: {
    type: string
    settings: Record<string, any>
    settingsSchema?: {
        name: string
        label: string
        type: 'text' | 'textarea' | 'checkbox' | 'select' | 'list' | 'image'
        default?: any
        options?: string[]
      }[]
      
  }
  onChange: (key: string, value: any) => void
  onClose: () => void
}

export const SectionEditor: React.FC<SectionEditorProps> = ({
  sectionId,
  section,
  onChange,
  onClose,
}) => {
  if (!section) return null

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Editar: {section.type}</h3>

      <form className="space-y-3 text-sm">
      {section.settingsSchema?.map((field) => (
        <div key={field.name} className="mb-3">
            <label className="block text-gray-700 text-sm mb-1">{field.label}</label>

            {/* TEXT */}
            {field.type === 'text' && (
            <input
                type="text"
                value={section.settings[field.name] ?? ''}
                onChange={(e) => onChange(field.name, e.target.value)}
                placeholder={field.default}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            )}

            {/* SELECT */}
            {field.type === 'select' && Array.isArray(field.options) && (
            <select 
                value={section.settings[field.name] ?? ''}
                onChange={(e) => onChange(field.name, e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 text-gray-800"

            >
                <option value="" disabled>{field.default || 'Selecione uma opção'}</option>
                {field.options.map((opt) => (
                <option key={opt} value={opt}>
                    {opt}
                </option>
                ))}
            </select>
            )}

            {/* LIST (ex: array de imagens) */}
            {field.type === 'list' && field.name === 'images' && (
            <ImageUploader
                value={(section.settings[field.name] ?? [])[0]}
                onChange={(val) => onChange(field.name, [val])}
                label={field.label}
            />
            )}

        </div>
        ))}

      </form>

      <button
        onClick={onClose}
        className="mt-4 text-sm text-blue-600 hover:underline"
      >
        ← Voltar para as seções
      </button>
    </div>
  )
}
