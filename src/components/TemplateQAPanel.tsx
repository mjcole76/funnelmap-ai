'use client';
import React, { useMemo } from 'react';
import { X, AlertTriangle, AlertCircle, CheckCircle, Info, Edit3, Wrench } from 'lucide-react';
import { analyzeTemplate, templateQAScore, templateQASummary } from '../lib/templateQA';
import type { TemplateQualityIssue } from '../types/qa';
import type { PlacedBlock } from '../lib/templateBlocks';
import { createPlacedBlock } from '../lib/templateBlocks';

interface TemplateQAPanelProps {
  blocks: PlacedBlock[];
  stepType: string;
  onClose: () => void;
  onSelectBlock: (instanceId: string) => void;
  onFixIssue: (issue: TemplateQualityIssue, blocks: PlacedBlock[]) => PlacedBlock[];
}

export default function TemplateQAPanel({ blocks, stepType, onClose, onSelectBlock, onFixIssue }: TemplateQAPanelProps) {
  const issues = useMemo(() => analyzeTemplate(blocks, stepType), [blocks, stepType]);
  const score = useMemo(() => templateQAScore(issues), [issues]);
  const summary = useMemo(() => templateQASummary(issues), [issues]);

  const scoreColor = score >= 80 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600';
  const scoreBg = score >= 80 ? 'bg-green-50 border-green-200' : score >= 50 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200';

  const criticalIssues = issues.filter(i => i.severity === 'critical');
  const warningIssues = issues.filter(i => i.severity === 'warning');
  const infoIssues = issues.filter(i => i.severity === 'info');

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-orange-50 to-amber-50">
        <h3 className="font-bold text-sm text-gray-900">🔍 Template QA</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
      </div>

      {/* Score */}
      <div className={`mx-4 mt-4 p-4 rounded-xl border ${scoreBg}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-3xl font-black ${scoreColor}`}>{score}</div>
            <div className="text-xs text-gray-500">Template QA Score</div>
          </div>
          <div className="text-right space-y-1">
            {summary.critical > 0 && (
              <div className="flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="w-3 h-3" /> {summary.critical} critical
              </div>
            )}
            {summary.warning > 0 && (
              <div className="flex items-center gap-1 text-xs text-yellow-600">
                <AlertTriangle className="w-3 h-3" /> {summary.warning} warning{summary.warning > 1 ? 's' : ''}
              </div>
            )}
            {summary.info > 0 && (
              <div className="flex items-center gap-1 text-xs text-blue-600">
                <Info className="w-3 h-3" /> {summary.info} info
              </div>
            )}
            {summary.passed > 0 && (
              <div className="flex items-center gap-1 text-xs text-green-600">
                <CheckCircle className="w-3 h-3" /> {summary.passed} passed
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Issues */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {issues.length === 0 && (
          <div className="text-center py-8 text-green-600">
            <CheckCircle className="w-8 h-8 mx-auto mb-2" />
            <p className="font-medium text-sm">All checks passed!</p>
            <p className="text-xs text-gray-500 mt-1">Template looks good to go.</p>
          </div>
        )}

        {/* Critical */}
        {criticalIssues.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-red-600 uppercase tracking-wide mb-1">Critical</h4>
            {criticalIssues.map(iss => (
              <IssueCard key={iss.id} issue={iss} onSelect={onSelectBlock} onFix={() => onFixIssue(iss, blocks)} />
            ))}
          </div>
        )}

        {/* Warnings */}
        {warningIssues.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-yellow-600 uppercase tracking-wide mb-1 mt-3">Warnings</h4>
            {warningIssues.map(iss => (
              <IssueCard key={iss.id} issue={iss} onSelect={onSelectBlock} onFix={() => onFixIssue(iss, blocks)} />
            ))}
          </div>
        )}

        {/* Info */}
        {infoIssues.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1 mt-3">Info</h4>
            {infoIssues.map(iss => (
              <IssueCard key={iss.id} issue={iss} onSelect={onSelectBlock} onFix={() => onFixIssue(iss, blocks)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function IssueCard({ issue, onSelect, onFix }: { issue: TemplateQualityIssue; onSelect: (id: string) => void; onFix: () => void }) {
  const severityIcon = issue.severity === 'critical'
    ? <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
    : issue.severity === 'warning'
    ? <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
    : <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />;

  const borderColor = issue.severity === 'critical' ? 'border-red-200 bg-red-50/50' : issue.severity === 'warning' ? 'border-yellow-200 bg-yellow-50/50' : 'border-blue-100 bg-blue-50/30';

  return (
    <div className={`border rounded-lg p-2.5 mb-1.5 ${borderColor}`}>
      <div className="flex items-start gap-2">
        {severityIcon}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-800 leading-relaxed">{issue.message}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">{issue.blockLabel}</p>
        </div>
      </div>
      <div className="flex gap-1.5 mt-2 ml-6">
        {issue.autoFixable && (
          <button onClick={onFix} className="flex items-center gap-1 text-[10px] px-2 py-1 bg-white border border-gray-200 rounded text-gray-700 hover:bg-gray-50">
            <Wrench className="w-3 h-3" /> Fix
          </button>
        )}
        {issue.blockInstanceId && (
          <button onClick={() => onSelect(issue.blockInstanceId)} className="flex items-center gap-1 text-[10px] px-2 py-1 bg-white border border-gray-200 rounded text-gray-700 hover:bg-gray-50">
            <Edit3 className="w-3 h-3" /> Edit Block
          </button>
        )}
      </div>
    </div>
  );
}
