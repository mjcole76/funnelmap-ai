'use client';
import React, { useState, useCallback } from 'react';
import { X, Check, AlertTriangle, XCircle, RefreshCcw, Wrench, Wand2, Pencil } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface QualityIssue {
  nodeId: string;
  nodeTitle: string;
  stepType: string;
  severity: 'pass' | 'warning' | 'critical';
  issueType: IssueType;
  message: string;
  detail?: string;
  fixable: 'auto' | 'manual' | 'none';
}

export type IssueType =
  | 'no_copy'
  | 'missing_product_name'
  | 'missing_audience'
  | 'missing_price'
  | 'blocked_phrase'
  | 'conditional_blocked'
  | 'generic_filler'
  | 'fake_proof'
  | 'weak_cta'
  | 'broken_variable'
  | 'missing_section'
  | 'step_mismatch'
  | 'pass';

interface CopyQualityReportProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: any[];
  funnelContext: any;
  onFixIssue: (issue: QualityIssue) => void;
  onFixAllCritical: () => void;
  onFixAllWarnings: () => void;
  onRerunQA: () => void;
  onEditNode: (nodeId: string, scrollTo?: string) => void;
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const BLOCKED_PHRASES = [
  'generated funnel copy',
  'low conversions',
  'sell product',
  'your headline here',
  'your content goes here',
  'want to upgrade your order?',
];

const CONDITIONAL_BLOCKED = [
  { phrase: 'special one-time offer', allowedTypes: ['Upsell', 'Downsell'] },
];

const GENERIC_FILLER = [
  'lorem ipsum',
  'insert your',
  'placeholder',
  'example text',
  'add your',
  '[your ',
  '{your ',
  'click here to',
  'your product name',
  'your audience',
];

const FAKE_PROOF_PATTERNS = [
  /\d{1,3}(?:,\d{3})*\+?\s*(?:happy|satisfied|verified)\s*(?:customers|users|buyers|clients)/i,
  /\$\d{1,3}(?:,\d{3})*\+?\s*(?:in revenue|generated|earned)/i,
  /(?:trusted by|used by|loved by)\s*\d+/i,
  /\d+%\s*(?:success rate|satisfaction|improvement|increase)/i,
];

const WEAK_CTAS = [
  'click here',
  'submit',
  'next',
  'continue',
  'learn more',
  'buy now',
];

// ═══════════════════════════════════════════════════════════════
// ANALYSIS
// ═══════════════════════════════════════════════════════════════

function getRequiredSections(stepType: string): string[] {
  switch (stepType) {
    case 'Sales Page': return ['headline', 'problem or opening_hook', 'benefits or whatYouGet', 'cta', 'guarantee'];
    case 'Landing Page': return ['headline', 'cta', 'bullets or benefits'];
    case 'Checkout': return ['headline', 'whatYouGet or bullets'];
    case 'Order Bump': return ['headline', 'bullets or benefits'];
    case 'Upsell': return ['headline', 'cta', 'whatYouGet or benefits'];
    case 'Downsell': return ['headline', 'cta'];
    case 'Thank You Page': return ['headline', 'nextSteps or confirmation'];
    case 'Email Follow-up': return ['emails'];
    default: return ['headline'];
  }
}

