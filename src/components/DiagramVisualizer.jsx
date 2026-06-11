'use client';

import { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import { toPng } from 'html-to-image';

import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ArchNode from './ArchNode';
import EmptyState from './EmptyState';
import { ConfirmModal, Toast } from './Modals';
import { useDiagram } from '../hooks/useDiagram';
import { hasSavedDiagram } from '../utils/storage';
import { getComponentConfig } from '../config/components';

const nodeTypes = { archNode: ArchNode };

function DiagramVisualizerInner() {
  const { fitView, setViewport, getViewport, getNodes, screenToFlowPosition } = useReactFlow();
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    save,
    load,
    clear,
  } = useDiagram();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);

  const addToast = useCallback((message, type = 'info') => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const handleSave = () => {
    const vp = getViewport();
    const ok = save(vp);
    if (ok) addToast('Diagram saved successfully', 'success');
    else addToast('Failed to save', 'error');
  };

  const handleLoad = () => {
    const vp = load();
    if (vp) {
      setTimeout(() => setViewport(vp, { duration: 400 }), 50);
      addToast('Diagram loaded', 'success');
    } else {
      addToast('No saved diagram found', 'error');
    }
  };

  const handleClear = () => {
    if (nodes.length === 0) {
      addToast('Canvas is already empty', 'info');
      return;
    }
    setShowClearModal(true);
  };

  const confirmClear = () => {
    clear();
    setShowClearModal(false);
    addToast('Canvas cleared', 'info');
  };

  // Drag and Drop implementation
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      // Calculate relative coordinates in React Flow workspace
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(type, position);
      addToast(`Added ${getComponentConfig(type).label}`, 'success');
    },
    [screenToFlowPosition, addNode, addToast]
  );

  // Export system design as PNG image
  const handleExportImage = useCallback(async () => {
    const allNodes = getNodes();
    if (allNodes.length === 0) {
      addToast('Add some components to the canvas first!', 'info');
      return;
    }

    const originalViewport = getViewport();

    // Fit view instantly so all components are visible for export
    fitView({ padding: 0.1 });

    // Allow React Flow rendering queue to catch up
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => setTimeout(resolve, 200));

    const flowEl = document.querySelector('.react-flow');
    if (flowEl) {
      toPng(flowEl, {
        filter: (domNode) => {
          // Exclude UI controls, panels, and hover action buttons
          return !(
            domNode.classList?.contains('react-flow__controls') ||
            domNode.classList?.contains('react-flow__minimap') ||
            domNode.classList?.contains('react-flow__panel') ||
            domNode.classList?.contains('node-actions')
          );
        },
        backgroundColor: '#0a0a0f',
      })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `system-design-${Date.now()}.png`;
          link.href = dataUrl;
          link.click();
          addToast('Image downloaded successfully', 'success');

          // Restore original pan and zoom
          setViewport(originalViewport, { duration: 200 });
        })
        .catch((err) => {
          console.error('Export failed:', err);
          addToast('Failed to export diagram as image', 'error');
          setViewport(originalViewport);
        });
    } else {
      addToast('Canvas wrapper not found', 'error');
      setViewport(originalViewport);
    }
  }, [fitView, getViewport, setViewport, getNodes, addToast]);

  const minimapNodeColor = (node) => {
    const config = getComponentConfig(node.data?.type);
    return config.color;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Navbar
        onSave={handleSave}
        onLoad={handleLoad}
        onClear={handleClear}
        onExportImage={handleExportImage}
        hasSaved={hasSavedDiagram()}
        nodeCount={nodes.length}
        edgeCount={edges.length}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar
          onAddNode={(type) => {
            addNode(type);
            addToast(`Added ${getComponentConfig(type).label}`, 'success');
          }}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((v) => !v)}
        />

        <div style={{ flex: 1, position: 'relative' }}>
          {nodes.length === 0 && <EmptyState />}

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onDragOver={onDragOver}
            onDrop={onDrop}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            deleteKeyCode="Delete"
            multiSelectionKeyCode="Shift"
            style={{ background: 'transparent' }}
            defaultEdgeOptions={{
              animated: true,
              style: { strokeWidth: 2, opacity: 0.8 },
            }}
            proOptions={{ hideAttribution: true }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={24}
              size={1.5}
              color="#1e1e2e"
            />
            <Controls />
            <MiniMap
              nodeColor={minimapNodeColor}
              maskColor="rgba(10,10,15,0.7)"
              style={{ bottom: 16, right: 16 }}
            />
          </ReactFlow>

          <div
            style={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              fontSize: 10,
              color: '#2a2a3a',
              fontFamily: '"JetBrains Mono", monospace',
              pointerEvents: 'none',
              zIndex: 5,
            }}
          >
            Drag components onto the canvas • Delete key to remove • Shift + drag to multi-select
          </div>
        </div>
      </div>

      {showClearModal && (
        <ConfirmModal
          message="Are you sure you want to remove all nodes and connections from the canvas?"
          onConfirm={confirmClear}
          onCancel={() => setShowClearModal(false)}
        />
      )}

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default function DiagramVisualizer() {
  return (
    <ReactFlowProvider>
      <DiagramVisualizerInner />
    </ReactFlowProvider>
  );
}
