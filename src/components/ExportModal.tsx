'use client';
import React, { useState } from 'react';
import { X, FileText, Code, Database, Download } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: any[];
  edges: any[];
  funnelContext: any;
}

function buildOfferBrief(ctx: any): string {
  return [
    `# Offer Brief`,
    ``,
    `- **Product Name:** ${ctx.productName || 'Not set'}`,
    `- **Audience:** ${ctx.audience || 'Not set'}`,
    `- **Price:** ${ctx.price || 'Not set'}`,
    `- **Problem:** ${ctx.problem || 'Not set'}`,
    `- **Outcome / Goal:** ${ctx.goal || 'Not set'}`,
    `- **Offer Type:** ${ctx.offerType || 'Not set'}`,
    `- **Funnel Name:** ${ctx.funnelName || 'My Funnel'}`,
  ].join('\n');
}

function buildFunnelMap(nodes: any[], edges: any[]): string {
  let md = `\n\n# Funnel Map\n\n`;
  md += `| # | Step | Type | Template | CTA | Price |\n`;
  md += `|---|------|------|----------|-----|-------|\n`;
  nodes.forEach((n, i) => {
    const tpl = (n.data.previewTemplate || 'default').split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    md += `| ${i+1} | ${n.data.title || 'Untitled'} | ${n.data.type || ''} | ${tpl} | ${n.data.buttonText || ''} | ${n.data.price || ''} |\n`;
  });

  // Flow
  md += `\n## Flow\n\n`;
  edges.forEach(e => {
    const src = nodes.find((n: any) => n.id === e.source);
    const tgt = nodes.find((n: any) => n.id === e.target);
    if (src && tgt) {
      md += `- ${src.data.title} → ${e.label || 'Next'} → ${tgt.data.title}\n`;
    }
  });
  return md;
}

function getCopyForNode(node: any): any {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(`funnel-copy-${node.id}`);
    if (saved) { try { return JSON.parse(saved); } catch { /* */ } }
  }
  return node.data.copy || null;
}

function buildFullCopy(nodes: any[]): string {
  let md = `\n\n# Full Page Copy\n`;
  nodes.forEach((n, i) => {
    const copy = getCopyForNode(n);
    md += `\n---\n\n## ${i+1}. ${n.data.title} — ${n.data.type}\n\n`;
    if (!copy) {
      md += `*No copy generated for this page.*\n`;
      return;
    }
    if (copy.headline) md += `### ${copy.headline}\n\n`;
    if (copy.cta || copy.button) md += `**CTA:** ${copy.cta || copy.button}\n\n`;
    const sections = copy.sections || [];
    if (sections.length > 0) {
      sections.forEach((s: any) => {
        if (s.title) md += `#### ${s.title}\n\n`;
        if (s.content) md += `${s.content}\n\n`;
      });
    } else if (copy.body) {
      md += `${copy.body}\n\n`;
    }
  });
  return md;
}

function buildMarkdownExport(nodes: any[], edges: any[], ctx: any): string {
  return buildOfferBrief(ctx) + buildFunnelMap(nodes, edges) + buildFullCopy(nodes);
}