export function analyzeCopy(node: any, funnelContext: any): QualityIssue[] {
  const issues: QualityIssue[] = [];
  const nodeId = node.id;
  const nodeTitle = (node.data.title as string) || 'Untitled';
  const stepType = (node.data.type as string) || 'Unknown';

  // Get stored copy
  let copyData: any = null;
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(`funnel-copy-${nodeId}`);
    if (saved) { try { copyData = JSON.parse(saved); } catch { /* ignore */ } }
  }
  if (!copyData) copyData = node.data.copy;

  // No copy at all
  if (!copyData) {
    issues.push({ nodeId, nodeTitle, stepType, severity: 'critical', issueType: 'no_copy', message: 'No copy generated', detail: 'This page has no generated copy. Run "Write Full Funnel" first.', fixable: 'auto' });
    return issues;
  }

  const allText = JSON.stringify(copyData).toLowerCase();
  const headline = (copyData.headline || '').toLowerCase();
  const sections = copyData.sections || [];
  const body = copyData.body || '';
  const fullText = `${headline} ${body} ${sections.map((s: any) => s.content).join(' ')}`.toLowerCase();

  // Check: Missing product name
  const productName = funnelContext?.productName?.toLowerCase();
  if (productName && productName.length > 3 && !fullText.includes(productName)) {
    issues.push({ nodeId, nodeTitle, stepType, severity: 'warning', issueType: 'missing_product_name', message: 'Missing product name', detail: `"${funnelContext.productName}" not found in copy.`, fixable: 'auto' });
  }

  // Check: Missing audience
  const audience = funnelContext?.audience?.toLowerCase();
  if (audience && audience.length > 3 && !fullText.includes(audience)) {
    issues.push({ nodeId, nodeTitle, stepType, severity: 'warning', issueType: 'missing_audience', message: 'Missing audience reference', detail: `"${funnelContext.audience}" not found in copy.`, fixable: 'auto' });
  }

  // Check: Missing price when relevant
  const needsPrice = ['Sales Page', 'Checkout', 'Upsell', 'Downsell', 'Order Bump'].includes(stepType);
  if (needsPrice && funnelContext?.price) {
    const priceStr = funnelContext.price.replace('$', '');
    if (!fullText.includes(priceStr) && !fullText.includes(funnelContext.price.toLowerCase())) {
      issues.push({ nodeId, nodeTitle, stepType, severity: 'warning', issueType: 'missing_price', message: 'Missing price', detail: `Price "${funnelContext.price}" not found on this ${stepType}.`, fixable: 'auto' });
    }
  }

  // Check: Blocked phrases
  for (const phrase of BLOCKED_PHRASES) {
    if (fullText.includes(phrase)) {
      issues.push({ nodeId, nodeTitle, stepType, severity: 'critical', issueType: 'blocked_phrase', message: 'Blocked phrase detected', detail: `Found "${phrase}" in copy.`, fixable: 'auto' });
    }
  }

  // Check: Conditional blocked phrases
  for (const { phrase, allowedTypes } of CONDITIONAL_BLOCKED) {
    if (fullText.includes(phrase) && !allowedTypes.includes(stepType)) {
      issues.push({ nodeId, nodeTitle, stepType, severity: 'critical', issueType: 'conditional_blocked', message: 'Phrase used in wrong context', detail: `"${phrase}" should only appear in ${allowedTypes.join('/')} pages.`, fixable: 'auto' });
    }
  }

  // Check: Generic filler
  for (const filler of GENERIC_FILLER) {
    if (fullText.includes(filler)) {
      issues.push({ nodeId, nodeTitle, stepType, severity: 'critical', issueType: 'generic_filler', message: 'Generic filler text', detail: `Found "${filler}" — replace with real copy.`, fixable: 'auto' });
    }
  }

  // Check: Fake proof / statistics
  for (const pattern of FAKE_PROOF_PATTERNS) {
    if (pattern.test(fullText)) {
      issues.push({ nodeId, nodeTitle, stepType, severity: 'warning', issueType: 'fake_proof', message: 'Possible fake proof/statistics', detail: 'Found numerical claims that may be fabricated. Remove or verify.', fixable: 'auto' });
      break;
    }
  }

  // Check: Weak CTA
  const cta = (copyData.cta || copyData.button || '').toLowerCase().trim();
  if (cta && WEAK_CTAS.includes(cta)) {
    issues.push({ nodeId, nodeTitle, stepType, severity: 'warning', issueType: 'weak_cta', message: 'Weak CTA', detail: `"${cta}" is generic. Use action-specific copy.`, fixable: 'auto' });
  }

  // Check: Awkward stitched variables
  const awkwardPatterns = [/\$\{/, /undefined/, /null/, /NaN/, /\[object/];
  for (const p of awkwardPatterns) {
    if (p.test(fullText)) {
      issues.push({ nodeId, nodeTitle, stepType, severity: 'critical', issueType: 'broken_variable', message: 'Broken variable in copy', detail: `Found pattern "${p.source}" — template not properly filled.`, fixable: 'auto' });
      break;
    }
  }

  // Check: Missing required sections
  const required = getRequiredSections(stepType);
  for (const req of required) {
    const alternatives = req.split(' or ');
    let found = false;
    for (const alt of alternatives) {
      const key = alt.trim();
      if (key === 'headline' && copyData.headline && copyData.headline.length > 5) { found = true; break; }
      if (key === 'cta' && (copyData.cta || copyData.button)) { found = true; break; }
      if (key === 'emails' && sections.some((s: any) => s.content && s.content.toLowerCase().includes('subject:'))) { found = true; break; }
      if (fullText.includes(`${key}:`) || fullText.includes(key.replace(/([A-Z])/g, ' $1').toLowerCase())) { found = true; break; }
      if (sections.some((s: any) => s.title && s.title.toLowerCase().includes(key))) { found = true; break; }
    }
    if (!found) {
      issues.push({ nodeId, nodeTitle, stepType, severity: 'warning', issueType: 'missing_section', message: `Missing section: ${req}`, detail: `Expected "${req}" section for a ${stepType}.`, fixable: 'auto' });
    }
  }

  // Check: Step type mismatch
  if (stepType === 'Thank You Page' && !fullText.includes('thank') && !fullText.includes('congrat') && !fullText.includes('success') && !fullText.includes('confirmed') && !fullText.includes('access')) {
    issues.push({ nodeId, nodeTitle, stepType, severity: 'warning', issueType: 'step_mismatch', message: 'Copy mismatch', detail: 'Thank You page should acknowledge the purchase/signup.', fixable: 'auto' });
  }
  if (stepType === 'Order Bump' && !fullText.includes('add') && !fullText.includes('bonus') && !fullText.includes('upgrade') && !fullText.includes('include')) {
    issues.push({ nodeId, nodeTitle, stepType, severity: 'warning', issueType: 'step_mismatch', message: 'Copy mismatch', detail: 'Order Bump should present the add-on value proposition.', fixable: 'auto' });
  }

  // If no issues found
  if (issues.length === 0) {
    issues.push({ nodeId, nodeTitle, stepType, severity: 'pass', issueType: 'pass', message: 'All checks passed', fixable: 'none' });
  }

  return issues;
}

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function CopyQualityReport({ isOpen, onClose, nodes, funnelContext, onFixIssue, onFixAllCritical, onFixAllWarnings, onRerunQA, onEditNode }: CopyQualityReportProps) {
  const [fixingId, setFixingId] = useState<string | null>(null);
  const [fixedIds, setFixedIds] = useState<Set<string>>(new Set());
  const [rerunKey, setRerunKey] = useState(0);

  if (!isOpen) return null;

  const allIssues: QualityIssue[] = [];
  nodes.forEach(node => {
    const nodeIssues = analyzeCopy(node, funnelContext);
    allIssues.push(...nodeIssues);
  });

  const criticals = allIssues.filter(i => i.severity === 'critical');
  const warnings = allIssues.filter(i => i.severity === 'warning');
  const passes = allIssues.filter(i => i.severity === 'pass');

  // Score: start at 100, -15 per critical, -5 per warning
  const rawScore = 100 - (criticals.length * 15) - (warnings.length * 5);
  const score = Math.max(0, Math.min(100, rawScore));

  const scoreColor = score >= 80 ? 'text-green-600' : score >= 50 ? 'text-amber-600' : 'text-red-600';
  const scoreBg = score >= 80 ? 'bg-green-50 border-green-200' : score >= 50 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200';

  const handleFix = (issue: QualityIssue) => {
    const key = `${issue.nodeId}-${issue.issueType}-${issue.message}`;
    setFixingId(key);
    onFixIssue(issue);
    setTimeout(() => {
      setFixingId(null);
      setFixedIds(prev => new Set([...prev, key]));
    }, 600);
  };

  const handleFixAllCritical = () => {
    setFixingId('all-critical');
    onFixAllCritical();
    setTimeout(() => {
      setFixingId(null);
      criticals.forEach(i => setFixedIds(prev => new Set([...prev, `${i.nodeId}-${i.issueType}-${i.message}`])));
    }, 1000);
  };

  const handleFixAllWarnings = () => {
    setFixingId('all-warnings');
    onFixAllWarnings();
    setTimeout(() => {
      setFixingId(null);
      warnings.forEach(i => setFixedIds(prev => new Set([...prev, `${i.nodeId}-${i.issueType}-${i.message}`])));
    }, 1000);
  };

  const handleRerun = () => {
    setFixedIds(new Set());
    setRerunKey(k => k + 1);
    onRerunQA();
  };

  const issueKey = (issue: QualityIssue) => `${issue.nodeId}-${issue.issueType}-${issue.message}`;

  const renderIssueRow = (issue: QualityIssue, idx: number, color: 'red' | 'amber') => {
    const key = issueKey(issue);
    const isFixed = fixedIds.has(key);
    const isFixing = fixingId === key;
    const bgColor = color === 'red' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100';
    const fixedBg = 'bg-green-50 border-green-200';

    return (
      <div key={`${color}-${idx}`} className={`flex items-start justify-between p-3 border rounded-lg transition-all duration-300 ${isFixed ? fixedBg : bgColor}`}>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            {isFixed ? (
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            ) : color === 'red' ? (
              <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            )}
            <span className="font-medium text-gray-900 text-sm">{issue.nodeTitle}</span>
            <span className="text-xs text-gray-500">({issue.stepType})</span>
          </div>
          <p className={`text-sm mt-1 ml-6 ${isFixed ? 'text-green-700 line-through' : color === 'red' ? 'text-red-700' : 'text-amber-700'}`}>{issue.message}</p>
          {issue.detail && !isFixed && <p className={`text-xs mt-0.5 ml-6 ${color === 'red' ? 'text-red-600' : 'text-amber-600'}`}>{issue.detail}</p>}
          {isFixed && <p className="text-xs mt-0.5 ml-6 text-green-600 font-medium">✓ Fixed</p>}
        </div>
        {!isFixed && (
          <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
            {issue.fixable === 'auto' && (
              <button
                onClick={() => handleFix(issue)}
                disabled={isFixing}
                className={`flex items-center text-xs px-2.5 py-1.5 rounded-md font-medium transition-all ${
                  isFixing
                    ? 'bg-gray-200 text-gray-400 cursor-wait'
                    : color === 'red'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-amber-600 text-white hover:bg-amber-700'
                }`}
              >
                {isFixing ? (
                  <RefreshCcw className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <Wand2 className="w-3 h-3 mr-1" />
                )}
                {isFixing ? 'Fixing...' : 'Auto-Fix'}
              </button>
            )}
            <button
              onClick={() => onEditNode(issue.nodeId, issue.issueType)}
              className="flex items-center text-xs px-2.5 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium"
            >
              <Pencil className="w-3 h-3 mr-1" />Edit
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-bold text-gray-900">Copy Quality Report</h2>
            <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full font-medium">{nodes.length} pages</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        {/* Score */}
        <div className={`mx-6 mt-6 p-6 rounded-xl border ${scoreBg} text-center`}>
          <div className={`text-5xl font-black ${scoreColor}`}>{score}</div>
          <p className="text-sm text-gray-600 mt-1">Overall Quality Score</p>
          <div className="flex justify-center space-x-6 mt-4 text-sm">
            <span className="flex items-center text-green-600"><Check className="w-4 h-4 mr-1" />{passes.length} passed</span>
            <span className="flex items-center text-amber-600"><AlertTriangle className="w-4 h-4 mr-1" />{warnings.length} warnings</span>
            <span className="flex items-center text-red-600"><XCircle className="w-4 h-4 mr-1" />{criticals.length} critical</span>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="mx-6 mt-4 flex flex-wrap gap-2">
          {criticals.length > 0 && (
            <button
              onClick={handleFixAllCritical}
              disabled={fixingId === 'all-critical'}
              className="flex items-center text-xs px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50"
            >
              <Wrench className="w-3.5 h-3.5 mr-1.5" />
              {fixingId === 'all-critical' ? 'Fixing...' : `Fix All Critical (${criticals.length})`}
            </button>
          )}
          {warnings.length > 0 && (
            <button
              onClick={handleFixAllWarnings}
              disabled={fixingId === 'all-warnings'}
              className="flex items-center text-xs px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium transition-colors disabled:opacity-50"
            >
              <Wrench className="w-3.5 h-3.5 mr-1.5" />
              {fixingId === 'all-warnings' ? 'Fixing...' : `Fix All Warnings (${warnings.length})`}
            </button>
          )}
          <button
            onClick={handleRerun}
            className="flex items-center text-xs px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            <RefreshCcw className="w-3.5 h-3.5 mr-1.5" />Rerun QA
          </button>
        </div>

        {/* Issues */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Critical Issues */}
          {criticals.length > 0 && (
            <div>
              <h3 className="font-bold text-red-700 text-sm uppercase tracking-wide mb-3">Critical Issues</h3>
              <div className="space-y-2">
                {criticals.map((issue, i) => renderIssueRow(issue, i, 'red'))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {warnings.length > 0 && (
            <div>
              <h3 className="font-bold text-amber-700 text-sm uppercase tracking-wide mb-3">Warnings</h3>
              <div className="space-y-2">
                {warnings.map((issue, i) => renderIssueRow(issue, i, 'amber'))}
              </div>
            </div>
          )}

          {/* Passes */}
          {passes.length > 0 && (
            <div>
              <h3 className="font-bold text-green-700 text-sm uppercase tracking-wide mb-3">Passed</h3>
              <div className="space-y-1">
                {passes.map((issue, i) => (
                  <div key={`p-${i}`} className="flex items-center p-2 text-sm text-green-700">
                    <Check className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="font-medium">{issue.nodeTitle}</span>
                    <span className="text-xs text-gray-500 ml-2">({issue.stepType})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {allIssues.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No copy to analyze. Generate copy first.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <p className="text-xs text-gray-500">Fix buttons auto-repair copy. Edit opens the section for manual changes.</p>
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Close</button>
        </div>
      </div>
    </div>
  );
}

// Export the analysis function so page.tsx can use it for badge warnings
export function getNodeQualityStatus(node: any, funnelContext: any): 'pass' | 'warning' | 'critical' | null {
  let copyData: any = null;
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(`funnel-copy-${node.id}`);
    if (saved) { try { copyData = JSON.parse(saved); } catch { /* ignore */ } }
  }
  if (!copyData) copyData = node.data.copy;
  if (!copyData) return null;

  const issues = analyzeCopy(node, funnelContext);
  if (issues.some(i => i.severity === 'critical')) return 'critical';
  if (issues.some(i => i.severity === 'warning')) return 'warning';
  return 'pass';
}
