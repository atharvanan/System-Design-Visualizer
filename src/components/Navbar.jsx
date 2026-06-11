import { Save, FolderOpen, Trash2, HelpCircle, Activity, Download } from 'lucide-react';

export default function Navbar({ onSave, onLoad, onClear, onExportImage, hasSaved, nodeCount, edgeCount }) {
  return (
    <div
      style={{
        height: 52,
        background: '#111118',
        borderBottom: '1px solid #2a2a3a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 28,
            height: 28,
            background: 'linear-gradient(135deg, #7c6af7, #a78bfa)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Activity size={15} color="#fff" />
        </div>
        <div>
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#e8e8f0',
              letterSpacing: '-0.02em',
            }}
          >
            SysDesign
          </span>
          <span
            style={{
              fontSize: 10,
              color: '#7c6af7',
              marginLeft: 6,
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: 500,
            }}
          >
            visualizer
          </span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Stat label="Nodes" value={nodeCount} />
        <Stat label="Connections" value={edgeCount} />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <NavBtn onClick={onSave} icon={Save} label="Save" accent />
        <NavBtn
          onClick={onLoad}
          icon={FolderOpen}
          label="Load"
          disabled={!hasSaved}
          title={hasSaved ? 'Load saved diagram' : 'No saved diagram'}
        />
        <NavBtn onClick={onExportImage} icon={Download} label="Export Image" />
        <div style={{ width: 1, height: 20, background: '#2a2a3a', margin: '0 2px' }} />
        <NavBtn onClick={onClear} icon={Trash2} label="Clear" danger />
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#e8e8f0', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, color: '#55556a', fontFamily: '"JetBrains Mono", monospace' }}>{label}</div>
    </div>
  );
}

function NavBtn({ onClick, icon: Icon, label, accent, danger, disabled, title }) {
  const base = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 12px',
    borderRadius: 8,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: 12,
    fontWeight: 500,
    fontFamily: '"DM Sans", sans-serif',
    transition: 'all 0.12s ease',
    border: '1px solid transparent',
    opacity: disabled ? 0.4 : 1,
  };

  const style = accent
    ? { ...base, background: 'rgba(124,106,247,0.15)', border: '1px solid rgba(124,106,247,0.35)', color: '#a78bfa' }
    : danger
    ? { ...base, background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)', color: '#f87171' }
    : { ...base, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#8888aa' };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={style}
      title={title || label}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.filter = 'brightness(1.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.filter = 'none';
      }}
    >
      <Icon size={13} />
      {label}
    </button>
  );
}
