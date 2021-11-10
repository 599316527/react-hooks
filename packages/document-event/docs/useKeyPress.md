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

<code src='./demo/useKeyPress.tsx'>
