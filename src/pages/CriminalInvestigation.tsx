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
import { Download, Plus } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
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

const MOBILE_BREAKPOINT = 768
const CATEGORY_HEIGHT = 200
const CATEGORY_SPACING = 200

function CriminalInvestigationPage() {
  const categoryNodes = useCategoryNodes()
  const categoryConnections = useCategoryConnections()
  const categoriesData = useCategoriesData()
  const allCategories = useAllCategories()

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
  )

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
    exportWorkflow,
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
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < MOBILE_BREAKPOINT
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isMobile])

  const layoutNodes = useMemo(() => {
    if (!isMobile) return categoryNodes

    return categoryNodes.map((node, index) => ({
      ...node,
      position: {
        x: 20,
        y: index * (CATEGORY_HEIGHT + CATEGORY_SPACING),
      },
    }))
  }, [categoryNodes, isMobile])

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
      if (isMobile) {
        const filteredChanges = changes.filter(
          (change) => change.type !== 'position'
        )
        if (filteredChanges.length > 0) {
          applyNodeChanges(filteredChanges)
        }
      } else {
        applyNodeChanges(changes)
      }
    },
    [applyNodeChanges, isMobile]
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

  const handleExport = useCallback(() => {
    const jsonString = exportWorkflow()
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `workflow-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [exportWorkflow])

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <div className="h-screen w-screen">
        <ReactFlow
          nodes={layoutNodes}
          edges={categoryConnections}
          onNodesChange={handleCategoryNodesChange}
          onEdgesChange={handleConnectionsChange}
          nodeTypes={categoryNodeTypes}
          onConnect={handleConnect}
          proOptions={{ hideAttribution: true }}
          fitView={false}
          nodesDraggable={!isMobile}
          nodesConnectable={!isMobile}
          elementsSelectable={true}
          panOnDrag={isMobile ? [1, 2] : true}
          zoomOnScroll={!isMobile}
          zoomOnPinch={isMobile}
          preventScrolling={!isMobile}
          className="touch-flow"
        >
          <Background />
          {!isMobile && <Controls />}
          <Panel
            className="flex gap-3"
            position={isMobile ? 'top-center' : 'top-left'}
          >
            <Button
              className="flex items-center"
              onClick={newCategoryModal.openModal}
            >
              <Plus className="h-5 w-5 md:mr-1" />
              {!isMobile && 'Adicionar Grupo'}
            </Button>
            <Button
              onClick={handleExport}
              color="secondary"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {!isMobile && 'Exportar'}
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
                placeholder="Nome do grupo"
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
                placeholder="Nome do grupo"
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
