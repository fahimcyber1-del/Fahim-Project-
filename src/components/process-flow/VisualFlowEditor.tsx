import React, { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  Panel,
  MarkerType,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FlowNode } from './types';

interface VisualFlowEditorProps {
  nodes: FlowNode[];
  onChange: (nodes: FlowNode[]) => void;
}

const nodeColor = (node: Node) => {
  switch (node.data.type) {
    case 'start':
      return '#10b981';
    case 'end':
      return '#ef4444';
    case 'decision':
      return '#f59e0b';
    case 'document':
      return '#06b6d4';
    default:
      return '#6366f1';
  }
};

export function VisualFlowEditor({ nodes: initialNodes, onChange }: VisualFlowEditorProps) {
  const [nodes, setNodes] = useNodesState<Node>([]);
  const [edges, setEdges] = useEdgesState<Edge>([]);

  // Initialize from props
  useEffect(() => {
    const xyNodes: Node[] = initialNodes.map((n) => ({
      id: n.id,
      type: 'default',
      position: n.position || { x: Math.random() * 200, y: Math.random() * 200 },
      data: { label: n.label, type: n.type, description: n.description },
      style: {
        background: '#fff',
        border: `2px solid ${nodeColor({ data: { type: n.type } } as any)}`,
        borderRadius: n.type === 'decision' ? '4px' : n.type === 'start' || n.type === 'end' ? '50px' : '8px',
        padding: '10px',
        color: '#333',
        fontWeight: 'bold',
        width: 150,
        textAlign: 'center'
      }
    }));

    const xyEdges: Edge[] = [];
    initialNodes.forEach((n) => {
      n.nextNodes.forEach((nextId) => {
        xyEdges.push({
          id: `${n.id}-${nextId}`,
          source: n.id,
          target: nextId,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#94a3b8',
          },
          style: { stroke: '#94a3b8', strokeWidth: 2 }
        });
      });
    });

    setNodes(xyNodes);
    setEdges(xyEdges);
  }, []);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => {
        const nextNodes = applyNodeChanges(changes, nds);
        updateParent(nextNodes, edges);
        return nextNodes as Node[];
      });
    },
    [setNodes, edges]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => {
        const nextEdges = applyEdgeChanges(changes, eds);
        updateParent(nodes, nextEdges);
        return nextEdges as Edge[];
      });
    },
    [setEdges, nodes]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => {
        const nextEdges = addEdge({
          ...params,
          markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
          style: { stroke: '#94a3b8', strokeWidth: 2 }
        }, eds);
        updateParent(nodes, nextEdges);
        return nextEdges;
      });
    },
    [setEdges, nodes]
  );

  const updateParent = (currentNodes: Node[], currentEdges: Edge[]) => {
    const updatedFlowNodes: FlowNode[] = currentNodes.map((n) => {
      // Find connections from this node
      const nextNodes = currentEdges.filter(e => e.source === n.id).map(e => e.target);
      return {
        id: n.id,
        type: n.data.type as any,
        label: n.data.label as string,
        description: n.data.description as string,
        position: n.position,
        nextNodes,
        dependencies: [] // Simplification: auto-calculate dependencies or ignore
      };
    });
    onChange(updatedFlowNodes);
  };

  const addNode = () => {
    const newNode: Node = {
      id: Math.random().toString(36).substring(7),
      type: 'default',
      position: { x: 250, y: 50 },
      data: { label: 'New Step', type: 'process', description: '' },
      style: {
        background: '#fff',
        border: `2px solid ${nodeColor({ data: { type: 'process' } } as any)}`,
        borderRadius: '8px',
        padding: '10px',
        color: '#333',
        fontWeight: 'bold',
        width: 150,
        textAlign: 'center'
      }
    };
    const nextNodes = [...nodes, newNode];
    setNodes(nextNodes);
    updateParent(nextNodes, edges);
  };

  return (
    <div style={{ width: '100%', height: '500px', border: '1px solid #e2e8f0', borderRadius: '0.75rem', overflow: 'hidden' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <MiniMap nodeColor={nodeColor} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Panel position="top-right">
          <button 
            type="button"
            onClick={addNode}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm font-bold text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Add Node
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
