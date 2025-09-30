import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Handle, Position } from '@xyflow/react'
import { EditIcon } from 'lucide-react'
import { memo, useCallback, useMemo } from 'react'

import {
  useAllCategories,
  useCategoryData,
  useInvestigationActions,
} from '../store/InvestigationStore'
import Button from './Button'
import ClueCard from './ClueCard'

interface InvestigationCategoryNodeProps {
  categoryId: string
  onEditCategory: (categoryId: string, title: string) => void
  onCreateClue: (categoryId: string) => void
  allCategories?: { id: string; title: string }[]
}

const InvestigationCategoryNode = memo(
  ({
    categoryId,
    onEditCategory,
    onCreateClue,
  }: InvestigationCategoryNodeProps) => {
    const categoryData = useCategoryData(categoryId)
    const { title, clues } = categoryData

    const allCategories = useAllCategories()

    const { updateClue, deleteClue, moveClueToCategory } =
      useInvestigationActions()

    const cluesIds = useMemo(() => clues.map((c) => c.id), [clues])

    const { setNodeRef, isOver } = useDroppable({
      id: categoryId,
      data: { type: 'Category', categoryId },
    })

    const handleEditClick = useCallback(() => {
      onEditCategory(categoryId, title)
    }, [categoryId, title, onEditCategory])

    const handleCreateClue = useCallback(() => {
      onCreateClue(categoryId)
    }, [categoryId, onCreateClue])

    const handleUpdateClue = useCallback(
      (clueId: number | string, content: string) => {
        updateClue(categoryId, clueId, content)
      },
      [categoryId, updateClue]
    )

    const handleDeleteClue = useCallback(
      (clueId: number | string) => {
        deleteClue(categoryId, clueId)
      },
      [categoryId, deleteClue]
    )

    const handleMoveClue = useCallback(
      (clueId: number | string, toCategoryId: string) => {
        moveClueToCategory(clueId, categoryId, toCategoryId)
      },
      [categoryId, moveClueToCategory]
    )

    return (
      <div
        ref={setNodeRef}
        className={`text-updater-node relative w-[350px] border bg-white p-2 transition-all ${
          isOver ? 'ring-4 ring-blue-500' : ''
        }`}
        data-category-id={categoryId}
      >
        <Handle
          type="target"
          position={Position.Top}
          id="top"
          className="!h-3 !w-3"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          className="!h-3 !w-3"
        />
        <Handle
          type="target"
          position={Position.Left}
          id="left"
          className="!h-3 !w-3"
        />
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          className="!h-3 !w-3"
        />

        <div
          className={`flex min-h-[350px] w-full flex-col rounded-md bg-brand-background text-white transition-all ${
            isOver ? 'ring-2 ring-inset ring-blue-400' : ''
          }`}
        >
          <div className="flex h-[60px] cursor-grab items-center justify-between rounded-md rounded-b-none border-4 p-3 font-bold">
            <h2 className="flex-1 text-white">{title}</h2>
            <button
              onClick={handleEditClick}
              className="ml-2 transition-transform hover:scale-110"
            >
              <EditIcon />
            </button>
          </div>

          <div className="flex flex-grow flex-col gap-4 overflow-y-auto p-2">
            <SortableContext
              items={cluesIds}
              strategy={verticalListSortingStrategy}
            >
              {clues.map((clue) => (
                <ClueCard
                  key={clue.id}
                  clue={clue}
                  categoryId={categoryId}
                  updateClue={handleUpdateClue}
                  deleteClue={handleDeleteClue}
                  moveClueToCategory={handleMoveClue}
                  allCategories={allCategories}
                />
              ))}
            </SortableContext>
          </div>

          <div className="p-2">
            <Button
              onClick={handleCreateClue}
              color="secondary"
              className="w-full rounded px-4 py-2 transition-colors hover:opacity-70"
            >
              Adicionar Pista
            </Button>
          </div>
        </div>
      </div>
    )
  }
)

export default InvestigationCategoryNode
