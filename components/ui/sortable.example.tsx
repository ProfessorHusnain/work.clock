/**
 * Sortable Components - Real-World Examples
 * 
 * This file contains ready-to-use example implementations of the sortable components.
 * Copy and adapt these examples for your own projects.
 */

"use client";

import * as React from "react";
import { 
  SortableProvider, 
  SortableList, 
  SortableItem,
  SortableOverlay,
  SortableDragHandle,
  useActiveSortableItem 
} from "@/components/ui/sortable";
import { GripVertical, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ===================================
 * Example 1: Simple Task List
 * =================================== */

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

/**
 * SimpleTaskList
 * 
 * A basic sortable task list with add/remove functionality.
 * Perfect for to-do lists, checklists, or simple ordered lists.
 */
export function SimpleTaskList() {
  const [tasks, setTasks] = React.useState<Task[]>([
    { id: "1", title: "Complete project documentation", completed: false },
    { id: "2", title: "Review pull requests", completed: false },
    { id: "3", title: "Update dependencies", completed: true },
  ]);

  /**
   * Handle reordering of tasks
   */
  const handleReorder = (newIds: Array<string | number>) => {
    const reorderedTasks = newIds
      .map(id => tasks.find(task => task.id === id))
      .filter(Boolean) as Task[];
    setTasks(reorderedTasks);
  };

  /**
   * Toggle task completion
   */
  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  /**
   * Remove a task
   */
  const removeTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  /**
   * Add a new task
   */
  const addTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: "New task",
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Tasks</h2>
        <Button onClick={addTask} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <SortableProvider
        items={tasks}
        onReorder={handleReorder}
        strategy="vertical"
      >
        <SortableList className="space-y-2">
          {tasks.map((task) => (
            <SortableItem
              key={task.id}
              id={task.id}
              className="group"
            >
              <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                {/* Drag Handle */}
                <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                  <GripVertical className="h-5 w-5" />
                </div>

                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="h-5 w-5 rounded"
                />

                {/* Task Title */}
                <span
                  className={`flex-1 ${
                    task.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {task.title}
                </span>

                {/* Delete Button */}
                <button
                  onClick={() => removeTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                  title="Remove task"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </SortableItem>
          ))}
        </SortableList>
      </SortableProvider>
    </div>
  );
}

/* ===================================
 * Example 2: Image Gallery Grid
 * =================================== */

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption: string;
}

/**
 * ImageGalleryGrid
 * 
 * A sortable image gallery with drag-and-drop reordering.
 * Includes a custom drag overlay showing the image being moved.
 */
export function ImageGalleryGrid() {
  const [images, setImages] = React.useState<GalleryImage[]>([
    { id: "1", url: "/api/placeholder/200/200", alt: "Image 1", caption: "Sunset" },
    { id: "2", url: "/api/placeholder/200/200", alt: "Image 2", caption: "Mountains" },
    { id: "3", url: "/api/placeholder/200/200", alt: "Image 3", caption: "Ocean" },
    { id: "4", url: "/api/placeholder/200/200", alt: "Image 4", caption: "Forest" },
  ]);

  /**
   * Handle reordering of images
   */
  const handleReorder = (newIds: Array<string | number>) => {
    const reorderedImages = newIds
      .map(id => images.find(img => img.id === id))
      .filter(Boolean) as GalleryImage[];
    setImages(reorderedImages);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Photo Gallery</h2>

      <SortableProvider
        items={images}
        onReorder={handleReorder}
        strategy="rect"
      >
        <SortableList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <SortableItem
              key={image.id}
              id={image.id}
              className="group"
              dragOpacity={0.4}
            >
              <div className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                  <p className="text-sm">{image.caption}</p>
                </div>
                
                {/* Drag indicator overlay */}
                <div className="absolute inset-0 bg-blue-500 bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <GripVertical className="h-8 w-8 text-white" />
                </div>
              </div>
            </SortableItem>
          ))}
        </SortableList>

        {/* Custom Drag Overlay */}
        <ImageDragOverlay images={images} />
      </SortableProvider>
    </div>
  );
}

/**
 * ImageDragOverlay
 * Custom drag overlay for the image gallery
 */
function ImageDragOverlay({ images }: { images: GalleryImage[] }) {
  const activeId = useActiveSortableItem();
  const activeImage = images.find((img) => img.id === activeId);

  return (
    <SortableOverlay>
      {activeId && activeImage ? (
        <div className="opacity-90 shadow-2xl border-2 border-blue-500 rounded-lg overflow-hidden">
          <img
            src={activeImage.url}
            alt={activeImage.alt}
            className="w-48 h-48 object-cover"
          />
        </div>
      ) : null}
    </SortableOverlay>
  );
}

/* ===================================
 * Example 3: Card Dashboard
 * =================================== */

interface DashboardCard {
  id: string;
  title: string;
  value: string;
  trend: "up" | "down" | "neutral";
  icon: string;
}

/**
 * DashboardCardGrid
 * 
 * A sortable dashboard with stat cards.
 * Demonstrates custom drag handles and complex card layouts.
 */
export function DashboardCardGrid() {
  const [cards, setCards] = React.useState<DashboardCard[]>([
    { id: "1", title: "Total Revenue", value: "$45,231", trend: "up", icon: "💰" },
    { id: "2", title: "New Users", value: "2,345", trend: "up", icon: "👥" },
    { id: "3", title: "Orders", value: "1,234", trend: "down", icon: "📦" },
    { id: "4", title: "Conversion Rate", value: "3.2%", trend: "neutral", icon: "📊" },
  ]);

  /**
   * Handle reordering of dashboard cards
   */
  const handleReorder = (newIds: Array<string | number>) => {
    const reorderedCards = newIds
      .map(id => cards.find(card => card.id === id))
      .filter(Boolean) as DashboardCard[];
    setCards(reorderedCards);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      <SortableProvider
        items={cards}
        onReorder={handleReorder}
        strategy="rect"
        activationDistance={10}
      >
        <SortableList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <SortableItem
              key={card.id}
              id={card.id}
              className="group"
              dragHandle={<SortableDragHandle />}
              dragHandlePosition="top-right"
            >
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                {/* Icon */}
                <div className="text-4xl mb-4">{card.icon}</div>

                {/* Title */}
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  {card.title}
                </h3>

                {/* Value */}
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {card.value}
                </p>

                {/* Trend Indicator */}
                <div className="flex items-center gap-1">
                  {card.trend === "up" && (
                    <span className="text-green-500 text-sm">↑ +12%</span>
                  )}
                  {card.trend === "down" && (
                    <span className="text-red-500 text-sm">↓ -5%</span>
                  )}
                  {card.trend === "neutral" && (
                    <span className="text-gray-500 text-sm">→ 0%</span>
                  )}
                </div>
              </div>
            </SortableItem>
          ))}
        </SortableList>
      </SortableProvider>
    </div>
  );
}

/* ===================================
 * Example 4: Kanban Board Column
 * =================================== */

interface KanbanItem {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  assignee: string;
}

/**
 * KanbanColumn
 * 
 * A sortable column for a Kanban board.
 * Demonstrates vertical sorting with complex card content.
 */
export function KanbanColumn({
  title,
  items: initialItems,
}: {
  title: string;
  items: KanbanItem[];
}) {
  const [items, setItems] = React.useState<KanbanItem[]>(initialItems);

  /**
   * Handle reordering of kanban items
   */
  const handleReorder = (newIds: Array<string | number>) => {
    const reorderedItems = newIds
      .map(id => items.find(item => item.id === id))
      .filter(Boolean) as KanbanItem[];
    setItems(reorderedItems);
  };

  /**
   * Get priority color
   */
  const getPriorityColor = (priority: KanbanItem["priority"]) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    }
  };

  return (
    <div className="w-80 bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
      {/* Column Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">{title}</h3>
        <span className="text-sm text-gray-500 bg-white dark:bg-gray-800 px-2 py-1 rounded">
          {items.length}
        </span>
      </div>

      {/* Sortable Items */}
      <SortableProvider
        items={items}
        onReorder={handleReorder}
        strategy="vertical"
      >
        <SortableList className="space-y-3 min-h-[200px]">
          {items.map((item) => (
            <SortableItem
              key={item.id}
              id={item.id}
              className="group"
              dragOpacity={0.6}
            >
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-grab active:cursor-grabbing">
                {/* Drag Handle */}
                <div className="flex items-center justify-between mb-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(item.priority)}`}>
                    {item.priority}
                  </span>
                </div>

                {/* Title */}
                <h4 className="font-semibold mb-2">{item.title}</h4>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {item.description}
                </p>

                {/* Assignee */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                    {item.assignee.charAt(0)}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.assignee}
                  </span>
                </div>
              </div>
            </SortableItem>
          ))}
        </SortableList>
      </SortableProvider>
    </div>
  );
}

