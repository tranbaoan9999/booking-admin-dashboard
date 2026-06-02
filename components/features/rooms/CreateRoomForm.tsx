'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateRoom } from '@/lib/hooks/useRooms';
import { useAmenities, useRoomTypes } from '@/lib/hooks/useAmenities';
import { SingleSelect, type SelectOption } from '@/components/ui/SingleSelect';
import { MultiSelect, type MultiSelectOption } from '@/components/ui/MultiSelect';
import { type CreateRoomPayload } from '@/lib/api/services/rooms';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import {
  BedDouble, Hash, Wifi, AlertCircle,
  Loader2, ImagePlus, Trash2,
} from 'lucide-react';
import type { RoomTypeOption } from '@/lib/api/services/amenities';

type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';

interface FormValues {
  roomNumber: string;
  status: RoomStatus;
  roomTypeId: number | null;
  amenityIds: number[];
  imageUrls: string[];
}

const STATUS_OPTIONS: { value: RoomStatus; label: string }[] = [
  { value: 'AVAILABLE',   label: 'Available'   },
  { value: 'OCCUPIED',    label: 'Occupied'    },
  { value: 'MAINTENANCE', label: 'Maintenance' },
];

const STATUS_ACTIVE_CLASS: Record<RoomStatus, string> = {
  AVAILABLE:   'border-green-500 bg-green-50 text-green-700 dark:border-green-500 dark:bg-green-950 dark:text-green-300',
  OCCUPIED:    'border-yellow-500 bg-yellow-50 text-yellow-700 dark:border-yellow-500 dark:bg-yellow-950 dark:text-yellow-300',
  MAINTENANCE: 'border-red-500 bg-red-50 text-red-700 dark:border-red-500 dark:bg-red-950 dark:text-red-300',
};

function SectionCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  badge,
  children,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 overflow-hidden">
      <div className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className={cn('flex h-7 w-7 items-center justify-center rounded-lg', iconBg)}>
            <Icon className={cn('h-3.5 w-3.5', iconColor)} />
          </div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h2>
          {badge && <span className="ml-auto text-xs text-gray-400">{badge}</span>}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {message}
    </p>
  );
}

