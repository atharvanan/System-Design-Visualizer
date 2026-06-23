import { describe, it, expect } from 'vitest';
import { getComponentConfig, COMPONENT_TYPES, CATEGORIES } from './components';

describe('Component Config', () => {
  it('should return the correct config for a valid type', () => {
    const config = getComponentConfig('frontend');
    expect(config).toBeDefined();
    expect(config.type).toBe('frontend');
    expect(config.label).toBe('Web Client');
  });

  it('should return the default/first config for an invalid type', () => {
    const config = getComponentConfig('non-existent-type');
    expect(config).toBeDefined();
    expect(config.type).toBe('frontend'); // The first element in COMPONENT_TYPES is 'frontend'
  });

  it('should list all unique categories', () => {
    expect(CATEGORIES).toContain('Client');
    expect(CATEGORIES).toContain('Network');
    expect(CATEGORIES).toContain('Compute');
    expect(CATEGORIES).toContain('Storage');
    // Ensure all categories are unique
    const uniqueCategories = [...new Set(CATEGORIES)];
    expect(CATEGORIES.length).toBe(uniqueCategories.length);
  });
});
