---
title: Web Frontend Implementation
---

# Web Frontend Implementation

## Overview
The web frontend is a Next.js 16 application that provides a comprehensive interface for browsing, comparing, and selecting AI models. It uses tRPC for type-safe API communication with the backend.

## Architecture

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4 with custom CSS variables
- **API Communication**: tRPC client
- **Language**: TypeScript
- **UI Components**: Custom component library

### Project Structure
```
web-frontend/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                 # Homepage
│   ├── models/                  # Model catalog & details
│   ├── pricing/                 # Pricing comparison
│   ├── benchmarks/              # Performance benchmarks
│   ├── capability-matching/     # AI-powered model matching
│   ├── suggestions/             # Model recommendations
│   ├── api-check/              # API status & diagnostics
│   ├── learn-more/             # About & information
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles & design tokens
├── components/                  # Reusable UI components
│   ├── Header.tsx              # Navigation header
│   ├── Card.tsx                # Card component
│   ├── LoadingState.tsx        # Loading indicator
│   └── ErrorState.tsx          # Error display
└── lib/
    └── trpc.ts                 # tRPC client configuration
```

## Design System

### Color Palette
The application uses a dark theme with consistent color variables:

- **Background**: Pure black (`#000000`)
- **Foreground**: White (`#ffffff`)
- **Primary**: Blue-600 (`#3b82f6`)
- **Text Secondary**: Gray-400 (`#9ca3af`)
- **Borders**: Gray-800/900 variants

### CSS Variables
All colors and design tokens are defined in `globals.css`:

```css
--background, --foreground
--primary, --primary-hover, --primary-light
--text-primary, --text-secondary, --text-tertiary
--border, --border-light
--card-bg, --card-bg-hover
```

### Utility Classes
Reusable classes for common patterns:
- `.btn-primary`, `.btn-secondary` - Button styles
- `.card`, `.card-hover` - Card components
- `.text-heading`, `.text-body` - Typography
- `.section-spacing` - Consistent layout spacing

## Pages

### 1. Homepage (`/`)
- Hero section with value proposition
- Feature showcase with visual cards
- Navigation to all major sections
- Fully responsive design

### 2. Models (`/models`)
**Features:**
- Grid view of all AI models
- Real-time search filtering
- Sort by name, price, or context window
- Quick view of key specs (context, output, pricing)
- Click-through to detailed model pages

**API Integration:**
- `trpc.catalog.getModels.query({})`

### 3. Model Details (`/models/[modelId]`)
**Features:**
- Tabbed interface (Overview, Benchmarks, Similar Models)
- Detailed specifications and pricing
- Performance benchmarks with visual progress bars
- Similar model recommendations with similarity scores

**API Integration:**
- `trpc.catalog.getModels.query({})`
- `trpc.benchmarks.getModelBenchmarks.query({ modelId })`
- `trpc.suggestions.getSuggestionsForModel.query({ modelId })`

### 4. Pricing (`/pricing`)
**Features:**
- Price range filters (input/output)
- Cost calculator for different usage tiers
- Comparative pricing table
- Estimated costs for light/medium/heavy use
- Sorting by total/input/output cost

**API Integration:**
- `trpc.catalog.getModels.query({})`

### 5. Benchmarks (`/benchmarks`)
**Features:**
- List of models with benchmark summaries
- Average scores and category counts
- Category filtering
- Visual score displays
- Sorted by performance

**API Integration:**
- `trpc.catalog.getModels.query({})`
- `trpc.benchmarks.getModelBenchmarkSummary.query({ modelId })`

### 6. Capability Matching (`/capability-matching`)
**Features:**
- Natural language task description input
- Optional price constraints
- Cost vs. quality priority slider
- Example task templates
- Ranked recommendations with reasoning
- Match scores and explanations

**API Integration:**
- `trpc.match.matchModelsForTask.query({ taskDescription, constraints, preferences })`

### 7. Suggestions (`/suggestions`)
**Features:**
- Model selector sidebar
- Current model overview
- Similar model recommendations
- Similarity scores and reasoning
- Side-by-side comparison
- One-click model switching

**API Integration:**
- `trpc.catalog.getModels.query({})`
- `trpc.suggestions.getSuggestionsForModel.query({ modelId })`

