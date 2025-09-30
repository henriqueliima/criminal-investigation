import type { Edge, EdgeChange, Node, NodeChange } from '@xyflow/react'
import {
  applyEdgeChanges as applyReactFlowEdgeChanges,
  applyNodeChanges as applyReactFlowNodeChanges,
} from '@xyflow/react'
import { useMemo } from 'react'
import { create } from 'zustand'

import type { CategoryNodeData, Clue, Id } from '../types'

interface InvestigationWorkflow {
  categoryNodes: Node[]
  categoryConnections: Edge[]
  categoriesData: Record<string, CategoryNodeData>

  actions: {
    applyNodeChanges: (changes: NodeChange[]) => void
    applyEdgeChanges: (changes: EdgeChange[]) => void
    addConnection: (edge: Edge) => void
    addCategory: (title: string) => void
    deleteCategory: (categoryId: string) => void
    updateCategoryTitle: (categoryId: string, title: string) => void
    addClue: (categoryId: string, content: string) => void
    updateClue: (categoryId: string, clueId: Id, content: string) => void
    deleteClue: (categoryId: string, clueId: Id) => void
    moveClueToCategory: (
      clueId: Id,
      fromCategoryId: string,
      toCategoryId: string
    ) => void
    reorderClues: (categoryId: string, clueId: Id, overClueId: Id) => void
  }
}

const generateCategoryId = () =>
  `category_${Date.now()}_${Math.random().toString(36).substring(7)}`
const generateClueId = () =>
  `clue_${Date.now()}_${Math.random().toString(36).substring(7)}`

export const useInvestigationWorkflow = create<InvestigationWorkflow>(
  (set) => ({
    categoryNodes: [],
    categoryConnections: [],
    categoriesData: {},

    actions: {
      applyNodeChanges: (changes) =>
        set((state) => {
          const updatedChanges = changes.filter((change) => {
            if (change.type === 'remove') {
              const newCategoriesData = { ...state.categoriesData }
              delete newCategoriesData[change.id]
              set({ categoriesData: newCategoriesData })
            }
            return true
          })

          return {
            categoryNodes: applyReactFlowNodeChanges(
              updatedChanges,
              state.categoryNodes
            ),
          }
        }),

      applyEdgeChanges: (changes) =>
        set((state) => ({
          categoryConnections: applyReactFlowEdgeChanges(
            changes,
            state.categoryConnections
          ),
        })),

      addConnection: (edge) =>
        set((state) => ({
          categoryConnections: [...state.categoryConnections, edge],
        })),

      addCategory: (title) =>
        set((state) => {
          const categoryId = generateCategoryId()
          const newCategoryNode: Node = {
            id: categoryId,
            type: 'investigationCategory',
            data: {},
            position: {
              x: Math.random() * 400,
              y: Math.random() * 400,
            },
          }

          return {
            categoryNodes: [...state.categoryNodes, newCategoryNode],
            categoriesData: {
              ...state.categoriesData,
              [categoryId]: {
                title: title || 'Nova Categoria',
                clues: [],
              },
            },
          }
        }),

      deleteCategory: (categoryId) =>
        set((state) => {
          const newCategoriesData = { ...state.categoriesData }
          delete newCategoriesData[categoryId]

          return {
            categoryNodes: state.categoryNodes.filter(
              (node) => node.id !== categoryId
            ),
            categoriesData: newCategoriesData,
          }
        }),

      updateCategoryTitle: (categoryId, title) =>
        set((state) => ({
          categoriesData: {
            ...state.categoriesData,
            [categoryId]: {
              ...state.categoriesData[categoryId],
              title,
            },
          },
        })),

      addClue: (categoryId, content) =>
        set((state) => {
          const categoryData = state.categoriesData[categoryId]
          if (!categoryData) return state

          const newClue: Clue = {
            id: generateClueId(),
            categoryId,
            content: content || `Pista ${Date.now()}`,
          }

          return {
            categoriesData: {
              ...state.categoriesData,
              [categoryId]: {
                ...categoryData,
                clues: [...categoryData.clues, newClue],
              },
            },
          }
        }),

      updateClue: (categoryId, clueId, content) =>
        set((state) => {
          const categoryData = state.categoriesData[categoryId]
          if (!categoryData) return state

          return {
            categoriesData: {
              ...state.categoriesData,
              [categoryId]: {
                ...categoryData,
                clues: categoryData.clues.map((clue) =>
                  clue.id === clueId ? { ...clue, content } : clue
                ),
              },
            },
          }
        }),

      deleteClue: (categoryId, clueId) =>
        set((state) => {
          const categoryData = state.categoriesData[categoryId]
          if (!categoryData) return state

          return {
            categoriesData: {
              ...state.categoriesData,
              [categoryId]: {
                ...categoryData,
                clues: categoryData.clues.filter((clue) => clue.id !== clueId),
              },
            },
          }
        }),

      moveClueToCategory: (clueId, fromCategoryId, toCategoryId) =>
        set((state) => {
          if (fromCategoryId === toCategoryId) return state

          const fromCategory = state.categoriesData[fromCategoryId]
          const toCategory = state.categoriesData[toCategoryId]

          if (!fromCategory || !toCategory) return state

          const clueToMove = fromCategory.clues.find(
            (clue) => String(clue.id) === String(clueId)
          )
          if (!clueToMove) return state

          return {
            categoriesData: {
              ...state.categoriesData,
              [fromCategoryId]: {
                ...fromCategory,
                clues: fromCategory.clues.filter(
                  (clue) => String(clue.id) !== String(clueId)
                ),
              },
              [toCategoryId]: {
                ...toCategory,
                clues: [
                  ...toCategory.clues,
                  { ...clueToMove, categoryId: toCategoryId },
                ],
              },
            },
          }
        }),

      reorderClues: (categoryId, clueId, overClueId) =>
        set((state) => {
          const categoryData = state.categoriesData[categoryId]
          if (!categoryData) return state

          const oldIndex = categoryData.clues.findIndex(
            (clue) => String(clue.id) === String(clueId)
          )
          const newIndex = categoryData.clues.findIndex(
            (clue) => String(clue.id) === String(overClueId)
          )

          if (oldIndex === -1 || newIndex === -1) return state

          const reorderedClues = [...categoryData.clues]
          const [removed] = reorderedClues.splice(oldIndex, 1)
          reorderedClues.splice(newIndex, 0, removed)

          return {
            categoriesData: {
              ...state.categoriesData,
              [categoryId]: {
                ...categoryData,
                clues: reorderedClues,
              },
            },
          }
        }),
    },
  })
)

export const useCategoryNodes = () =>
  useInvestigationWorkflow((state) => state.categoryNodes)
export const useCategoryConnections = () =>
  useInvestigationWorkflow((state) => state.categoryConnections)
export const useCategoriesData = () =>
  useInvestigationWorkflow((state) => state.categoriesData)
export const useCategoryData = (categoryId: string) =>
  useInvestigationWorkflow(
    (state) =>
      state.categoriesData[categoryId] || { title: 'Nova Categoria', clues: [] }
  )

export const useAllCategories = () => {
  const categoryNodes = useInvestigationWorkflow((state) => state.categoryNodes)
  const categoriesData = useInvestigationWorkflow(
    (state) => state.categoriesData
  )

  return useMemo(
    () =>
      categoryNodes.map((node) => ({
        id: node.id,
        title: categoriesData[node.id]?.title || 'Sem título',
      })),
    [categoryNodes, categoriesData]
  )
}

export const useInvestigationActions = () =>
  useInvestigationWorkflow((state) => state.actions)
