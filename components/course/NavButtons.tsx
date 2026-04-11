import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { FlatLesson } from '@/lib/utils'

interface Props {
  prev: FlatLesson | null
  next: FlatLesson | null
  onNav: (id: string) => void
  exitHref?: string
  onFinish?: () => void
  isFinished?: boolean
}

export function NavButtons({ prev, next, onNav, exitHref, onFinish, isFinished }: Props) {
  return (
    <div className="flex gap-3 border-t border-border pt-5">
      {prev ? (
        <button
          onClick={() => onNav(prev.id)}
          className="flex-1 flex flex-col gap-1 p-4 text-left bg-bg-card border border-border rounded-xl hover:border-border-focus transition-colors"
        >
          <span className="flex items-center gap-1 text-[11px] text-ink-light">
            <ArrowLeft size={13} /> Forrige
          </span>
          <span className="text-[14px] font-medium">{prev.title || 'Uten tittel'}</span>
        </button>
      ) : exitHref ? (
        <Link
          href={exitHref}
          className="flex-1 flex flex-col gap-1 p-4 text-left bg-bg-card border border-border rounded-xl hover:border-border-focus transition-colors"
        >
          <span className="flex items-center gap-1 text-[11px] text-ink-light">
            <ArrowLeft size={13} /> Avbryt
          </span>
          <span className="text-[14px] font-medium">Tilbake til Landingsside</span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {next ? (
        <button
          onClick={() => onNav(next.id)}
          className="flex-1 flex flex-col gap-1 p-4 text-right bg-bg-card border border-border rounded-xl hover:border-border-focus transition-colors"
        >
          <span className="flex items-center gap-1 justify-end text-[11px] text-ink-light">
            Neste <ArrowRight size={13} />
          </span>
          <span className="text-[14px] font-medium">{next.title || 'Uten tittel'}</span>
        </button>
      ) : onFinish ? (
        isFinished ? (
          <Link
            href="/"
            className="flex-1 flex flex-col gap-1 p-4 text-right bg-bg-card border border-border rounded-xl hover:border-border-focus transition-colors"
          >
            <span className="flex items-center gap-1 justify-end text-[11px] text-ink-light">
              Ferdig <ArrowRight size={13} />
            </span>
            <span className="text-[14px] font-medium">Gå til Landingsside</span>
          </Link>
        ) : (
          <button
            onClick={onFinish}
            className="flex-1 flex flex-col gap-1 p-4 text-right bg-bg-card border border-border rounded-xl hover:border-border-focus transition-colors"
          >
            <span className="flex items-center gap-1 justify-end text-[11px] text-ink-light">
              Fullfør kurs <ArrowRight size={13} />
            </span>
            <span className="text-[14px] font-medium">Marker som fullført</span>
          </button>
        )
      ) : (
        <div className="flex-1" />
      )}
    </div>
  )
}
