'use client';

import dynamic from 'next/dynamic';

const DiagramVisualizer = dynamic(
  () => import('../components/DiagramVisualizer'),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          width: '100vw',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0f',
          color: '#e8e8f0',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '14px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: '#7c6af7' }}>SysDesign</div>
          <div style={{ color: '#55556a' }}>Loading canvas and components...</div>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  return <HomeInner />;
}

function HomeInner() {
  return <DiagramVisualizer />;
}
