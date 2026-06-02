import { ArrowLeft, BedDouble } from 'lucide-react';
import Link from 'next/link';
import { CreateRoomForm } from '@/components/features/rooms/CreateRoomForm';

export default function CreateRoomPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/rooms"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Rooms
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 dark:bg-blue-500">
            <BedDouble className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Room</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Add a new room to your property</p>
          </div>
        </div>
      </div>

      <CreateRoomForm />
    </div>
  );
}
