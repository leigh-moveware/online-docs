# Moveware Design System

## Brand Identity

### Colors

**Primary Palette:**
- Primary Blue: `#2563eb` (Tailwind: `bg-blue-600`)
- Primary Hover: `#1d4ed8` (Tailwind: `bg-blue-700`)
- Primary Light: `#60a5fa` (Tailwind: `bg-blue-400`)

**Neutral Palette:**
- Background: `#f9fafb` (Tailwind: `bg-gray-50`)
- Surface: `#ffffff` (Tailwind: `bg-white`)
- Border: `#e5e7eb` (Tailwind: `border-gray-200`)
- Text Primary: `#111827` (Tailwind: `text-gray-900`)
- Text Secondary: `#6b7280` (Tailwind: `text-gray-600`)
- Text Muted: `#9ca3af` (Tailwind: `text-gray-400`)

**Semantic Colors:**
- Success: `#10b981` (Tailwind: `bg-green-500`)
- Warning: `#f59e0b` (Tailwind: `bg-amber-500`)
- Error: `#ef4444` (Tailwind: `bg-red-500`)
- Info: `#3b82f6` (Tailwind: `bg-blue-500`)

### Typography

**Font Scales:**
```tsx
// Headings
text-4xl font-bold  // Hero heading (36px)
text-3xl font-bold  // Page heading (30px)
text-2xl font-bold  // Section heading (24px)
text-xl font-semibold  // Subsection heading (20px)
text-lg font-semibold  // Card heading (18px)

// Body
text-base font-normal  // Body text (16px)
text-sm font-normal    // Small text (14px)
text-xs font-normal    // Caption (12px)
```

**Font Weights:**
- Regular: `font-normal` (400)
- Medium: `font-medium` (500)
- Semibold: `font-semibold` (600)
- Bold: `font-bold` (700)

## Layout

### Container

```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

### Spacing Scale

```tsx
// Component-specific
py-12 sm:py-16 lg:py-20  // Section vertical padding
space-y-6                 // Stack spacing
gap-6                     // Grid gap
```

## Components

### Button

**Primary Button:**
```tsx
<button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
  Button Text
</button>
```

**Secondary Button:**
```tsx
<button className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-all duration-200">
  Button Text
</button>
```

### Card

**Standard Card:**
```tsx
<div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
  {/* Card content */}
</div>
```

### Form Input

**Text Input:**
```tsx
<div className="space-y-2">
  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
    Email Address
  </label>
  <input
    type="email"
    id="email"
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
    placeholder="you@example.com"
  />
</div>
```

**Input with Error:**
```tsx
<input
  className="w-full px-4 py-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
/>
<p className="text-sm text-red-600">Error message</p>
```

### Alert

**Error Alert:**
```tsx
<div className="bg-red-50 border border-red-200 rounded-lg p-4">
  <p className="text-sm text-red-700">Error message</p>
</div>
```

## Accessibility

**Always Include:**
- Semantic HTML (`<button>`, `<main>`, `<nav>`, etc.)
- ARIA labels where needed
- Keyboard navigation support
- Focus states on interactive elements
- Proper form labels and error messages
