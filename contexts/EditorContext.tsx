'use client'

import { createContext, useContext, useState } from 'react'

interface EditorControls {
  saving: boolean
  published: boolean
  onSave: () => void
  onTogglePublish: () => void
}

interface EditorContextValue {
  controls: EditorControls | null
  setControls: (controls: EditorControls | null) => void
  ownedCourseId: string | null
  setOwnedCourseId: (id: string | null) => void
}

const EditorContext = createContext<EditorContextValue>({
  controls: null,
  setControls: () => {},
  ownedCourseId: null,
  setOwnedCourseId: () => {},
})

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [controls, setControls] = useState<EditorControls | null>(null)
  const [ownedCourseId, setOwnedCourseId] = useState<string | null>(null)
  return (
    <EditorContext.Provider value={{ controls, setControls, ownedCourseId, setOwnedCourseId }}>
      {children}
    </EditorContext.Provider>
  )
}

export function useEditorContext() {
  return useContext(EditorContext)
}
