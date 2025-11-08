/**
 * Sortable Components
 * 
 * A reusable set of components for drag-and-drop sortable functionality
 * built on top of @dnd-kit. These components provide a shadcn-like API
 * for implementing sortable lists and grids in your application.
 * 
 * @example
 * ```tsx
 * <SortableProvider items={items} onReorder={handleReorder}>
 *   <SortableList className="grid grid-cols-3 gap-4">
 *     {items.map((item) => (
 *       <SortableItem key={item.id} id={item.id}>
 *         <YourComponent item={item} />
 *       </SortableItem>
 *     ))}
 *   </SortableList>
 * </SortableProvider>
 * ```
 */

"use client";

import * as React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragCancelEvent,
  CollisionDetection,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  SortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

/* ===================================
 * Types & Interfaces
 * =================================== */

/**
 * Strategy for sorting items in the sortable container
 */
export type SortableStrategy = "rect" | "vertical" | "horizontal";

/**
 * Configuration options for the SortableProvider
 */
export interface SortableConfig {
  /** Items to be sorted (must have an 'id' property) */
  items: Array<{ id: string | number }>;
  /** Callback when items are reordered */
  onReorder?: (ids: Array<string | number>) => void;
  /** Callback when drag starts */
  onDragStart?: (id: string | number) => void;
  /** Callback when drag ends (regardless of drop success) */
  onDragEnd?: (id: string | number) => void;
  /** Callback when drag is cancelled */
  onDragCancel?: () => void;
  /** Collision detection strategy */
  collisionDetection?: CollisionDetection;
  /** Distance in pixels before drag activates (prevents accidental drags) */
  activationDistance?: number;
  /** Sorting strategy for the sortable context */
  strategy?: SortableStrategy;
}

/**
 * Props for the SortableProvider component
 */
export interface SortableProviderProps extends SortableConfig {
  children: React.ReactNode;
  /** Optional class name for the context wrapper */
  className?: string;
}

/**
 * Props for the SortableList component
 */
export interface SortableListProps {
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Props for the SortableItem component
 */
export interface SortableItemProps {
  /** Unique identifier for the item (must match an item in SortableProvider) */
  id: string | number;
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Whether to disable drag functionality for this item */
  disabled?: boolean;
  /** Custom drag handle (if not provided, entire item is draggable) */
  dragHandle?: React.ReactNode;
  /** Show drag handle position */
  dragHandlePosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  /** Custom styles to apply during drag */
  dragStyle?: React.CSSProperties;
  /** Opacity during drag (default: 0.5) */
  dragOpacity?: number;
}

/**
 * Props for the SortableOverlay component
 */
export interface SortableOverlayProps {
  /** Content to show in the drag overlay */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/* ===================================
 * Context
 * =================================== */

/**
 * Context for sharing sortable state across components
 */
interface SortableContextValue {
  activeId: string | number | null;
  items: Array<{ id: string | number }>;
}

const SortableProviderContext = React.createContext<SortableContextValue | null>(null);

/**
 * Hook to access sortable context
 * @throws Error if used outside of SortableProvider
 */
export function useSortableContext() {
  const context = React.useContext(SortableProviderContext);
  if (!context) {
    throw new Error("useSortableContext must be used within a SortableProvider");
  }
  return context;
}

/* ===================================
 * SortableProvider Component
 * =================================== */

/**
 * SortableProvider
 * 
 * Root component that sets up the drag-and-drop context and manages the state
 * of sortable items. This component handles all the DnD logic and provides
 * callbacks for reordering.
 * 
 * @param items - Array of items with unique 'id' properties
 * @param onReorder - Called with new order of IDs when items are reordered
 * @param onDragStart - Called when drag operation starts
 * @param onDragEnd - Called when drag operation ends
 * @param onDragCancel - Called when drag operation is cancelled
 * @param collisionDetection - Algorithm to detect collisions (default: closestCenter)
 * @param activationDistance - Pixels to move before drag starts (default: 8)
 * @param strategy - Layout strategy for items (default: "rect")
 * 
 * @example
 * ```tsx
 * <SortableProvider
 *   items={items}
 *   onReorder={(newIds) => console.log('New order:', newIds)}
 *   strategy="rect"
 * >
 *   <SortableList>
 *     {items.map(item => (
 *       <SortableItem key={item.id} id={item.id}>
 *         <Card>{item.name}</Card>
 *       </SortableItem>
 *     ))}
 *   </SortableList>
 * </SortableProvider>
 * ```
 */
export function SortableProvider({
  items,
  onReorder,
  onDragStart,
  onDragEnd,
  onDragCancel,
  collisionDetection = closestCenter,
  activationDistance = 8,
  strategy = "rect",
  children,
  className,
}: SortableProviderProps) {
  // Track the currently dragged item
  const [activeId, setActiveId] = React.useState<string | number | null>(null);

  // Configure sensors for drag interactions
  // MouseSensor: handles mouse events (better for Electron)
  // TouchSensor: handles touch events for mobile
  // PointerSensor: fallback for pointer events
  // KeyboardSensor: handles keyboard navigation for accessibility
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: activationDistance,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: activationDistance,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /**
   * Handle the start of a drag operation
   * Sets the active item ID and calls the optional onDragStart callback
   */
  const handleDragStart = React.useCallback(
    (event: DragStartEvent) => {
      const id = event.active.id;
      setActiveId(id);
      onDragStart?.(id);
    },
    [onDragStart]
  );

  /**
   * Handle the end of a drag operation
   * Reorders items if dropped in a new position
   */
  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      const id = active.id;

      // Clear the active item
      setActiveId(null);
      
      // Call the onDragEnd callback
      onDragEnd?.(id);

      // If dropped over a valid target and position changed
      if (over && active.id !== over.id) {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        // Calculate new order using dnd-kit's arrayMove utility
        const newOrder = arrayMove(items, oldIndex, newIndex);
        const newIds = newOrder.map((item) => item.id);

        // Notify parent component of the reorder
        onReorder?.(newIds);
      }
    },
    [items, onReorder, onDragEnd]
  );

