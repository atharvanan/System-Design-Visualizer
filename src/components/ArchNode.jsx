import { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { getComponentConfig } from '../config/components';

function ArchNode({ data, selected }) {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const [draft, setDraft] = useState(data.label);
  const config = getComponentConfig(data.type);
  const Icon = config.icon;

  const confirmEdit = () => {
    const trimmed = draft.trim();
    if (trimmed) {
      setLabel(trimmed);
      data.onLabelChange?.(trimmed);
    }
    setEditing(false);
  };

  const cancelEdit = () => {
    setDraft(label);
    setEditing(false);
  };

  return (
    <div
      style={{
        background: config.bg,
        border: `1.5px solid ${selected ? config.color : config.border}`,
        borderRadius: '12px',
        minWidth: '140px',
        padding: '0',
        boxShadow: selected
          ? `0 0 0 2px ${config.color}55, 0 8px 32px rgba(0,0,0,0.5)`
          : '0 4px 20px rgba(0,0,0,0.4)',
        transition: 'all 0.15s ease',
        cursor: 'grab',
        overflow: 'hidden',
        fontFamily: '"DM Sans", sans-serif',
      }}
    >
      {/* Top color bar */}
      <div style={{ height: '3px', background: config.color, opacity: 0.8 }} />

      <div style={{ padding: '12px 14px 10px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '7px',
              background: `${config.color}22`,
              border: `1px solid ${config.color}44`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={14} color={config.color} />
          </div>

          {editing ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmEdit();
                  if (e.key === 'Escape') cancelEdit();
                }}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: `1px solid ${config.color}66`,
                  borderRadius: '5px',
                  color: '#e8e8f0',
                  fontSize: '12px',
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 500,
                  padding: '2px 6px',
                  width: '80px',
                  outline: 'none',
                }}
              />
              <button onClick={confirmEdit} style={iconBtnStyle}>
                <Check size={11} color="#22c55e" />
              </button>
              <button onClick={cancelEdit} style={iconBtnStyle}>
                <X size={11} color="#f43f5e" />
              </button>
            </div>
          ) : (
            <span
              style={{
                color: '#e8e8f0',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                flex: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {label}
            </span>
          )}
        </div>

        {/* Description */}
        <p
          style={{
            margin: 0,
            fontSize: '10px',
            color: '#8888aa',
            letterSpacing: '0.02em',
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          {config.description}
        </p>
      </div>

      {/* Action buttons — shown on hover via CSS parent */}
      {!editing && (
        <div className="node-actions" style={actionsStyle}>
          <button
            onClick={() => {
              setDraft(label);
              setEditing(true);
            }}
            title="Rename"
            style={actionBtnStyle}
          >
            <Edit2 size={11} color="#8888aa" />
          </button>
          <button
            onClick={() => data.onDelete?.()}
            title="Delete"
            style={{ ...actionBtnStyle, marginLeft: '2px' }}
          >
            <Trash2 size={11} color="#f43f5e" />
          </button>
        </div>
      )}

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        style={handleStyle(config.color)}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={handleStyle(config.color)}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{ ...handleStyle(config.color), top: -5, left: '50%' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{ ...handleStyle(config.color), bottom: -5, left: '50%' }}
      />
    </div>
  );
}

const handleStyle = (color) => ({
  width: 10,
  height: 10,
  background: '#0a0a0f',
  border: `2px solid ${color}`,
  borderRadius: '50%',
  transition: 'transform 0.15s ease',
});

const iconBtnStyle = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: '2px',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '4px',
};

const actionsStyle = {
  position: 'absolute',
  top: '8px',
  right: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
  opacity: 0,
  transition: 'opacity 0.15s ease',
};

const actionBtnStyle = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '5px',
  cursor: 'pointer',
  padding: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.1s',
};

export default memo(ArchNode);
