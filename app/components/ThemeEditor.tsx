'use client'
import { useState } from 'react'
import FileTreeManual from './FileTreeManual'
import SimpleEditor from './SimpleEditor'

export default function ThemeEditor({ themeId }: { themeId: string }) {
  const [selectedPath, setSelectedPath] = useState('')

  return (
    <div className="flex h-screen">
      <div className="w-64 border-r overflow-y-auto">
        <FileTreeManual themeId={themeId} onSelect={setSelectedPath} />
      </div>
      <div className="flex-1">
        <SimpleEditor themeId={themeId} filePath={selectedPath} />
      </div>
    </div>
  )
}
