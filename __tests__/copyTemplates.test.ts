import { describe, it, expect } from 'vitest';
import { generateCopy, generateCopyFromLayout, FunnelContext } from '../src/lib/copyTemplates';

const baseContext: FunnelContext = {
  funnelName: 'Test Funnel',
  productName: 'SpeedWriter Pro',
  audience: 'busy freelancers',
  price: '$47',
  problem: 'spending too much time writing proposals',
  goal: 'write proposals in half the time',
  offerType: 'Low-ticket ($7-$47)',
};

describe('generateCopy', () => {
  it('generates copy with a headline for Sales Page', () => {
    const result = generateCopy('Sales Page', baseContext);
    expect(result.headline).toBeTruthy();
    expect(result.headline.length).toBeGreaterThan(5);
    expect(result.sections).toBeDefined();
    expect(result.sections.length).toBeGreaterThan(0);
  });

  it('generates copy for Landing Page', () => {
    const result = generateCopy('Landing Page', baseContext);
    expect(result.headline).toBeTruthy();
    expect(result.sections.length).toBeGreaterThan(0);
  });

  it('generates copy for Checkout', () => {
    const result = generateCopy('Checkout', baseContext);
    expect(result.headline).toBeTruthy();
  });

  it('generates copy for Upsell', () => {
    const result = generateCopy('Upsell', baseContext);
    expect(result.headline).toBeTruthy();
  });

  it('generates copy for Thank You Page', () => {
    const result = generateCopy('Thank You Page', baseContext);
    expect(result.headline).toBeTruthy();
  });

  it('returns placeholder when context is empty', () => {
    const result = generateCopy('Sales Page', {
      funnelName: '', productName: 'Your Product', audience: 'your audience', price: '', problem: '', goal: '', offerType: '',
    });
    expect(result.headline.toLowerCase()).toContain('offer brief');
  });

  it('does not include blocked phrases', () => {
    const result = generateCopy('Sales Page', baseContext);
    const fullText = `${result.headline} ${result.sections.map(s => s.content).join(' ')}`;
    expect(fullText.toLowerCase()).not.toContain('game-changer');
    expect(fullText.toLowerCase()).not.toContain('revolutionary');
  });

  it('includes product name in generated copy', () => {
    const result = generateCopy('Sales Page', baseContext);
    const fullText = `${result.headline} ${result.sections.map(s => s.content).join(' ')}`;
    expect(fullText).toContain('SpeedWriter');
  });
});

describe('generateCopyFromLayout', () => {
  it('generates a section per block in layout', () => {
    const layout = [
      { instanceId: 'h1', blockType: 'hero', content: {}, styles: {} as any },
      { instanceId: 'p1', blockType: 'problem', content: {}, styles: {} as any },
      { instanceId: 'b1', blockType: 'benefits', content: {}, styles: {} as any },
      { instanceId: 'c1', blockType: 'cta_final', content: {}, styles: {} as any },
    ];
    const result = generateCopyFromLayout('Sales Page', baseContext, layout);
    expect(result.headline).toBeTruthy();
    expect(result.sections.length).toBe(4);
  });

  it('generates different content per block type', () => {
    const layout = [
      { instanceId: 'h1', blockType: 'hero', content: {}, styles: {} as any },
      { instanceId: 'f1', blockType: 'faq', content: {}, styles: {} as any },
      { instanceId: 'g1', blockType: 'guarantee', content: {}, styles: {} as any },
    ];
    const result = generateCopyFromLayout('Sales Page', baseContext, layout);
    const titles = result.sections.map(s => s.title);
    expect(new Set(titles).size).toBe(titles.length); // All unique
  });

  it('includes CTA in output when cta_final block is present', () => {
    const layout = [
      { instanceId: 'h1', blockType: 'hero', content: {}, styles: {} as any },
      { instanceId: 'c1', blockType: 'cta_final', content: {}, styles: {} as any },
    ];
    const result = generateCopyFromLayout('Sales Page', baseContext, layout);
    expect(result.cta).toBeTruthy();
  });

  it('returns placeholder when context is empty', () => {
    const layout = [{ instanceId: 'h1', blockType: 'hero', content: {}, styles: {} as any }];
    const result = generateCopyFromLayout('Sales Page', {
      funnelName: '', productName: 'Your Product', audience: 'your audience', price: '', problem: '', goal: '', offerType: '',
    }, layout);
    expect(result.headline.toLowerCase()).toContain('offer brief');
  });
});
