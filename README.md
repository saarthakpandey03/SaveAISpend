# StackSpend - Cloud Cost Optimization SaaS

A modern SaaS application that audits cloud infrastructure and reveals thousands in hidden cost optimization opportunities.

## Overview

StackSpend helps engineering teams understand and reduce their cloud costs through intelligent infrastructure analysis. The application guides users through a quick audit, analyzes their infrastructure against best practices, and provides personalized recommendations with estimated savings.

## Features

- **Smart Audit Wizard**: Multi-step form with progress tracking and localStorage persistence
- **Infrastructure Analysis**: Comprehensive analysis of 5 key optimization areas:
  - Compute optimization
  - Storage efficiency
  - Database performance
  - Network optimization
  - Monitoring stack configuration
- **Personalized Results**: Dynamic cost savings estimates and specific recommendations
- **Shareable Reports**: Generate public report links to share with team members
- **Responsive Design**: Mobile-first design that works seamlessly on all devices
- **Dark Theme**: Premium dark mode with cyan accents for a modern SaaS aesthetic

## Project Structure

```
├── app/
│   ├── layout.tsx           # Root layout with dark mode setup
│   ├── page.tsx             # Landing page with 10+ sections
│   ├── audit/
│   │   └── page.tsx         # Audit form page
│   ├── results/
│   │   └── [sessionId]/
│   │       └── page.tsx     # Results display page
│   ├── report/
│   │   └── [id]/
│   │       └── page.tsx     # Public shareable report
│   ├── not-found.tsx        # 404 error page
│   ├── globals.css          # Global styles with design tokens
│   └── ...
├── components/
│   ├── header.tsx           # Navigation header
│   ├── footer.tsx           # Site footer
│   ├── audit-form.tsx       # Multi-step audit form
│   ├── results-display.tsx  # Results visualization
│   ├── public-report.tsx    # Shareable report component
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── audit-data.ts       # Audit logic, questions, and results calculation
│   ├── storage.ts          # localStorage utilities for session management
│   └── utils.ts            # Helper utilities
└── ...
```

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React hooks + localStorage
- **Font**: Geist (system font)

## Design System

The application uses a carefully crafted color system:

- **Background**: Very dark (oklch(0.08 0 0))
- **Foreground**: Light text (oklch(0.97 0 0))
- **Accent**: Cyan (oklch(0.65 0.2 188)) for interactive elements
- **Cards**: Dark gray (oklch(0.12 0 0)) on dark backgrounds
- **Borders**: Subtle dark borders (oklch(0.2 0 0))

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open browser
# Visit http://localhost:3000
```

### Build for Production

```bash
pnpm build
pnpm start
```

## User Journey

1. **Landing Page** (`/`)
   - Hero section with value proposition
   - Social proof and statistics
   - Feature overview
   - FAQ and testimonials
   - Clear CTA to start audit

2. **Audit Form** (`/audit`)
   - 3-question multi-step form
   - Progress tracking
   - Form answers persisted to localStorage
   - Auto-advance between questions
   - Smart navigation with previous/next buttons

3. **Results Page** (`/results/[sessionId]`)
   - Total annual savings displayed prominently
   - Detailed breakdown for each optimization area
   - Specific recommendations per area
   - Option to share results
   - Session-based persistence

4. **Public Report** (`/report/[id]`)
   - View-only version of results
   - Executive summary
   - Detailed findings with prioritization
   - Implementation guidance
   - No authentication required

## Data Flow

### Session Management
- User answers stored in localStorage with unique session ID
- Results calculated and stored in same session
- Public reports can be shared via URL with demo data

### Audit Logic
- Answers converted to scores (0-4 scale)
- Scoring affects calculation multipliers
- Base costs adjusted based on utilization and optimization patterns
- Results include specific recommendations for each area

## Key Files

### `/lib/audit-data.ts`
Contains:
- Question definitions for the audit form
- Tool database with base costs and savings potential
- Calculation logic for results
- Recommendation generation

### `/lib/storage.ts`
Contains:
- Session management functions
- localStorage integration
- Session ID generation
- Results persistence

### `/components/audit-form.tsx`
Features:
- Multi-step form handling
- Progress tracking
- Answer persistence
- Form validation and navigation

## Future Enhancements

Potential additions for a production version:
- Backend API for persistent data storage
- User authentication and accounts
- Real cloud provider API integration
- Advanced analytics and historical tracking
- Team collaboration features
- Export functionality (PDF, CSV)
- Webhook notifications
- Premium tiers with advanced features

## Performance Considerations

- Lazy-loaded components for optimal initial load
- Optimized images and assets
- CSS modules for component isolation
- Server components for static content
- Client components only where needed

## Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast compliance
- Focus indicators for keyboard users
- Screen reader friendly

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - Feel free to use this project as a template for your own SaaS applications.

## Support

For issues or questions, please refer to the FAQ section on the landing page or contact support.
# SaveAISpend
