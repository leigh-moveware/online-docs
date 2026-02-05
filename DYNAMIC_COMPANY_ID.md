# Dynamic Company ID Implementation

## Overview

The system now supports **dynamic company IDs** for multi-tenant functionality. Instead of using a static `MOVEWARE_COMPANY_ID` from environment variables, the company ID is now extracted from the URL parameter `coId`.

## Why This Change?

### Before (Static Company ID)
- ❌ One company ID per deployment
- ❌ Required separate deployments for multiple companies
- ❌ Company ID hardcoded in `.env` file
- ❌ Not suitable for multi-tenant SaaS applications

### After (Dynamic Company ID)
- ✅ Multiple companies on single deployment
- ✅ Company ID passed via URL parameter
- ✅ True multi-tenant architecture
- ✅ Easy to scale to unlimited companies
- ✅ No configuration changes needed per company

## How It Works

### URL Format

```
http://localhost:3000/jobs/{jobId}?coId={companyId}
```

**Example**:
```
http://localhost:3000/jobs/111505?coId=ABC123
```

### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `jobId` | string | Path | Yes | The job/quote ID to display |
| `coId` | string | Query | Yes | The company ID for Moveware API |

## Implementation Details

### 1. Client Creation

The Moveware client now uses a factory pattern:

```typescript
// OLD - Static company ID from environment
const movewareClient = createMovewareClient(process.env.MOVEWARE_COMPANY_ID);

// NEW - Dynamic company ID from request
const companyId = searchParams.get('coId');
const movewareClient = createMovewareClient(companyId);
```

### 2. API Routes

All API routes now extract and validate the company ID:

```typescript
export async function GET(request: NextRequest) {
  // Extract company ID from URL
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get('coId');
  
  // Validate
  if (!companyId) {
    return NextResponse.json(
      { error: 'Company ID (coId) parameter is required' },
      { status: 400 }
    );
  }
  
  // Create client with dynamic company ID
  const movewareClient = createMovewareClient(companyId);
  
  // Use client...
}
```

### 3. Frontend Integration

The quote page extracts the company ID and passes it to all API calls:

```typescript
// Extract from URL
const urlParams = new URLSearchParams(window.location.search);
const coId = urlParams.get('coId');

// Include in all API calls
fetch(`/api/jobs/${jobId}?coId=${coId}`)
fetch(`/api/jobs/${jobId}/inventory?coId=${coId}`)
fetch(`/api/jobs/${jobId}/sync?coId=${coId}`, { method: 'POST' })
```

## Migration Guide

### For Developers

1. **Update `.env` file** (optional, for backward compatibility only):
   ```env
   # Before
   MOVEWARE_COMPANY_ID=ABC123
   
   # After (optional - only for default/legacy support)
   # MOVEWARE_COMPANY_ID=ABC123
   ```

2. **Update quote URLs** to include `coId` parameter:
   ```
   Before: /jobs/111505
   After:  /jobs/111505?coId=ABC123
   ```

3. **No code changes required** if using the updated codebase

### For End Users

Simply add the `coId` parameter to any quote URL:

```
https://quotes.yourcompany.com/jobs/111505?coId=YOUR_COMPANY_ID
```

## API Endpoints

### Job Details
```
GET /api/jobs/{jobId}?coId={companyId}
```

### Inventory
```
GET /api/jobs/{jobId}/inventory?coId={companyId}
```

### Force Sync
```
POST /api/jobs/{jobId}/sync?coId={companyId}
```

## Error Handling

### Missing Company ID

**Request**:
```
GET /api/jobs/111505
```

**Response** (400 Bad Request):
```json
{
  "error": "Company ID (coId) parameter is required"
}
```

### Invalid Company ID

**Request**:
```
GET /api/jobs/111505?coId=INVALID
```

**Response** (404 Not Found):
```json
{
  "error": "Job not found in database or Moveware API"
}
```

## Security Considerations

### Company ID Validation

The system validates company IDs through the Moveware API:
- Invalid company IDs result in API authentication failures
- Each company can only access their own data
- No cross-tenant data leakage

### Best Practices

1. **Validate company IDs** on the server side (already implemented)
2. **Log access attempts** for audit trails
3. **Rate limit** API calls per company ID
4. **Monitor** for suspicious patterns

## Multi-Tenant Architecture

### Database Design

The database stores data from multiple companies:
- Jobs are linked to companies via `brandCode`
- Local cache improves performance for all tenants
- Each company's data is kept separate

### Workflow

```
User Request → Extract coId → Create API Client → 
  Check Database → [Not Found] → Fetch from Moveware → 
  Save to Database → Return Data
```

## Examples

### Company A Accessing Their Data

```bash
curl "http://localhost:3000/api/jobs/111505?coId=COMPANY_A"
```

### Company B Accessing Their Data

```bash
curl "http://localhost:3000/api/jobs/222333?coId=COMPANY_B"
```

### Force Refresh for Company A

```bash
curl -X POST "http://localhost:3000/api/jobs/111505/sync?coId=COMPANY_A"
```

## Testing

### Local Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Access a quote with company ID:
   ```
   http://localhost:3000/jobs/111505?coId=TEST_COMPANY
   ```

3. Check the console for company ID in logs:
   ```
   Fetching from Moveware API (Company: TEST_COMPANY)...
   ```

### Unit Testing

Test the factory function:

```typescript
import { createMovewareClient } from '@/lib/clients/moveware';

test('creates client with specific company ID', () => {
  const client = createMovewareClient('TEST_CO');
  expect(client.getConfig().companyId).toBe('***');
});
```

## Backward Compatibility

For legacy support, you can still use the environment variable:

```env
MOVEWARE_COMPANY_ID=DEFAULT_COMPANY
```

This creates a default client, but the dynamic approach is recommended for new implementations.

## Troubleshooting

### Issue: "Company ID parameter is required"

**Solution**: Ensure `coId` is included in the URL:
```
✗ /jobs/111505
✓ /jobs/111505?coId=ABC123
```

### Issue: "Job not found in Moveware API"

**Possible causes**:
1. Invalid company ID
2. Job doesn't exist for that company
3. Moveware API credentials incorrect
4. Network connectivity issues

**Debug steps**:
1. Check server logs for API errors
2. Verify company ID is correct
3. Test Moveware API credentials
4. Check job exists in Moveware for that company

### Issue: Different companies seeing same data

**Solution**: This shouldn't happen with the new implementation. If it does:
1. Clear database cache
2. Check that `coId` is being passed correctly
3. Verify API routes are using dynamic company ID
4. Check logs to confirm correct company ID is being used

## Future Enhancements

Potential improvements for the multi-tenant system:

1. **Company ID from subdomain**: `company-a.quotes.com` automatically uses `COMPANY_A`
2. **Company ID from path**: `/company-a/jobs/111505` extracts company ID from path
3. **Authentication-based**: Extract company ID from user session/JWT token
4. **Company whitelist**: Validate against allowed company IDs
5. **Rate limiting**: Per-company rate limits
6. **Analytics**: Track usage per company

## Summary

The dynamic company ID feature enables:
- ✅ True multi-tenant architecture
- ✅ Single deployment for multiple companies
- ✅ Simplified configuration
- ✅ Better scalability
- ✅ Improved security through API-level validation

All quote URLs now require the `coId` parameter for company identification.
