# Sortable Components Documentation

A comprehensive set of reusable drag-and-drop sortable components built on top of `@dnd-kit`. These components provide a shadcn-like API for implementing sortable lists and grids in your application.

## Installation

Make sure you have the required dependencies installed:

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

## Components

### SortableProvider
Root component that sets up the drag-and-drop context and manages sortable state.

### SortableList
Container component for sortable items with customizable layout.

### SortableItem
Individual sortable item wrapper with drag functionality.

### SortableOverlay
Drag overlay component that shows a preview during drag operations.

### SortableDragHandle
Pre-styled drag handle component.

## Hooks

### useSortableContext()
Access the sortable context (activeId, items).

### useSortableItem(id)
Direct access to sortable item state and methods.

### useActiveSortableItem()
Get the currently dragging item ID.

---

## Basic Usage

### Simple Vertical List

```tsx
"use client";

import { 
  SortableProvider, 
  SortableList, 
  SortableItem 
} from "@/components/ui/sortable";

interface Item {
  id: string;
  title: string;
}

export function TodoList({ items }: { items: Item[] }) {
  const handleReorder = (newIds: Array<string | number>) => {
    console.log("New order:", newIds);
    // Update your state here
  };

  return (
    <SortableProvider
      items={items}
      onReorder={handleReorder}
      strategy="vertical"
    >
      <SortableList className="space-y-2">
        {items.map((item) => (
          <SortableItem key={item.id} id={item.id}>
            <div className="p-4 bg-white rounded-lg shadow">
              {item.title}
            </div>
          </SortableItem>
        ))}
      </SortableList>
    </SortableProvider>
  );
}
```

---

## Advanced Examples

### Grid Layout with Custom Drag Handle

```tsx
"use client";

import { 
  SortableProvider, 
  SortableList, 
  SortableItem,
  SortableDragHandle 
} from "@/components/ui/sortable";
import { GripVertical } from "lucide-react";

interface Card {
  id: string;
  title: string;
  content: string;
}

export function CardGrid({ cards }: { cards: Card[] }) {
  const handleReorder = (newIds: Array<string | number>) => {
    // Handle reordering
  };

  return (
    <SortableProvider
      items={cards}
      onReorder={handleReorder}
      strategy="rect"
      activationDistance={8}
    >
      <SortableList className="grid grid-cols-3 gap-4">
        {cards.map((card) => (
          <SortableItem
            key={card.id}
            id={card.id}
            dragHandle={
              <SortableDragHandle 
                icon={<GripVertical className="h-4 w-4" />} 
              />
            }
            dragHandlePosition="top-right"
            className="group"
          >
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="font-bold mb-2">{card.title}</h3>
              <p className="text-gray-600">{card.content}</p>
            </div>
          </SortableItem>
        ))}
      </SortableList>
    </SortableProvider>
  );
}
```

---

### With Drag Overlay Preview

```tsx
"use client";

import { 
  SortableProvider, 
  SortableList, 
  SortableItem,
  SortableOverlay,
  useActiveSortableItem 
} from "@/components/ui/sortable";

interface Image {
  id: string;
  url: string;
  alt: string;
}

function ImagePreview({ images }: { images: Image[] }) {
  const activeId = useActiveSortableItem();
  const activeImage = images.find((img) => img.id === activeId);

  return (
    <SortableOverlay>
      {activeId && activeImage ? (
        <div className="opacity-90 shadow-2xl border-2 border-blue-500 rounded-lg">
          <img 
            src={activeImage.url} 
            alt={activeImage.alt}
            className="w-32 h-32 object-cover rounded-lg"
          />
        </div>
      ) : null}
    </SortableOverlay>
  );
}

export function ImageGallery({ images }: { images: Image[] }) {
  const handleReorder = (newIds: Array<string | number>) => {
    // Handle reordering
  };

  return (
    <SortableProvider
      items={images}
      onReorder={handleReorder}
      strategy="rect"
    >
      <SortableList className="grid grid-cols-4 gap-4">
        {images.map((image) => (
          <SortableItem key={image.id} id={image.id} dragOpacity={0.3}>
            <img 
              src={image.url} 
              alt={image.alt}
              className="w-full h-32 object-cover rounded-lg"
            />
          </SortableItem>
        ))}
      </SortableList>
      
      <ImagePreview images={images} />
    </SortableProvider>
  );
}
```

---

### Horizontal List

