# Project Structure

This is a modern Next.js admin dashboard for booking management with a clean and organized folder structure.

## Directory Structure

```
booking-admin-dashboard/
├── app/                          # Next.js App Router
│   ├── (dashboard)/             # Dashboard route group
│   │   ├── layout.tsx           # Dashboard layout with sidebar
│   │   ├── dashboard/           # Dashboard page
│   │   ├── rooms/               # Room management
│   │   ├── bookings/            # Booking management
│   │   ├── amenities/           # Amenities management
│   │   └── reports/             # Reports page
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page (redirects to dashboard)
│   └── globals.css              # Global styles
│
├── components/                   # React components
│   ├── layouts/                 # Layout components
│   │   └── Sidebar.tsx          # Main sidebar navigation
│   ├── providers/               # Provider components
│   │   ├── QueryProvider.tsx   # TanStack Query provider
│   │   └── ReduxProvider.tsx   # Redux provider
│   ├── ui/                      # Reusable UI components
│   └── features/                # Feature-specific components
│
├── lib/                         # Libraries and utilities
│   ├── api/                     # API client and services
│   │   ├── client.ts            # Base API client
│   │   └── services/            # API service modules
│   │       ├── rooms.ts         # Room API service
│   │       └── bookings.ts      # Booking API service
│   ├── hooks/                   # Custom React hooks
│   │   ├── useDebounce.ts       # Debounce hook
│   │   └── useRooms.ts          # Room data hooks with TanStack Query
│   ├── utils/                   # Utility functions
│   │   ├── cn.ts                # Class name utility
│   │   └── format.ts            # Formatting utilities
│   └── query-client.ts          # TanStack Query client config
│
├── store/                       # Redux store
│   ├── index.ts                 # Store configuration
│   ├── hooks.ts                 # Typed Redux hooks
│   ├── slices/                  # Redux slices
│   └── middleware/              # Custom middleware
│
└── types/                       # TypeScript types
    ├── index.ts                 # Main types (Room, Booking, etc.)
    └── navigation.ts            # Navigation types

## Key Features

### State Management
- **Redux Toolkit**: Global state management
- **TanStack Query**: Server state management with caching

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Dark Mode**: Built-in dark mode support

### Navigation
- Sidebar navigation with active states
- Route groups for clean organization

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Run development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Open [http://localhost:3000](http://localhost:3000)

## Adding New Features

### New Page
1. Create page in `app/(dashboard)/your-page/page.tsx`
2. Add navigation item in `components/layouts/Sidebar.tsx`

### New API Service
1. Create service in `lib/api/services/your-service.ts`
2. Create hooks in `lib/hooks/useYourService.ts`

### New Redux Slice
1. Create slice in `store/slices/yourSlice.ts`
2. Add to store in `store/index.ts`

### New Component
- UI components: `components/ui/YourComponent.tsx`
- Feature components: `components/features/YourFeature.tsx`
