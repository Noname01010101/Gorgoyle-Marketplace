# Gorgoyle Admin Control Panel

A fully functional web-based admin panel for managing Gorgoyle database records.

## 🚀 Features

- **Full CRUD Operations**: Create, Read, Update, and Delete records for all database tables
- **Dark Mode**: Beautiful dark mode UI with theme persistence
- **Interactive Interface**: Fully interactive with real-time feedback
- **Search & Filter**: Advanced search and filtering capabilities
- **Sorting**: Sort data by any column
- **Pagination**: Efficient pagination for large datasets
- **Form Validation**: Comprehensive input validation using Zod
- **Error Handling**: Proper error handling with user-friendly messages
- **Loading States**: Visual feedback during async operations
- **Responsive Design**: Works seamlessly on all screen sizes
- **Type-Safe**: Built with TypeScript for type safety

## 📋 Tables Managed

- **AI Models**: Manage AI models with full relationship support
- **Providers**: Manage AI service providers
- **Model Pricing**: Configure pricing information
- **Benchmarks**: View and manage benchmark results
- **Fields**: Manage model fields and attributes

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **UI Components**: Custom React components
- **Validation**: Zod
- **Testing**: Vitest + Testing Library
- **Toast Notifications**: React Hot Toast

## 📦 Installation

1. **Install dependencies**:
   ```bash
   cd packages/admin-control-panel
   pnpm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your `DATABASE_URL`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/gorgoyle?schema=public"
   ```

> **Build Note:** The application uses `force-dynamic` rendering to ensure theme context is available during SSR. All pages render on-demand for full dark mode compatibility.

3. **Ensure Prisma is set up**:
   ```bash
   cd ../prisma-db
   pnpm prisma generate
   pnpm prisma migrate dev
   pnpm seed
   ```

## 🚀 Usage

### Development Mode

Start the development server (runs on port 3001 by default):

```bash
pnpm dev
```

