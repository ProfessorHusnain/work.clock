import { ModeToggle } from "./mode-toggle";
export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 py-4 px-8 bg-gray-200 dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          World Clock
        </h1>
        <ModeToggle />
      </div>
    </header>
  );
}
