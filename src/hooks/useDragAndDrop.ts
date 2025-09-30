import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useCallback, useState } from 'react'

import type { CategoryNodeData, Clue, Id } from '../types'

interface UseDragAndDropProps {
  moveClueToCategory: (
    clueId: Id,
    fromCategoryId: string,
    toCategoryId: string
  ) => void
  reorderClues: (categoryId: string, clueId: Id, overClueId: Id) => void
  categoriesData: Record<string, CategoryNodeData>
}

export const useDragAndDrop = ({
  moveClueToCategory,
  reorderClues,
  categoriesData,
}: UseDragAndDropProps) => {
  const [activeClue, setActiveClue] = useState<Clue | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 1, delay: 0 },
    })
  )

  const onDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event
    if (active.data.current?.type === 'Clue') {
      setActiveClue(active.data.current.clue)
    }
  }, [])

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (!over || !active.data.current?.clue) {
        setActiveClue(null)
        return
      }

      const draggedClue = active.data.current.clue as Clue
      const sourceCategoryId = draggedClue.categoryId

      if (over.data.current?.type === 'Category') {
        const targetCategoryId = over.data.current.categoryId
        if (sourceCategoryId !== targetCategoryId) {
          moveClueToCategory(draggedClue.id, sourceCategoryId, targetCategoryId)
        }
      }

      if (over.data.current?.type === 'Clue') {
        const targetClue = over.data.current.clue as Clue
        const targetCategoryId = targetClue.categoryId

        if (sourceCategoryId === targetCategoryId) {
          reorderClues(sourceCategoryId, draggedClue.id, targetClue.id)
        } else {
          moveClueToCategory(draggedClue.id, sourceCategoryId, targetCategoryId)
        }
      }

      setActiveClue(null)
    },
    [moveClueToCategory, reorderClues]
  )

  const onDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event

      if (!over || !active.data.current?.clue) return

      const draggedClue = active.data.current.clue as Clue
      const sourceCategoryId = draggedClue.categoryId

      if (over.data.current?.type === 'Category') {
        return
      }

      if (over.data.current?.type === 'Clue') {
        const targetClue = over.data.current.clue as Clue
        const targetCategoryId = targetClue.categoryId

        if (sourceCategoryId !== targetCategoryId) {
          const clueAlreadyInTarget = categoriesData[
            targetCategoryId
          ]?.clues.some((c) => String(c.id) === String(draggedClue.id))

          if (!clueAlreadyInTarget) {
            moveClueToCategory(
              draggedClue.id,
              sourceCategoryId,
              targetCategoryId
            )
          }
        }
      }
    },
    [moveClueToCategory, categoriesData]
  )

  return {
    sensors,
    activeClue,
    onDragStart,
    onDragEnd,
    onDragOver,
  }
}