Visit [http://localhost:3001](http://localhost:3001) to access the admin panel.

### Build for Production

```bash
pnpm build
pnpm start
```

### Testing

Run all tests:

```bash
pnpm test
```

Run tests with UI:

```bash
pnpm test:ui
```

### Type Checking

```bash
pnpm typecheck
```

### Linting

```bash
pnpm lint
```

## 📁 Project Structure

```
admin-control-panel/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes (CRUD operations)
│   │   │   ├── fields/
│   │   │   ├── providers/
│   │   │   ├── models/
│   │   │   ├── pricing/
│   │   │   └── benchmarks/
│   │   ├── fields/            # Fields management page
│   │   ├── providers/         # Providers management page
│   │   ├── models/            # Models management page
│   │   ├── pricing/           # Pricing management page
│   │   ├── benchmarks/        # Benchmarks page
│   │   ├── layout.tsx         # Root layout with sidebar
│   │   ├── page.tsx           # Dashboard home page
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable React components
│   │   ├── Button.tsx
│   │   ├── DataTable.tsx
│   │   ├── ErrorState.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Modal.tsx
│   │   ├── Pagination.tsx
│   │   ├── SearchBar.tsx
│   │   ├── Sidebar.tsx
│   │   └── ThemeProvider.tsx
│   ├── lib/                   # Utility functions
│   │   ├── prisma.ts         # Prisma client singleton
│   │   ├── types.ts          # TypeScript types
│   │   └── utils.ts          # Helper functions
│   └── test/                  # Test setup
│       └── setup.ts
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── vitest.config.ts
└── README.md
```

## 🔧 API Routes

All API routes follow RESTful conventions:

### Fields
- `GET /api/fields` - List all fields (with pagination, search, sort)
- `POST /api/fields` - Create new field
- `GET /api/fields/[id]` - Get single field
- `PUT /api/fields/[id]` - Update field
- `DELETE /api/fields/[id]` - Delete field

### Providers
- `GET /api/providers` - List all providers
- `POST /api/providers` - Create new provider
- `GET /api/providers/[id]` - Get single provider
- `PUT /api/providers/[id]` - Update provider
- `DELETE /api/providers/[id]` - Delete provider

### Model Pricing
- `GET /api/pricing` - List all pricing configurations
- `POST /api/pricing` - Create new pricing
- `GET /api/pricing/[id]` - Get single pricing
- `PUT /api/pricing/[id]` - Update pricing
- `DELETE /api/pricing/[id]` - Delete pricing

### Benchmarks
- `GET /api/benchmarks` - List all benchmarks
- `POST /api/benchmarks` - Create new benchmark
- `GET /api/benchmarks/[id]` - Get single benchmark
- `PUT /api/benchmarks/[id]` - Update benchmark
- `DELETE /api/benchmarks/[id]` - Delete benchmark

### AI Models
- `GET /api/models` - List all models (with relationships)
- `POST /api/models` - Create new model
- `GET /api/models/[id]` - Get single model
- `PUT /api/models/[id]` - Update model
- `DELETE /api/models/[id]` - Delete model

## 🎨 Features in Detail

### Search and Filtering
Each table page includes a search bar that filters results in real-time. The search works across relevant fields (e.g., name, country for providers).

### Sorting
Click on any column header with a sort icon to sort by that column. Click again to reverse the sort order.

### Pagination
Navigate through large datasets efficiently with pagination controls at the bottom of each table.

### Dark Mode
Toggle dark mode using the theme switcher in the sidebar. Your preference is saved to localStorage.

### Form Validation
All forms include validation with helpful error messages:
- Required fields are enforced
- Data types are validated
- Relationships are validated before submission

### Error Handling
- API errors are caught and displayed to users
- Network errors show retry options
- Form validation errors appear inline
- Toast notifications for success/failure

### Loading States
- Spinner indicators during data fetching
- Button loading states during form submission
- Skeleton loaders for better UX

## 🔐 Security Considerations

- All API routes validate input using Zod schemas
- Environment variables keep database credentials secure
- CORS and security headers should be configured for production
- Consider adding authentication/authorization for production use

## 🧪 Testing

The project includes comprehensive tests:

- **Component Tests**: Test React components in isolation
- **Utility Tests**: Test helper functions
- **API Route Tests**: Test CRUD operations with mocked Prisma

Example running tests:
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test -- --watch

# Run tests with coverage
pnpm test -- --coverage

# Run tests with UI
pnpm test:ui
```

## 🚢 Deployment

### Environment Variables

Ensure these environment variables are set in production:

```bash
DATABASE_URL="your-production-database-url"
NODE_ENV="production"
```

### Build and Deploy

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

### Docker (Optional)

You can containerize the admin panel alongside your main application using the existing docker-compose setup.

## 🔄 Integration with Existing Codebase

This admin panel is designed to be **non-breaking** and isolated:

- Located in `packages/admin-control-panel`
- Runs on port 3001 (separate from main app)
- Uses the same Prisma schema via workspace dependency
- Doesn't modify any existing code outside its directory
- Can be developed and deployed independently

## 📝 Best Practices

1. **Always validate user input** - Use Zod schemas
2. **Handle errors gracefully** - Show user-friendly messages
3. **Provide feedback** - Loading states and success/error toasts
4. **Keep forms simple** - Break complex forms into steps if needed
5. **Test thoroughly** - Write tests for critical functionality
6. **Type everything** - Leverage TypeScript for safety
7. **Follow conventions** - Consistent naming and structure

## 🐛 Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Check database credentials

### Port Already in Use
Change the port in `package.json`:
```json
"dev": "next dev -p 3002"
```

### Prisma Client Issues
Regenerate Prisma client:
```bash
cd ../prisma-db
pnpm prisma generate
```

### Type Errors
Run type checking:
```bash
pnpm typecheck
```

## 🤝 Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before committing
5. Keep commits atomic and descriptive

## 📄 License

This project inherits the license from the main Gorgoyle project.

## 🙏 Acknowledgments

Built with modern web technologies and best practices for a robust, maintainable admin interface.
