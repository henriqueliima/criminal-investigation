import { memo, useCallback, useRef } from 'react'

import type { InvestigationCategory } from '../types'
import type { ContentType, MediaType } from '../types/mediaTypes'
import ContentTypeSelector from './ContentTypeSelector'
import MediaPreview from './MediaPreview'
import Input from './ui/Input'

interface ClueEditorModalProps {
  draft: string
  draftMediaType: MediaType
  contentType: ContentType
  selectedCategoryId: string
  allCategories?: InvestigationCategory[]
  onDraftChange: (value: string) => void
  onContentTypeChange: (type: ContentType) => void
  onCategoryIdChange: (categoryId: string) => void
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  showMoveToCategory?: boolean
}

const ClueEditorModal = memo(
  ({
    draft,
    draftMediaType,
    contentType,
    selectedCategoryId,
    allCategories,
    onDraftChange,
    onContentTypeChange,
    onCategoryIdChange,
    onFileChange,
    showMoveToCategory = false,
  }: ClueEditorModalProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileButtonClick = useCallback(
      (type: 'image' | 'video' | 'audio') => {
        onContentTypeChange(type)
        setTimeout(() => {
          fileInputRef.current?.click()
        }, 0)
      },
      [onContentTypeChange]
    )

    return (
      <div className="flex flex-col gap-4">
        <ContentTypeSelector
          contentType={contentType}
          onSelectType={onContentTypeChange}
          onFileButtonClick={handleFileButtonClick}
        />

        <Input
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
          onChange={onFileChange}
          className="hidden"
        />

        {(draft?.trim() || contentType === 'text') && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Conteúdo da Pista
            </label>
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <MediaPreview
                content={draft}
                type={draftMediaType}
                onChange={onDraftChange}
                onChangeUrl={onDraftChange}
              />
            </div>
          </div>
        )}

        {showMoveToCategory && allCategories && allCategories.length > 1 && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Mover para Categoria
            </label>
            <select
              className="focus:primary w-full rounded-lg border border-solid border-gray-300 px-4 py-3 focus:outline-none focus:ring-2"
              value={selectedCategoryId}
              onChange={(e) => onCategoryIdChange(e.target.value)}
            >
              {allCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    )
  }
)

export default ClueEditorModal
