# StackSpend Product Logic Layer

Comprehensive backend-ready logic system for the StackSpend AI Spend Audit engine.

## Overview

The product logic layer transforms StackSpend from a UI demo into a real decision engine. It includes:

- **Pricing Data System** - Centralized, type-safe pricing for 9 AI tools
- **Audit Engine** - Core recommendation logic with defensible rules
- **Report Storage** - Persistent localStorage-based report management
- **Shareable Reports** - Public audit URLs with view tracking
- **Lead Capture** - Email collection and analytics
- **Full Test Suite** - 7 comprehensive test categories

All components are production-ready and easy to migrate to Supabase/backend.

---

## Architecture

```
lib/
├── pricing-data.ts       # Centralized pricing database
├── types.ts              # Type definitions for entire system
├── audit-engine.ts       # Core recommendation logic
├── report-storage.ts     # Report persistence & retrieval
├── lead-capture.ts       # Email & lead management
└── __tests__/
    └── audit-engine.test.ts  # Comprehensive test suite

components/
├── audit-form.tsx        # Updated to use audit engine
└── results-display.tsx   # Updated to use engine results

app/
├── audit/
│   └── page.tsx          # Audit form page
├── results/
│   └── page.tsx          # Results display page
└── report/
    └── [id]/
        └── page.tsx      # Shareable report page
```

---

## Part 1: Pricing Data System (`lib/pricing-data.ts`)

Centralized pricing database for all supported tools.

### Supported Tools

1. **Cursor** - Hobby / Pro / Business / Enterprise
2. **GitHub Copilot** - Individual / Business / Enterprise
3. **Claude** - Free / Pro / Team / API (pay-as-you-go/enterprise)
4. **ChatGPT** - Free / Plus / Team / Enterprise / API
5. **Gemini** - Free / Pro / Ultra / API
6. **OpenAI API** - Pay-as-you-go (multiple models)
7. **Anthropic API** - Pay-as-you-go
8. **Windsurf** - Pro
9. **v0** - Free / Pro

### Usage

```typescript
import { 
  getToolPrice,
  getToolPlans,
  getSeatAssumption,
  isValidToolPlan 
} from "@/lib/pricing-data";

// Get monthly price for a tool/plan
const price = getToolPrice("cursor", "pro"); // 20

// Get all plans for a tool
const plans = getToolPlans("claude");

// Get expected seat assumption (% of team that uses tool)
const assumption = getSeatAssumption("cursor"); // 0.8 = 80%

// Validate tool/plan exists
const valid = isValidToolPlan("cursor", "pro"); // true
```

### Adding New Tools

```typescript
// In toolsPricing object:
newTool: {
  id: "new-tool",
  name: "New Tool",
  provider: "Provider",
  lastUpdated: "2025-05-08",
  seatAssumption: 0.6,
  plans: {
    free: { name: "Free", monthly: 0 },
    pro: { name: "Pro", monthly: 20 },
  },
}
```

---

## Part 2: Types System (`lib/types.ts`)

Complete type safety for the entire audit pipeline.

### Key Types

```typescript
// Input types
interface AuditInput {
  id?: string;
  teamProfile: TeamProfile;
  tools: ToolInput[];
  timestamp?: string;
}

// Output types
interface FullAuditResult {
  auditId: string;
  timestamp: string;
  currentMonthlySpend: number;
  optimizedMonthlySpend: number;
  monthlySavings: number;
  annualSavings: number;
  savingsPercentage: number;
  recommendations: ToolRecommendation[];
  summary: string;
  overallConfidence: "high" | "moderate" | "low";
  optimizationState: "significant" | "moderate" | "minor" | "optimized";
}

// Individual recommendation
interface ToolRecommendation {
  toolId: ToolName;
  toolName: string;
  currentPlan: ToolPlan;
  recommendedPlan: ToolPlan | null;
  monthlySavings: number;
  annualSavings: number;
  confidence: "high" | "moderate" | "low";
  reason: string;
  actions: string[];
}
```

---

## Part 3: Audit Engine (`lib/audit-engine.ts`)

The core decision engine that generates recommendations.

