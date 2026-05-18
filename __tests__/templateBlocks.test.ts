import { describe, it, expect, beforeEach } from 'vitest';
import {
  TEMPLATE_BLOCKS, getBlockDef, createPlacedBlock, layoutFromStepType, getBlocksByCategory,
  saveTemplate, loadTemplates, deleteTemplate, duplicateTemplate, exportTemplate, importTemplate,
  blockToHTML, blocksToHTML, getDefaultStyles,
} from '../src/lib/templateBlocks';

// Mock localStorage for template tests
const storage: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (key: string) => storage[key] || null,
  setItem: (key: string, value: string) => { storage[key] = value; },
  removeItem: (key: string) => { delete storage[key]; },
  clear: () => { Object.keys(storage).forEach(k => delete storage[k]); },
};
Object.defineProperty(globalThis, 'localStorage', { value: mockLocalStorage });

beforeEach(() => { mockLocalStorage.clear(); });

describe('TEMPLATE_BLOCKS', () => {
  it('has 41 block definitions', () => {
    expect(TEMPLATE_BLOCKS.length).toBe(41);
  });

  it('has unique IDs', () => {
    const ids = TEMPLATE_BLOCKS.map(b => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('covers all categories', () => {
    const cats = new Set(TEMPLATE_BLOCKS.map(b => b.category));
    expect(cats).toContain('core');
    expect(cats).toContain('sales');
    expect(cats).toContain('trust');
    expect(cats).toContain('conversion');
    expect(cats).toContain('media');
    expect(cats).toContain('layout');
    expect(cats).toContain('button');
  });
});

describe('getBlockDef', () => {
  it('returns correct block for hero', () => {
    const def = getBlockDef('hero');
    expect(def.label).toBe('Hero Section');
    expect(def.category).toBe('core');
  });

  it('returns fallback for unknown type', () => {
    const def = getBlockDef('nonexistent' as any);
    expect(def).toBeDefined();
  });
});

describe('createPlacedBlock', () => {
  it('creates a block with unique instanceId', () => {
    const b1 = createPlacedBlock('hero');
    const b2 = createPlacedBlock('hero');
    expect(b1.instanceId).not.toBe(b2.instanceId);
  });

  it('includes default styles', () => {
    const b = createPlacedBlock('hero');
    expect(b.styles).toBeDefined();
    expect(b.styles.section).toBeDefined();
    expect(b.styles.typography).toBeDefined();
  });

  it('includes default content', () => {
    const b = createPlacedBlock('hero');
    expect(b.content.headline).toBeTruthy();
  });
});

describe('layoutFromStepType', () => {
  it('returns blocks for Sales Page', () => {
    const layout = layoutFromStepType('Sales Page');
    expect(layout.length).toBe(10);
    expect(layout[0].blockType).toBe('hero');
  });

  it('returns blocks for Landing Page', () => {
    const layout = layoutFromStepType('Landing Page');
    expect(layout.length).toBe(4);
  });

  it('falls back to Landing Page for unknown type', () => {
    const layout = layoutFromStepType('Unknown Page');
    expect(layout.length).toBe(4);
  });
});

describe('getBlocksByCategory', () => {
  it('returns only blocks in category', () => {
    const media = getBlocksByCategory('media');
    expect(media.length).toBe(4);
    media.forEach(b => expect(b.category).toBe('media'));
  });
});

describe('getDefaultStyles', () => {
  it('returns dark styles for dark_section', () => {
    const s = getDefaultStyles('dark_section');
    expect(s.section.backgroundColor).toBe('#111827');
    expect(s.section.textColor).toBe('#f9fafb');
  });

  it('returns button styles for hero', () => {
    const s = getDefaultStyles('hero');
    expect(s.button).toBeDefined();
  });

  it('returns image styles for image block', () => {
    const s = getDefaultStyles('image');
    expect(s.image).toBeDefined();
  });
});

describe('template save/load', () => {
  it('saves and loads a template', () => {
    saveTemplate({
      id: 'tpl-test', name: 'Test', description: '', pageType: 'Sales Page', pageStyle: '',
      blocks: [], includeCopy: false, createdAt: Date.now(), updatedAt: Date.now(),
    });
    const loaded = loadTemplates();
    expect(loaded.length).toBe(1);
    expect(loaded[0].name).toBe('Test');
  });

  it('deletes a template', () => {
    saveTemplate({ id: 'tpl-1', name: 'A', description: '', pageType: '', pageStyle: '', blocks: [], includeCopy: false, createdAt: 0, updatedAt: 0 });
    saveTemplate({ id: 'tpl-2', name: 'B', description: '', pageType: '', pageStyle: '', blocks: [], includeCopy: false, createdAt: 0, updatedAt: 0 });
    deleteTemplate('tpl-1');
    expect(loadTemplates().length).toBe(1);
    expect(loadTemplates()[0].name).toBe('B');
  });

  it('duplicates a template', () => {
    saveTemplate({ id: 'tpl-orig', name: 'Original', description: '', pageType: '', pageStyle: '', blocks: [], includeCopy: false, createdAt: 0, updatedAt: 0 });
    const dup = duplicateTemplate('tpl-orig');
    expect(dup).toBeDefined();
    expect(dup!.name).toContain('Copy');
    expect(loadTemplates().length).toBe(2);
  });
});

describe('template export/import', () => {
  it('exports template as JSON', () => {
    saveTemplate({ id: 'tpl-exp', name: 'Export Me', description: '', pageType: '', pageStyle: '', blocks: [], includeCopy: false, createdAt: 0, updatedAt: 0 });
    const json = exportTemplate('tpl-exp');
    expect(json).toBeTruthy();
    const parsed = JSON.parse(json!);
    expect(parsed.name).toBe('Export Me');
  });

  it('imports template from JSON', () => {
    const json = JSON.stringify({ id: 'x', name: 'Imported', description: '', pageType: 'LP', pageStyle: '', blocks: [], includeCopy: false, createdAt: 0, updatedAt: 0 });
    const result = importTemplate(json);
    expect(result).toBeDefined();
    expect(result!.name).toBe('Imported');
    expect(loadTemplates().length).toBe(1);
  });

  it('returns null for invalid JSON', () => {
    const result = importTemplate('not valid json');
    expect(result).toBeNull();
  });
});

describe('blockToHTML', () => {
  it('generates HTML for a hero block', () => {
    const block = createPlacedBlock('hero');
    const html = blockToHTML(block);
    expect(html).toContain('<section');
    expect(html).toContain(block.content.headline);
  });

  it('generates HTML for an image block', () => {
    const block = createPlacedBlock('image');
    const html = blockToHTML(block);
    expect(html).toContain('placeholder');
  });

  it('generates HTML for a dark_section', () => {
    const block = createPlacedBlock('dark_section');
    const html = blockToHTML(block);
    expect(html).toContain('#111827');
  });
});

describe('blocksToHTML', () => {
  it('generates a full HTML document', () => {
    const blocks = [createPlacedBlock('hero'), createPlacedBlock('cta_final')];
    const html = blocksToHTML(blocks, 'Test Page');
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('Test Page');
    expect(html).toContain('<section');
  });
});
