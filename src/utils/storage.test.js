import { describe, it, expect, beforeEach } from 'vitest';
import { saveDiagram, loadDiagram, hasSavedDiagram, clearSavedDiagram } from './storage';

describe('Storage Utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return false for hasSavedDiagram when empty', () => {
    expect(hasSavedDiagram()).toBe(false);
  });

  it('should return null for loadDiagram when empty', () => {
    expect(loadDiagram()).toBeNull();
  });

  it('should successfully save and load a diagram', () => {
    const nodes = [{ id: '1', data: { label: 'Node 1' } }];
    const edges = [{ id: 'e1', source: '1', target: '2' }];
    const viewport = { x: 0, y: 0, zoom: 1 };

    const saveResult = saveDiagram(nodes, edges, viewport);
    expect(saveResult).toBe(true);
    expect(hasSavedDiagram()).toBe(true);

    const loaded = loadDiagram();
    expect(loaded).toBeDefined();
    expect(loaded.nodes).toEqual(nodes);
    expect(loaded.edges).toEqual(edges);
    expect(loaded.viewport).toEqual(viewport);
    expect(loaded.savedAt).toBeTypeOf('string');
  });

  it('should clear a saved diagram', () => {
    const nodes = [{ id: '1' }];
    saveDiagram(nodes, [], {});
    expect(hasSavedDiagram()).toBe(true);

    clearSavedDiagram();
    expect(hasSavedDiagram()).toBe(false);
    expect(loadDiagram()).toBeNull();
  });
});
