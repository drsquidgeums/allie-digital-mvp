

## Plan: Increase AI Credit Limits + Fix Runtime Error

### 1. Bump monthly AI credits to 25 per provider

Update `PROVIDER_LIMITS` in two files:

- **`supabase/functions/_shared/ai-usage.ts`** — change `openai: 15, anthropic: 15, elevenlabs: 10` to `openai: 25, anthropic: 25, elevenlabs: 25`
- **`supabase/functions/manage-api-keys/index.ts`** — same change to its duplicate `PROVIDER_LIMITS` constant

### 2. Fix "Rendered more hooks than during the previous render" crash

The `STTToggleButton` component has a hooks ordering issue — `useEditorContent` likely returns conditionally, causing `useInlineDictation` and `useCallback` to run a different number of times between renders. The fix is to ensure all hooks are called unconditionally before any early returns or conditional logic.

### Files to edit
- `supabase/functions/_shared/ai-usage.ts` (credit limits)
- `supabase/functions/manage-api-keys/index.ts` (credit limits)
- `src/components/document-viewer/toolbar/STTToggleButton.tsx` (hooks fix)

