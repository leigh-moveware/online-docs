# Database Schema Documentation

This document describes the database schema for the Moveware Online Docs application, including how to store and manage job data from the Moveware API.

## Database Models

### 1. Branding Model
Stores branding/theming information for each company/brand.

```typescript
model Branding {
  id             String   // Internal ID
  companyId      String   // Company identifier (unique)
  brandCode      String   // Brand code from Moveware API (unique)
  logoUrl        String
  primaryColor   String
  secondaryColor String
  fontFamily     String
  companyName    String
  favicon        String
  
  jobs           Job[]    // Related jobs
}
```

**Key Fields:**
- `brandCode`: Links to jobs from Moveware API (e.g., "MWB")
- Used to apply tenant-specific branding to job views

### 2. Job Model
Stores job details from Moveware API.

```typescript
model Job {
  id                        Int      // Job ID from Moveware
  titleName                 String   // Mr, Mrs, Ms, etc.
  firstName                 String
  lastName                  String
  estimatedDeliveryDetails  String   // Delivery date
  jobValue                  Float    // Total job value
  dateModified              DateTime
  
  brandCode                 String   // Links to Branding model
  branchCode                String
  companyCode               String
  
  // Measures (volume and weight)
  measuresVolumeGrossF3     Float    // Cubic feet
  measuresVolumeGrossM3     Float    // Cubic meters
  measuresVolumeNetF3       Float
  measuresVolumeNetM3       Float
  measuresWeightGrossKg     Float
  measuresWeightGrossLb     Float    // Pounds
  measuresWeightNetKg       Float
  measuresWeightNetLb       Float
  
  // Uplift Address (origin)
  upliftLine1               String
  upliftLine2               String
  upliftCity                String
  upliftState               String
  upliftPostcode            String
  upliftCountry             String
  
  // Delivery Address (destination)
  deliveryLine1             String
  deliveryLine2             String
  deliveryCity              String
  deliveryState             String
  deliveryPostcode          String
  deliveryCountry           String
  
  rawData                   Json     // Full API response for reference
  
  // Relations
  branding                  Branding
  inventoryItems            InventoryItem[]
  costingItems              CostingItem[]
}
```

**Key Relationships:**
- Linked to `Branding` via `brandCode`
- Has many `InventoryItem` records
- Has many `CostingItem` records

### 3. InventoryItem Model
Stores inventory items for each job.

```typescript
model InventoryItem {
  id          Int      // Inventory item ID from Moveware
  jobId       Int      // Foreign key to Job
  description String   // Item description (e.g., "Bed, King")
  room        String   // Room location
  quantity    Int      // Quantity of items
  destination String   // Destination location
  cube        Float    // Volume in cubic meters
  typeCode    String   // Item type code
  barcode     String   // Item barcode/identifier
  
  rawData     Json     // Full API response for reference
  
  job         Job      // Related job
}
```

**Key Features:**
- Multiple inventory items per job
- Cascade delete: when a job is deleted, its inventory items are deleted

### 4. CostingItem Model
Stores costing/pricing items for each job.

```typescript
model CostingItem {
  id          String   // Internal ID (cuid)
  jobId       Int      // Foreign key to Job
  category    String   // Cost category
  description String   // Item description
  quantity    Float    // Quantity
  unitPrice   Float    // Price per unit
  totalPrice  Float    // Total price
  
  rawData     Json     // Full API response for reference
  
  job         Job      // Related job
}
```

## Data Flow

### 1. Fetching and Storing Job Data

```typescript
import { jobService } from '@/lib/services/jobService';
import { transformJobForDatabase } from '@/lib/types/job';

// Fetch job from Moveware API
const response = await fetch(`${MOVEWARE_API_URL}/jobs/111505`);
const apiJob = await response.json();

// Transform and save to database
const jobData = transformJobForDatabase(apiJob);
await jobService.upsertJob(jobData);
```

### 2. Fetching and Storing Inventory Data

```typescript
import { inventoryService } from '@/lib/services/inventoryService';
import { transformInventoryItemForDatabase } from '@/lib/types/job';

// Fetch inventory from Moveware API
const response = await fetch(`${MOVEWARE_API_URL}/jobs/111505/inventory`);
const { inventoryUsage } = await response.json();

// Transform and save each item
const items = inventoryUsage.map(item => 
  transformInventoryItemForDatabase(item, 111505)
);

await inventoryService.upsertInventoryItems(items);
```

### 3. Linking Jobs to Branding

Jobs are automatically linked to branding through the `brandCode` field:

```typescript
// Get job with branding
const job = await jobService.getJob(111505);
console.log(job.branding); // Branding info

// Get all jobs for a brand
const jobs = await jobService.getJobsByBrand('MWB');
```

## API Endpoints

### Job Endpoints

```typescript
// GET /api/jobs/[jobId]
// Fetch a specific job with related data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  const job = await jobService.getJob(parseInt(jobId));
  return NextResponse.json(job);
}
```