function buildHTMLPage(node: any, ctx: any, idx: number): string {
  const copy = getCopyForNode(node);
  const title = node.data.title || 'Page';
  const stepType = node.data.type || '';
  const color = '#3b82f6';

  let bodyHTML = '';
  if (!copy) {
    bodyHTML = `<div style="text-align:center;padding:60px 20px;color:#666"><h2>No copy generated</h2><p>Generate copy in FunnelMap AI first.</p></div>`;
  } else {
    const headline = copy.headline || title;
    const cta = copy.cta || copy.button || 'Get Started';
    const sections = copy.sections || [];
    const bodyText = copy.body || '';

    bodyHTML += `<div style="background:linear-gradient(135deg,#1e293b,#312e81);color:white;padding:60px 20px;text-align:center">`;
    bodyHTML += `<h1 style="font-size:2.5rem;font-weight:800;margin-bottom:16px">${escapeHTML(headline)}</h1>`;
    bodyHTML += `<a href="#" style="display:inline-block;background:${color};color:white;padding:16px 32px;border-radius:12px;font-weight:700;font-size:1.1rem;text-decoration:none;margin-top:20px">${escapeHTML(cta)}</a>`;
    bodyHTML += `</div>`;

    if (sections.length > 0) {
      sections.forEach((s: any) => {
        bodyHTML += `<div style="padding:40px 20px;max-width:700px;margin:0 auto">`;
        if (s.title) bodyHTML += `<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:16px">${escapeHTML(s.title)}</h2>`;
        if (s.content) {
          const lines = s.content.split('\n');
          lines.forEach((line: string) => {
            const trimmed = line.trim();
            if (!trimmed) return;
            if (/^[•\-✓✅]/.test(trimmed)) {
              bodyHTML += `<p style="padding:8px 0;display:flex;align-items:flex-start"><span style="color:#22c55e;margin-right:8px;font-weight:bold">✓</span> ${escapeHTML(trimmed.replace(/^[•\-✓✅]\s*/, ''))}</p>`;
            } else if (trimmed.startsWith('Q:') || trimmed.startsWith('q:')) {
              bodyHTML += `<p style="font-weight:700;margin-top:16px">${escapeHTML(trimmed)}</p>`;
            } else if (trimmed.startsWith('A:') || trimmed.startsWith('a:')) {
              bodyHTML += `<p style="color:#555;margin-bottom:12px">${escapeHTML(trimmed)}</p>`;
            } else {
              bodyHTML += `<p style="color:#444;line-height:1.7;margin-bottom:12px">${escapeHTML(trimmed)}</p>`;
            }
          });
        }
        bodyHTML += `</div>`;
      });
    } else if (bodyText) {
      bodyHTML += `<div style="padding:40px 20px;max-width:700px;margin:0 auto">`;
      bodyText.split('\n').forEach((line: string) => {
        const t = line.trim();
        if (t) bodyHTML += `<p style="color:#444;line-height:1.7;margin-bottom:12px">${escapeHTML(t)}</p>`;
      });
      bodyHTML += `</div>`;
    }

    bodyHTML += `<div style="background:#f8fafc;padding:40px 20px;text-align:center;border-top:1px solid #e5e7eb">`;
    bodyHTML += `<a href="#" style="display:inline-block;background:${color};color:white;padding:16px 32px;border-radius:12px;font-weight:700;font-size:1.1rem;text-decoration:none">${escapeHTML(cta)}</a>`;
    bodyHTML += `</div>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHTML(title)} — ${escapeHTML(stepType)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; }
  a { transition: opacity 0.2s; }
  a:hover { opacity: 0.9; }
</style>
</head>
<body>
${bodyHTML}
<footer style="text-align:center;padding:20px;color:#999;font-size:0.75rem">Generated by FunnelMap AI</footer>
</body>
</html>`;
}

function escapeHTML(str: string): string {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function buildJSONBackup(nodes: any[], edges: any[], ctx: any): string {
  const backup: any = {
    version: '5.1',
    exportedAt: new Date().toISOString(),
    offerBrief: ctx,
    funnelMap: {
      nodes: nodes.map(n => ({
        id: n.id,
        type: n.data.type,
        title: n.data.title,
        template: n.data.previewTemplate,
        headline: n.data.headline,
        buttonText: n.data.buttonText,
        price: n.data.price,
        position: n.position,
      })),
      edges: edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
      })),
    },
    generatedCopy: {} as Record<string, any>,
  };
  nodes.forEach(n => {
    backup.generatedCopy[n.id] = getCopyForNode(n) || null;
  });
  return JSON.stringify(backup, null, 2);
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadZip(files: {name: string; content: string}[], zipName: string) {
  // Simple approach: download each file individually since we can't bundle a zip without a library
  // Actually, let's just create a single concatenated HTML with links
  let indexHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Funnel Pages</title>
<style>body{font-family:sans-serif;max-width:600px;margin:40px auto;padding:0 20px}a{display:block;padding:12px 16px;margin:8px 0;background:#f1f5f9;border-radius:8px;color:#1e40af;text-decoration:none;font-weight:500}a:hover{background:#e2e8f0}</style>
</head><body><h1>Funnel Pages</h1><p>Open each page below:</p>`;
  files.forEach(f => {
    indexHTML += `<a href="${f.name}">${f.name}</a>`;
  });
  indexHTML += `</body></html>`;

  // Download each file
  files.forEach(f => downloadFile(f.content, f.name, 'text/html'));
  downloadFile(indexHTML, 'index.html', 'text/html');
}

export default function ExportModal({ isOpen, onClose, nodes, edges, funnelContext }: ExportModalProps) {
  const [exporting, setExporting] = useState<string | null>(null);

  if (!isOpen) return null;

  const slug = (funnelContext?.funnelName || 'funnel').toLowerCase().replace(/\s+/g, '-');

  const handleExportMarkdown = () => {
    setExporting('markdown');
    const md = buildMarkdownExport(nodes, edges, funnelContext);
    downloadFile(md, `${slug}-export.md`, 'text/markdown');
    setTimeout(() => setExporting(null), 500);
  };

  const handleExportHTML = () => {
    setExporting('html');
    const files = nodes.map((n, i) => {
      const name = `${String(i+1).padStart(2,'0')}-${(n.data.title || 'page').toLowerCase().replace(/\s+/g, '-')}.html`;
      return { name, content: buildHTMLPage(n, funnelContext, i) };
    });
    downloadZip(files, `${slug}-pages`);
    setTimeout(() => setExporting(null), 1000);
  };

  const handleExportJSON = () => {
    setExporting('json');
    const json = buildJSONBackup(nodes, edges, funnelContext);
    downloadFile(json, `${slug}-backup.json`, 'application/json');
    setTimeout(() => setExporting(null), 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">Export Funnel</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-3">
          <p className="text-sm text-gray-600 mb-4">Choose an export format. All exports include the Offer Brief, Funnel Map, and generated copy.</p>

          {/* Markdown */}
          <button onClick={handleExportMarkdown} disabled={!!exporting} className="w-full flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left group disabled:opacity-50">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-blue-200 transition-colors"><FileText className="w-5 h-5 text-blue-600" /></div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Markdown</h3>
              <p className="text-sm text-gray-500">Complete funnel document — Offer Brief, Map, and all copy in one .md file</p>
            </div>
            <Download className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
          </button>

          {/* HTML Bundle */}
          <button onClick={handleExportHTML} disabled={!!exporting} className="w-full flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left group disabled:opacity-50">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-purple-200 transition-colors"><Code className="w-5 h-5 text-purple-600" /></div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">HTML Pages</h3>
              <p className="text-sm text-gray-500">Standalone HTML file per page — editable, hostable, CSS included</p>
            </div>
            <Download className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
          </button>

          {/* JSON Backup */}
          <button onClick={handleExportJSON} disabled={!!exporting} className="w-full flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left group disabled:opacity-50">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-amber-200 transition-colors"><Database className="w-5 h-5 text-amber-600" /></div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">JSON Backup</h3>
              <p className="text-sm text-gray-500">Full backup — structure, nodes, edges, Offer Brief, templates, and all copy</p>
            </div>
            <Download className="w-5 h-5 text-gray-400 group-hover:text-amber-600" />
          </button>
        </div>

        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 text-center">
          <p className="text-xs text-gray-500">{nodes.length} pages • {nodes.filter(n => getCopyForNode(n)).length} with copy</p>
        </div>
      </div>
    </div>
  );
}