function ImageUrlsInput({ value, onChange }: { value: string[]; onChange: (urls: string[]) => void }) {
  const [input, setInput] = useState('');

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInput('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder="Paste an image URL and press Enter…"
          className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
        />
        <Button type="button" variant="secondary" size="sm" onClick={add} className="shrink-0 gap-1.5">
          <ImagePlus className="h-4 w-4" />
          Add
        </Button>
      </div>
      {value.length > 0 && (
        <div className="space-y-1.5">
          {value.map((url, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-900">
              <span className="flex-1 truncate text-xs text-gray-600 dark:text-gray-400">{url}</span>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Remove image"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function CreateRoomForm() {
  const router = useRouter();
  const createRoom = useCreateRoom();
  const { data: roomTypes, isLoading: rtLoading, isError: rtError } = useRoomTypes();
  const { data: amenities, isLoading: amLoading, isError: amError } = useAmenities();

  const [values, setValues] = useState<FormValues>({
    roomNumber: '',
    status: 'AVAILABLE',
    roomTypeId: null,
    amenityIds: [],
    imageUrls: [],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});

  const set = <K extends keyof FormValues>(key: K, val: FormValues[K]) =>
    setValues((v) => ({ ...v, [key]: val }));

  const roomTypeOptions: SelectOption<number>[] = (roomTypes ?? []).map((rt: RoomTypeOption) => ({
    value: rt.id,
    label: rt.name,
    description: `$${rt.price}/night · up to ${rt.maxCapacity} guests`,
  }));

  const amenityOptions: MultiSelectOption<number>[] = (amenities ?? []).map((a) => ({
    value: a.id,
    label: a.name,
  }));

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!values.roomNumber.trim()) next.roomNumber = 'Room number is required';
    if (!values.roomTypeId)        next.roomTypeId = 'Room type is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: CreateRoomPayload = {
      roomNumber: values.roomNumber.trim(),
      status: values.status,
      roomType: { id: values.roomTypeId! },
      amenities: values.amenityIds,
      imageUrls: values.imageUrls,
    };
    await createRoom.mutateAsync(payload);

    router.push('/rooms');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <SectionCard
        icon={Hash}
        iconBg="bg-blue-100 dark:bg-blue-950"
        iconColor="text-blue-600 dark:text-blue-400"
        title="Basic Information"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Room Number */}
          <div>
            <FieldLabel required>Room Number</FieldLabel>
            <div className="relative">
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Hash className="h-4 w-4" />
              </div>
              <input
                id="roomNumber"
                value={values.roomNumber}
                onChange={(e) => {
                  set('roomNumber', e.target.value);
                  if (errors.roomNumber) setErrors((er) => ({ ...er, roomNumber: undefined }));
                }}
                placeholder="e.g. 101, A-202"
                className={cn(
                  'w-full rounded-lg border bg-white pl-9 pr-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  'dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500',
                  errors.roomNumber
                    ? 'border-red-400 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-700',
                )}
              />
            </div>
            <FieldError message={errors.roomNumber} />
          </div>

          {/* Status */}
          <div>
            <FieldLabel required>Status</FieldLabel>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set('status', opt.value)}
                  className={cn(
                    'flex-1 rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition-all',
                    values.status === opt.value
                      ? STATUS_ACTIVE_CLASS[opt.value]
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-gray-600',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Room Type */}
      <SectionCard
        icon={BedDouble}
        iconBg="bg-purple-100 dark:bg-purple-950"
        iconColor="text-purple-600 dark:text-purple-400"
        title="Room Type"
      >
        <FieldLabel required>Room Type</FieldLabel>
        <SingleSelect<number>
          options={roomTypeOptions}
          value={values.roomTypeId}
          onChange={(id) => {
            set('roomTypeId', id);
            setErrors((er) => ({ ...er, roomTypeId: undefined }));
          }}
          placeholder="Select a room type…"
          isLoading={rtLoading}
          isError={rtError}
          hasError={!!errors.roomTypeId}
          renderSelected={(opt) => (
            <span className="flex items-center gap-2">
              <BedDouble className="h-4 w-4 text-purple-500 shrink-0" />
              <span className="font-medium text-gray-900 dark:text-white">{opt.label}</span>
              {opt.description && (
                <span className="text-gray-400 text-xs truncate">{opt.description}</span>
              )}
            </span>
          )}
        />
        <FieldError message={errors.roomTypeId} />
      </SectionCard>

      {/* Amenities */}
      <SectionCard
        icon={Wifi}
        iconBg="bg-emerald-100 dark:bg-emerald-950"
        iconColor="text-emerald-600 dark:text-emerald-400"
        title="Amenities"
        badge="Optional"
      >
        <FieldLabel>Amenities</FieldLabel>
        <MultiSelect<number>
          options={amenityOptions}
          value={values.amenityIds}
          onChange={(ids) => set('amenityIds', ids)}
          placeholder="Select amenities…"
          searchPlaceholder="Search amenities…"
          isLoading={amLoading}
          isError={amError}
        />
        {values.amenityIds.length > 0 && (
          <p className="mt-2 text-xs text-gray-500">
            {values.amenityIds.length} amenit{values.amenityIds.length === 1 ? 'y' : 'ies'} selected
          </p>
        )}
      </SectionCard>

      {/* Images */}
      <SectionCard
        icon={ImagePlus}
        iconBg="bg-orange-100 dark:bg-orange-950"
        iconColor="text-orange-600 dark:text-orange-400"
        title="Images"
        badge="Optional"
      >
        <FieldLabel>Image URLs</FieldLabel>
        <ImageUrlsInput
          value={values.imageUrls}
          onChange={(urls) => set('imageUrls', urls)}
        />
      </SectionCard>

      {/* Error banner */}
      {createRoom.isError && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {createRoom.error instanceof Error ? createRoom.error.message : 'Failed to create room. Please try again.'}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pb-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/rooms')}
          disabled={createRoom.isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={createRoom.isPending}
          className="min-w-[140px] gap-2"
        >
          {createRoom.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating…
            </>
          ) : (
            'Create Room'
          )}
        </Button>
      </div>
    </form>
  );
}
