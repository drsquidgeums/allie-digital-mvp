

## Language Switcher Fix Plan

### The Problem

There are two issues causing labels to remain in English after switching languages:

1. **Hardcoded strings not using translation keys** — Several components use plain English strings instead of `t()` calls
2. **Missing translation keys** — The non-English locale files (`es`, `de`, `fr`) are missing many keys that exist in `en-GB`, so even where `t()` is used, it falls back to English

### Hardcoded Strings to Fix

| File | Hardcoded String | Fix |
|------|-----------------|-----|
| `ToolbarTools.tsx` (line 64) | `"AI Simplify"` | Use `t('tools.rewordify')` |
| `ToolbarTools.tsx` (line 73) | `"Document AI"` | Add key `tools.documentAI`, use `t()` |
| `ToolbarTools.tsx` (line 96) | `"Learning AI"` | Add key `tools.learningAI`, use `t()` |
| `SidebarTools.tsx` (line 73) | `"Feedback"` | Add key `navigation.feedback`, use `t()` |
| `SidebarAICredits.tsx` (line 83) | `"AI Credits — click to manage in Settings"` | Add key, use `t()` |

### Missing Translation Keys

The `es`, `de`, and `fr` locale files are missing entire sections that exist in `en-GB`:

- `settings.account.*` (all account-related settings)
- `tasks.aiAssistant`, `tasks.aiDescription`, `tasks.suggestions`, `tasks.schedule`, `tasks.optimise`, etc.
- `chat.studyBuddyTitle`, `chat.studyBuddyDescription`
- `common.cancel`, `common.save`, `common.delete`, `common.edit`, `common.close`
- `mindMap.*`
- `navigation.progress`
- New tool keys: `tools.documentAI`, `tools.learningAI`
- `tools.colour` is `tools.color` in es/de/fr (key mismatch)
- `navigation.feedback`

### Key Mismatch: `tools.colour` vs `tools.color`

The `en-GB` file uses `tools.colour` but `es`, `de`, `fr` use `tools.color`. Need to standardise to `tools.colour` across all files.

### Implementation Steps

1. **Fix hardcoded strings in components** — Replace with `t()` calls, adding new translation keys where needed
2. **Add missing keys to `en-GB/translation.json`** — For new keys like `tools.documentAI`, `tools.learningAI`, `navigation.feedback`
3. **Update `es/translation.json`** — Add all missing translated keys
4. **Update `de/translation.json`** — Add all missing translated keys
5. **Update `fr/translation.json`** — Add all missing translated keys
6. **Fix the `tools.color` → `tools.colour` key mismatch** in es/de/fr files

This will ensure that when a user switches language in Settings, all visible UI labels update correctly.

