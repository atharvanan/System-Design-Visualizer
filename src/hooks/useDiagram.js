import { useState, useCallback, useRef } from 'react';
import { useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import { getComponentConfig } from '../config/components';
import { saveDiagram, loadDiagram } from '../utils/storage';

let nodeCounter = 1;

const generateId = () => `node_${Date.now()}_${nodeCounter++}`;

export function useDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });

  const addNode = useCallback(
    (type, position = null) => {
      const config = getComponentConfig(type);
      const id = generateId();

      let targetPosition = position;
      if (!targetPosition) {
        // Spread nodes in a grid-like pattern if no position is specified
        const offset = nodes.length * 30;
        const x = 200 + (nodes.length % 5) * 180 + Math.random() * 40 - 20;
        const y = 150 + Math.floor(nodes.length / 5) * 150 + offset % 100;
        targetPosition = { x, y };
      }

      const newNode = {
        id,
        type: 'archNode',
        position: targetPosition,
        data: {
          type,
          label: config.label,
          onDelete: () => deleteNode(id),
          onLabelChange: (newLabel) => updateNodeLabel(id, newLabel),
        },
      };

      setNodes((nds) => [...nds, newNode]);
      return id;
    },
    [nodes.length]
  );

  const deleteNode = useCallback((id) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  }, []);

  const updateNodeLabel = useCallback((id, label) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, label } } : n))
    );
  }, []);

  const onConnect = useCallback(
    (params) => {
      const config = getComponentConfig(
        nodes.find((n) => n.id === params.source)?.data?.type || 'frontend'
      );
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: config.color, strokeWidth: 2, opacity: 0.8 },
            markerEnd: { type: 'arrowclosed', color: config.color, width: 16, height: 16 },
          },
          eds
        )
      );
    },
    [nodes]
  );

  const save = useCallback(
    (currentViewport) => {
      const serializableNodes = nodes.map((n) => ({
        ...n,
        data: { type: n.data.type, label: n.data.label },
      }));
      return saveDiagram(serializableNodes, edges, currentViewport);
    },
    [nodes, edges]
  );

  const load = useCallback(() => {
    const data = loadDiagram();
    if (!data) return null;

    const restored = data.nodes.map((n) => ({
      ...n,
      type: 'archNode',
      data: {
        ...n.data,
        onDelete: () => deleteNode(n.id),
        onLabelChange: (newLabel) => updateNodeLabel(n.id, newLabel),
      },
    }));

    setNodes(restored);
    setEdges(data.edges || []);
    return data.viewport || null;
  }, []);

  const clear = useCallback(() => {
    setNodes([]);
    setEdges([]);
  }, []);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    deleteNode,
    save,
    load,
    clear,
  };
}