### Main Function

```typescript
import { generateAudit } from "@/lib/audit-engine";

const result = generateAudit({
  teamProfile: {
    size: 5,
    teamType: "startup",
    useCase: "coding",
    painPoint: "seats"
  },
  tools: [
    {
      toolId: "cursor",
      plan: "business",
      monthlySpend: 40,
      seats: 3
    }
  ]
});

// Returns: FullAuditResult with recommendations
```

### Core Rules

Rules are transparent and defensible:

| Rule | Trigger | Recommendation | Confidence |
|------|---------|---|---|
| Small team Business→Pro | teamSize ≤ 5 + Cursor Business | Downgrade to Pro | High |
| Large team seat reduction | seats > teamSize × 0.8 | Reduce seats | Moderate |
| Claude Team consolidation | teamSize ≥ 5 + multiple Pro | Migrate to Team | High |
| ChatGPT Team for scale | teamSize ≥ 8 + Plus × 4+ | Migrate to Team | High |
| API vs Subscription | API spend low | Consider subscription | Low |

Each rule includes:
- Clear logic
- Specific conditions
- Expected savings
- Confidence level
- Action items

### Validation

```typescript
import { validateAuditInput } from "@/lib/audit-engine";

const validation = validateAuditInput(input);
if (!validation.valid) {
  console.error(validation.errors);
}
```

---

## Part 4: Report Storage (`lib/report-storage.ts`)

Persistent storage and retrieval of audits.

### Core Functions

```typescript
import {
  saveAuditInput,
  loadAuditInput,
  saveAuditResult,
  loadAuditResult,
  makeAuditPublic,
  isAuditPublic,
  listAllAudits,
  deleteAudit
} from "@/lib/report-storage";

// Save audit data
saveAuditInput(input);
saveAuditResult(auditId, result, isPublic);

// Load audit data
const input = loadAuditInput(auditId);
const result = loadAuditResult(auditId);

// Manage public reports
const publicUrl = makeAuditPublic(auditId);
const isPublic = isAuditPublic(auditId);

// List and delete
const allIds = listAllAudits();
deleteAudit(auditId);

// Analytics
const stats = getStorageStats();
// { totalAudits: 5, publicAudits: 2, storageBytes: 45000 }
```

### Storage Format

Reports are stored in localStorage with keys:
- `stackspend_reports_<auditId>` - Full report with input + result
- `stackspend_inputs_<auditId>` - Input data only
- `stackspend_metadata` - Quick-access metadata for all audits

---

## Part 5: Shareable Reports (`app/report/[id]/page.tsx`)

Public report URLs that can be shared without authentication.

### Features

- Loads report by ID from storage
- Validates report is public
- Shows full recommendations without personal info
- Tracks view counts
- Provides copy-to-clipboard for sharing

### URL Format

```
https://stackspend.com/report/report-timestamp-random
```

### Privacy

- Only public reports are viewable
- Personal emails/company names not displayed
- Team size and type shown (aggregated)
- Full savings recommendations displayed

---

## Part 6: Lead Capture (`lib/lead-capture.ts`)

Email collection and lead management.

### Capturing Leads

```typescript
import { captureLead, captureLeadFromAudit } from "@/lib/lead-capture";

// Generic lead capture
captureLead({
  email: "user@company.com",
  company: "ACME Corp",
  role: "CTO",
  teamSize: 10
});

// From audit context
captureLeadFromAudit("user@company.com", auditId, 10);
```

### Analytics

```typescript
import { getLeadStats } from "@/lib/lead-capture";

const stats = getLeadStats();
// {
//   totalLeads: 150,
//   uniqueCompanies: 120,
//   rolesRepresented: ["CTO", "Engineering Manager", ...],
//   averageTeamSize: 8,
//   leadsWithAudits: 95
// }
```

### Export

```typescript
import { exportLeadsAsCSV, downloadLeadsAsCSV } from "@/lib/lead-capture";

// Get CSV string
const csv = exportLeadsAsCSV();

// Download as file
downloadLeadsAsCSV();
```

---

## Part 7: Tests (`lib/__tests__/audit-engine.test.ts`)

