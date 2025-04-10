'use client'

import { useEffect, useRef } from 'react'
import { EditorView, keymap, highlightActiveLine, lineNumbers } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { history, historyKeymap, indentWithTab  } from '@codemirror/commands'
import {defaultKeymap} from "@codemirror/commands"
import { html } from '@codemirror/lang-html'
import { json } from '@codemirror/lang-json'
import { css } from '@codemirror/lang-css'

export default function CodeEditor({
  value,
  onChange,
  language = 'html',
}: {
  value: string
  onChange: (val: string) => void
  language?: 'html' | 'json' | 'css'
}) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)

  useEffect(() => {
    if (!editorRef.current) return

    const extensions = [
        lineNumbers(),
        highlightActiveLine(),
        history(),
        keymap.of([indentWithTab, ...defaultKeymap, ...historyKeymap]),
        EditorView.updateListener.of((update) => {
        if (update.docChanged) {
            const doc = update.state.doc.toString()
            onChange(doc)
        }
        }),
    ]

    // Adiciona linguagem com base no tipo
    if (language === 'html') extensions.push(html())
    else if (language === 'json') extensions.push(json())
    else if (language === 'css') extensions.push(css())

    const state = EditorState.create({
      doc: value,
      extensions,
    })

    const view = new EditorView({
      state,
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
    }
  }, [])

  return <div ref={editorRef} className="h-96 border rounded bg-white" />
}
