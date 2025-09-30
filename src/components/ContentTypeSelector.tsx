import { memo } from 'react'

import Button from './Button'

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
          <Button
            type="button"
            onClick={() => onSelectType('text')}
            color={contentType === 'text' ? 'primary' : 'secondary'}
            className={
              'rounded-lg px-3 py-2 text-sm font-medium transition-colors'
            }
          >
            Texto
          </Button>
          <Button
            type="button"
            color={contentType === 'image' ? 'primary' : 'secondary'}
            onClick={() => onFileButtonClick('image')}
            className={
              'rounded-lg px-3 py-2 text-sm font-medium transition-colors'
            }
          >
            Imagem
          </Button>
          <Button
            type="button"
            onClick={() => onFileButtonClick('video')}
            color={contentType === 'video' ? 'primary' : 'secondary'}
            className={
              'rounded-lg px-3 py-2 text-sm font-medium transition-colors'
            }
          >
            Vídeo
          </Button>
          <Button
            type="button"
            onClick={() => onFileButtonClick('audio')}
            color={contentType === 'audio' ? 'primary' : 'secondary'}
            className={
              'rounded-lg px-3 py-2 text-sm font-medium transition-colors'
            }
          >
            Áudio
          </Button>
        </div>
      </div>
    )
  }
)

export default ContentTypeSelector