Comprehensive test suite covering:

1. **Small Team Overpaying** - Cursor Business→Pro downgrade
2. **Already Optimized** - Recognize well-optimized stacks
3. **Seat Reduction** - Recommend reducing overprovisioned seats
4. **Multi-Tool Consolidation** - Tool consolidation opportunities
5. **Input Validation** - Invalid inputs rejected correctly
6. **Edge Cases** - Solo founder, enterprise scale scenarios
7. **Financial Accuracy** - Calculations correct

### Running Tests

```bash
npm test -- audit-engine.test.ts
```

---

## Integration with Frontend

### Audit Form

The audit form now uses the new audit engine:

```typescript
// In components/audit-form.tsx handleSubmit()
const { generateAudit, generateAuditId } = await import("@/lib/audit-engine");
const { saveAuditInput, saveAuditResult } = await import("@/lib/report-storage");

const auditId = generateAuditId();
const auditInput = { id: auditId, teamProfile, tools, timestamp };
const auditResult = generateAudit(auditInput);

saveAuditInput(auditInput);
saveAuditResult(auditId, auditResult, false);

router.push("/results");
```

### Results Page

The results page loads and displays audit results:

```typescript
// In app/results/page.tsx
const result = loadAuditResult(auditId);
// Pass to ResultsDisplay component
```

### Report Page

Shareable reports are displayed at `/report/[id]`:

```typescript
// In app/report/[id]/page.tsx
const report = loadAuditReport(reportId);
if (report?.isPublic) {
  incrementPublicViewCount(reportId);
  // Display report
}
```

---

## Future: Database Migration

### To Supabase

Replace localStorage with Supabase:

```typescript
// lib/report-storage.ts (future implementation)

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(url, key);

export async function saveAuditResult(
  auditId: string,
  result: FullAuditResult
) {
  await supabase.from("audits").insert({
    id: auditId,
    result,
    created_at: new Date().toISOString(),
  });
}
```

### To Neon/PostgreSQL

```typescript
// lib/report-storage.ts (future implementation)

import { sql } from "@vercel/postgres";

export async function saveAuditResult(
  auditId: string,
  result: FullAuditResult
) {
  await sql`
    INSERT INTO audits (id, result, created_at)
    VALUES (${auditId}, ${JSON.stringify(result)}, NOW())
  `;
}
```

The interface remains the same - only the storage layer changes.

---

## API Structure (Future REST/GraphQL)

### Endpoints

```
POST /api/audits
  - Create new audit
  - Body: AuditInput
  - Returns: FullAuditResult

GET /api/audits/:id
  - Retrieve audit result
  - Returns: FullAuditResult

POST /api/audits/:id/public
  - Make audit public
  - Returns: { publicUrl: string }

GET /api/reports/:id
  - Get public report (unauthenticated)
  - Returns: FullAuditResult (filtered)

POST /api/leads
  - Capture lead
  - Body: LeadCapture
  - Returns: { success: boolean }
```

---

## Quality Checklist

- [x] Type-safe entire pipeline
- [x] Defensible, transparent rules
- [x] Comprehensive test coverage
- [x] Error handling & validation
- [x] Privacy-first design
- [x] localStorage ready for migration
- [x] No fake AI/magic math
- [x] Financially believable recommendations
- [x] Easy to update pricing
- [x] Production-ready code

---

## Support & Debugging

### Enable Debug Logging

All modules use `[StackSpend]` prefix:

```typescript
// In browser console
localStorage.getItem("stackspend_reports");
```

### Check Storage

```typescript
import { getStorageStats } from "@/lib/report-storage";

console.log(getStorageStats());
```

### Validate Audit

```typescript
import { validateAuditInput } from "@/lib/audit-engine";

const validation = validateAuditInput(input);
console.log(validation);
```

---

## Contact & Iteration

This is a living document. As the product evolves:

1. Update pricing data annually
2. Add new tools to pricing-data.ts
3. Add new rules to audit-engine.ts
4. Expand test coverage as needed
5. Migrate storage layer when ready

All changes maintain backward compatibility through the shared type system.