### Inventory Endpoints

```typescript
// GET /api/jobs/[jobId]/inventory
// Fetch inventory for a job
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  const inventory = await inventoryService.getInventoryByJob(parseInt(jobId));
  return NextResponse.json(inventory);
}
```

## Database Migrations

### Initial Setup

```bash
# Generate Prisma client
npm run db:generate

# Create database tables (development)
npm run db:push

# Or create migration (production)
npm run db:migrate
```

### Adding New Fields

1. Update `prisma/schema.prisma`
2. Run `npm run db:generate`
3. Create migration: `npm run db:migrate`

## Multi-Tenant Architecture

This application supports multi-tenancy through the `brandCode` field:

### Tenant Isolation
- Each job belongs to a brand (via `brandCode`)
- Branding/theming is applied based on the brand
- Queries can be filtered by brand to show only relevant jobs

### Example: Brand-Specific Views

```typescript
// Get all jobs for "Crown Worldwide" brand
const crownJobs = await jobService.getJobsByBrand('MWB');

// Apply Crown branding to the page
const branding = await brandingService.getBrandingByCode('MWB');
```

## Data Mapping Reference

### Job API → Database Mapping

| API Field | Database Field |
|-----------|---------------|
| `id` | `id` |
| `titleName` | `titleName` |
| `firstName` | `firstName` |
| `lastName` | `lastName` |
| `estimatedDeliveryDetails` | `estimatedDeliveryDetails` |
| `jobValue` | `jobValue` |
| `dateModified` | `dateModified` |
| `brandCode` | `brandCode` |
| `branchCode` | `branchCode` |
| `companyCode` | `companyCode` |
| `measures[0].volume.gross.f3` | `measuresVolumeGrossF3` |
| `measures[0].volume.gross.m3` | `measuresVolumeGrossM3` |
| `measures[0].volume.net.f3` | `measuresVolumeNetF3` |
| `measures[0].volume.net.m3` | `measuresVolumeNetM3` |
| `measures[0].weight.gross.kg` | `measuresWeightGrossKg` |
| `measures[0].weight.gross.lb` | `measuresWeightGrossLb` |
| `measures[0].weight.net.kg` | `measuresWeightNetKg` |
| `measures[0].weight.net.lb` | `measuresWeightNetLb` |
| `addresses.Uplift.line1` | `upliftLine1` |
| `addresses.Uplift.line2` | `upliftLine2` |
| `addresses.Uplift.city` | `upliftCity` |
| `addresses.Uplift.state` | `upliftState` |
| `addresses.Uplift.postcode` | `upliftPostcode` |
| `addresses.Uplift.country` | `upliftCountry` |
| `addresses.Delivery.line1` | `deliveryLine1` |
| `addresses.Delivery.line2` | `deliveryLine2` |
| `addresses.Delivery.city` | `deliveryCity` |
| `addresses.Delivery.state` | `deliveryState` |
| `addresses.Delivery.postcode` | `deliveryPostcode` |
| `addresses.Delivery.country` | `deliveryCountry` |

### Inventory API → Database Mapping

| API Field | Database Field |
|-----------|---------------|
| `id` | `id` |
| `parentid` | `jobId` |
| `description` | `description` |
| `room` | `room` |
| `quantity` | `quantity` |
| `destination` | `destination` |
| `cube` | `cube` |
| `typeCode` | `typeCode` |
| `barcode` | `barcode` |

## Best Practices

### 1. Always Store Raw Data
The `rawData` JSON field stores the complete API response for:
- Debugging purposes
- Future field additions
- Audit trail

### 2. Use Transactions for Related Data
When saving a job with inventory:

```typescript
await prisma.$transaction(async (tx) => {
  // Save job
  await tx.job.upsert({...});
  
  // Save inventory items
  for (const item of items) {
    await tx.inventoryItem.upsert({...});
  }
});
```

### 3. Index Important Fields
The schema includes indexes on:
- `brandCode`, `branchCode`, `companyCode` (for filtering)
- `dateModified` (for sorting)
- `jobId` (for inventory/costing lookups)

### 4. Handle API Sync
Use upsert operations to handle both new and updated records:

```typescript
// Upsert automatically creates or updates
await jobService.upsertJob(jobData);
```

## Next Steps

1. **Set up PostgreSQL** (see `POSTGRES_SETUP.md`)
2. **Run migrations** to create tables
3. **Create API sync endpoints** to fetch from Moveware API
4. **Implement scheduled sync** to keep data up-to-date
5. **Add costings API** integration (similar to inventory)

## Questions?

- **How do I link branding to a job?** Set the `brandCode` field when creating the job
- **Can I store additional fields?** Yes, use the `rawData` JSON field
- **How do I query across tenants?** Use Prisma's `findMany` without brandCode filter
- **What about data privacy?** Implement Row Level Security (RLS) in PostgreSQL for production
