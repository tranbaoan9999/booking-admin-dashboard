import { LoginForm } from '@/components/features/auth/LoginForm';
import { BedDouble } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-950 flex-col items-center justify-center p-12 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -right-20 h-[28rem] w-[28rem] rounded-full bg-white/5" />
        <div className="absolute top-1/3 right-10 h-40 w-40 rounded-full bg-white/5" />

        <div className="relative z-10 max-w-md text-center">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm ring-1 ring-white/20">
            <BedDouble className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Booking Admin
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-blue-100">
            Manage reservations, rooms, and guests — all in one place.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            {[
              { value: '500+', label: 'Rooms' },
              { value: '12k+', label: 'Bookings' },
              { value: '99.9%', label: 'Uptime' },
            ].map(({ value, label }) => (
              <div key={label} className="rounded-2xl bg-white/10 px-4 py-5 backdrop-blur-sm ring-1 ring-white/10">
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="mt-1 text-sm text-blue-200">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
            <BedDouble className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">Booking Admin</span>
        </div>

        <div className="w-full max-w-sm">
          {/* Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back
              </h2>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                Sign in to your admin account to continue.
              </p>
            </div>

            <LoginForm />
          </div>

          {/* Hint */}
          <p className="mt-5 text-center text-xs text-gray-400 dark:text-gray-600">
            Demo credentials: <span className="font-medium text-gray-600 dark:text-gray-400">admin / admin</span>
          </p>
        </div>
      </div>
    </div>
  );
}
