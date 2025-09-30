import { memo, useState } from 'react'

import type { MediaType } from '../types/mediaTypes'
import Button from './Button'

interface MediaPreviewProps {
  content: string
  type: MediaType
  onChange?: (value: string) => void
  onChangeUrl?: (value: string) => void
  readOnly?: boolean
}

const MediaPreview = memo(
  ({
    content,
    type,
    onChange,
    onChangeUrl,
    readOnly = false,
  }: MediaPreviewProps) => {
    const [isEditingUrl, setIsEditingUrl] = useState(false)
    const [tempUrl, setTempUrl] = useState(content)

    const handleSaveUrl = () => {
      onChangeUrl?.(tempUrl)
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
              draggable={false}
            />
            {!readOnly && !isEditingUrl && (
              <Button
                type="button"
                onClick={() => setIsEditingUrl(true)}
                className="w-full rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200"
              >
                Editar URL da imagem
              </Button>
            )}
            {!readOnly && isEditingUrl && (
              <div className="space-y-2">
                <input
                  type="url"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  placeholder="Cole a URL da imagem"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleSaveUrl}
                    className="flex-1 rounded-md bg-brand-background px-3 py-1.5 text-sm text-white hover:opacity-70"
                  >
                    Salvar
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCancelUrl}
                    className="flex-1 rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>
        )
      case 'video':
        return (
          <div className="space-y-2">
            <div className="pointer-events-none">
              <video
                src={content}
                controls
                preload="metadata"
                className="pointer-events-auto max-h-40 w-full rounded-md"
                onPointerDown={(e) => {
                  if (readOnly) {
                    e.stopPropagation()
                  }
                }}
              />
            </div>
            {!readOnly && !isEditingUrl && (
              <Button
                type="button"
                onClick={() => setIsEditingUrl(true)}
                className="w-full rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200"
              >
                Editar URL do vídeo
              </Button>
            )}
            {!readOnly && isEditingUrl && (
              <div className="space-y-2">
                <input
                  type="url"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  placeholder="Cole a URL do vídeo"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleSaveUrl}
                    className="flex-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                  >
                    Salvar
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCancelUrl}
                    className="flex-1 rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>
        )
      case 'audio':
        return (
          <div className="space-y-2">
            {/* Wrapper que permite drag quando readOnly */}
            <div className={readOnly ? 'pointer-events-none' : ''}>
              <audio
                controls
                preload="metadata"
                className={`w-full ${readOnly ? 'pointer-events-auto' : ''}`}
                onPointerDown={(e) => {
                  if (readOnly) {
                    e.stopPropagation()
                  }
                }}
              >
                <source src={content} />
                Seu navegador não suporta o elemento de áudio.
              </audio>
            </div>
            {!readOnly && !isEditingUrl && (
              <button
                type="button"
                onClick={() => setIsEditingUrl(true)}
                className="w-full rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200"
              >
                Editar URL do áudio
              </button>
            )}
            {!readOnly && isEditingUrl && (
              <div className="space-y-2">
                <input
                  type="url"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  placeholder="Cole a URL do áudio"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveUrl}
                    className="rounded-m flex-1 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
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
            value={content}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-full rounded-lg border border-solid border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            rows={4}
            placeholder="Digite seu texto aqui..."
            readOnly={readOnly}
          />
        )
      default:
        return null
    }
  }
)

export default MediaPreview
