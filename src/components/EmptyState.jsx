import { MousePointerClick, ArrowRight } from 'lucide-react';

export default function EmptyState() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 360 }}>
        {/* Grid decoration */}
        <div style={{ position: 'relative', marginBottom: 24 }}>
          <div style={ghostNode('#3b82f6', -120, -20)}>
            <span style={{ fontSize: 11, color: '#3b82f6' }}>Frontend</span>
          </div>
          <div style={ghostNode('#22c55e', 120, -20)}>
            <span style={{ fontSize: 11, color: '#22c55e' }}>Backend</span>
          </div>
          <div style={ghostNode('#a855f7', 0, 50)}>
            <span style={{ fontSize: 11, color: '#a855f7' }}>Database</span>
          </div>

          {/* Arrow lines */}
          <svg
            width="280"
            height="120"
            style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }}
          >
            <line x1="100" y1="40" x2="180" y2="40" stroke="#2a2a3a" strokeWidth="1.5" strokeDasharray="4" />
            <line x1="140" y1="50" x2="140" y2="90" stroke="#2a2a3a" strokeWidth="1.5" strokeDasharray="4" />
          </svg>
        </div>

        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'rgba(124,106,247,0.1)',
            border: '1px solid rgba(124,106,247,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <MousePointerClick size={20} color="#7c6af7" />
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e8f0', margin: '0 0 8px' }}>
          Start your architecture
        </h2>
        <p style={{ fontSize: 13, color: '#55556a', margin: '0 0 20px', lineHeight: 1.6 }}>
          Click any component in the sidebar to add it to the canvas. Connect nodes by dragging from one handle to another.
        </p>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            ['Add a component', '1'],
            ['Connect nodes', '2'],
            ['Save diagram', '3'],
          ].map(([text, num]) => (
            <div
              key={num}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 10px',
                borderRadius: 6,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid #2a2a3a',
              }}
            >
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: '#2a2a3a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 9,
                  color: '#7c6af7',
                  fontWeight: 700,
                  fontFamily: '"JetBrains Mono", monospace',
                  flexShrink: 0,
                }}
              >
                {num}
              </span>
              <span style={{ fontSize: 11, color: '#8888aa' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ghostNode(color, x, y) {
  return {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
    padding: '6px 14px',
    borderRadius: 8,
    border: `1px solid ${color}33`,
    background: `${color}0a`,
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    opacity: 0.6,
  };
}
