---
title: useKeyPressing
nav:
  title: Hooks
  path: /hook
group:
  title: Document Event
  path: /document-event
order: 2
---

# useKeyPressing

This hook will track key pressing for you.

```typescript
interface UseKeyPressingOptions {
    fromTextarea?: boolean;
}

function useKeyPressing(watchKeys: string[], options: UseKeyPressingOptions = {}) void
```

<code src='./demo/useKeyPressing.tsx'>
