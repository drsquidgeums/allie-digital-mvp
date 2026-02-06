
# Plan: Fix Storage Limit and Verify Translations

## Issues Identified

### 1. Incorrect Storage Limit
The settings page shows **5 GB** as the storage limit, but the actual **Supabase free tier limit is 1 GB**.

### 2. Translation Loading (Potential Cache Issue)
The translation files appear correctly configured with UK spellings. If raw keys are still showing, it's likely a browser cache issue with the old translation files.

---

## Implementation Steps

### Step 1: Fix Storage Limit in StorageSettings.tsx
Update the default storage limit from 5 GB to 1 GB to match Supabase's free tier:

**File:** `src/components/settings/StorageSettings.tsx`
- Change line 13 from `5 * 1024 * 1024 * 1024` to `1 * 1024 * 1024 * 1024`
- Update the comment to reflect "1GB default (Supabase free tier)"

### Step 2: Ensure Translation Files Load Fresh
Add a cache-busting mechanism to the i18n configuration to prevent stale translation files:

**File:** `src/i18n/config.ts`
- Add a version query parameter to the `loadPath` to bust browser cache

---

## Technical Details

### Storage Limit Change
```typescript
// Before
const [storageLimit, setStorageLimit] = useState(5 * 1024 * 1024 * 1024); // 5GB default

// After  
const [storageLimit, setStorageLimit] = useState(1 * 1024 * 1024 * 1024); // 1GB (Supabase free tier)
```

### i18n Cache Busting
```typescript
backend: {
  loadPath: '/locales/{{lng}}/translation.json?v=' + Date.now(),
}
```

---

## Verification After Implementation
1. Navigate to Settings and confirm storage shows "X / 1 GB" instead of "X / 5 GB"
2. Hard refresh the page to ensure translations load correctly
3. Verify UK spellings appear throughout the app (e.g., "Organise", "Visualise")
