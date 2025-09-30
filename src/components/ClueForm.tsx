import { memo, useCallback, useMemo, useRef, useState } from 'react'

type MediaType = 'image' | 'video' | 'audio' | 'text'
type ContentType = 'file' | 'url' | 'text'

export { MediaPreview }

const detectMediaType = (content: string): MediaType => {
  if (!content) return 'text'

  if (content.startsWith('data:image/')) return 'image'
  if (content.startsWith('data:video/')) return 'video'
  if (content.startsWith('data:audio/')) return 'audio'

  if (/\.(jpeg|jpg|gif|png|webp|svg)$/i.test(content)) return 'image'
  if (/\.(mp4|webm|mov|avi|mkv|ogg)$/i.test(content)) return 'video'
  if (/\.(mp3|wav|m4a|flac|ogg)$/i.test(content)) return 'audio'

  return 'text'
}

const MediaPreview = memo(
  ({
    content,
    type,
    onChange,
    onChangeUrl,
  }: {
    content: string
    type: MediaType
    onChange: (val: string) => void
    onChangeUrl: (val: string) => void
  }) => {
    const [isEditingUrl, setIsEditingUrl] = useState(false)
    const [tempUrl, setTempUrl] = useState(content)

    const handleSaveUrl = () => {
      onChangeUrl(tempUrl)
      setIsEditingUrl(false)
    }

    const handleCancelUrl = () => {
      setTempUrl(content)
      setIsEditingUrl(false)
    }

    if (!content && type !== 'text') return null

    switch (type) {
      case 'image':
        return (
          <div className="space-y-2">
            <img
              src={content}
              alt="preview"
              className="max-h-40 w-full rounded-md object-cover"
            />
            {!isEditingUrl ? (
              <button
                type="button"
                onClick={() => setIsEditingUrl(true)}
                className="w-full rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200"
              >
                Editar URL da imagem
              </button>
            ) : (
              <div className="space-y-2">
                <input
                  type="url"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  placeholder="Cole a URL da imagem"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveUrl}
                    className="flex-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelUrl}
                    className="flex-1 rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      case 'video':
        return (
          <div className="space-y-2">
            <video
              src={content}
              controls
              preload="metadata"
              className="max-h-40 w-full rounded-md"
            />
            {!isEditingUrl ? (
              <button
                type="button"
                onClick={() => setIsEditingUrl(true)}
                className="w-full rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200"
              >
                Editar URL do vídeo
              </button>
            ) : (
              <div className="space-y-2">
                <input
                  type="url"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  placeholder="Cole a URL do vídeo"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveUrl}
                    className="flex-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelUrl}
                    className="flex-1 rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      case 'audio':
        return (
          <div className="space-y-2">
            <audio controls preload="metadata" className="w-full">
              <source src={content} type="audio/mpeg" />
              Seu navegador não suporta o elemento de áudio.
            </audio>
            {!isEditingUrl ? (
              <button
                type="button"
                onClick={() => setIsEditingUrl(true)}
                className="w-full rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200"
              >
                Editar URL do áudio
              </button>
            ) : (
              <div className="space-y-2">
                <input
                  type="url"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  placeholder="Cole a URL do áudio"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveUrl}
                    className="flex-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelUrl}
                    className="flex-1 rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      case 'text':
        return (
          <textarea
            className="w-full rounded-lg border border-solid border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Digite seu texto aqui..."
          />
        )
      default:
        return null
    }
  }
)

MediaPreview.displayName = 'MediaPreview'

interface TaskFormProps {
  value: string
  onChange: (value: string) => void
}

const ClueForm = memo(({ value, onChange }: TaskFormProps) => {
  const [contentType, setContentType] = useState<ContentType>('text')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const mediaType = useMemo(() => detectMediaType(value), [value])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]

      if (!file) {
        setContentType('text')
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result
        if (typeof result === 'string') {
          onChange(result)
        }
      }
      reader.readAsDataURL(file)
    },
    [onChange]
  )

  const handleFileButtonClick = useCallback(() => {
    setContentType('file')
    setTimeout(() => {
      fileInputRef.current?.click()
    }, 0)
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Tipo de conteúdo
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setContentType('text')}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              contentType === 'text'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Texto
          </button>
          <button
            type="button"
            onClick={handleFileButtonClick}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              contentType === 'file'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Arquivo
          </button>
          <button
            type="button"
            onClick={() => setContentType('url')}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              contentType === 'url'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            URL
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,audio/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Campo de edição de URL */}
      {contentType === 'url' && (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            URL do arquivo
          </label>
          <input
            type="url"
            className="w-full rounded-lg border border-solid border-gray-300 px-4 py-3 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Cole a URL da imagem, vídeo ou áudio"
            autoFocus
          />
        </div>
      )}

      {(value?.trim() || contentType === 'text') && (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Preview
          </label>
          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <MediaPreview
              content={value}
              type={mediaType}
              onChange={onChange}
              onChangeUrl={onChange}
            />
          </div>
        </div>
      )}
    </div>
  )
})

export default ClueForm
