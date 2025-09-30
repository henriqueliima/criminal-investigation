export type MediaType = 'image' | 'video' | 'audio' | 'text'
export type ContentType = 'text' | 'image' | 'video' | 'audio'

export const detectMediaType = (content: string): MediaType => {
  if (!content) return 'text'

  if (content.startsWith('data:image/')) return 'image'
  if (content.startsWith('data:video/')) return 'video'
  if (content.startsWith('data:audio/')) return 'audio'

  if (/\.(jpeg|jpg|gif|png|webp|svg)$/i.test(content)) return 'image'
  if (/\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(content)) return 'video'
  if (/\.(mp3|wav|ogg|m4a|flac)$/i.test(content)) return 'audio'

  return 'text'
}