/* ===================================
 * Example 5: Priority List with Badges
 * =================================== */

interface PriorityItem {
  id: string;
  name: string;
  category: string;
  status: "active" | "pending" | "completed";
}

/**
 * PriorityList
 * 
 * A sortable priority list with status badges.
 * Perfect for feature prioritization, roadmaps, or backlogs.
 */
export function PriorityList() {
  const [items, setItems] = React.useState<PriorityItem[]>([
    { id: "1", name: "User authentication", category: "Backend", status: "active" },
    { id: "2", name: "Dashboard UI", category: "Frontend", status: "pending" },
    { id: "3", name: "API documentation", category: "Docs", status: "completed" },
  ]);

  const handleReorder = (newIds: Array<string | number>) => {
    const reorderedItems = newIds
      .map(id => items.find(item => item.id === id))
      .filter(Boolean) as PriorityItem[];
    setItems(reorderedItems);
  };

  const getStatusColor = (status: PriorityItem["status"]) => {
    switch (status) {
      case "active": return "bg-blue-500";
      case "pending": return "bg-yellow-500";
      case "completed": return "bg-green-500";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Feature Priority</h2>

      <SortableProvider
        items={items}
        onReorder={handleReorder}
        strategy="vertical"
      >
        <SortableList className="space-y-3">
          {items.map((item, index) => (
            <SortableItem
              key={item.id}
              id={item.id}
              className="group"
            >
              <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
                {/* Priority Number */}
                <div className="flex-shrink-0 w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>

                {/* Drag Handle */}
                <div className="cursor-grab active:cursor-grabbing text-gray-400">
                  <GripVertical className="h-5 w-5" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.category}
                  </p>
                </div>

                {/* Status Badge */}
                <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`} />
              </div>
            </SortableItem>
          ))}
        </SortableList>
      </SortableProvider>
    </div>
  );
}

