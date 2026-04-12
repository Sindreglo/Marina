export function LoadingScreen() {
  return (
    <div className="flex h-[calc(100vh-56px)] flex-col items-center justify-center gap-4">
      <div className="relative flex items-center justify-center">
        <span className="absolute inline-flex h-12 w-12 animate-ping rounded-full bg-accent opacity-20" />
        <span className="relative font-serif text-2xl tracking-tight">
          <span className="text-accent">●</span> Marina
        </span>
      </div>
    </div>
  )
}
