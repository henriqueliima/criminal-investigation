import { memo, useCallback, useRef, useState } from 'react'

import type { ContentType } from '../types/mediaTypes'
import { detectMediaType } from '../types/mediaTypes'
import ContentTypeSelector from './ContentTypeSelector'
import MediaPreview from './MediaPreview'
import Modal from './Modal'

interface CreateClueModalProps {
  isOpen: boolean
  clueContent: string
  onContentChange: (content: string) => void
  onSave: () => void
  onClose: () => void
}

const CreateClueModal = memo(
  ({
    isOpen,
    clueContent,
    onContentChange,
    onSave,
    onClose,
  }: CreateClueModalProps) => {
    const [contentType, setContentType] = useState<ContentType>('text')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const mediaType = detectMediaType(clueContent)

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
            onContentChange(result)
          }
        }
        reader.readAsDataURL(file)
      },
      [onContentChange]
    )

    const handleFileButtonClick = useCallback(
      (type: 'image' | 'video' | 'audio') => {
        setContentType(type)
        setTimeout(() => {
          fileInputRef.current?.click()
        }, 0)
      },
      []
    )

    if (!isOpen) return null

    return (
      <Modal saveModal={onSave} closeModal={onClose}>
        <div className="flex flex-col gap-4">
          <ContentTypeSelector
            contentType={contentType}
            onSelectType={setContentType}
            onFileButtonClick={handleFileButtonClick}
          />

          <input
            ref={fileInputRef}
            type="file"
            accept={
              contentType === 'image'
                ? 'image/*'
                : contentType === 'video'
                  ? 'video/*'
                  : contentType === 'audio'
                    ? 'audio/*'
                    : 'image/*,video/*,audio/*'
            }
            onChange={handleFileChange}
            className="hidden"
          />

          {(clueContent?.trim() || contentType === 'text') && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Conteúdo da Pista
              </label>
              <div className="rounded-lg border border-gray-200 bg-white p-3">
                <MediaPreview
                  content={clueContent}
                  type={mediaType}
                  onChange={onContentChange}
                  onChangeUrl={onContentChange}
                />
              </div>
            </div>
          )}
        </div>
      </Modal>
    )
  }
)

export default CreateClueModal