  /**
   * Handle cancellation of a drag operation
   * This occurs when user presses ESC or drag is programmatically cancelled
   */
  const handleDragCancel = React.useCallback(() => {
    setActiveId(null);
    onDragCancel?.();
  }, [onDragCancel]);

  // Get the appropriate sorting strategy
  const sortingStrategy = React.useMemo((): SortingStrategy => {
    switch (strategy) {
      case "vertical":
        return verticalListSortingStrategy;
      case "horizontal":
        return horizontalListSortingStrategy;
      case "rect":
      default:
        return rectSortingStrategy;
    }
  }, [strategy]);

  // Provide context values to child components
  const contextValue = React.useMemo(
    () => ({ activeId, items }),
    [activeId, items]
  );

  return (
    <SortableProviderContext.Provider value={contextValue}>
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={sortingStrategy}
        >
          <div className={className}>{children}</div>
        </SortableContext>
      </DndContext>
    </SortableProviderContext.Provider>
  );
}

/* ===================================
 * SortableList Component
 * =================================== */

/**
 * SortableList
 * 
 * Container component for sortable items. This is a simple wrapper that
 * applies styling to the list of sortable items. Use this to define the
 * layout (grid, flex, list, etc.) of your sortable items.
 * 
 * @example
 * ```tsx
 * <SortableList className="grid grid-cols-3 gap-4">
 *   {items.map(item => (
 *     <SortableItem key={item.id} id={item.id}>
 *       <Card>{item.name}</Card>
 *     </SortableItem>
 *   ))}
 * </SortableList>
 * ```
 */
export function SortableList({ children, className }: SortableListProps) {
  return <div className={cn("relative", className)}>{children}</div>;
}

/* ===================================
 * SortableItem Component
 * =================================== */

/**
 * SortableItem
 * 
 * Individual sortable item wrapper. This component makes its children draggable
 * and handles the drag state, animations, and styling during drag operations.
 * 
 * Features:
 * - Automatic drag handle or custom drag handle support
 * - Smooth animations during drag and drop
 * - Configurable opacity during drag
 * - Disabled state support
 * - Accessible keyboard navigation
 * 
 * @param id - Unique identifier matching an item in SortableProvider
 * @param disabled - Disables drag functionality
 * @param dragHandle - Custom drag handle element
 * @param dragHandlePosition - Position of the drag handle
 * @param dragOpacity - Opacity during drag (0-1)
 * @param dragStyle - Custom styles to apply during drag
 * 
 * @example
 * ```tsx
 * <SortableItem id={item.id} dragOpacity={0.6}>
 *   <Card>
 *     <CardHeader>{item.title}</CardHeader>
 *     <CardContent>{item.content}</CardContent>
 *   </Card>
 * </SortableItem>
 * ```
 */
