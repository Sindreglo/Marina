export function getEmbedUrl(url: string): { type: 'iframe'; src: string } | { type: 'video'; src: string } | null {
  try {
    const u = new URL(url)

    // YouTube
    const ytId =
      (u.hostname.includes('youtube.com') && u.searchParams.get('v')) ||
      (u.hostname === 'youtu.be' && u.pathname.slice(1))
    if (ytId) {
      return { type: 'iframe', src: `https://www.youtube.com/embed/${ytId}` }
    }

    // Vimeo
    const vimeoMatch = u.hostname.includes('vimeo.com') && u.pathname.match(/\/(\d+)/)
    if (vimeoMatch) {
      return { type: 'iframe', src: `https://player.vimeo.com/video/${vimeoMatch[1]}` }
    }

    // Direct video file
    return { type: 'video', src: url }
  } catch {
    return null
  }
}
