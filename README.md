# FunnelMap AI

Visual funnel builder with AI-powered copy generation. Design your sales funnel, write conversion-focused copy for every page, QA it, preview it, and export standalone HTML.

## What It Does

FunnelMap AI is a drag-and-drop funnel mapping tool that generates real sales copy based on your offer brief. No generic filler — copy is generated from your actual product, audience, price, problem, and desired outcome.

### Core Workflow

```
Offer Brief → Funnel Map → Write Full Funnel → QA → Preview → Export
```

1. **Fill your Offer Brief** — product name, audience, price, problem, goal
2. **Generate a funnel map** — auto-creates the right steps for your offer type
3. **Write Full Funnel** — generates copy for every page based on your brief
4. **QA Check** — automated quality report flags issues (missing data, weak CTAs, filler)
5. **Preview** — see each page rendered with real copy
6. **Export** — download as HTML pages, JSON, or offer brief

## Features

### Funnel Builder
- Drag-and-drop canvas (ReactFlow)
- 12 step types: Landing Page, Sales Page, Checkout, Order Bump, Upsell, Downsell, Thank You, Email Follow-up, Webinar, Survey, Application, Booking
- Auto-generate funnel structure from offer type
- Visual node connections with labeled edges
- Auto-arrange (topological sort)
- Template library with pre-built funnel layouts

### Copy Engine
- Generates page-specific copy from your offer brief
- Per-step-type templates (hero, problem, solution, benefits, features, pricing, CTA, etc.)
- Layout-aware generation — respects your block order from Template Builder
- Blocked phrase detection (removes AI-sounding filler)
- 5 page styles: Bold Direct Response, Clean SaaS, Editorial Letter, Compact Tripwire, Premium Minimal

### Template Builder (28 blocks)
- **Core:** Hero, Problem/Pain, Solution
- **Sales:** Benefits, Features, Bonus Stack, Before/After
- **Trust:** Social Proof, Guarantee, FAQ, About/Story, Objection Handler
- **Conversion:** Pricing, Final CTA, Urgency/Scarcity
- **Media:** Image, Video Embed, Product Mockup, Logo Row
- **Layout:** Two Columns, Three Columns, Card Grid, Split Image/Text, Full-Width, Dark Section, Callout Box
- **Buttons:** Standalone Button, Button Group

Each block has full style controls:
- Section: background, text color, accent, border, shadow, padding, width, alignment
- Typography: headline size, body size, font weight
- Button: text, URL, colors, size, width, radius
- Image: URL, alt, aspect ratio, position, width
- Video: URL, embed, thumbnail, aspect ratio, autoplay
- Columns: ratio, mobile stack, gap

### Reusable Templates
- Save any layout as a named template
- Use templates across different funnel steps
- Duplicate, delete, export (JSON), import templates

### Page Editor
- Inline editing of generated copy
- Edit headline, CTA, and all sections
- Reorder, add, remove sections
- Undo all changes
- Regenerate (layout-aware)

### Copy QA
- Auto-detects: missing product name, missing audience, missing price, blocked phrases, generic filler, fake proof, weak CTAs
- Per-issue auto-fix
- Fix All Critical / Fix All Warnings
- Rerun QA after fixes
- Fix status: Fixed, Needs Manual Edit, Could Not Fix

### Template QA
- Missing hero, CTA, pricing (on paid pages), guarantee
- Empty image/video URLs
- Button with no text or URL
- Poor text/background contrast
- Empty blocks
- Too many sections without CTA

### Export
- **HTML Pages** — one standalone file per page, CSS included, hostable anywhere
- **JSON** — full funnel state
- **Offer Brief** — text summary of your offer setup

## Run Locally

```bash
cd app
npm install
npm run dev
```

Open `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

Output goes to `out/` (static export).

## How It Works

### localStorage Persistence

All state is saved to `localStorage` under `funnelmap-ai-state`:
- Nodes (position, type, data)
- Edges (connections)
- Funnel context (offer brief)
- Published state

Per-node copy: `funnel-copy-{nodeId}`
Per-node layout: `funnel-layout-{nodeId}`
Custom templates: `funnel-custom-templates`

No backend, no database, no auth. Everything runs client-side.

### Templates

Two template systems:
1. **Funnel Templates** — pre-built funnel structures (step order + edge connections)
2. **Page Templates** — per-page block layouts with full style settings (saved as JSON)

### Architecture

```
src/
  app/page.tsx            — Main page, layout + hook wiring (~260 lines)
  hooks/                  — Custom hooks for state management
    useFunnelStorage.ts   — localStorage persistence, auto-save
    useCopyGeneration.ts  — Copy generation + layout-aware gen
    useQualityReport.ts   — QA fix management
    useFunnelGeneration.ts — Funnel creation from brief + auto-arrange
    useTemplateManager.ts — Template Builder state
    usePageEditor.ts      — Page Editor state
    useExportManager.ts   — Export modal state
  types/                  — Shared TypeScript types
    funnel.ts             — FunnelContext, FunnelNodeData, FunnelStepType, FunnelTemplate
    copy.ts               — GeneratedCopy, CopySection, ParsedCopy
    template.ts           — PlacedBlock, BlockStyles, SavedTemplate
    qa.ts                 — QualityIssue, FixResult, TemplateQualityIssue
    export.ts             — ExportFormat, ExportFile, ExportOptions
  lib/
    copyTemplates.ts      — Copy generation engine
    templateBlocks.ts     — Block definitions, styles, HTML rendering
    qaFixEngine.ts        — Per-issue fix logic
    templateQA.ts         — Template structural quality checks
  components/             — UI components
__tests__/                — Vitest test suite
  copyTemplates.test.ts   — Copy generation tests
  templateBlocks.test.ts  — Block + template save/load tests
  templateQA.test.ts      — Template quality checks
```

### Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build (static export)
npm run test         # Run all tests
npm run test:watch   # Run tests in watch mode
npm run check        # Lint + test + build (smoke test)
```

## Known Limitations

- Client-side only — no backend, no multi-device sync
- Copy generation is template-based, not LLM-powered (fast but not infinite variety)
- No undo history (Ctrl+Z) for canvas operations
- No drag reordering in Template Builder (use up/down arrows)
- Custom templates are stored in localStorage (clear browser = lose templates)
- No real-time collaboration
- No custom fonts or font import
- Export HTML is self-contained but not a full website framework

## Roadmap

- [ ] My Funnels — save/load multiple funnels
- [ ] Try Demo Funnel — one-click example funnel
- [ ] Custom domain publishing
- [ ] Stripe payment integration
- [ ] User auth + cloud persistence
- [ ] LLM-powered copy generation (optional)
- [ ] Drag reorder in Template Builder
- [ ] Undo/redo for canvas
- [ ] A/B copy variants
- [ ] Analytics integration

## Tech Stack

- Next.js 16 (static export)
- React 19
- ReactFlow (canvas)
- Tailwind CSS
- TypeScript
- localStorage (persistence)

## License

Private — not open source.
