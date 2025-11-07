# 🎯 Reusable Sortable Components

A complete, production-ready set of drag-and-drop sortable components built with **@dnd-kit** and designed in the **shadcn/ui** style. These components are fully reusable, well-documented, and can be used across any project.

---

## 📦 What's Included

### Core Components
- **`sortable.tsx`** - Main component library with full TypeScript support
- **`sortable.examples.md`** - Comprehensive documentation with code examples
- **`sortable.example.tsx`** - Real-world example implementations

### Features
✅ **Fully TypeScript** - Complete type safety and IntelliSense support  
✅ **Accessible** - Keyboard navigation, screen reader support, ARIA attributes  
✅ **Responsive** - Works on desktop, tablet, and mobile  
✅ **Customizable** - Easy to style with Tailwind CSS  
✅ **Well-Documented** - Extensive comments and examples  
✅ **Production Ready** - Battle-tested patterns and best practices  

---

## 🚀 Quick Start

### 1. Installation

The components use `@dnd-kit` which should already be installed. If not:

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### 2. Import Components

```tsx
import { 
  SortableProvider, 
  SortableList, 
  SortableItem 
} from "@/components/ui/sortable";
```

### 3. Basic Usage

```tsx
"use client";

import { SortableProvider, SortableList, SortableItem } from "@/components/ui/sortable";

interface Item {
  id: string;
  name: string;
}

export function MyList({ items }: { items: Item[] }) {
  const handleReorder = (newIds: Array<string | number>) => {
    console.log("New order:", newIds);
    // Update your state here
  };

  return (
    <SortableProvider items={items} onReorder={handleReorder}>
      <SortableList className="grid grid-cols-3 gap-4">
        {items.map((item) => (
          <SortableItem key={item.id} id={item.id}>
            <div className="p-4 bg-white rounded-lg shadow">
              {item.name}
            </div>
          </SortableItem>
        ))}
      </SortableList>
    </SortableProvider>
  );
}
```

---

## 📚 Component API

### `<SortableProvider>`

The root component that manages drag-and-drop state.

```tsx
<SortableProvider
  items={items}                    // Required: Array of items with id property
  onReorder={(newIds) => {...}}    // Called when items are reordered
  strategy="rect"                  // "rect" | "vertical" | "horizontal"
  activationDistance={8}           // Pixels to move before drag starts
  onDragStart={(id) => {...}}      // Called when drag starts
  onDragEnd={(id) => {...}}        // Called when drag ends
  onDragCancel={() => {...}}       // Called when drag is cancelled
>
  {children}
</SortableProvider>
```

### `<SortableList>`

Container for sortable items. Defines the layout.

```tsx
<SortableList className="grid grid-cols-4 gap-4">
  {children}
</SortableList>
```

### `<SortableItem>`

Individual draggable item wrapper.

```tsx
<SortableItem
  id={item.id}                     // Required: Unique identifier
  dragHandle={<CustomHandle />}    // Optional: Custom drag handle
  dragHandlePosition="top-left"    // "top-left" | "top-right" | "bottom-left" | "bottom-right"
  dragOpacity={0.5}                // Opacity during drag (0-1)
  disabled={false}                 // Disable dragging
  className="..."                  // Additional CSS classes
>
  {children}
</SortableItem>
```

### `<SortableOverlay>`

Displays a preview during drag operations.

```tsx
<SortableOverlay>
  {activeItem && <PreviewComponent item={activeItem} />}
</SortableOverlay>
```

### `<SortableDragHandle>`

Pre-styled drag handle component.

```tsx
<SortableDragHandle 
  icon={<YourIcon />}
  className="..."
/>
```

---

## 🎨 Styling

All components accept `className` props and work seamlessly with Tailwind CSS:

```tsx
<SortableList className="grid grid-cols-3 gap-6 p-4">
  <SortableItem 
    className="group hover:scale-105 transition-transform"
    dragOpacity={0.6}
  >
    <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
      Your content
    </div>
  </SortableItem>
</SortableList>
```

Use the `group` utility for conditional styling:

```tsx
<SortableItem className="group">
  <div className="opacity-0 group-hover:opacity-100">
    Shows on hover
  </div>
</SortableItem>
```

---

## 🔌 Hooks

### `useSortableContext()`

Access the sortable context.

```tsx
const { activeId, items } = useSortableContext();
```

### `useSortableItem(id)`

Get full sortable item state and handlers.

```tsx
const { 
  isDragging, 
  attributes, 
  listeners, 
  setNodeRef 
} = useSortableItem(item.id);
```

### `useActiveSortableItem()`

Get the currently dragging item ID.

```tsx
const activeId = useActiveSortableItem();
const isDragging = activeId !== null;
```

---

## 💡 Common Patterns

### Persist to Database

```tsx
const handleReorder = async (newIds: Array<string | number>) => {
  // Optimistic update
  setItems(reorderItems(items, newIds));
  
  // Persist to backend
  try {
    await fetch('/api/items/reorder', {
      method: 'POST',
      body: JSON.stringify({ ids: newIds }),
    });
  } catch (error) {
    // Revert on error
    console.error('Failed to save order:', error);
  }
};
```

