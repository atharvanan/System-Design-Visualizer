import { AlertTriangle, X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useEffect } from 'react';

export function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: '#16161f',
          border: '1px solid #2a2a3a',
          borderRadius: 14,
          padding: '24px',
          width: 340,
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(244,63,94,0.12)',
              border: '1px solid rgba(244,63,94,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle size={18} color="#f43f5e" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#e8e8f0' }}>Clear Canvas</div>
            <div style={{ fontSize: 11, color: '#55556a' }}>This action cannot be undone</div>
          </div>
        </div>

        <p style={{ fontSize: 13, color: '#8888aa', margin: '0 0 20px', lineHeight: 1.6 }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={cancelBtnStyle}>
            Cancel
          </button>
          <button onClick={onConfirm} style={confirmBtnStyle}>
            Clear Everything
          </button>
        </div>
      </div>
    </div>
  );
}

const cancelBtnStyle = {
  padding: '7px 16px',
  borderRadius: 8,
  border: '1px solid #2a2a3a',
  background: 'transparent',
  color: '#8888aa',
  fontSize: 13,
  cursor: 'pointer',
  fontFamily: '"DM Sans", sans-serif',
};

const confirmBtnStyle = {
  padding: '7px 16px',
  borderRadius: 8,
  border: '1px solid rgba(244,63,94,0.4)',
  background: 'rgba(244,63,94,0.15)',
  color: '#f87171',
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: '"DM Sans", sans-serif',
};

// Toast notification
export function Toast({ toasts, onRemove }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        zIndex: 2000,
      }}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={() => onRemove(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(onRemove, 3000);
    return () => clearTimeout(timer);
  }, []);

  const icons = {
    success: <CheckCircle size={15} color="#22c55e" />,
    error: <AlertCircle size={15} color="#f43f5e" />,
    info: <Info size={15} color="#7c6af7" />,
  };

  const colors = {
    success: { border: 'rgba(34,197,94,0.3)', bg: 'rgba(34,197,94,0.08)' },
    error: { border: 'rgba(244,63,94,0.3)', bg: 'rgba(244,63,94,0.08)' },
    info: { border: 'rgba(124,106,247,0.3)', bg: 'rgba(124,106,247,0.08)' },
  };

  const c = colors[toast.type] || colors.info;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 14px',
        borderRadius: 10,
        background: '#16161f',
        border: `1px solid ${c.border}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        minWidth: 220,
        animation: 'slideIn 0.2s ease',
      }}
    >
      {icons[toast.type]}
      <span style={{ fontSize: 13, color: '#e8e8f0', flex: 1 }}>{toast.message}</span>
      <button
        onClick={onRemove}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
      >
        <X size={12} color="#55556a" />
      </button>
    </div>
  );
}
