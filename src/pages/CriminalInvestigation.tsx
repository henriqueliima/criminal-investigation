import '@xyflow/react/dist/style.css'

import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  type Edge,
  Handle,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  Panel,
  Position,
  ReactFlow,
} from '@xyflow/react'
import { useCallback, useState } from 'react'

const initialGroups: Node[] = []

const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2' }]

function CriminalInvestigationPage() {
  const [nodes, setNodes] = useState<Node[]>(initialGroups)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  )
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  )
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  )

  const getNodeId = () => `randomnode_${+new Date()}`

  const handleAddInvestigationNode = () => {
    return (
      <div className="text-updater-node relative border bg-white p-2">
        <Handle type="target" position={Position.Top} id="top" />
        <Handle type="source" position={Position.Bottom} id="bottom" />
        <Handle type="target" position={Position.Left} id="left" />
        <Handle type="source" position={Position.Right} id="right" />
        <div>
          <h2>Grupo de investigação criminal</h2>
        </div>
      </div>
    )
  }

  const nodeTypes = {
    textUpdater: handleAddInvestigationNode,
  }

  const handleAddGroup = useCallback(() => {
    const newGroup: Node = {
      id: getNodeId(),
      type: 'textUpdater',
      data: {},
      position: {
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
      },
    }
    setNodes((nodes) => nodes.concat(newGroup))
  }, [setNodes])

  return (
    <div className="h-screen w-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
        <Panel>
          <button
            className="border bg-black px-4 py-2 text-white"
            onClick={handleAddGroup}
          >
            Adicionar grupo
          </button>
        </Panel>
      </ReactFlow>
    </div>
  )
}

export default CriminalInvestigationPage
