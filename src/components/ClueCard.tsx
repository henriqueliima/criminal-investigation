import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { EditIcon } from 'lucide-react'
import { memo, useCallback, useMemo, useState } from 'react'

import type { Clue, Id, InvestigationCategory } from '../types'
import { type ContentType, detectMediaType } from '../types/mediaTypes'
import ClueEditorModal from './ClueEditorModal'
import MediaPreview from './MediaPreview'
import Modal from './Modal'

interface ClueCardProps {
  clue: Clue
  categoryId: string
  updateClue: (id: Id, content: string) => void
  deleteClue?: (id: Id) => void
  moveClueToCategory?: (clueId: Id, toCategoryId: string) => void
  allCategories?: InvestigationCategory[]
}

const ClueCard = memo(
  ({
    clue,
    updateClue,
    deleteClue,
    moveClueToCategory,
    allCategories,
  }: ClueCardProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [draft, setDraft] = useState(clue.content)
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
      clue.categoryId
    )
    const [contentType, setContentType] = useState<ContentType>('text')

    const mediaType = useMemo(
      () => detectMediaType(clue.content),
      [clue.content]
    )
    const draftMediaType = useMemo(() => detectMediaType(draft), [draft])

    const {
      setNodeRef,
      attributes,
      listeners,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: clue.id,
      data: { type: 'Clue', clue },
    })

    const style = useMemo(
      () => ({
        transition,
        transform: CSS.Transform.toString(transform),
      }),
      [transition, transform]
    )

    const openModal = useCallback(() => {
      setDraft(clue.content)
      setSelectedCategoryId(clue.categoryId)

      const currentMediaType = detectMediaType(clue.content)
      setContentType(currentMediaType)
      setIsModalOpen(true)
    }, [clue.content, clue.categoryId])

    const closeModal = useCallback(() => {
      setIsModalOpen(false)
      setDraft(clue.content)

      const currentMediaType = detectMediaType(clue.content)
      setContentType(currentMediaType)
    }, [clue.content])

    const handleFileChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (!file) {
          const currentDraftType = detectMediaType(draft)
          setContentType(currentDraftType)
          return
        }

        const reader = new FileReader()
        reader.onload = (event) => {
          const result = event.target?.result
          if (typeof result === 'string') {
            setDraft(result)
            const newMediaType = detectMediaType(result)
            setContentType(newMediaType)
          }
        }
        reader.readAsDataURL(file)
      },
      [draft]
    )

    const saveChanges = useCallback(() => {
      const originalCategoryId = clue.categoryId

      updateClue(clue.id, draft)

      if (moveClueToCategory && selectedCategoryId !== originalCategoryId) {
        moveClueToCategory(clue.id, selectedCategoryId)
      }

      closeModal()
    }, [
      clue.id,
      clue.categoryId,
      draft,
      selectedCategoryId,
      updateClue,
      moveClueToCategory,
      closeModal,
    ])

    const handleDelete = useCallback(() => {
      if (deleteClue) {
        deleteClue(clue.id)
        closeModal()
      }
    }, [deleteClue, clue.id, closeModal])

    const handleEditClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        openModal()
      },
      [openModal]
    )

    if (isDragging) {
      return (
        <div
          ref={setNodeRef}
          style={style}
          className="relative flex rounded-xl bg-black px-2 py-4 text-left opacity-50"
        >
          {mediaType === 'text' ? clue.content : '📎 Mídia'}
        </div>
      )
    }

    return (
      <>
        <div
          ref={setNodeRef}
          style={style}
          className="nodrag relative flex flex-col gap-2 rounded-xl bg-black p-3 text-left transition-all hover:ring-2 hover:ring-inset hover:ring-rose-500"
        >
          <div className="flex items-start justify-between gap-2">
            <div
              className="flex-1 cursor-grab"
              {...attributes}
              {...listeners}
              style={{ touchAction: 'none' }}
            >
              {mediaType === 'text' ? (
                <span className="select-none text-white">{clue.content}</span>
              ) : (
                <div className="select-none space-y-2">
                  <div className="relative">
                    <MediaPreview
                      content={clue.content}
                      type={mediaType}
                      readOnly
                    />
                    <div
                      className="absolute inset-0 z-0 cursor-grab"
                      style={{ pointerEvents: 'auto' }}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleEditClick}
              className="z-20 shrink-0 text-white transition-all hover:scale-110 hover:text-yellow-300"
              style={{ pointerEvents: 'auto' }}
            >
              <EditIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {isModalOpen && (
          <Modal
            saveModal={saveChanges}
            closeModal={closeModal}
            deleteModal={handleDelete}
            showDelete={!!deleteClue}
          >
            <ClueEditorModal
              draft={draft}
              draftMediaType={draftMediaType}
              contentType={contentType}
              selectedCategoryId={selectedCategoryId}
              allCategories={allCategories}
              onDraftChange={setDraft}
              onContentTypeChange={setContentType}
              onCategoryIdChange={setSelectedCategoryId}
              onFileChange={handleFileChange}
              showMoveToCategory={!!moveClueToCategory}
            />
          </Modal>
        )}
      </>
    )
  }
)

ClueCard.displayName = 'ClueCard'

export default ClueCard
