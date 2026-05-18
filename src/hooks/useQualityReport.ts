import { useCallback } from 'react';
import { Node } from '@xyflow/react';
import type { FunnelContext } from '../types';
import { QualityIssue, analyzeCopy } from '../components/CopyQualityReport';
import { fixIssue, fixAllIssuesOfSeverity } from '../lib/qaFixEngine';
// FixResult is defined locally since the component's QualityIssue differs from types/qa.ts
type FixStatus = 'fixed' | 'needs_manual_edit' | 'could_not_fix';
interface FixResult {
  issue: QualityIssue;
  status: FixStatus;
  message: string;
  updatedCopy?: any;
}

/**
 * Hook for QA issue management — fix, fix-all, rerun.
 * Now returns FixResult with status for each fix.
 */
export function useQualityReport(
  nodes: Node[],
  funnelContext: FunnelContext,
  setNodes: (fn: (nds: Node[]) => Node[]) => void,
  setSaveStatus: (s: 'saved' | 'saving' | 'unsaved') => void,
  saveCopyForNode: (nodeId: string, copy: any) => void,
  loadCopyForNode: (nodeId: string) => any | null,
) {
  const buildContext = (node: Node): FunnelContext => ({
    productName: funnelContext.productName || 'Your Product',
    audience: funnelContext.audience || 'your audience',
    price: funnelContext.price || '$29',
    problem: funnelContext.problem || 'their main challenge',
    goal: funnelContext.goal || 'achieve their desired outcome',
    funnelName: funnelContext.funnelName || 'My Funnel',
    offerType: funnelContext.offerType || 'low_ticket',
    previewTemplate: (node.data.previewTemplate as string) || '',
    stepTitle: (node.data.title as string) || '',
  });

  /** Fix a single issue. Returns FixResult with status. */
  const handleFixIssue = useCallback((issue: QualityIssue): FixResult => {
    const node = nodes.find(n => n.id === issue.nodeId);
    if (!node) return { issue, status: 'could_not_fix' as FixStatus, message: 'Node not found' };

    let copyData = loadCopyForNode(issue.nodeId) || node.data.copy;
    if (!copyData) return { issue, status: 'could_not_fix' as FixStatus, message: 'No copy to fix' };

    const context = buildContext(node);
    const fixedCopy = fixIssue(issue, copyData, context, (node.data.type as string) || 'Sales Page');

    if (fixedCopy) {
      saveCopyForNode(issue.nodeId, fixedCopy);
      setNodes(nds => nds.map(n => n.id === issue.nodeId ? { ...n, data: { ...n.data, copy: fixedCopy, _copyUpdated: Date.now() } } : n));
      setSaveStatus('unsaved');

      // Verify the fix by re-analyzing
      const remaining = analyzeCopy([{ ...node, data: { ...node.data, copy: fixedCopy } }] as any, funnelContext);
      const stillPresent = remaining.some(r => r.issueType === issue.issueType && r.nodeId === issue.nodeId);

      if (stillPresent) {
        return { issue, status: 'needs_manual_edit', message: 'Auto-fix applied but issue persists. Open editor to fix manually.', updatedCopy: fixedCopy };
      }
      return { issue, status: 'fixed', message: 'Fixed successfully', updatedCopy: fixedCopy };
    }

    return { issue, status: 'could_not_fix', message: 'Could not auto-fix this issue. Open editor to fix manually.' };
  }, [nodes, funnelContext, setNodes, setSaveStatus, saveCopyForNode, loadCopyForNode]);

  /** Fix all issues of a given severity. */
  const handleFixAllBySeverity = useCallback((severity: 'critical' | 'warning'): FixResult[] => {
    const fixes = fixAllIssuesOfSeverity(nodes, funnelContext as FunnelContext, severity, analyzeCopy);
    const results: FixResult[] = [];
    fixes.forEach((fixedCopy, nodeId) => {
      saveCopyForNode(nodeId, fixedCopy);
      results.push({
        issue: { nodeId, nodeTitle: '', stepType: '', severity, issueType: 'generic_filler' as any, message: '', fixable: 'auto' as const },
        status: 'fixed',
        message: `Fixed ${severity} issues for node`,
        updatedCopy: fixedCopy,
      });
    });
    setNodes(nds => nds.map(n => {
      const fixedCopy = fixes.get(n.id);
      if (fixedCopy) return { ...n, data: { ...n.data, copy: fixedCopy, _copyUpdated: Date.now() } };
      return n;
    }));
    setSaveStatus('unsaved');
    return results;
  }, [nodes, funnelContext, setNodes, setSaveStatus, saveCopyForNode]);

  return { handleFixIssue, handleFixAllBySeverity };
}
