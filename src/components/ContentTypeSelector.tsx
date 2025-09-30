import { memo } from 'react'

export type ContentType = 'text' | 'image' | 'video' | 'audio'

interface ContentTypeSelectorProps {
  contentType: ContentType
  onSelectType: (type: ContentType) => void
  onFileButtonClick: (type: 'image' | 'video' | 'audio') => void
}

const ContentTypeSelector = memo(
  ({
    contentType,
    onSelectType,
    onFileButtonClick,
  }: ContentTypeSelectorProps) => {
    return (
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Tipo de conteúdo
        </label>
        <div className="grid grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => onSelectType('text')}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              contentType === 'text'
                ? 'bg-brand-background text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Texto
          </button>
          <button
            type="button"
            onClick={() => onFileButtonClick('image')}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              contentType === 'image'
                ? 'bg-brand-background text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Imagem
          </button>
          <button
            type="button"
            onClick={() => onFileButtonClick('video')}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              contentType === 'video'
                ? 'bg-brand-background text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Vídeo
          </button>
          <button
            type="button"
            onClick={() => onFileButtonClick('audio')}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              contentType === 'audio'
                ? 'bg-brand-background text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Áudio
          </button>
        </div>
      </div>
    )
  }
)

export default ContentTypeSelector
