# Google Business Lookup Flow (WebsiteLeakDetector.com)

## Recommended architecture

- **Frontend orchestration**: `GoogleBusinessResolverOrchestrator` controls UX states (auto-match, confidence handling, manual fallback, result selection).
- **Backend API routes**:
  - `POST /api/google-business/resolve` for automatic identity extraction + candidate scoring.
  - `POST /api/google-business/search` for manual lookup by business name + city/state.
  - `POST /api/google-business/details` for canonical place details fetch after user selection.
- **Domain logic layer** (`lib/googleBusinessResolver.ts`):
  - identity extraction (`extractBusinessIdentityFromScan`)
  - Google Places calls (`searchGoogleBusinesses`, `getGoogleBusinessDetails`)
  - matching score engine (`scoreBusinessMatch`, `rankCandidates`)

## Frontend flow

1. **Website scan finished**
2. App calls `POST /api/google-business/resolve` with scan payload.
3. If confidence is **high**:
   - Show compact confirmation card.
   - CTA: **Yes, continue** or **Not the right business**.
4. If confidence is **medium**:
   - Show helper message + manual form + top candidates list.
5. If confidence is **low**:
   - Skip auto-select, immediately show manual form.
6. Manual submit calls `POST /api/google-business/search`.
7. Selecting a result calls `POST /api/google-business/details`.
8. Persist selected business `resourceName` / `id` and continue report flow.

## Backend/service flow

1. `resolve` route receives `scanData`.
2. `extractBusinessIdentityFromScan(scanData)` derives normalized identity.
3. Search query built from `businessName + city + state`.
4. Call Google Places Text Search (New) with strict field mask.
5. Score each candidate using weighted rules.
6. Return:
   - `high`: `topMatch` + confirmation copy.
   - `medium`: top 3 candidates.
   - `low`: manual fallback copy.
7. `details` route fetches final details from `places/{resource}` with field mask.

## Matching/scoring pseudocode

```ts
score = 0
if name similar -> +35
if city matches address -> +15
if phone matches -> +20
if website domain matches -> +20
if address similar -> +15
if embedded google hint matches maps uri -> +10

if score >= 70 => high confidence
else if score >= 45 => medium confidence
else => low confidence
```

## React component structure

- `GoogleBusinessResolverOrchestrator`
  - owns request + state machine
  - renders:
    - `BusinessMatchConfirmationCard`
    - `ManualBusinessSearchForm`
    - `BusinessSearchResultsList`
- Components are mobile-first Tailwind cards, single-column by default.

## API route examples

### Auto resolve

`POST /api/google-business/resolve`

```json
{
  "scanData": {
    "businessName": "Example Dental",
    "city": "Austin",
    "state": "TX",
    "phoneNumbers": ["(512) 555-1234"],
    "websiteUrl": "https://www.exampledental.com"
  }
}
```

### Manual search

`POST /api/google-business/search`

```json
{
  "query": "Example Dental",
  "city": "Austin",
  "state": "TX"
}
```

### Place details fetch

`POST /api/google-business/details`

```json
{
  "place": "places/ChIJ..."
}
```

## Edge cases

- Missing business name in scan → immediate manual form.
- Google API timeout/error → friendly retry copy while preserving form input.
- No search results → keep form visible and editable.
- Duplicate business names in same city → show multiple cards with address/category/rating.
- Domain mismatch with strong name similarity → medium confidence, never silent auto-select.

## Suggested UI copy

- Auto success headline: **"Found your business on Google"**
- Auto fallback: **"We couldn’t confidently match your business."**
- Helper: **"Let’s find it manually."**
- Manual heading: **"Find your business on Google"**
- Empty results: **"No close matches yet — update the details and search again."**
- Generic error: **"We hit a temporary issue. Please try again."**

## Google Places (New) field masks used

Search (`places:searchText`) asks only for:
- id
- name (resource)
- displayName
- formattedAddress
- websiteUri
- nationalPhoneNumber
- rating
- userRatingCount
- businessStatus
- primaryType
- primaryTypeDisplayName
- googleMapsUri
- location

Details (`places/{name}`) asks only for those same fields.
