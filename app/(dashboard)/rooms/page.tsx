'use client';

import { useState } from 'react';
import { useRooms, useDeleteRoom } from '@/lib/hooks/useRooms';
import { Room } from '@/types';
import { RoomsTable } from '@/components/features/rooms/RoomsTable';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Plus, BedDouble } from 'lucide-react';

export default function RoomsPage() {
  const { data: rooms, isLoading, error, refetch } = useRooms();
  const deleteRoomMutation = useDeleteRoom();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const handleView = (room: Room) => {
    setSelectedRoom(room);
    // TODO: Open view modal
    console.log('View room:', room);
  };

  const handleEdit = (room: Room) => {
    // TODO: Open edit modal
    console.log('Edit room:', room);
  };

  const handleDelete = async (room: Room) => {
    if (confirm(`Are you sure you want to delete room ${room.roomNumber}?`)) {
      try {
        await deleteRoomMutation.mutateAsync(room.id);
      } catch (error) {
        console.error('Failed to delete room:', error);
      }
    }
  };

  const handleCreateRoom = () => {
    // TODO: Open create modal
    console.log('Create new room');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Room Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your rooms and availability
          </p>
        </div>
        <Button onClick={handleCreateRoom} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Room
        </Button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        {isLoading && <LoadingState message="Loading rooms..." />}

        {error && (
          <ErrorState
            message={error instanceof Error ? error.message : 'Failed to load rooms'}
            onRetry={refetch}
          />
        )}

        {!isLoading && !error && rooms && rooms.length === 0 && (
          <EmptyState
            icon={BedDouble}
            title="No rooms found"
            description="Get started by creating your first room"
            action={{
              label: 'Create Room',
              onClick: handleCreateRoom,
            }}
          />
        )}

        {!isLoading && !error && rooms && rooms.length > 0 && (
          <RoomsTable
            data={rooms}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
