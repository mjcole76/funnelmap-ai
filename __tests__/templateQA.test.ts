import { describe, it, expect } from 'vitest';
import { analyzeTemplate } from '../src/lib/templateQA';
import { createPlacedBlock, PlacedBlock } from '../src/lib/templateBlocks';

describe('analyzeTemplate', () => {
  it('returns no issues for a well-formed Sales Page', () => {
    const blocks = [
      createPlacedBlock('hero'),
      createPlacedBlock('problem'),
      createPlacedBlock('benefits'),
      createPlacedBlock('pricing'),
      createPlacedBlock('guarantee'),
      createPlacedBlock('cta_final'),
    ];
    const issues = analyzeTemplate(blocks, 'Sales Page');
    // Should have no critical issues
    const critical = issues.filter(i => i.severity === 'critical');
    expect(critical.length).toBe(0);
  });

  it('flags missing hero', () => {
    const blocks = [createPlacedBlock('problem'), createPlacedBlock('cta_final')];
    const issues = analyzeTemplate(blocks, 'Sales Page');
    expect(issues.some(i => i.issueType === 'missing_hero')).toBe(true);
  });

  it('flags missing pricing on paid pages', () => {
    const blocks = [createPlacedBlock('hero'), createPlacedBlock('cta_final')];
    const issues = analyzeTemplate(blocks, 'Sales Page');
    expect(issues.some(i => i.issueType === 'missing_pricing')).toBe(true);
  });

  it('flags missing guarantee on checkout', () => {
    const blocks = [createPlacedBlock('hero'), createPlacedBlock('pricing')];
    const issues = analyzeTemplate(blocks, 'Checkout');
    expect(issues.some(i => i.issueType === 'missing_guarantee')).toBe(true);
  });

  it('does not flag pricing on non-paid pages', () => {
    const blocks = [createPlacedBlock('hero'), createPlacedBlock('cta_final')];
    const issues = analyzeTemplate(blocks, 'Thank You Page');
    expect(issues.some(i => i.issueType === 'missing_pricing')).toBe(false);
  });

  it('flags empty image URL', () => {
    const block = createPlacedBlock('image');
    block.content.imageUrl = '';
    const issues = analyzeTemplate([block], 'Sales Page');
    expect(issues.some(i => i.issueType === 'empty_image_url')).toBe(true);
  });

  it('flags empty video URL', () => {
    const block = createPlacedBlock('video_embed');
    block.content.videoUrl = '';
    block.content.embedUrl = '';
    const issues = analyzeTemplate([block], 'Sales Page');
    expect(issues.some(i => i.issueType === 'empty_video_url')).toBe(true);
  });

  it('flags poor contrast', () => {
    const block = createPlacedBlock('hero');
    block.styles.section.backgroundColor = '#ffffff';
    block.styles.section.textColor = '#eeeeee'; // Very low contrast
    const issues = analyzeTemplate([block], 'Sales Page');
    expect(issues.some(i => i.issueType === 'poor_contrast')).toBe(true);
  });

  it('returns empty array for empty blocks', () => {
    const issues = analyzeTemplate([], 'Sales Page');
    expect(issues.length).toBe(0);
  });

  it('flags too many sections without CTA', () => {
    const blocks = [
      createPlacedBlock('problem'),
      createPlacedBlock('solution'),
      createPlacedBlock('benefits'),
      createPlacedBlock('features'),
      createPlacedBlock('social_proof'),
      createPlacedBlock('faq'), // 6 content blocks, no CTA
    ];
    const issues = analyzeTemplate(blocks, 'Sales Page');
    expect(issues.some(i => i.issueType === 'too_many_sections_without_cta')).toBe(true);
  });
});
