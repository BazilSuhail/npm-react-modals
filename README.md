# entity-react-modals

[![npm version](https://img.shields.io/npm/v/entity-react-modals.svg)](https://www.npmjs.com/package/entity-react-modals)
[![npm downloads](https://img.shields.io/npm/dm/entity-react-modals.svg)](https://www.npmjs.com/package/entity-react-modals)
[![license](https://img.shields.io/npm/l/entity-react-modals.svg)](https://github.com/BazilSuhail/npm-react-modals/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/entity-react-modals)](https://bundlephobia.com/package/entity-react-modals)
[![typescript](https://img.shields.io/badge/typescript-ready-blue.svg)](https://www.typescriptlang.org/)

Zero-dependency React modal library with spring physics animations powered by the Web Animations API.

- **7 animation variants** — scale, slide, fade, none
- **5 spring presets** — default, gentle, wobbly, stiff, slow
- **Focus management** — auto-focus, return focus, `initialFocusRef`/`finalFocusRef`
- **Force mount** — keep modal in DOM for CSS transitions
- **Scroll lock** — `preventScroll` with reference-counted body overflow
- **Event callbacks** — `onEscapeKeyDown`, `onInteractOutside`, `onOpenAutoFocus`, `onCloseAutoFocus`
- **`data-state` attributes** — style open/closed states with CSS
- Zero-config — styles auto-injected, no CSS import needed
- Compound component API for flexible composition
- Controlled and uncontrolled modes
- Portal-rendered, accessible, and tree-shakable

## Install

```bash
npm install entity-react-modals
```

## Quick Start

```tsx
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalClose,
} from 'entity-react-modals';

function App() {
  return (
    <Modal>
      <ModalTrigger>
        <button>Open Modal</button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <h2>Hello</h2>
          <ModalClose />
        </ModalHeader>
        <ModalBody>
          <p>This modal uses spring physics for smooth animations.</p>
        </ModalBody>
        <ModalFooter>
          <ModalClose>Cancel</ModalClose>
          <button>Confirm</button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
```

## Components

| Component | Purpose |
|---|---|
| `Modal` | Root provider. Manages open/close state, focus management, and passes config to children via context. |
| `ModalTrigger` | Wraps an element to open the modal on click. Injects `ref`, `aria-controls`, `aria-haspopup`. |
| `ModalContent` | The dialog panel. Renders via portal. Handles animations, backdrop, escape, click-outside, focus trap, scroll lock. |
| `ModalHeader` | Layout wrapper for the header. Auto-registers as `aria-labelledby`. |
| `ModalBody` | Layout wrapper for the body. Auto-registers as `aria-describedby`. |
| `ModalFooter` | Layout wrapper for the footer actions. |
| `ModalClose` | Button that closes the modal. Injects `aria-controls`. |

## Props

### Modal

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Must contain `ModalContent` and optionally `ModalTrigger`. |
| `open` | `boolean` | — | Controlled open state. |
| `defaultOpen` | `boolean` | `false` | Initial open state for uncontrolled mode. |
| `onOpenChange` | `(open: boolean) => void` | — | Called when open state changes. |
| `animation` | `AnimationVariant` | `'scale'` | Animation variant. |
| `spring` | `SpringPreset \| SpringConfig` | `'default'` | Spring physics config. |
| `backdropColor` | `string` | `'rgba(0,0,0,0.6)'` | Backdrop background color. |
| `backdropBlur` | `number` | `4` | Backdrop blur radius in px. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Panel max-width preset. |
| `animationDuration` | `number` | — | Override computed spring duration in ms. |
| `preventScroll` | `boolean` | `false` | Lock body scroll when modal is open. |
| `forceMount` | `boolean` | `false` | Always render modal in DOM (useful for CSS transitions). |
| `initialFocusRef` | `RefObject<HTMLElement>` | — | Focus this element on open instead of first focusable. |
| `finalFocusRef` | `RefObject<HTMLElement>` | — | Focus this element on close instead of trigger. |
| `onOpenAutoFocus` | `(e: { preventDefault: () => void }) => void` | — | Called on open focus. Call `preventDefault()` to skip auto-focus. |
| `onCloseAutoFocus` | `(e: { preventDefault: () => void }) => void` | — | Called on close focus. Call `preventDefault()` to skip return focus. |
| `onEscapeKeyDown` | `(e: KeyboardEvent) => void` | — | Called on Escape keydown. Call `preventDefault()` to prevent close. |
| `onInteractOutside` | `(e: MouseEvent) => void` | — | Called on backdrop click. Call `preventDefault()` to prevent close. |

### ModalContent

Props set on `ModalContent` override those set on `Modal` for that specific content panel.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Modal panel content. |
| `className` | `string` | — | Additional CSS class on the panel. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Panel max-width. |
| `animation` | `AnimationVariant` | `'scale'` | Animation variant. |
| `closeOnBackdropClick` | `boolean` | `true` | Close when clicking the backdrop. |
| `closeOnEscape` | `boolean` | `true` | Close on Escape key press. |
| `backdropColor` | `string` | — | Override backdrop color. |
| `backdropBlur` | `number` | — | Override backdrop blur. |
| `spring` | `SpringPreset \| SpringConfig` | — | Override spring config. |
| `animationDuration` | `number` | — | Override animation duration. |
| `preventScroll` | `boolean` | — | Override scroll lock. |

### ModalClose

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | `'×'` | Button content. |
| `className` | `string` | — | Additional CSS class. |

### ModalHeader, ModalBody, ModalFooter

| Prop | Type | Description |
|---|---|---|
| `children` | `ReactNode` | Section content. |
| `className` | `string` | Additional CSS class. |

## Animation Variants

| Variant | Effect |
|---|---|
| `scale` | Scale from 0.95 to 1 (default) |
| `slide-bottom` | Slide up from below |
| `slide-top` | Slide down from above |
| `slide-left` | Slide in from left |
| `slide-right` | Slide in from right |
| `fade` | Opacity only, no transform |
| `none` | Instant, no animation |

```tsx
// Set on Modal (applies to all content)
<Modal animation="slide-bottom">...</Modal>

// Set on ModalContent (overrides Modal)
<ModalContent animation="slide-left" spring="gentle">...</ModalContent>

// Disable animation entirely
<ModalContent animation="none">...</ModalContent>
```

## Sizes

| Size | Max Width |
|---|---|
| `sm` | 400px |
| `md` | 560px |
| `lg` | 720px |
| `xl` | 900px |

## Spring Presets

| Preset | Stiffness | Damping | Mass | Feel |
|---|---|---|---|---|
| `default` | 100 | 10 | 1 | Moderate bounce, balanced |
| `gentle` | 100 | 20 | 1 | Critically damped, no overshoot |
| `wobbly` | 200 | 10 | 1 | Playful, lots of bounce |
| `stiff` | 400 | 30 | 1 | Snappy, quick settle |
| `slow` | 50 | 20 | 1 | Heavy, deliberate |

```tsx
<ModalContent spring="wobbly">...</ModalContent>
```

## Custom Spring Config

Pass a `SpringConfig` object to fine-tune the animation:

```tsx
<ModalContent spring={{ stiffness: 300, damping: 15, mass: 0.8 }}>
  ...
</ModalContent>
```

| Parameter | Description |
|---|---|
| `stiffness` | Spring stiffness. Higher = faster response. |
| `damping` | Damping force. Higher = less oscillation. |
| `mass` | Mass of the animated object. Lower = lighter feel. |

## Focus Management

Focus is automatically trapped inside the modal. On open, the first focusable element receives focus. On close, focus returns to the trigger button.

### Custom Focus Targets

```tsx
const initialRef = useRef(null);
const finalRef = useRef(null);

<Modal initialFocusRef={initialRef} finalFocusRef={finalRef}>
  <ModalTrigger>
    <button ref={finalRef}>Open</button>
  </ModalTrigger>
  <ModalContent>
    <input ref={initialRef} autoFocus />
  </ModalContent>
</Modal>
```

### Prevent Auto-Focus

```tsx
<Modal
  onOpenAutoFocus={(e) => e.preventDefault()}
  onCloseAutoFocus={(e) => e.preventDefault()}
>
  ...
</Modal>
```

## Event Callbacks

### Prevent Close on Escape

```tsx
<Modal
  onEscapeKeyDown={(e) => {
    if (someCondition) e.preventDefault();
  }}
>
  ...
</Modal>
```

### Prevent Close on Backdrop Click

```tsx
<Modal
  onInteractOutside={(e) => {
    if (someCondition) e.preventDefault();
  }}
>
  ...
</Modal>
```

## Force Mount

Keep the modal in the DOM even when closed. Useful for CSS transitions or enter/leave animations.

```tsx
<Modal forceMount>
  <ModalTrigger>
    <button>Open</button>
  </ModalTrigger>
  <ModalContent>
    {/* Always in DOM, visibility toggled via data-state */}
  </ModalContent>
</Modal>
```

When `forceMount` is set:
- Modal is always rendered in the portal
- `data-state="closed"` hides with `visibility: hidden` and `pointer-events: none`
- `data-state="open"` shows normally

## Prevent Scroll

Lock body scroll when the modal is open. Uses reference counting so nested modals work correctly.

```tsx
<Modal preventScroll>
  <ModalTrigger>
    <button>Open</button>
  </ModalTrigger>
  <ModalContent>
    <ModalBody>
      {/* Body scroll is locked */}
    </ModalBody>
  </ModalContent>
</Modal>
```

## Data State Attributes

Both `rm-backdrop` and `rm-panel` have `data-state` attributes for CSS styling:

```css
/* Style based on open/closed state */
.rm-panel[data-state="open"] {
  opacity: 1;
}

.rm-panel[data-state="closed"] {
  opacity: 0;
}
```

## Controlled Mode

Manage open/close state externally with `useState`:

```tsx
function ControlledModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>
            <h2>Controlled</h2>
            <ModalClose />
          </ModalHeader>
          <ModalBody>
            <p>State is managed by the parent.</p>
            <p>Status: {open ? 'Open' : 'Closed'}</p>
          </ModalBody>
          <ModalFooter>
            <button onClick={() => setOpen(false)}>Close</button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
```

## Uncontrolled Mode

Use `defaultOpen` for simple cases where you don't need external state:

```tsx
<Modal defaultOpen={false}>
  <ModalTrigger>
    <button>Open</button>
  </ModalTrigger>
  <ModalContent>
    <ModalHeader>
      <h2>Uncontrolled</h2>
      <ModalClose />
    </ModalHeader>
    <ModalBody>
      <p>Managed internally.</p>
    </ModalBody>
  </ModalContent>
</Modal>
```

## Backdrop Customization

Customize the backdrop color and blur intensity:

```tsx
{/* Dark backdrop with heavy blur */}
<ModalContent backdropColor="rgba(0, 0, 0, 0.8)" backdropBlur={20}>
  ...
</ModalContent>

{/* Colored backdrop */}
<ModalContent backdropColor="rgba(99, 102, 241, 0.4)" backdropBlur={8}>
  ...
</ModalContent>
```

## Disabling Close Behaviors

```tsx
{/* Disable close on backdrop click */}
<ModalContent closeOnBackdropClick={false}>
  ...
</ModalContent>

{/* Disable close on Escape key */}
<ModalContent closeOnEscape={false}>
  ...
</ModalContent>
```

## Multiple Modals

Each `Modal` provider is independent. Nest multiple modals freely:

```tsx
function App() {
  return (
    <>
      <Modal>
        <ModalTrigger><button>First</button></ModalTrigger>
        <ModalContent>
          <ModalHeader><h2>First Modal</h2><ModalClose /></ModalHeader>
          <ModalBody>Content</ModalBody>
        </ModalContent>
      </Modal>

      <Modal>
        <ModalTrigger><button>Second</button></ModalTrigger>
        <ModalContent size="lg" animation="slide-left" spring="gentle">
          <ModalHeader><h2>Second Modal</h2><ModalClose /></ModalHeader>
          <ModalBody>Different size, animation, and spring</ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
```

## CSS Custom Properties

Override these in your CSS to theme the modals globally:

```css
:root {
  --rm-backdrop-bg: rgba(0, 0, 0, 0.6);
  --rm-panel-bg: #ffffff;
  --rm-panel-radius: 12px;
  --rm-panel-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  --rm-close-color: #3b82f6;
  --rm-close-hover: #2563eb;
  --rm-header-border: #e2e8f0;
  --rm-footer-border: #e2e8f0;
}
```

## Real-World Examples

### Notification Toast

```tsx
<Modal>
  <ModalTrigger>
    <button>Show Notification</button>
  </ModalTrigger>
  <ModalContent size="sm" animation="slide-bottom" spring="stiff"
    backdropColor="rgba(0, 0, 0, 0.3)" backdropBlur={4}>
    <div style={{ padding: '24px', textAlign: 'center' }}>
      <h3>Success!</h3>
      <p>Your changes have been saved.</p>
      <ModalClose>Done</ModalClose>
    </div>
  </ModalContent>
</Modal>
```

### Settings Panel

```tsx
<Modal>
  <ModalTrigger>
    <button>Settings</button>
  </ModalTrigger>
  <ModalContent size="lg" animation="slide-left" spring="default"
    backdropColor="rgba(0, 0, 0, 0.4)" backdropBlur={8}>
    <ModalHeader>
      <h2>Settings</h2>
      <ModalClose />
    </ModalHeader>
    <ModalBody>
      {/* Toggle sections, forms, danger zones */}
    </ModalBody>
  </ModalContent>
</Modal>
```

### Command Palette

```tsx
<Modal>
  <ModalTrigger>
    <button>Search</button>
  </ModalTrigger>
  <ModalContent size="md" animation="scale" spring="stiff"
    backdropColor="rgba(0, 0, 0, 0.6)" backdropBlur={8}>
    <div style={{ padding: '12px' }}>
      <input type="text" placeholder="Search commands..." autoFocus />
      {/* Command list */}
    </div>
  </ModalContent>
</Modal>
```

### Payment Form

```tsx
<Modal>
  <ModalTrigger>
    <button>Upgrade to Pro</button>
  </ModalTrigger>
  <ModalContent size="md" spring="gentle"
    backdropColor="rgba(0, 0, 0, 0.5)" backdropBlur={6}>
    <ModalHeader>
      <h2>Upgrade to Pro</h2>
      <ModalClose />
    </ModalHeader>
    <ModalBody>
      <p>$49 / one time</p>
      {/* Card form */}
    </ModalBody>
    <ModalFooter>
      <ModalClose>Cancel</ModalClose>
      <button>Pay $49</button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

### Image Viewer

```tsx
<Modal>
  <ModalTrigger>
    <button>View Image</button>
  </ModalTrigger>
  <ModalContent size="xl" animation="scale" spring="gentle"
    backdropColor="rgba(0, 0, 0, 0.85)" backdropBlur={12}>
    <ModalClose />
    {/* Full-width image content */}
  </ModalContent>
</Modal>
```

### Destructive Alert

```tsx
<Modal>
  <ModalTrigger>
    <button>Delete Account</button>
  </ModalTrigger>
  <ModalContent size="sm" animation="slide-top" spring="stiff"
    backdropColor="rgba(0, 0, 0, 0.6)" backdropBlur={4}>
    <div style={{ padding: '24px', textAlign: 'center' }}>
      <h3>Are you sure?</h3>
      <p>This action cannot be undone.</p>
      <ModalClose>Cancel</ModalClose>
      <button style={{ background: '#ef4444', color: 'white' }}>
        Yes, delete everything
      </button>
    </div>
  </ModalContent>
</Modal>
```

### Login Form

```tsx
<Modal>
  <ModalTrigger>
    <button>Sign in</button>
  </ModalTrigger>
  <ModalContent size="sm" animation="slide-bottom" spring="gentle"
    backdropColor="rgba(16, 185, 129, 0.15)" backdropBlur={12}>
    <div style={{ padding: '24px' }}>
      <h3>Welcome back</h3>
      <input type="email" placeholder="you@example.com" />
      <input type="password" placeholder="Password" />
      <button>Sign in</button>
    </div>
  </ModalContent>
</Modal>
```

### Pricing Cards

```tsx
<Modal>
  <ModalTrigger>
    <button>View Pricing</button>
  </ModalTrigger>
  <ModalContent size="lg" animation="slide-right" spring="wobbly"
    backdropColor="rgba(0, 0, 0, 0.5)" backdropBlur={8}>
    <ModalHeader>
      <h2>Choose your plan</h2>
      <ModalClose />
    </ModalHeader>
    <ModalBody>
      {/* Three-column pricing cards */}
    </ModalBody>
  </ModalContent>
</Modal>
```

## Accessibility

- `role="dialog"` and `aria-modal="true"` on the panel
- `aria-labelledby` linking to `ModalHeader` via `useId`
- `aria-describedby` linking to `ModalBody` via `useId`
- `aria-controls` on trigger and close button linking to dialog
- `aria-haspopup="dialog"` on trigger
- `aria-label="Close"` on close button
- Focus trapped within the modal via backdrop click and escape handling
- Auto-focus on open, return focus on close
- Respects `prefers-reduced-motion: reduce` — animations are skipped entirely
- `data-state="open"` / `data-state="closed"` for CSS-based styling

## TypeScript

All component props, spring types, and animation types are fully typed and exported:

```tsx
import type {
  ModalProps,
  ModalContentProps,
  ModalTriggerProps,
  ModalCloseProps,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
  SpringConfig,
  SpringPreset,
  AnimationVariant,
  AnimateConfig,
} from 'entity-react-modals';
```

## Tree Shaking

The package uses the `exports` field with conditional ESM/CJS builds and `sideEffects: false`. Styles are auto-injected on first import. Bundlers will tree-shake unused components automatically.

```tsx
// Only imports what you use
import { Modal, ModalContent } from 'entity-react-modals';
```

## License

MIT
