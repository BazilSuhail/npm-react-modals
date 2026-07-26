# @bazil/react-modals

Zero-dependency React modal library with spring physics animations powered by the Web Animations API.

- No animation libraries required — uses native WAAPI
- Compound component API for flexible composition
- 5 built-in spring presets + custom spring configs
- Controlled and uncontrolled modes
- Portal-rendered, accessible, and tree-shakable

## Install

```bash
npm install @bazil/react-modals
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
} from '@bazil/react-modals';
import '@bazil/react-modals/styles.css';

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
| `Modal` | Root provider. Manages open/close state and passes config to children via context. |
| `ModalTrigger` | Wraps an element to open the modal on click. Clones child and injects `onClick`. |
| `ModalContent` | The dialog panel. Renders via portal to `document.body`. Handles animations, backdrop, escape, click-outside. |
| `ModalHeader` | Layout wrapper for the header section. |
| `ModalBody` | Layout wrapper for the body content. |
| `ModalFooter` | Layout wrapper for the footer actions. |
| `ModalClose` | Button that closes the modal. Defaults to `×` character. |

## Props

### Modal

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Must contain `ModalContent` and optionally `ModalTrigger`. |
| `open` | `boolean` | — | Controlled open state. |
| `defaultOpen` | `boolean` | `false` | Initial open state for uncontrolled mode. |
| `onOpenChange` | `(open: boolean) => void` | — | Called when open state changes. |
| `spring` | `SpringPreset \| SpringConfig` | `'default'` | Spring animation config. |
| `backdropColor` | `string` | `'rgba(0,0,0,0.6)'` | Backdrop background color. |
| `backdropBlur` | `number` | `4` | Backdrop blur radius in px. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Panel max-width preset. |
| `animationDuration` | `number` | — | Override computed spring duration in ms. |

### ModalContent

Props set on `ModalContent` override those set on `Modal` for that specific content panel.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Modal panel content. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Panel max-width. |
| `closeOnBackdropClick` | `boolean` | `true` | Close when clicking the backdrop. |
| `closeOnEscape` | `boolean` | `true` | Close on Escape key press. |
| `backdropColor` | `string` | — | Override backdrop color. |
| `backdropBlur` | `number` | — | Override backdrop blur. |
| `spring` | `SpringPreset \| SpringConfig` | — | Override spring config. |
| `animationDuration` | `number` | — | Override animation duration. |

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

## Sizes

| Size | Max Width |
|---|---|
| `sm` | 400px |
| `md` | 560px |
| `lg` | 720px |
| `xl` | 900px |

```tsx
<ModalContent size="lg">...</ModalContent>
```

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

Spring config can also be set on the `Modal` root and it applies to all content panels:

```tsx
<Modal spring={{ stiffness: 300, damping: 15, mass: 0.8 }}>
  <ModalTrigger>...</ModalTrigger>
  <ModalContent>...</ModalContent>
</Modal>
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
        <ModalContent size="lg" spring="gentle">
          <ModalHeader><h2>Second Modal</h2><ModalClose /></ModalHeader>
          <ModalBody>Different size and spring</ModalBody>
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

## Accessibility

- `role="dialog"` and `aria-modal="true"` on the panel
- `aria-label="Close"` on the close button
- Focus trapped within the modal via backdrop click and escape handling
- Respects `prefers-reduced-motion: reduce` — animations are skipped entirely

## TypeScript

All component props and spring types are fully typed and exported:

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
} from '@bazil/react-modals';
```

## Tree Shaking

The package uses the `exports` field with conditional ESM/CJS builds and marks CSS as the only side effect. Bundlers will tree-shake unused components automatically.

```tsx
// Only imports what you use
import { Modal, ModalContent } from '@bazil/react-modals';
```

## License

MIT