export function SortableItem({
  id,
  children,
  className,
  disabled = false,
  dragHandle,
  dragHandlePosition = "top-left",
  dragStyle,
  dragOpacity = 0.5,
}: SortableItemProps) {
  // Get sortable functionality from dnd-kit
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    disabled,
  });

  // Calculate position classes for the drag handle
  const dragHandlePositionClasses = React.useMemo(() => {
    switch (dragHandlePosition) {
      case "top-right":
        return "top-2 right-2";
      case "bottom-left":
        return "bottom-2 left-2";
      case "bottom-right":
        return "bottom-2 right-2";
      case "top-left":
      default:
        return "top-2 left-2";
    }
  }, [dragHandlePosition]);

  // Combine transform and transition for smooth animations
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? dragOpacity : 1,
    ...dragStyle,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("relative sortable-item", className)}
      data-sortable-id={id}
    >
      {/* Custom drag handle (if provided) */}
      {dragHandle && (
        <div
          {...attributes}
          {...listeners}
          data-sortable-handle="true"
          className={cn(
            "absolute z-10 cursor-grab active:cursor-grabbing select-none",
            dragHandlePositionClasses
          )}
          style={{
            WebkitUserDrag: 'element',
            WebkitUserSelect: 'none',
            touchAction: 'none',
          } as React.CSSProperties}
        >
          {dragHandle}
        </div>
      )}

      {/* If no drag handle provided, make entire item draggable */}
      {!dragHandle ? (
        <div 
          {...attributes} 
          {...listeners}
          data-sortable-handle="true"
          className="cursor-grab active:cursor-grabbing select-none"
          style={{
            WebkitUserDrag: 'element',
            WebkitUserSelect: 'none',
            touchAction: 'none',
          } as React.CSSProperties}
        >
          {children}
        </div>
      ) : (
        <div data-sortable-content="true">
          {children}
        </div>
      )}
    </div>
  );
}

/* ===================================
 * SortableDragHandle Component
 * =================================== */

/**
 * SortableDragHandle
 * 
 * A pre-styled drag handle component that can be used with SortableItem.
 * This provides a consistent drag handle design across your application.
 * 
 * @example
 * ```tsx
 * <SortableItem 
 *   id={item.id}
 *   dragHandle={<SortableDragHandle />}
 * >
 *   <Card>{item.content}</Card>
 * </SortableItem>
 * ```
 */
export function SortableDragHandle({ 
  className,
  icon,
}: { 
  className?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "p-2 rounded-lg transition-all",
        "bg-gray-500 hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600",
        "text-white shadow-lg",
        "opacity-0 group-hover:opacity-100",
        className
      )}
      title="Drag to reorder"
    >
      {icon || (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <circle cx="9" cy="5" r="1" />
          <circle cx="9" cy="12" r="1" />
          <circle cx="9" cy="19" r="1" />
          <circle cx="15" cy="5" r="1" />
          <circle cx="15" cy="12" r="1" />
          <circle cx="15" cy="19" r="1" />
        </svg>
      )}
    </div>
  );
}

/* ===================================
 * SortableOverlay Component
 * =================================== */

/**
 * SortableOverlay
 * 
 * Renders content in a drag overlay that follows the cursor during drag operations.
 * This component is automatically rendered by DndContext and shows a preview
 * of the item being dragged.
 * 
 * Usage: Place this inside SortableProvider to customize the drag preview.
 * 
 * @example
 * ```tsx
 * <SortableProvider items={items} onReorder={handleReorder}>
 *   <SortableList>
 *     {items.map(item => (
 *       <SortableItem key={item.id} id={item.id}>
 *         <Card>{item.name}</Card>
 *       </SortableItem>
 *     ))}
 *   </SortableList>
 *   
 *   <SortableOverlay>
 *     {activeItem && (
 *       <div className="opacity-90 shadow-2xl border-2 border-blue-500">
 *         <Card>{activeItem.name}</Card>
 *       </div>
 *     )}
 *   </SortableOverlay>
 * </SortableProvider>
 * ```
 */
export function SortableOverlay({ children, className }: SortableOverlayProps) {
  return (
    <DragOverlay>
      {children ? (
        <div className={cn("cursor-grabbing", className)}>
          {children}
        </div>
      ) : null}
    </DragOverlay>
  );
}

/* ===================================
 * Utility Hooks
 * =================================== */

/**
 * useSortableItem
 * 
 * A hook that provides access to the sortable item's state and methods.
 * This is useful for creating custom sortable components that need direct
 * access to the drag state.
 * 
 * @param id - The unique identifier of the item
 * 
 * @example
 * ```tsx
 * function CustomSortableItem({ id, children }) {
 *   const { isDragging, listeners, attributes, setNodeRef } = useSortableItem(id);
 *   
 *   return (
 *     <div ref={setNodeRef} {...attributes} {...listeners}>
 *       {children}
 *       {isDragging && <Badge>Dragging...</Badge>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useSortableItem(id: string | number) {
  return useSortable({ id });
}

/**
 * useActiveSortableItem
 * 
 * A hook that returns the currently active (dragging) item ID.
 * Useful for conditional rendering based on drag state.
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const activeId = useActiveSortableItem();
 *   
 *   return (
 *     <div>
 *       {activeId ? `Dragging item: ${activeId}` : 'No item being dragged'}
 *     </div>
 *   );
 * }
 * ```
 */
export function useActiveSortableItem() {
  const { activeId } = useSortableContext();
  return activeId;
}

