'use client'

import { useState, useRef } from 'react'
import { Link2, Upload, X, Loader2 } from 'lucide-react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase'

type Mode = 'link' | 'upload'

export function ImageUploader({
  lessonId,
  imageUrl,
  onChange,
}: {
  lessonId: string
  imageUrl?: string
  onChange: (url: string) => void
}) {
  const [mode, setMode] = useState<Mode>('upload')
  const [linkInput, setLinkInput] = useState(imageUrl ?? '')
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function handleLinkSave() {
    const url = linkInput.trim()
    if (!url) return
    onChange(url)
    setError('')
  }

  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Kun bildefiler støttes.')
      return
    }
    setError('')
    setProgress(0)
    const storageRef = ref(storage, `images/${lessonId}/${file.name}`)
    const task = uploadBytesResumable(storageRef, file)
    task.on(
      'state_changed',
      (snap) => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      () => { setError('Opplasting feilet. Prøv igjen.'); setProgress(null) },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        onChange(url)
        setProgress(null)
      }
    )
  }

  return (
    <div className="mb-4">
      {/* Mode toggle */}
      <div className="flex gap-1 mb-3 p-1 bg-bg-warm rounded-lg w-fit">
        {(['upload', 'link'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
              mode === m ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {m === 'link' ? <Link2 size={12} /> : <Upload size={12} />}
            {m === 'link' ? 'Legg til lenke' : 'Last opp'}
          </button>
        ))}
      </div>

      {mode === 'link' ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLinkSave()}
            placeholder="https://..."
            className="flex-1 px-3 py-2 border border-border rounded-lg text-[14px] outline-none focus:border-accent bg-white transition-colors"
          />
          <button
            onClick={handleLinkSave}
            className="px-4 py-2 bg-ink text-white text-[13px] font-semibold rounded-lg hover:bg-ink/90 transition-colors"
          >
            Lagre
          </button>
          {imageUrl && (
            <button
              onClick={() => { onChange(''); setLinkInput('') }}
              className="px-2 py-2 text-ink-muted hover:text-ink rounded-lg hover:bg-bg-warm transition-colors"
            >
              <X size={15} />
            </button>
          )}
        </div>
      ) : (
        <div>
          {progress !== null ? (
            <div className="border border-border rounded-lg p-4 bg-white">
              <div className="flex items-center gap-3 mb-2">
                <Loader2 size={14} className="animate-spin text-accent" />
                <span className="text-[13px] text-ink-muted">Laster opp... {progress}%</span>
              </div>
              <div className="h-1.5 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-[width]" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-accent hover:bg-accent-soft/30 transition-all"
            >
              <Upload size={20} className="mx-auto mb-2 text-ink-muted" />
              <p className="text-[13px] text-ink-muted">Dra og slipp bilde her, eller <span className="text-accent font-medium">velg fil</span></p>
              <p className="text-[11px] text-ink-light mt-1">JPG, PNG, WebP, GIF</p>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
            </div>
          )}
          {imageUrl && progress === null && (
            <div className="flex items-center justify-between mt-2 px-1">
              <span className="text-[12px] text-green font-medium">Bilde lastet opp</span>
              <button onClick={() => onChange('')} className="text-[12px] text-ink-muted hover:text-ink transition-colors flex items-center gap-1">
                <X size={12} /> Fjern
              </button>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-[12px] text-red-500 mt-2">{error}</p>}

      {imageUrl && (
        <img
          src={imageUrl}
          alt=""
          className="w-full rounded-xl mt-3 object-cover"
          style={{ maxHeight: 280 }}
        />
      )}
    </div>
  )
}