### 8. API Check (`/api-check`)
**Features:**
- Real-time API connectivity tests
- Multiple endpoint validation
- Visual status indicators
- Connection troubleshooting guide
- Detailed test results

**API Integration:**
- Tests all tRPC endpoints

### 9. Learn More (`/learn-more`)
**Features:**
- Platform overview and value proposition
- Use case descriptions
- Persona-based workflows
- Statistics and metrics
- Call-to-action sections

## Components

### Header
Navigation component with:
- Logo/home link
- Main navigation menu
- Consistent across all pages
- Mobile-responsive (with hamburger menu placeholder)

### Card
Flexible container component with:
- Optional hover effects
- Consistent padding and borders
- Customizable className
- Dark theme styling

### LoadingState
Displays:
- Animated spinner
- Custom loading message
- Centered layout
- Consistent styling

### ErrorState
Displays:
- Error icon
- Error message
- Optional retry button
- User-friendly troubleshooting text

## tRPC Integration

### Client Setup (`lib/trpc.ts`)
```typescript
export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/trpc`,
    }),
  ],
});
```

### Type Safety
All API calls are fully typed based on the backend router definitions. TypeScript will catch:
- Invalid endpoint names
- Wrong input parameters
- Incorrect response handling

### Error Handling
Standard pattern across all pages:
```typescript
try {
  const data = await trpc.endpoint.query({});
  // Handle success
} catch (err) {
  // Handle error
  setError("User-friendly message");
}
```

## State Management

### Client-Side State
Uses React hooks:
- `useState` for local component state
- `useEffect` for data loading
- No external state management library needed

### Data Flow
1. Page loads → `useEffect` triggers
2. Call tRPC endpoint
3. Update loading state
4. Handle response (success/error)
5. Update UI with data

## Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Patterns
- Grid layouts with responsive columns
- Stacked mobile, side-by-side desktop
- Hidden elements on mobile (with mobile menu placeholder)
- Flexible typography scaling

## Performance Considerations

### Optimization Strategies
1. **Data Fetching**: Client-side with loading states
2. **Code Splitting**: Automatic via Next.js App Router
3. **Image Optimization**: Next.js Image component (where applicable)
4. **CSS**: Tailwind with tree-shaking
5. **Bundle Size**: Minimal dependencies

### Future Improvements
- Server-side rendering for initial data
- React Query for caching
- Incremental static regeneration
- Image optimization for hero graphics

## Development

### Running Locally
```bash
cd web-frontend
npm install
npm run dev
```

### Environment Variables
None required currently. Backend URL is hardcoded to localhost:3000.

### Building for Production
```bash
npm run build
npm start
```

## Testing Strategy

### Manual Testing Checklist
- [ ] All navigation links work
- [ ] Search and filters function correctly
- [ ] API calls succeed with backend running
- [ ] Error states display properly
- [ ] Loading states appear during data fetch
- [ ] Responsive design works on mobile
- [ ] All pages render without errors

### API Testing
Use the `/api-check` page to verify backend connectivity.

## Accessibility

### Current Implementation
- Semantic HTML elements
- Keyboard navigation support (native)
- Color contrast meets WCAG standards
- Focus states on interactive elements

### Future Enhancements
- ARIA labels
- Screen reader testing
- Keyboard shortcut documentation
- Skip navigation links

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2017+ required
- No IE11 support

## Known Issues & Limitations
1. **CSS Warnings**: `@theme` and `@apply` are Tailwind 4 features that may show warnings in older CSS validators
2. **Mobile Menu**: Hamburger menu button exists but doesn't toggle menu yet
3. **Error Handling**: Generic error messages (could be more specific)
4. **Type Definitions**: Some tRPC types are inferred (not explicitly imported from backend)

## Future Enhancements
1. Add authentication/user accounts
2. Save favorite models
3. Model comparison side-by-side view
4. Export pricing/benchmark data
5. Dark/light theme toggle (currently dark only)
6. Advanced filtering (multimodal, streaming, etc.)
7. Cost tracking/budgeting tools
8. API key management
9. Usage analytics
10. Model version history

## Contributing
Follow the existing patterns:
- Use TypeScript strictly
- Match the design system
- Add loading/error states
- Use tRPC for all API calls
- Keep components simple and reusable
- Test with backend running
