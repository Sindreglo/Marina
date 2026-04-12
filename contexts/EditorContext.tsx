'use client'

import { createContext, useContext, useState } from 'react'

export interface EditorControls {
  saving: boolean
  saved: boolean
  published: boolean
  canSave: boolean
  onSave: () => void
  onTogglePublish: () => void
}

interface EditorContextValue {
  controls: EditorControls | null
  setControls: (controls: EditorControls | null) => void
}

const EditorContext = createContext<EditorContextValue>({ controls: null, setControls: () => {} })

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [controls, setControls] = useState<EditorControls | null>(null)
  return (
    <EditorContext.Provider value={{ controls, setControls }}>
      {children}
    </EditorContext.Provider>
  )
}

export function useEditorContext() {
  return useContext(EditorContext)
}
