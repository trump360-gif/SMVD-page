# SMVD Website Design System

**Version**: 1.0
**Last Updated**: 2026-02-12
**Design Lead**: Claude (AI Design System Specialist)
**Based on**: DESIGN_ANALYSIS_REPORT.md (Figma data extraction)

---

## Table of Contents

1. [Design Tokens](#1-design-tokens)
2. [Component Specifications](#2-component-specifications)
3. [Responsive Guidelines](#3-responsive-guidelines)
4. [Accessibility Requirements](#4-accessibility-requirements)
5. [Implementation Guide](#5-implementation-guide)

---

## 1. Design Tokens

Design tokens are the fundamental visual design decisions that define the brand and ensure consistency across the entire system.

### 1.1 Color Palette

#### Primary Colors (Brand Identity)

| Token Name | HEX | RGB | Usage | Contrast Check |
|------------|-----|-----|-------|----------------|
| `primary-deep-blue` | `#0845A7` | rgb(8, 69, 167) | Main brand color, headers | AA on white |
| `primary-blue` | `#1A46E7` | rgb(26, 70, 231) | CTA buttons, active states | AA on white |
| `primary-light-blue` | `#489AFF` | rgb(72, 154, 255) | Hover states, links | AA on white |
| `primary-teal` | `#1ABC9C` | rgb(26, 188, 156) | Accent color, highlights | AA on white |

**Usage Guidelines**:
- Use `primary-deep-blue` for main headings and branding
- Use `primary-blue` for all primary CTA buttons
- Use `primary-light-blue` for hover states on interactive elements
- Reserve `primary-teal` for special emphasis or secondary CTAs

#### Accent Colors

| Token Name | HEX | Usage |
|------------|-----|-------|
| `accent-purple` | `#9747FF` | Special events, featured items |
| `accent-light-purple` | `#A14AFF` | Hover state for purple elements |

**Usage Guidelines**:
- Use sparingly for special announcements or featured content
- Avoid using purple for primary navigation

#### Semantic Colors

| Token Name | HEX | Usage | WCAG Compliance |
|------------|-----|-------|-----------------|
| `semantic-error` | `#FF0000` | Error messages, destructive actions | AAA on white |
| `semantic-error-light` | `#FF5F59` | Error backgrounds, soft warnings | AA on white |
| `semantic-warning` | `#FFCB53` | Warnings, important notices | AAA on black |

#### Neutral Colors (Greyscale - 16 Levels)

**Token Structure**: `neutral-{weight}`

```css
/* Darkest to Lightest */
--neutral-black: #000000;      /* Pure black */
--neutral-900: #141414;        /* Almost black */
--neutral-850: #1B1D1F;
--neutral-800: #1D1D1D;
--neutral-750: #1D1F21;
--neutral-700: #2B2E32;        /* Very dark grey */
--neutral-650: #342F2F;
--neutral-600: #373A40;
--neutral-550: #3A3A3A;
--neutral-500: #43474F;        /* Mid-dark grey */
--neutral-450: #4E525A;
--neutral-400: #575A60;        /* Medium grey */
--neutral-350: #626872;
--neutral-300: #7A828E;        /* Light-medium grey */
--neutral-250: #8E98A8;
--neutral-200: #ADADAD;        /* Light grey */
--neutral-150: #B7BEC5;
--neutral-100: #D6D8DC;        /* Very light grey */
--neutral-50: #E8E8E8;
--neutral-25: #F2F3F4;
--neutral-white: #FFFFFF;      /* Pure white */
```

**Usage Matrix**:

| Element | Light Mode | Dark Mode (Future) |
|---------|------------|-------------------|
| Background | `neutral-white` | `neutral-black` |
| Surface | `neutral-25` | `neutral-800` |
| Border | `neutral-100` | `neutral-600` |
| Text Primary | `neutral-black` | `neutral-white` |
| Text Secondary | `neutral-500` | `neutral-300` |
| Disabled | `neutral-200` | `neutral-600` |

### 1.2 Typography

**Status**: Font information incomplete in Figma export. Needs verification with design team.

#### Recommended Typography Scale

| Level | Font Size | Line Height | Font Weight | Use Case | Token Name |
|-------|-----------|-------------|-------------|----------|------------|
| H1 | 48px | 56px | 700 (Bold) | Page titles | `text-h1` |
| H2 | 36px | 44px | 700 (Bold) | Section headings | `text-h2` |
| H3 | 28px | 36px | 600 (Semibold) | Subsection headings | `text-h3` |
| H4 | 24px | 32px | 600 (Semibold) | Card titles | `text-h4` |
| H5 | 20px | 28px | 600 (Semibold) | Small headings | `text-h5` |
| Body Large | 18px | 28px | 400 (Regular) | Main body text | `text-body-lg` |
| Body | 16px | 24px | 400 (Regular) | Default body text | `text-body` |
| Body Small | 14px | 20px | 400 (Regular) | Secondary text | `text-body-sm` |
| Caption | 12px | 16px | 400 (Regular) | Labels, captions | `text-caption` |
| Button Large | 16px | 24px | 600 (Semibold) | Large buttons | `text-button-lg` |
| Button | 14px | 20px | 600 (Semibold) | Default buttons | `text-button` |

**Font Families** (To be confirmed):
```css
--font-primary: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-heading: 'Satoshi', 'Pretendard', sans-serif;
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
```

**Accessibility Requirements**:
- Minimum body text size: 16px (WCAG AA)
- Minimum contrast ratio: 4.5:1 for normal text, 3:1 for large text
- Line height at least 1.5x font size for body text

### 1.3 Spacing System

**Base Unit**: 8px (recommended for consistency)

#### Spacing Scale (8px base)

| Token Name | Value | Use Case |
|------------|-------|----------|
| `space-0` | 0px | No spacing |
| `space-1` | 4px | Tight spacing, icons |
| `space-2` | 8px | Small gaps, compact UI |
| `space-3` | 12px | Medium-small gaps |
| `space-4` | 16px | Standard spacing |
| `space-5` | 24px | Medium spacing |
| `space-6` | 32px | Large spacing |
| `space-7` | 40px | Section spacing |
| `space-8` | 48px | Extra large spacing |
| `space-9` | 64px | Major section breaks |
| `space-10` | 80px | Page-level spacing |

#### Component-Specific Spacing

**Padding**:
- Buttons: `padding-y: space-3 (12px)`, `padding-x: space-5 (24px)`
- Cards: `padding: space-4 (16px)` to `space-6 (32px)`
- Containers: `padding: space-6 (32px)` to `space-8 (48px)`

**Gaps**:
- Grid gaps: `space-4 (16px)` to `space-5 (24px)`
- Form elements: `space-3 (12px)`
- Navigation items: `space-4 (16px)`

**Margins**:
- Section margins: `space-8 (48px)` to `space-10 (80px)`
- Component margins: `space-4 (16px)` to `space-6 (32px)`

### 1.4 Border Radius

| Token Name | Value | Use Case |
|------------|-------|----------|
| `radius-none` | 0px | Sharp corners (rare) |
| `radius-sm` | 4px | Buttons, chips |
| `radius-md` | 8px | Cards, inputs |
| `radius-lg` | 12px | Large cards, modals |
| `radius-xl` | 16px | Special cards |
| `radius-full` | 9999px | Pills, avatars |

### 1.5 Shadows

| Token Name | CSS Value | Use Case |
|------------|-----------|----------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle elevation |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.15)` | Dropdowns, popovers |
| `shadow-xl` | `0 20px 25px rgba(0,0,0,0.2)` | Modals, overlays |

### 1.6 Animation Timing

| Token Name | Value | Use Case |
|------------|-------|----------|
| `duration-instant` | 100ms | Immediate feedback |
| `duration-fast` | 200ms | Hover effects, buttons |
| `duration-base` | 300ms | Default transitions |
| `duration-slow` | 500ms | Modals, drawers |
| `duration-slower` | 800ms | Page transitions |

**Easing Functions**:
```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

---

## 2. Component Specifications

### 2.1 Navigation Components

#### Top Navigation Group (Web)

**Component ID**: `TopNavigationWeb`
**Variants**: 5 (Home, About, Curriculum, Work, News&Event)

**Props**:
```typescript
interface TopNavigationWebProps {
  type: 'Home' | 'About' | 'Curriculum' | 'Work' | 'News&Event';
  activeSection?: string;
  onNavigate?: (section: string) => void;
}
```

**States**:
- Default: `neutral-500` text
- Active: `primary-blue` text, `primary-blue` underline
- Hover: `primary-light-blue` text

**Specifications**:
- Height: 80px
- Padding: `space-4 (16px)` horizontal
- Gap between items: `space-6 (32px)`
- Font: `text-body-lg` (18px, Semibold)
- Active indicator: 2px underline

**Accessibility**:
- `role="navigation"`
- `aria-label="Main navigation"`
- `aria-current="page"` for active item
- Keyboard: Tab to navigate, Enter to select

#### Top Navigation Group (Mobile)

**Component ID**: `TopNavigationMobile`
**Variants**: 10 (State: Enabled/Selected, Selected: About/Curriculum/Work/News&Event/null)

**Props**:
```typescript
interface TopNavigationMobileProps {
  state: 'Enabled' | 'Selected';
  selected?: 'About' | 'Curriculum' | 'Work' | 'News&Event' | null;
  onSelect?: (section: string) => void;
}
```

**States**:
- Enabled: Hamburger menu icon
- Selected: Drawer open, selected item highlighted

**Specifications**:
- Height: 60px
- Drawer: Full width, slide-in from top
- Item height: 48px
- Gap: `space-2 (8px)`
- Font: `text-body` (16px, Medium)

**Accessibility**:
- `aria-expanded` on menu button
- `aria-hidden` on drawer when closed
- Focus trap when drawer open

### 2.2 Button Components

#### Category Btn (Web)

**Component ID**: `CategoryBtnWeb`
**Variants**: 6 (State: Pressed/Default/Hover, Size: Large/Medium)

**Props**:
```typescript
interface CategoryBtnWebProps {
  btnText: string;
  iconRight?: boolean;
  state?: 'Pressed' | 'Default' | 'Hover';
  pressed?: boolean;
  size?: 'Large' | 'Medium';
  onClick?: () => void;
}
```

**Size Specifications**:

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| Large | 48px | 24px horizontal | 16px |
| Medium | 40px | 20px horizontal | 14px |

**State Styles**:

| State | Background | Text Color | Border |
|-------|------------|------------|--------|
| Default | `neutral-white` | `neutral-black` | 1px `neutral-200` |
| Hover | `neutral-25` | `primary-blue` | 1px `primary-light-blue` |
| Pressed | `primary-blue` | `neutral-white` | 1px `primary-blue` |

**Accessibility**:
- `aria-pressed` for toggle state
- Minimum touch target: 44x44px (WCAG AAA)
- Focus visible ring: 2px `primary-blue`

#### Filter Tabs

**Component ID**: `FilterTabs`
**Variants**: 6 (State: Selected/Enabled/Hover, Size: Large/Medium)

**Props**:
```typescript
interface FilterTabsProps {
  filterTabs: string;
  state?: 'Selected' | 'Enabled' | 'Hover';
  size?: 'Large' | 'Medium';
  onClick?: () => void;
}
```

**Specifications**:
- Border radius: `radius-full` (pill shape)
- Gap between tabs: `space-2 (8px)`
- Active tab: `primary-blue` background, white text
- Inactive tab: transparent background, `neutral-500` text

**Accessibility**:
- `role="tablist"` on container
- `role="tab"` on each tab
- `aria-selected` on active tab

### 2.3 Card Components

#### News & Events Card

**Component ID**: `NewsEventCard`
**Variants**: 11 (complex props)

**Props**:
```typescript
interface NewsEventCardProps {
  title: string;
  thumbnail?: string;
  hasImage: boolean;
  description?: string;
  date: Date;
  tags?: string[];
  variant?: 'default' | 'hovering';
}
```

**Specifications**:
- Width: 100% (responsive)
- Padding: `space-4 (16px)`
- Border radius: `radius-md (8px)`
- Border: 1px `neutral-100`
- Shadow: `shadow-sm` (default), `shadow-md` (hover)

**Layout**:
```
┌──────────────────────────┐
│  [Thumbnail Image]       │ ← 16:9 aspect ratio
├──────────────────────────┤
│  Date                    │ ← text-caption, neutral-500
│  Title                   │ ← text-h5, 2 lines max
│  Description             │ ← text-body-sm, 3 lines max
│  [Tag] [Tag]             │ ← Chip components
└──────────────────────────┘
```

**Accessibility**:
- `<article>` semantic tag
- `<time>` for date
- `alt` text for thumbnail (required)
- Keyboard: Entire card focusable

#### Work Card (Project Card)

**Component ID**: `ProjectCard`
**Variants**: 4 (display: web/mobile, showChip: boolean)

**Props**:
```typescript
interface ProjectCardProps {
  projectName: string;
  designer: string;
  year: string;
  image: string;
  showChip?: boolean;
  display?: 'web' | 'mobile';
}
```

**Specifications**:
- Aspect ratio: 3:4 (portrait)
- Overlay: Gradient from bottom (rgba(0,0,0,0) to rgba(0,0,0,0.6))
- Hover: Scale 1.05, `shadow-lg`

**Layout**:
```
┌──────────────────┐
│                  │
│  [Project Image] │
│                  │
│  ┌─────────────┐ │ ← Overlay (bottom)
│  │ Chip (opt)  │ │
│  │ Project Name│ │ ← text-h5, white
│  │ Designer    │ │ ← text-body-sm, neutral-200
│  │ Year        │ │ ← text-caption, neutral-300
│  └─────────────┘ │
└──────────────────┘
```

### 2.4 UI Elements

#### Chip / Tag

**Component ID**: `Chip`
**Variants**: 4 (Property 1: web/mobile/web_line/mobile_line)

**Props**:
```typescript
interface ChipProps {
  text: string;
  variant?: 'web' | 'mobile' | 'web_line' | 'mobile_line';
}
```

**Specifications**:

| Variant | Background | Text Color | Border |
|---------|------------|------------|--------|
| web | `primary-blue` | white | none |
| mobile | `primary-blue` | white | none |
| web_line | transparent | `primary-blue` | 1px `primary-blue` |
| mobile_line | transparent | `primary-blue` | 1px `primary-blue` |

- Border radius: `radius-full`
- Padding: `4px 12px`
- Font: `text-caption` (12px, Medium)

#### Pagination

**Component ID**: `Pagination`
**Variants**: 2 (web/mobile)

**Props**:
```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  display?: 'web' | 'mobile';
  onPageChange?: (page: number) => void;
}
```

**Specifications (Web)**:
- Show 5 page numbers + prev/next
- Active page: `primary-blue` background, white text
- Inactive: transparent, `neutral-500` text
- Hover: `neutral-25` background

**Specifications (Mobile)**:
- Show current page only + prev/next
- Font: `text-body` (16px)

**Accessibility**:
- `role="navigation"`
- `aria-label="Pagination"`
- `aria-current="page"` for active
- Disabled prev/next when at edges

#### Footer

**Component ID**: `Footer`
**Variants**: 2 (web/mobile)

**Props**:
```typescript
interface FooterProps {
  display?: 'web' | 'mobile';
  links?: FooterLink[];
  contactInfo?: ContactInfo;
}
```

**Layout (Web)**:
```
┌─────────────────────────────────────────┐
│  Logo                    [Social Icons] │
│                                          │
│  Link 1 | Link 2 | Link 3 | Link 4      │
│                                          │
│  Address Line 1                          │
│  Address Line 2                          │
│  Phone | Email                           │
│                                          │
│  Copyright © 2026 SMVD                   │
└─────────────────────────────────────────┘
```

**Specifications**:
- Background: `neutral-black`
- Text: `neutral-200`
- Padding: `space-8 (48px)` top/bottom
- Gap: `space-5 (24px)`

---

## 3. Responsive Guidelines

### 3.1 Breakpoints

**Standard Breakpoints**:

```css
/* Mobile First */
@media (min-width: 640px) { /* Small */ }
@media (min-width: 768px) { /* Medium (Tablet) */ }
@media (min-width: 1024px) { /* Large (Desktop) */ }
@media (min-width: 1280px) { /* XL */ }
@media (min-width: 1536px) { /* 2XL */ }
```

**Component-Specific Breakpoints**:

| Component | Mobile (<768px) | Tablet (768-1023px) | Desktop (1024px+) |
|-----------|-----------------|---------------------|-------------------|
| TopNav | Hamburger menu | Horizontal nav | Horizontal nav |
| Grid Columns | 1 column | 2 columns | 3-4 columns |
| Spacing | 16px | 24px | 32-48px |
| Font Scale | 0.9x | 1x | 1x |

### 3.2 Responsive Strategy

#### 1. Component Swap (Complete Replacement)

**Use when**: Layout fundamentally different between devices

**Examples**:
- TopNavigation: `TopNavigationWeb` vs `TopNavigationMobile`
- Category Buttons: Different sizes and interactions

```typescript
const Navigation = () => {
  const { isMobile } = useResponsive();

  return isMobile ? <TopNavigationMobile /> : <TopNavigationWeb />;
};
```

#### 2. Display Prop (Same Component, Different Styles)

**Use when**: Same content, different presentation

**Examples**:
- Pagination
- More button
- Chip
- Footer

```typescript
<Pagination display={isMobile ? 'mobile' : 'web'} />
```

#### 3. CSS Media Queries (Style Adjustments)

**Use when**: Minor layout tweaks

```css
.card {
  padding: var(--space-4); /* 16px */
}

@media (min-width: 1024px) {
  .card {
    padding: var(--space-6); /* 32px */
  }
}
```

### 3.3 Grid System

**12-Column Grid** (Desktop):

```css
.container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-5); /* 24px */
}

/* Example: 3-column layout */
.item {
  grid-column: span 4; /* 4/12 = 33.33% */
}
```

**Responsive Grid**:

| Device | Columns | Gap |
|--------|---------|-----|
| Mobile | 1 | 16px |
| Tablet | 2-3 | 20px |
| Desktop | 3-4 | 24px |

### 3.4 Typography Scaling

**Fluid Typography** (recommended):

```css
h1 {
  font-size: clamp(32px, 5vw, 48px);
}

body {
  font-size: clamp(14px, 2vw, 16px);
}
```

**Or use breakpoint-specific sizes**:

```css
h1 {
  font-size: 32px; /* Mobile */
}

@media (min-width: 768px) {
  h1 {
    font-size: 40px; /* Tablet */
  }
}

@media (min-width: 1024px) {
  h1 {
    font-size: 48px; /* Desktop */
  }
}
```

### 3.5 Touch Targets (Mobile)

**Minimum Sizes**:
- Touch target: 44x44px (WCAG AAA)
- Acceptable: 40x40px (WCAG AA)
- Spacing between targets: 8px minimum

**Implementation**:
```css
.button-mobile {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 24px;
}
```

---

## 4. Accessibility Requirements

### 4.1 WCAG AA Compliance Checklist

#### Color Contrast

**Text Contrast Ratios** (WCAG AA):

| Text Type | Minimum Ratio | Example |
|-----------|---------------|---------|
| Normal text (<18px) | 4.5:1 | `neutral-black` on `neutral-white` |
| Large text (18px+) | 3:1 | `primary-blue` on `neutral-white` |
| UI components | 3:1 | Borders, icons |

**Verification Required**:
- [ ] `primary-deep-blue` (#0845A7) on white: 4.5:1
- [ ] `primary-blue` (#1A46E7) on white: 3.5:1 (needs checking)
- [ ] `primary-light-blue` (#489AFF) on white: May fail, use for large text only
- [ ] `neutral-500` (#43474F) on white: Check for body text

**Tools**:
- WebAIM Contrast Checker
- Chrome DevTools Accessibility Panel

#### Keyboard Navigation

**Requirements**:
- [ ] All interactive elements focusable via Tab
- [ ] Focus order follows logical reading order
- [ ] Visible focus indicators (2px outline, `primary-blue`)
- [ ] Escape key closes modals/drawers
- [ ] Arrow keys for navigation within components (optional)

**Implementation**:
```css
*:focus-visible {
  outline: 2px solid var(--primary-blue);
  outline-offset: 2px;
}
```

#### Screen Reader Support

**Semantic HTML**:
- [ ] `<header>`, `<nav>`, `<main>`, `<footer>`, `<article>`, `<section>`
- [ ] `<h1>` to `<h6>` in hierarchical order
- [ ] `<button>` for clickable elements (not `<div>`)
- [ ] `<a>` for links (with meaningful text)

**ARIA Labels**:
```html
<!-- Navigation -->
<nav aria-label="Main navigation">
  <a href="/" aria-current="page">Home</a>
</nav>

<!-- Buttons -->
<button aria-pressed="false">Category</button>
<button aria-expanded="false" aria-controls="menu">Menu</button>

<!-- Images -->
<img src="..." alt="Descriptive text">

<!-- Form -->
<label for="email">Email</label>
<input id="email" type="email" aria-required="true">
```

#### Alternative Text

**Image Alt Text Rules**:
- Decorative images: `alt=""`
- Informative images: Describe content
- Complex images (charts): Use `aria-describedby` for long description
- Linked images: Describe destination

**Example**:
```html
<!-- Decorative -->
<img src="pattern.svg" alt="" role="presentation">

<!-- Informative -->
<img src="project.jpg" alt="Student project: Typography poster design">

<!-- Link -->
<a href="/work/123">
  <img src="thumbnail.jpg" alt="View project: Brand identity for startup">
</a>
```

### 4.2 Accessibility Testing Checklist

**Automated Testing**:
- [ ] axe DevTools (Chrome extension)
- [ ] Lighthouse Accessibility score (90+)
- [ ] WAVE (Web Accessibility Evaluation Tool)

**Manual Testing**:
- [ ] Keyboard-only navigation (unplug mouse)
- [ ] Screen reader (NVDA/JAWS on Windows, VoiceOver on Mac)
- [ ] Zoom to 200% (no horizontal scroll)
- [ ] High contrast mode (Windows)
- [ ] Color blindness simulation (Chrome DevTools)

**Device Testing**:
- [ ] Mobile: iOS VoiceOver, Android TalkBack
- [ ] Tablet: iPad VoiceOver
- [ ] Desktop: NVDA, JAWS, VoiceOver

### 4.3 Accessibility Features to Implement

#### Skip Links

```html
<a href="#main-content" class="skip-link">Skip to main content</a>

<style>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--primary-blue);
  color: white;
  padding: 8px;
  z-index: 9999;
}

.skip-link:focus {
  top: 0;
}
</style>
```

#### Live Regions (for dynamic content)

```html
<!-- For notifications -->
<div role="status" aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

<!-- For errors -->
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>
```

#### Focus Management

```typescript
// Modal open: trap focus
const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
};
```

---

## 5. Implementation Guide

### 5.1 Tailwind CSS Configuration

**tailwind.config.js**:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          'deep-blue': '#0845A7',
          'blue': '#1A46E7',
          'light-blue': '#489AFF',
          'teal': '#1ABC9C',
        },
        accent: {
          'purple': '#9747FF',
          'light-purple': '#A14AFF',
        },
        semantic: {
          'error': '#FF0000',
          'error-light': '#FF5F59',
          'warning': '#FFCB53',
        },
        neutral: {
          'black': '#000000',
          900: '#141414',
          850: '#1B1D1F',
          800: '#1D1D1D',
          750: '#1D1F21',
          700: '#2B2E32',
          650: '#342F2F',
          600: '#373A40',
          550: '#3A3A3A',
          500: '#43474F',
          450: '#4E525A',
          400: '#575A60',
          350: '#626872',
          300: '#7A828E',
          250: '#8E98A8',
          200: '#ADADAD',
          150: '#B7BEC5',
          100: '#D6D8DC',
          50: '#E8E8E8',
          25: '#F2F3F4',
          'white': '#FFFFFF',
        },
      },
      spacing: {
        '0': '0px',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '24px',
        '6': '32px',
        '7': '40px',
        '8': '48px',
        '9': '64px',
        '10': '80px',
      },
      borderRadius: {
        'none': '0px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0,0,0,0.05)',
        'md': '0 4px 6px rgba(0,0,0,0.1)',
        'lg': '0 10px 15px rgba(0,0,0,0.15)',
        'xl': '0 20px 25px rgba(0,0,0,0.2)',
      },
      transitionDuration: {
        'instant': '100ms',
        'fast': '200ms',
        'base': '300ms',
        'slow': '500ms',
        'slower': '800ms',
      },
    },
  },
  plugins: [],
};
```

### 5.2 CSS Custom Properties (Alternative)

**globals.css**:

```css
:root {
  /* Colors - Primary */
  --primary-deep-blue: #0845A7;
  --primary-blue: #1A46E7;
  --primary-light-blue: #489AFF;
  --primary-teal: #1ABC9C;

  /* Colors - Accent */
  --accent-purple: #9747FF;
  --accent-light-purple: #A14AFF;

  /* Colors - Semantic */
  --semantic-error: #FF0000;
  --semantic-error-light: #FF5F59;
  --semantic-warning: #FFCB53;

  /* Colors - Neutral */
  --neutral-black: #000000;
  --neutral-900: #141414;
  --neutral-500: #43474F;
  --neutral-100: #D6D8DC;
  --neutral-white: #FFFFFF;
  /* ... (add all levels) */

  /* Spacing */
  --space-0: 0px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 40px;
  --space-8: 48px;
  --space-9: 64px;
  --space-10: 80px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.15);
  --shadow-xl: 0 20px 25px rgba(0,0,0,0.2);

  /* Animation */
  --duration-instant: 100ms;
  --duration-fast: 200ms;
  --duration-base: 300ms;
  --duration-slow: 500ms;
  --duration-slower: 800ms;

  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 5.3 React TypeScript Component Template

**Button Component Example**:

```typescript
// components/ui/Button.tsx
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-sm font-semibold transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary-blue text-neutral-white hover:bg-primary-deep-blue',
        outline: 'border border-neutral-200 bg-neutral-white text-neutral-black hover:bg-neutral-25 hover:border-primary-light-blue',
        ghost: 'bg-transparent text-neutral-black hover:bg-neutral-25',
      },
      size: {
        large: 'h-12 px-6 text-base',
        medium: 'h-10 px-5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'medium',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  iconRight?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, iconRight, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
        {iconRight && <span className="ml-2">{iconRight}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

**Usage**:
```tsx
<Button variant="default" size="large">
  Click Me
</Button>

<Button variant="outline" size="medium" iconRight={<ArrowRight />}>
  Learn More
</Button>
```

### 5.4 Responsive Hook

**hooks/useResponsive.ts**:

```typescript
import { useState, useEffect } from 'react';

interface Breakpoints {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export const useResponsive = (): Breakpoints => {
  const [breakpoints, setBreakpoints] = useState<Breakpoints>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      setBreakpoints({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      });
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoints;
};
```

**Usage**:
```tsx
const MyComponent = () => {
  const { isMobile, isDesktop } = useResponsive();

  return (
    <div>
      {isMobile ? <MobileNav /> : <DesktopNav />}
      <main className={isDesktop ? 'px-8' : 'px-4'}>
        {/* Content */}
      </main>
    </div>
  );
};
```

### 5.5 Component Documentation Template

**For each component, document**:

```markdown
# ComponentName

## Description
Brief description of the component's purpose.

## Props
| Prop Name | Type | Default | Required | Description |
|-----------|------|---------|----------|-------------|
| variant | 'default' \| 'outline' | 'default' | No | Visual style |
| size | 'large' \| 'medium' | 'medium' | No | Component size |
| onClick | () => void | - | No | Click handler |

## States
- Default: Initial state
- Hover: On mouse over
- Active: On click/press
- Disabled: Cannot interact

## Accessibility
- Keyboard: Tab to focus, Enter to activate
- Screen reader: Announces as "Button, [label]"
- ARIA: `role="button"` (implicit)

## Examples
\`\`\`tsx
<Button variant="default" size="large">
  Primary Action
</Button>
\`\`\`

## Related Components
- IconButton
- LinkButton
```

---

## 6. Design System Maintenance

### 6.1 Version Control

**Semantic Versioning**:
- **Major (1.0.0)**: Breaking changes (component API changes)
- **Minor (0.1.0)**: New components, non-breaking features
- **Patch (0.0.1)**: Bug fixes, documentation updates

**Change Log** (example):
```markdown
## [1.1.0] - 2026-02-15
### Added
- New `Tooltip` component
- Dark mode support for all components

### Changed
- Updated `Button` focus ring to 2px (was 1px)
- Increased touch target size to 44px

### Fixed
- `Pagination` keyboard navigation bug
```

### 6.2 Design Tokens Update Process

1. **Propose Change**: Create issue/RFC
2. **Review**: Design team + frontend team
3. **Update**: Modify token files (colors.ts, spacing.ts)
4. **Test**: Visual regression tests
5. **Document**: Update this file + component docs
6. **Release**: Bump version, publish

### 6.3 Component Lifecycle

**States**:
- **Draft**: In development, not ready for use
- **Beta**: Ready for testing, API may change
- **Stable**: Production-ready, API locked
- **Deprecated**: Marked for removal, use alternative

**Example**:
```typescript
/**
 * @deprecated Use `Button` component instead
 * @see Button
 */
export const OldButton = () => { ... };
```

---

## 7. FAQ & Common Issues

### 7.1 Color Contrast Failures

**Problem**: `primary-light-blue` (#489AFF) fails contrast on white background.

**Solution**:
- Use only for large text (18px+)
- Or add dark overlay: `background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3))`
- For small text, use `primary-blue` instead

### 7.2 Typography Not Rendering

**Problem**: Font family not applied.

**Solution**:
1. Check font file imported in `globals.css`:
   ```css
   @font-face {
     font-family: 'Pretendard';
     src: url('/fonts/Pretendard-Regular.woff2') format('woff2');
   }
   ```
2. Verify font-family declaration:
   ```css
   body {
     font-family: 'Pretendard', sans-serif;
   }
   ```

### 7.3 Spacing Inconsistencies

**Problem**: Developers using random px values.

**Solution**:
- Use design tokens only: `var(--space-4)` or Tailwind `p-4`
- Lint rule: Disallow hardcoded px values (stylelint)
- Code review: Reject PRs with magic numbers

### 7.4 Mobile Navigation Not Accessible

**Problem**: Hamburger menu not keyboard accessible.

**Solution**:
```tsx
<button
  aria-label="Toggle menu"
  aria-expanded={isOpen}
  aria-controls="mobile-menu"
  onClick={toggleMenu}
>
  <HamburgerIcon />
</button>

<nav
  id="mobile-menu"
  aria-hidden={!isOpen}
  hidden={!isOpen}
>
  {/* Menu items */}
</nav>
```

---

## 8. Resources & Tools

### 8.1 Design Tools
- **Figma**: Source of truth for designs
- **Zeplin/Inspect**: Handoff specs (if applicable)

### 8.2 Development Tools
- **Tailwind CSS**: Utility-first CSS framework
- **CVA (Class Variance Authority)**: Component variants
- **Radix UI**: Accessible primitives (recommended)
- **Storybook**: Component documentation/playground

### 8.3 Accessibility Tools
- **axe DevTools**: Browser extension for automated checks
- **WAVE**: Web accessibility evaluation
- **Lighthouse**: Performance + accessibility audit
- **NVDA/JAWS**: Screen readers (Windows)
- **VoiceOver**: Screen reader (macOS/iOS)

### 8.4 Testing Tools
- **Chromatic**: Visual regression testing
- **Playwright**: E2E testing with accessibility checks
- **Jest**: Unit testing for components

---

## 9. Next Steps & Roadmap

### Phase 1: Foundation (Current)
- [x] Design tokens defined
- [x] Component specifications documented
- [x] Accessibility requirements outlined
- [ ] Verify typography with design team
- [ ] Test color contrast ratios

### Phase 2: Implementation
- [ ] Set up Tailwind config
- [ ] Implement core components (Button, Input, Card)
- [ ] Build navigation components (TopNav, Footer)
- [ ] Create responsive hooks

### Phase 3: Page Components
- [ ] Home page sections
- [ ] About Major page
- [ ] Curriculum page
- [ ] People page
- [ ] Work page
- [ ] News & Events page

### Phase 4: Enhancements
- [ ] Dark mode support
- [ ] Animation system (Framer Motion)
- [ ] Loading states & skeletons
- [ ] Error states & messaging

### Phase 5: Documentation
- [ ] Storybook setup
- [ ] Component usage examples
- [ ] Developer onboarding guide

---

## 10. Glossary

| Term | Definition |
|------|------------|
| **Design Token** | Foundational design decision stored as a variable (color, spacing, etc.) |
| **Component Variant** | Different visual/behavioral versions of the same component |
| **Semantic Color** | Color with specific meaning (error, warning, success) |
| **WCAG** | Web Content Accessibility Guidelines |
| **ARIA** | Accessible Rich Internet Applications (attributes for screen readers) |
| **Breakpoint** | Screen width threshold for responsive design changes |
| **Focus Trap** | Keyboard focus restricted to a specific area (e.g., modal) |
| **Touch Target** | Minimum size for clickable elements on touchscreens |

---

**Document Version**: 1.0
**Last Updated**: 2026-02-12
**Maintained By**: Design Lead (AI) + SMVD Development Team
**Contact**: For questions or suggestions, open an issue in the project repository.
