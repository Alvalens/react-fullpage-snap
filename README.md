# @alvalens/react-fullpage-snap

A lightweight, modern React library for fullpage scroll snapping with smooth animations. Built from the ground up for React with zero dependencies and full TypeScript support.

## Features

- **Smooth scroll snapping** between sections
- **Keyboard navigation** (Arrow keys, Page Up/Down, Home/End, Space)
- **Mouse wheel** scrolling with momentum detection
- **Touch/swipe** support for mobile devices
- **Hash-based navigation** (`/#section-name`)
- **Menu synchronization** with auto-highlighting
- **Framework agnostic** - works with Next.js, Remix, Vite, etc.
- **TypeScript** support out of the box
- **Lightweight** - no external dependencies
- **Performance optimized** with RAF-based animations

## Installation

```bash
npm install @alvalens/react-fullpage-snap
# or
pnpm add @alvalens/react-fullpage-snap
# or
yarn add @alvalens/react-fullpage-snap
```

## Basic Usage

```tsx
import { FullPageProvider, FullPageWrapper, Section } from '@alvalens/react-fullpage-snap';

function App() {
  return (
    <FullPageProvider
      scrollingSpeed={1000}
      anchors={['home', 'about', 'projects', 'contact']}
      menu="#navigation"
    >
      <FullPageWrapper>
        <Section>
          <h1>Home</h1>
        </Section>
        <Section>
          <h1>About</h1>
        </Section>
        <Section>
          <h1>Projects</h1>
        </Section>
        <Section>
          <h1>Contact</h1>
        </Section>
      </FullPageWrapper>
    </FullPageProvider>
  );
}
```

### Menu Integration

```tsx
<nav id="navigation">
  <ul>
    <li data-menuanchor="home">Home</li>
    <li data-menuanchor="about">About</li>
    <li data-menuanchor="projects">Projects</li>
    <li data-menuanchor="contact">Contact</li>
  </ul>
</nav>
```

Add this CSS for active menu highlighting:

```css
.section {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

li.active {
  /* Your active styles */
}
```

## Programmatic Navigation

Use the `useFullPage` hook to access navigation methods:

```tsx
import { useFullPage } from '@alvalens/react-fullpage-snap';

function NavigationButtons() {
  const { moveTo, moveNext, movePrevious, getActiveSection } = useFullPage();

  return (
    <div>
      <button onClick={() => moveTo(0)}>Go to first</button>
      <button onClick={() => moveTo('about')}>Go to about</button>
      <button onClick={moveNext}>Next section</button>
      <button onClick={movePrevious}>Previous section</button>
    </div>
  );
}
```

## API Reference

### FullPageProvider Props

| Prop                  | Type         | Default       | Description                                      |
| --------------------- | ------------ | ------------- | ------------------------------------------------ |
| `scrollingSpeed`    | `number`   | `1000`      | Scroll animation duration in ms                  |
| `anchors`           | `string[]` | `[]`        | URL anchors for each section                     |
| `menu`              | `string`   | `undefined` | CSS selector for menu (uses `data-menuanchor`) |
| `lockAnchors`       | `boolean`  | `false`     | Prevent anchor changes in URL                    |
| `keyboardScrolling` | `boolean`  | `true`      | Enable keyboard navigation                       |
| `touchScrolling`    | `boolean`  | `true`      | Enable touch/swipe navigation                    |
| `wheelScrolling`    | `boolean`  | `true`      | Enable mouse wheel navigation                    |
| `scrollThreshold`   | `number`   | `50`        | Wheel delta threshold for triggering scroll      |
| `touchThreshold`    | `number`   | `50`        | Touch swipe distance threshold (px)              |

### Callbacks

```tsx
<FullPageProvider
  onSectionChange={(prevIndex, nextIndex) => {
    console.log(`Changed from ${prevIndex} to ${nextIndex}`);
  }}
  beforeScroll={(origin, destination) => {
    console.log('Before scroll', origin, destination);
  }}
  afterScroll={(origin, destination) => {
    console.log('After scroll', origin, destination);
  }}
>
```

### useFullPage Hook

```tsx
const {
  moveTo,           // (index: number | anchor: string) => void
  moveNext,         // () => void
  movePrevious,     // () => void
  getActiveSection, // () => SectionInfo
  setAllowScrolling, // (allow: boolean) => void
  activeIndex,      // number
  isScrolling,      // boolean
  scrollDirection,  // 'up' | 'down' | null
  totalSections,    // number
} = useFullPage();
```

## License

MIT © Alvalen Shafelbilyunazra

## Credits

Created by [Alvalen Shafelbilyunazra](https://alvalens.my.id)

Inspired by fullpage.js by Alvaro Trigo