### With State Management

```tsx
// Using Zustand
const handleReorder = useStore(state => state.reorderItems);

// Using Redux
const dispatch = useDispatch();
const handleReorder = (newIds) => dispatch(reorderItems(newIds));
```

### Nested Lists

```tsx
<SortableProvider items={categories}>
  <SortableList>
    {categories.map(category => (
      <SortableItem key={category.id} id={category.id}>
        <div>
          <h3>{category.name}</h3>
          
          {/* Nested sortable list */}
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

## 📖 Real-World Examples

The `sortable.example.tsx` file contains production-ready examples:

1. **SimpleTaskList** - To-do list with checkboxes
2. **ImageGalleryGrid** - Photo gallery with drag preview
3. **DashboardCardGrid** - Stat cards with custom handles
4. **KanbanColumn** - Kanban board column
5. **PriorityList** - Feature prioritization list

Import and use them:

```tsx
import { SimpleTaskList } from "@/components/ui/sortable.example";

export default function Page() {
  return <SimpleTaskList />;
}
```

---

## ♿ Accessibility

Built-in accessibility features:

- **Keyboard Navigation**: Tab to focus, Space/Enter to pick up, Arrow keys to move, Escape to cancel
- **Screen Readers**: ARIA attributes and announcements
- **Focus Management**: Proper focus indicators and states
- **Touch Support**: Works on mobile devices

---

## 🎯 Migration from @dnd-kit

If you're using `@dnd-kit` directly, migration is straightforward:

**Before:**
```tsx
<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
  <SortableContext items={items.map(i => i.id)} strategy={rectSortingStrategy}>
    {items.map(item => (
      <MySortableItem key={item.id} id={item.id} />
    ))}
  </SortableContext>
</DndContext>
```

**After:**
```tsx
<SortableProvider items={items} onReorder={handleReorder} strategy="rect">
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

## 🧪 Usage in This Project

The sortable components are already integrated into the World Clock app:

**File:** `app/page.tsx`

```tsx
<SortableProvider
  items={selectedTimezones}
  onReorder={handleReorder}
  strategy="rect"
>
  <SortableList className="grid grid-cols-3 gap-4">
    {selectedTimezones.map((tz) => (
      <SortableItem key={tz.id} id={tz.id}>
        <ClockCard timezone={tz} />
      </SortableItem>
    ))}
  </SortableList>
  
  <SortableOverlay>
    {/* Drag preview */}
  </SortableOverlay>
</SortableProvider>
```

---

## 📝 TypeScript Support

Full TypeScript support with comprehensive type definitions:

```tsx
import type { 
  SortableConfig,
  SortableProviderProps,
  SortableListProps,
  SortableItemProps,
  SortableStrategy 
} from "@/components/ui/sortable";
```

---

## 🔧 Troubleshooting

### Items not dragging
- Ensure each item has a unique `id` property
- Check that the `items` array in `SortableProvider` matches your list items
- Verify no CSS conflicts with `pointer-events` or `cursor`

### Layout issues
- Ensure items have explicit dimensions
- Use `dragOpacity` for visual feedback
- Check for CSS transforms that might interfere

### Performance issues
- Use `React.memo()` for item components
- Implement `useCallback` for handlers
- Consider virtualizing very long lists

---

## 📄 Files Overview

```
components/ui/
├── sortable.tsx                 # Main component library (580 lines)
├── sortable.examples.md         # Documentation with examples
├── sortable.example.tsx         # Real-world implementations
└── SORTABLE_README.md          # This file
```

---

## 🎓 Learning Resources

1. **Start here**: Read `sortable.examples.md` for basic to advanced examples
2. **See it in action**: Check `sortable.example.tsx` for real components
3. **Understand the code**: Read comments in `sortable.tsx`
4. **Try it**: Copy an example and customize it for your needs

---

## 🌟 Features Comparison

| Feature | This Library | Raw @dnd-kit |
|---------|-------------|--------------|
| Easy API | ✅ Simple | ❌ Complex |
| TypeScript | ✅ Full support | ✅ Supported |
| Documented | ✅ Extensive | ⚠️ Basic |
| Examples | ✅ Many | ❌ Few |
| Accessibility | ✅ Built-in | ⚠️ Manual |
| Customizable | ✅ Props-based | ⚠️ Code-based |
| Reusable | ✅ Drop-in | ❌ Boilerplate |

---

## 🤝 Contributing

To improve these components:

1. **Add new examples** to `sortable.example.tsx`
2. **Enhance documentation** in `sortable.examples.md`
3. **Extend functionality** in `sortable.tsx`
4. **Report issues** and suggest improvements

---

## 📜 License

These components are part of the World Clock project and follow the same license.

---

## 🎉 Credits

Built with:
- [@dnd-kit](https://dndkit.com/) - Drag and drop toolkit
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - Design inspiration
- TypeScript - Type safety
- React - UI framework

---

## 📞 Need Help?

1. Check the **examples** in `sortable.examples.md`
2. Review the **real-world components** in `sortable.example.tsx`
3. Read the **inline comments** in `sortable.tsx`
4. Look at the **usage** in `app/page.tsx`

---

**Happy sorting! 🎯**

