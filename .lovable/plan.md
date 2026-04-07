

## Plan: Remove Anthropic from the App + Cost Efficiency Notes

### Why
No features in the app actually use Anthropic. The `FEATURE_PROVIDER_MAP` maps everything to either `openai` or `elevenlabs`. Anthropic credits are fully dormant, so displaying them misleads users and adds clutter.

### Cost Efficiency Summary
After removing Anthropic, the app has two real cost centers:
- **OpenAI features** (text simplifier, document chat, study buddy, etc.) — routed through the free Lovable Gateway (Gemini 2.5 Flash) when no BYOK key is present. The $1/month free AI balance covers ~40-50 users at 25 credits each.
- **ElevenLabs** (TTS, STT, voice assistant) — uses your shared API key. This is the tightest bottleneck; the free tier (10k chars/month) supports only a handful of active users. BYOK is critical here.

The 25-credit allocation per provider is reasonable for a free tier. The BYOK flow is essential for power users and keeps your costs at zero for those users.

### Changes

**1. Remove Anthropic from backend usage tracking**

Files: `supabase/functions/_shared/ai-usage.ts`, `supabase/functions/manage-api-keys/index.ts`
- Remove `anthropic` from `PROVIDER_LIMITS`
- Remove `anthropic` from the `providerUsage` counter object
- Remove `"anthropic"` from the valid provider list in save/delete validation

**2. Remove Anthropic from sidebar credits widget**

File: `src/components/sidebar/SidebarAICredits.tsx`
- Remove the `anthropic` entry from `providerConfig`
- Remove the `anthropic` fallback from the placeholder `providers` array

**3. Remove Anthropic from AI Settings panel**

File: `src/components/settings/AISettings.tsx`
- Remove the `anthropic` entry from `providerMeta`
- Remove the `Brain` icon import if no longer used

**4. Remove Anthropic from API Key Tutorial Modal**

File: `src/components/settings/APIKeyTutorialModal.tsx`
- Remove the entire Anthropic provider tutorial section (the object with `id: "anthropic"`)

**5. Remove Anthropic from Privacy Policy**

File: `src/pages/Privacy.tsx`
- Remove the two Anthropic bullet points (data processing and third-party sharing sections)

**6. Remove Anthropic from Onboarding tour**

File: `src/contexts/OnboardingContext.tsx`
- Update the tour step description to remove the Anthropic mention, keeping just "OpenAI and ElevenLabs"

**7. Remove Anthropic from toolbar indicator** (minor)

File: `src/components/document-viewer/toolbar/AICreditsIndicator.tsx`
- No direct Anthropic references here; it reads from the hook which will no longer return Anthropic data. No changes needed.

### Files to edit (6 files)
1. `supabase/functions/_shared/ai-usage.ts`
2. `supabase/functions/manage-api-keys/index.ts`
3. `src/components/sidebar/SidebarAICredits.tsx`
4. `src/components/settings/AISettings.tsx`
5. `src/components/settings/APIKeyTutorialModal.tsx`
6. `src/pages/Privacy.tsx`
7. `src/contexts/OnboardingContext.tsx`

