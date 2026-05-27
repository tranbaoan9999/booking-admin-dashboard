import {
  BedDouble,
  Calendar,
  DollarSign,
  TrendingUp
} from 'lucide-react';

const stats = [
  {
    title: 'Total Rooms',
    value: '48',
    change: '+12%',
    icon: BedDouble,
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    title: 'Available Rooms',
    value: '23',
    change: '+8%',
    icon: TrendingUp,
    bgColor: 'bg-green-50 dark:bg-green-950',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    title: 'Total Bookings',
    value: '156',
    change: '+23%',
    icon: Calendar,
    bgColor: 'bg-purple-50 dark:bg-purple-950',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    title: 'Revenue',
    value: '$45,231',
    change: '+18%',
    icon: DollarSign,
    bgColor: 'bg-amber-50 dark:bg-amber-950',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome to your booking management dashboard
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Bookings
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Your latest booking activities
          </p>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Room 101 - Deluxe Suite
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  John Doe • Check-in: May 28
                </p>
              </div>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-400">
                Confirmed
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Room 205 - Standard Room
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Jane Smith • Check-in: May 29
                </p>
              </div>
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400">
                Pending
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Room 302 - Premium Suite
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Mike Johnson • Check-in: May 30
                </p>
              </div>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-400">
                Confirmed
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Room Status
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Current availability overview
          </p>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Available</span>
                <span className="font-medium text-gray-900 dark:text-white">23 rooms</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                <div className="h-full w-[48%] bg-green-500"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Occupied</span>
                <span className="font-medium text-gray-900 dark:text-white">20 rooms</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                <div className="h-full w-[42%] bg-blue-500"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Maintenance</span>
                <span className="font-medium text-gray-900 dark:text-white">5 rooms</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                <div className="h-full w-[10%] bg-amber-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
