# Interactive Wall Calendar Component

A polished, interactive wall calendar built with **Next.js 15** and **TypeScript**, submitted as a frontend engineering challenge.

## ✨ Features

### Core Requirements
- **Wall Calendar Aesthetic** — physical wall-calendar look with a hero nature photograph that changes each month, dark header strip with binding holes, paper texture, and dashed notes section divider
- **Day Range Selector** — click a start date then click an end date; hover preview shows the prospective range; clear visual states for start, end, and in-between days
- **Integrated Notes** — add color-coded sticky notes tied to your selected date range; notes display the range label and can be deleted individually
- **Fully Responsive** — side-by-side desktop layout; vertically stacked mobile layout with full touch support

### Creative Extras
- **Page-flip animation** — CSS 3D perspective flip when navigating months (`flipNext` / `flipPrev` keyframes)
- **Month-aware color theming** — each month has its own accent + background palette derived from the hero image, applied via CSS custom properties so the entire UI shifts on navigation
- **Holiday markers** — dot indicators on US public holidays with tooltip on hover
- **Today ring** — red ring highlights today's date at all times
- **Color-coded notes** — six pastel colors to categorize notes; active color shown with a ring indicator
- **Keyboard shortcut** — press Enter in the notes textarea to save without reaching for the mouse

## 🛠 Tech Choices

| Decision | Rationale |
|---|---|
| Next.js App Router | Modern React with zero-config TypeScript and fast dev server |
| CSS Modules | Scoped styles, no runtime overhead, co-located with the component |
| No external UI library | Full control over every pixel; keeps the bundle lean |
| `localStorage` not used | Assignment says "strictly frontend"; state lives in React (`useState`) which is sufficient for a demo — no persistence needed |
| Unsplash for images | Free, high-quality, CDN-delivered; no API key needed at this resolution |

## 🚀 Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Requires **Node.js 18.18+**.

## 📁 Project Structure

```
app/
  components/
    WallCalendar.tsx          # Main component (~280 lines)
    WallCalendar.module.css   # All styles (~400 lines)
  page.tsx                    # Thin wrapper
  layout.tsx
  globals.css
```

## 🎨 Design Decisions

- **Typography**: Georgia serif for body copy (warm, editorial) paired with Courier New monospace for labels (typewriter / planner aesthetic)
- **Color**: Derived per-month from the hero photo palette — one accent for selected states, one tinted background; transitions smoothly with CSS `transition`
- **Animations**: Single well-orchestrated page-flip on month navigation rather than scattered micro-interactions; hover scale on day cells for tactile feedback
- **Layout**: Sticky hero panel on desktop keeps the image in view while scrolling through notes; collapses to stacked on mobile
