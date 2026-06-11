import '../index.css';
import '@xyflow/react/dist/style.css';

export const metadata = {
  title: 'SysDesign Visualizer - System Architecture Diagramming Tool',
  description: 'Interactive system design visualizer to plan, drag-and-drop components, and export diagrams as images. Perfect for designing large scale systems like Netflix or YouTube.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
