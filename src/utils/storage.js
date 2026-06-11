const STORAGE_KEY = 'sysdesign_diagram_v1';

export function saveDiagram(nodes, edges, viewport) {
  try {
    const data = {
      nodes,
      edges,
      viewport,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Save failed:', e);
    return false;
  }
}

export function loadDiagram() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Load failed:', e);
    return null;
  }
}

export function hasSavedDiagram() {
  return !!localStorage.getItem(STORAGE_KEY);
}

export function clearSavedDiagram() {
  localStorage.removeItem(STORAGE_KEY);
}
