import '@xyflow/react/dist/style.css'

import { DndContext, DragOverlay } from '@dnd-kit/core'
import {
  Background,
  type Connection,
  Controls,
  type Edge,
  type EdgeChange,
  type NodeChange,
  Panel,
  ReactFlow,
} from '@xyflow/react'
import { useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'

import CreateClueModal from '../components/CreateClueModal'
import InvestigationCategoryNode from '../components/InvestigationCategoryNode'
import Modal from '../components/Modal'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useDragAndDrop } from '../hooks/useDragAndDrop'
import {
  useCategoryModal,
  useClueModal,
  useNewCategoryModal,
} from '../hooks/useModalManagement'
import {
  useAllCategories,
  useCategoriesData,
  useCategoryConnections,
  useCategoryNodes,
  useInvestigationActions,
} from '../store/InvestigationStore'

function CriminalInvestigationPage() {
  const categoryNodes = useCategoryNodes()
  const categoryConnections = useCategoryConnections()
  const categoriesData = useCategoriesData()
  const allCategories = useAllCategories()

  const {
    applyNodeChanges,
    applyEdgeChanges,
    addConnection,
    addCategory,
    deleteCategory,
    updateCategoryTitle,
    addClue,
    moveClueToCategory,
    reorderClues,
  } = useInvestigationActions()

  const clueModal = useClueModal()
  const categoryModal = useCategoryModal()
  const newCategoryModal = useNewCategoryModal()

  const { sensors, activeClue, onDragStart, onDragEnd, onDragOver } =
    useDragAndDrop({
      moveClueToCategory,
      reorderClues,
      categoriesData,
    })

  const handleOpenCreateClueModal = useCallback(
    (categoryId: string) => {
      clueModal.openModal(categoryId)
    },
    [clueModal]
  )

  const handleSaveClue = useCallback(() => {
    if (!clueModal.categoryId) return
    addClue(clueModal.categoryId, clueModal.content)
    clueModal.closeModal()
  }, [clueModal, addClue])

  const handleSaveNewCategory = useCallback(() => {
    addCategory(newCategoryModal.categoryName)
    newCategoryModal.closeModal()
  }, [newCategoryModal, addCategory])

  const handleEditCategory = useCallback(
    (categoryId: string, title: string) => {
      categoryModal.openModal(categoryId, title)
    },
    [categoryModal]
  )

  const handleSaveCategoryEdit = useCallback(() => {
    if (categoryModal.categoryId && categoryModal.categoryName.trim()) {
      updateCategoryTitle(
        categoryModal.categoryId,
        categoryModal.categoryName.trim()
      )
    }
    categoryModal.closeModal()
  }, [categoryModal, updateCategoryTitle])

  const handleDeleteCategory = useCallback(() => {
    if (categoryModal.categoryId) {
      deleteCategory(categoryModal.categoryId)
      categoryModal.closeModal()
    }
  }, [categoryModal, deleteCategory])

  const handleCategoryNodesChange = useCallback(
    (changes: NodeChange[]) => {
      applyNodeChanges(changes)
    },
    [applyNodeChanges]
  )

  const handleConnectionsChange = useCallback(
    (changes: EdgeChange[]) => {
      applyEdgeChanges(changes)
    },
    [applyEdgeChanges]
  )

  const handleConnect = useCallback(
    (connection: Connection) => {
      const newConnection: Edge = {
        id: `connection-${Date.now()}`,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
      }
      addConnection(newConnection)
    },
    [addConnection]
  )

  const categoryNodeTypes = useMemo(
    () => ({
      investigationCategory: ({ id }: { id: string }) => (
        <InvestigationCategoryNode
          categoryId={id}
          onEditCategory={handleEditCategory}
          onCreateClue={handleOpenCreateClueModal}
          allCategories={allCategories}
        />
      ),
    }),
    [handleEditCategory, handleOpenCreateClueModal, allCategories]
  )

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <div className="h-screen w-screen">
        <ReactFlow
          nodes={categoryNodes}
          edges={categoryConnections}
          onNodesChange={handleCategoryNodesChange}
          onEdgesChange={handleConnectionsChange}
          nodeTypes={categoryNodeTypes}
          onConnect={handleConnect}
          proOptions={{ hideAttribution: true }}
          fitView={false}
        >
          <Background />
          <Controls />
          <Panel>
            <Button onClick={newCategoryModal.openModal}>
              Adicionar Categoria
            </Button>
          </Panel>

          {clueModal.isOpen && (
            <CreateClueModal
              isOpen={clueModal.isOpen}
              clueContent={clueModal.content}
              onContentChange={clueModal.setContent}
              onSave={handleSaveClue}
              onClose={clueModal.closeModal}
            />
          )}

          {newCategoryModal.isOpen && (
            <Modal
              saveModal={handleSaveNewCategory}
              closeModal={newCategoryModal.closeModal}
            >
              <Input
                type="text"
                placeholder="Nome da categoria (ex: Evidências Físicas)"
                value={newCategoryModal.categoryName}
                onChange={(e) =>
                  newCategoryModal.setCategoryName(e.target.value)
                }
                autoFocus
              />
            </Modal>
          )}

          {categoryModal.isOpen && (
            <Modal
              saveModal={handleSaveCategoryEdit}
              closeModal={categoryModal.closeModal}
              deleteModal={handleDeleteCategory}
              showDelete={true}
            >
              <Input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="Nome da categoria"
                value={categoryModal.categoryName}
                onChange={(e) => categoryModal.setCategoryName(e.target.value)}
                autoFocus
              />
            </Modal>
          )}
        </ReactFlow>

        {createPortal(
          <DragOverlay>
            {activeClue && (
              <div className="relative flex cursor-grabbing rounded-xl bg-brand-background px-2 py-4 text-left text-white opacity-90 shadow-2xl">
                {activeClue.content}
              </div>
            )}
          </DragOverlay>,
          document.body
        )}
      </div>
    </DndContext>
  )
}

export default CriminalInvestigationPage
