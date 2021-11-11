---
title: useKeyPress
nav:
  title: Hooks
  path: /hook
group:
  title: Document Event
  path: /document-event
order: 2
---

# useKeyPress

This hook will register key bindings event listeners on `document` on component mount, and unlisten that events on unmount.

```typescript
type KeyboardEventNames = 'keydown' | 'keyup' | 'keypress';

interface UseKeyPressOptions<K extends KeyboardEventNames> {
    eventName?: K;
    fromTextarea?: boolean;
}
interface KeyBindingMap<K extends KeyboardEventNames> {
    [key: string]: DocumentEventHandler<K>;
}
type UseKeyPressArgs<K extends KeyboardEventNames>
    = [string, DocumentEventHandler<K>, UseKeyPressOptions<K>?]
        | [KeyBindingMap<K>, UseKeyPressOptions<K>?];

function useKeyPress<K extends KeyboardEventNames>(...args: UseKeyPressArgs<K>): void
```

```js
useKeyPress('Ctrl+X', () => console.log('Ctrl+X pressed'));
```

Use `+` to join modifiers and key, such as 'Ctrl+Alt+Y'. Key bindings are case-insensitive.
Available modifiers are <kbd>Ctrl</kbd>, <kbd>Shift</kbd>, <kbd>Meta</kbd>, <kbd>Alt</kbd> (aka. <kbd>Option</kbd>) and a special modifier <kbd>Command</kbd> which refers to Ctrl/Meta on Windows/Mac.

Events from textarea are ignored by default. There's an option `fromTextarea` to enable them.

<code src='./demo/useKeyPress.tsx'>
