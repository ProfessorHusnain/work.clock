import { AnalogClock } from "@/components/analog-clock";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-gray-900 dark:to-black pt-24 px-8">
      <main className="container mx-auto max-w-7xl py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            World Clock
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Track time across different timezones around the world
          </p>
        </div>

        {/* Clocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
            <AnalogClock label="Local Time" size={280} />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
            <AnalogClock
              label="New York"
              timezone="America/New_York"
              size={280}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
            <AnalogClock
              label="London"
              timezone="Europe/London"
              size={280}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
            <AnalogClock
              label="Tokyo"
              timezone="Asia/Tokyo"
              size={280}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
            <AnalogClock
              label="Sydney"
              timezone="Australia/Sydney"
              size={280}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
            <AnalogClock
              label="Dubai"
              timezone="Asia/Dubai"
              size={280}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