```tsx
"use client";

import { 
  SortableProvider, 
  SortableList, 
  SortableItem 
} from "@/components/ui/sortable";

interface Tab {
  id: string;
  label: string;
}

export function HorizontalTabs({ tabs }: { tabs: Tab[] }) {
  const handleReorder = (newIds: Array<string | number>) => {
    // Handle reordering
  };

  return (
    <SortableProvider
      items={tabs}
      onReorder={handleReorder}
      strategy="horizontal"
    >
      <SortableList className="flex gap-2">
        {tabs.map((tab) => (
          <SortableItem key={tab.id} id={tab.id}>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
              {tab.label}
            </button>
          </SortableItem>
        ))}
      </SortableList>
    </SortableProvider>
  );
}
```

---

### With Callbacks

```tsx
"use client";

import { 
  SortableProvider, 
  SortableList, 
  SortableItem 
} from "@/components/ui/sortable";

interface Task {
  id: string;
  text: string;
}

export function TaskList({ tasks }: { tasks: Task[] }) {
  const handleReorder = (newIds: Array<string | number>) => {
    console.log("Items reordered:", newIds);
  };

  const handleDragStart = (id: string | number) => {
    console.log("Started dragging:", id);
  };

  const handleDragEnd = (id: string | number) => {
    console.log("Stopped dragging:", id);
  };

  const handleDragCancel = () => {
    console.log("Drag cancelled");
  };

  return (
    <SortableProvider
      items={tasks}
      onReorder={handleReorder}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      strategy="vertical"
    >
      <SortableList className="space-y-2">
        {tasks.map((task) => (
          <SortableItem key={task.id} id={task.id}>
            <div className="p-4 bg-white rounded-lg shadow">
              {task.text}
            </div>
          </SortableItem>
        ))}
      </SortableList>
    </SortableProvider>
  );
}
```

---

### Disabled Items

```tsx
"use client";

import { 
  SortableProvider, 
  SortableList, 
  SortableItem 
} from "@/components/ui/sortable";

interface Item {
  id: string;
  title: string;
  locked: boolean;
}

export function MixedList({ items }: { items: Item[] }) {
  const handleReorder = (newIds: Array<string | number>) => {
    // Handle reordering
  };

  return (
    <SortableProvider
      items={items}
      onReorder={handleReorder}
      strategy="vertical"
    >
      <SortableList className="space-y-2">
        {items.map((item) => (
          <SortableItem 
            key={item.id} 
            id={item.id}
            disabled={item.locked}
          >
            <div className={`p-4 rounded-lg shadow ${
              item.locked ? 'bg-gray-200 opacity-50' : 'bg-white'
            }`}>
              {item.title}
              {item.locked && <span className="ml-2">🔒</span>}
            </div>
          </SortableItem>
        ))}
      </SortableList>
    </SortableProvider>
  );
}
```

---

### Using the Hook API

```tsx
"use client";

import { 
  SortableProvider, 
  SortableList,
  useSortableItem
} from "@/components/ui/sortable";

interface CustomItemProps {
  id: string;
  title: string;
}

function CustomSortableItem({ id, title }: CustomItemProps) {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition, 
    isDragging 
  } = useSortableItem(id);

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 bg-white rounded-lg shadow cursor-move"
    >
      {title}
      {isDragging && <span className="ml-2">✋</span>}
    </div>
  );
}

export function CustomList({ items }: { items: CustomItemProps[] }) {
  return (
    <SortableProvider
      items={items}
      onReorder={(ids) => console.log("Reordered:", ids)}
      strategy="vertical"
    >
      <SortableList className="space-y-2">
        {items.map((item) => (
          <CustomSortableItem key={item.id} {...item} />
        ))}
      </SortableList>
    </SortableProvider>
  );
}
```

---

## API Reference

### SortableProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Array<{ id: string \| number }>` | Required | Array of items with unique IDs |
| `onReorder` | `(ids: Array<string \| number>) => void` | - | Callback when items are reordered |
| `onDragStart` | `(id: string \| number) => void` | - | Callback when drag starts |
| `onDragEnd` | `(id: string \| number) => void` | - | Callback when drag ends |
| `onDragCancel` | `() => void` | - | Callback when drag is cancelled |
| `collisionDetection` | `CollisionDetection` | `closestCenter` | Collision detection algorithm |
| `activationDistance` | `number` | `8` | Pixels to move before drag activates |
| `strategy` | `"rect" \| "vertical" \| "horizontal"` | `"rect"` | Sorting strategy |
| `className` | `string` | - | CSS classes for wrapper |

### SortableList Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | Required | Child items |
| `className` | `string` | - | CSS classes for container |

### SortableItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string \| number` | Required | Unique identifier |
| `children` | `React.ReactNode` | Required | Item content |
| `className` | `string` | - | CSS classes |
| `disabled` | `boolean` | `false` | Disable dragging |
| `dragHandle` | `React.ReactNode` | - | Custom drag handle |
| `dragHandlePosition` | `"top-left" \| "top-right" \| "bottom-left" \| "bottom-right"` | `"top-left"` | Handle position |
| `dragOpacity` | `number` | `0.5` | Opacity during drag |
| `dragStyle` | `React.CSSProperties` | - | Custom drag styles |

---

## Styling

The components use Tailwind CSS classes. You can customize the appearance by:

1. **Passing className props**
```tsx
<SortableList className="grid grid-cols-4 gap-6">
```

2. **Using the group utility for hover effects**
```tsx
<SortableItem className="group">
  <div className="opacity-0 group-hover:opacity-100">
    Drag Handle
  </div>
</SortableItem>
```

3. **Customizing drag opacity**
```tsx
<SortableItem dragOpacity={0.3}>
```

---

## Accessibility

The components include built-in accessibility features:

- ✅ Keyboard navigation support
- ✅ Screen reader announcements
- ✅ Focusable drag handles
- ✅ ARIA attributes
- ✅ Touch device support

To use keyboard navigation:
- **Tab** to focus items
- **Space** or **Enter** to pick up item
- **Arrow keys** to move item
- **Space** or **Enter** to drop item
- **Escape** to cancel

---

## Tips & Best Practices

### Performance Optimization

```tsx
// Memoize items to prevent unnecessary re-renders
const memoizedItems = useMemo(() => items, [items]);

// Use callbacks to avoid re-creating functions
const handleReorder = useCallback((newIds) => {
  // Update state
}, []);
```

### Error Handling

```tsx
const handleReorder = (newIds: Array<string | number>) => {
  try {
    // Update your state
    updateItems(newIds);
  } catch (error) {
    console.error("Failed to reorder items:", error);
    // Show error toast
  }
};
```

### Type Safety

```tsx
interface MyItem {
  id: string;
  name: string;
  // ... other properties
}

const items: MyItem[] = [...];

<SortableProvider
  items={items}
  onReorder={(newIds) => {
    // TypeScript knows newIds is Array<string | number>
    const typedIds = newIds as string[];
  }}
>
```

---

## Common Patterns

### Persist Order to Database

```tsx
const handleReorder = async (newIds: Array<string | number>) => {
  try {
    await fetch('/api/items/reorder', {
      method: 'POST',
      body: JSON.stringify({ ids: newIds }),
    });
    
    // Update local state
    setItems(reorderItems(items, newIds));
  } catch (error) {
    console.error('Failed to save order:', error);
  }
};
```

### Optimistic Updates

```tsx
const handleReorder = (newIds: Array<string | number>) => {
  // Update UI immediately
  const reorderedItems = newIds.map(id => 
    items.find(item => item.id === id)!
  );
  setItems(reorderedItems);
  
  // Save to backend in background
  saveOrder(newIds).catch(() => {
    // Revert on error
    setItems(items);
  });
};
```

### Nested Sortables

```tsx
// Parent list
<SortableProvider items={categories}>
  <SortableList>
    {categories.map(category => (
      <SortableItem key={category.id} id={category.id}>
        <div>
          <h3>{category.name}</h3>
          
          {/* Nested list */}
          <SortableProvider items={category.items}>
            <SortableList>
              {category.items.map(item => (
                <SortableItem key={item.id} id={item.id}>
                  {item.name}
                </SortableItem>
              ))}
            </SortableList>
          </SortableProvider>
        </div>
      </SortableItem>
    ))}
  </SortableList>
</SortableProvider>
```

---

## Troubleshooting

### Items not dragging
- Ensure each item has a unique `id`
- Check that `items` prop matches the IDs in your list
- Verify no CSS conflicts with `pointer-events`

### Layout jumps during drag
- Make sure items have explicit dimensions
- Use `dragOpacity` to provide visual feedback
- Consider using `transform` instead of `position` for animations

### Poor performance with many items
- Use `React.memo()` for item components
- Implement virtualization for long lists
- Optimize re-renders with `useCallback` and `useMemo`

---

## Migration from Direct @dnd-kit Usage

If you're migrating from direct @dnd-kit usage:

**Before:**
```tsx
<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
  <SortableContext items={items.map(i => i.id)}>
    {items.map(item => <MySortableItem key={item.id} {...item} />)}
  </SortableContext>
</DndContext>
```

**After:**
```tsx
<SortableProvider items={items} onReorder={handleReorder}>
  <SortableList>
    {items.map(item => (
      <SortableItem key={item.id} id={item.id}>
        <MyItem {...item} />
      </SortableItem>
    ))}
  </SortableList>
</SortableProvider>
```

---

## License

This component library is part of your project and follows the same license.

