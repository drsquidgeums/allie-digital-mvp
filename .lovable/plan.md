

# Security Cleanup: Remove Dead Code & Unused Dependencies

## What Aikido Found
Many of the remaining vulnerabilities are in packages/code that are installed but **never actually used** in the application. Removing them eliminates the vulnerabilities entirely.

## Plan

### 1. Remove Unused npm Packages
These packages exist in `package.json` but have **zero imports** anywhere in the codebase:

| Package | Why it's flagged | Status |
|---------|-----------------|--------|
| `openai` | "Found an OpenAI API Key" — the npm package bundles an API key pattern. AI calls go through edge functions, not client-side SDK | **Zero imports** — remove |
| `pdfkit` | Unused PDF generation library | **Zero imports** — remove |
| `pspdfkit` | Only used in dead `PSPDFKitViewer` component (see below) | Remove with dead code |
| `selection.js` | Selection library | **Zero imports** — remove |
| `react-pdf-highlighter-extended` | Extended highlighter lib | **Zero imports** — remove |
| `rangy` | Only used in dead `PdfHighlighter.ts/.tsx` files (see below) | Remove with dead code |

### 2. Delete Dead Code Files
These components are defined but **never imported or used** anywhere in the app:

- `src/components/document-viewer/viewers/pdf/PdfHighlighter.ts` — rangy-based highlighter (unused)
- `src/components/document-viewer/viewers/pdf/PdfHighlighter.tsx` — duplicate rangy-based highlighter (unused)
- `src/components/document-viewer/viewers/pdf/SimplePdfHighlighter.tsx` — never imported
- `src/components/document-viewer/viewers/pdf/PdfDocumentLoader.tsx` — never imported
- `src/components/document-viewer/viewers/pdf/components/PSPDFKitViewer.tsx` — never imported
- `src/components/document-viewer/viewers/pdf/components/CustomPDFViewer/index.ts` — barrel file importing PSPDFKit styles for an unused component

### 3. Upgrade Remaining Flagged Dependencies
For packages that ARE used but have known vulnerabilities:

- `pdfjs-dist` — upgrade from 3.4.120 to latest compatible version
- `lodash-es` / `lodash` — check if used; upgrade if so
- `nanoid` — transitive dep, upgrade via parent packages
- `markdown-it` — transitive dep, upgrade via parent packages

### 4. Accepted Risks (No Action)
These are build-time/dev-only tools not shipped to production:
- `vite`, `rollup`, `@babel/runtime`, `tar`, `minimatch`, `brace-expansion` — dev dependencies, not in production bundle

## Impact
- Removes ~6 unused packages from `package.json`
- Deletes ~6 dead code files
- Directly resolves multiple Aikido findings by eliminating the vulnerable code/dependencies entirely
- No functional changes to the app — all removed code is confirmed unused

