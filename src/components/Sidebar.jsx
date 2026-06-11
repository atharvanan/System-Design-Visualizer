import { useState } from 'react';
import { COMPONENT_TYPES, CATEGORIES } from '../config/components';
import { Layers, ChevronDown, ChevronRight } from 'lucide-react';

export default function Sidebar({ onAddNode, collapsed, onToggle }) {
  const [openCategories, setOpenCategories] = useState(
    Object.fromEntries(CATEGORIES.map((c) => [c, true]))
  );

  const toggleCategory = (cat) =>
    setOpenCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = COMPONENT_TYPES.filter((c) => c.category === cat);
    return acc;
  }, {});

  if (collapsed) {
    return (
      <div
        style={{
          width: 48,
          background: '#111118',
          borderRight: '1px solid #2a2a3a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 16,
          gap: 12,
          transition: 'width 0.2s ease',
        }}
      >
        <button
          onClick={onToggle}
          title="Expand sidebar"
          style={collapsedBtnStyle}
        >
          <Layers size={18} color="#7c6af7" />
        </button>
        {COMPONENT_TYPES.map((comp) => {
          const Icon = comp.icon;
          return (
            <button
              key={comp.type}
              onClick={() => onAddNode(comp.type)}
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow', comp.type);
                event.dataTransfer.effectAllowed = 'move';
              }}
              title={comp.label}
              style={{
                ...collapsedBtnStyle,
                background: comp.bg,
                border: `1px solid ${comp.border}`,
                borderRadius: 8,
              }}
            >
              <Icon size={14} color={comp.color} />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      style={{
        width: 240,
        background: '#111118',
        borderRight: '1px solid #2a2a3a',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 16px 12px',
          borderBottom: '1px solid #2a2a3a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Layers size={16} color="#7c6af7" />
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: '#e8e8f0',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            Components
          </span>
        </div>
        <button onClick={onToggle} style={closeBtnStyle} title="Collapse">
          ‹
        </button>
      </div>

      <div style={{ padding: '12px 10px', overflowY: 'auto', flex: 1 }}>
        <p style={{ fontSize: 11, color: '#55556a', margin: '0 0 12px 6px' }}>
          Click to add to canvas
        </p>

        {CATEGORIES.map((cat) => (
          <div key={cat} style={{ marginBottom: 8 }}>
            <button
              onClick={() => toggleCategory(cat)}
              style={categoryHeaderStyle}
            >
              {openCategories[cat] ? (
                <ChevronDown size={12} color="#55556a" />
              ) : (
                <ChevronRight size={12} color="#55556a" />
              )}
              <span style={{ fontSize: 10, color: '#55556a', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: '"JetBrains Mono", monospace' }}>
                {cat}
              </span>
            </button>

            {openCategories[cat] && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {grouped[cat].map((comp) => {
                  const Icon = comp.icon;
                  return (
                    <button
                      key={comp.type}
                      onClick={() => onAddNode(comp.type)}
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.setData('application/reactflow', comp.type);
                        event.dataTransfer.effectAllowed = 'move';
                      }}
                      style={componentBtnStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = comp.bg;
                        e.currentTarget.style.borderColor = comp.border;
                        e.currentTarget.style.transform = 'translateX(2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 7,
                          background: `${comp.color}18`,
                          border: `1px solid ${comp.color}33`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={13} color={comp.color} />
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: '#e8e8f0' }}>
                          {comp.label}
                        </div>
                        <div style={{ fontSize: 10, color: '#55556a', fontFamily: '"JetBrains Mono", monospace' }}>
                          {comp.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const categoryHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: '4px 6px',
  width: '100%',
  marginBottom: 4,
};

const componentBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  background: 'transparent',
  border: '1px solid transparent',
  borderRadius: 8,
  cursor: 'pointer',
  padding: '7px 8px',
  width: '100%',
  transition: 'all 0.12s ease',
  textAlign: 'left',
};

const collapsedBtnStyle = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: 6,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 6,
};

const closeBtnStyle = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: '#55556a',
  fontSize: 18,
  lineHeight: 1,
  padding: '0 4px',
  borderRadius: 4,
};
