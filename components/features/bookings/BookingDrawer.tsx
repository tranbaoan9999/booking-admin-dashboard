'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Booking } from '@/types';
import { useUpdateBookingStatus } from '@/lib/hooks/useBookings';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import {
  X, User, Mail, Phone, BedDouble, CalendarDays,
  Users, DollarSign, Clock, CheckCircle2, XCircle, Loader2,
  AlertCircle,
} from 'lucide-react';

type BookingStatus = Booking['status'];

const STATUS_CONFIG: Record<BookingStatus, {
  variant: 'success' | 'warning' | 'error' | 'info' | 'default';
  label: string;
}> = {
  PENDING:     { variant: 'warning', label: 'Pending'     },
  APPROVED:    { variant: 'info',    label: 'Approved'    },
  CONFIRMED:   { variant: 'info',    label: 'Confirmed'   },
  REJECTED:    { variant: 'error',   label: 'Rejected'    },
  CHECKED_IN:  { variant: 'success', label: 'Checked In'  },
  CHECKED_OUT: { variant: 'default', label: 'Checked Out' },
  CANCELLED:   { variant: 'error',   label: 'Cancelled'   },
  COMPLETED:   { variant: 'success', label: 'Completed'   },
};

const REVIEW_STATUSES: BookingStatus[] = ['PENDING', 'APPROVED', 'CONFIRMED'];

interface BookingDrawerProps {
  booking: Booking | null;
  onClose: () => void;
}

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
        <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {label}
        </span>
        <div className="text-sm text-gray-900 dark:text-white">{children}</div>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
      {children}
    </h3>
  );
}

export function BookingDrawer({ booking, onClose }: BookingDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const updateStatus = useUpdateBookingStatus();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Reset local state whenever the drawer opens with a different booking
  useEffect(() => {
    if (booking) {
      setSelectedStatus(null);
      setErrorMsg('');
    }
  }, [booking?.id]);

  // Trap focus: close on Escape
  useEffect(() => {
    if (!booking) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    // Prevent body scroll while open
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [booking, onClose]);

  // Focus close button when drawer opens
  useEffect(() => {
    if (booking) {
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    }
  }, [booking?.id]);

  const handleSave = async () => {
    if (!booking || !selectedStatus) return;
    setErrorMsg('');
    try {
      await updateStatus.mutateAsync({ id: booking.id, status: selectedStatus });
      onClose();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to update status. Please try again.');
    }
  };

  const isDirty = selectedStatus !== null && selectedStatus !== booking?.status;
  const canReview = booking ? REVIEW_STATUSES.includes(booking.status) : false;

  const statusCfg = booking ? (STATUS_CONFIG[booking.status] ?? { variant: 'default', label: booking.status }) : null;

  const nights =
    booking
      ? Math.max(
          1,
          Math.round(
            (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        )
      : 0;

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300',
          booking ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Booking details"
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl dark:bg-gray-950',
          'transition-transform duration-300 ease-in-out',
          booking ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {booking && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950">
                  <CalendarDays className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Booking #{booking.id}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Created {formatDateTime(booking.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {statusCfg && <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>}
                <button
                  ref={closeButtonRef}
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

              {/* Guest */}
              <div>
                <SectionTitle>Guest Information</SectionTitle>
                <div className="rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 p-4 space-y-3">
                  <DetailRow icon={User} label="Name">
                    <span className="font-medium">{booking.guest.name}</span>
                  </DetailRow>
                  <DetailRow icon={Mail} label="Email">
                    <a
                      href={`mailto:${booking.guest.email}`}
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {booking.guest.email}
                    </a>
                  </DetailRow>
                  <DetailRow icon={Phone} label="Phone">
                    <a
                      href={`tel:${booking.guest.phone}`}
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {booking.guest.phone}
                    </a>
                  </DetailRow>
                </div>
              </div>

              {/* Room */}
              <div>
                <SectionTitle>Room Details</SectionTitle>
                <div className="rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 p-4 space-y-3">
                  <DetailRow icon={BedDouble} label="Room">
                    <span className="font-semibold">{booking.room.roomNumber}</span>
                    <span className="ml-2 text-gray-500 dark:text-gray-400 text-xs">
                      {booking.room.roomType.name} · up to {booking.room.roomType.maxCapacity} guests
                    </span>
                  </DetailRow>
                  <DetailRow icon={Users} label="Number of Guests">
                    {booking.numberOfGuests}
                  </DetailRow>
                </div>
              </div>

              {/* Stay */}
              <div>
                <SectionTitle>Stay Period</SectionTitle>
                <div className="rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1 rounded-lg bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 px-4 py-3">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Check-in</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{formatDate(booking.checkIn)}</span>
                    </div>
                    <div className="flex flex-col gap-1 rounded-lg bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 px-4 py-3">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Check-out</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{formatDate(booking.checkOut)}</span>
                    </div>
                  </div>
                  <DetailRow icon={Clock} label="Duration">
                    {nights} night{nights !== 1 ? 's' : ''}
                  </DetailRow>
                  <DetailRow icon={DollarSign} label="Total Price">
                    <span className="text-base font-bold text-gray-900 dark:text-white">
                      {formatCurrency(booking.totalPrice)}
                    </span>
                    <span className="ml-1.5 text-xs text-gray-500 dark:text-gray-400">
                      ({formatCurrency(booking.room.roomType.price)}/night × {nights})
                    </span>
                  </DetailRow>
                </div>
              </div>

              {/* Admin Action */}
              {canReview && (
                <div>
                  <SectionTitle>Admin Decision</SectionTitle>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 p-4 space-y-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Review this booking and set its approval status.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Approve */}
                      <button
                        type="button"
                        onClick={() => setSelectedStatus('APPROVED')}
                        className={cn(
                          'flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all',
                          selectedStatus === 'APPROVED'
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'border-gray-200 bg-white text-gray-500 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-emerald-700 dark:hover:bg-emerald-950 dark:hover:text-emerald-300',
                        )}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Approve
                      </button>

                      {/* Reject */}
                      <button
                        type="button"
                        onClick={() => setSelectedStatus('REJECTED')}
                        className={cn(
                          'flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all',
                          selectedStatus === 'REJECTED'
                            ? 'border-red-500 bg-red-50 text-red-700 dark:border-red-500 dark:bg-red-950 dark:text-red-300'
                            : 'border-gray-200 bg-white text-gray-500 hover:border-red-300 hover:bg-red-50 hover:text-red-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-red-700 dark:hover:bg-red-950 dark:hover:text-red-300',
                        )}
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                    </div>

                    {selectedStatus && selectedStatus !== booking.status && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Status will change from{' '}
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {STATUS_CONFIG[booking.status]?.label ?? booking.status}
                        </span>{' '}
                        to{' '}
                        <span className={cn(
                          'font-medium',
                          selectedStatus === 'APPROVED' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400',
                        )}>
                          {STATUS_CONFIG[selectedStatus]?.label ?? selectedStatus}
                        </span>
                        .
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="text-xs text-gray-400 dark:text-gray-600 space-y-1 pb-2">
                <p>Last updated: {formatDateTime(booking.updatedAt)}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-4 space-y-3">
              {errorMsg && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errorMsg}
                </div>
              )}
              <div className="flex items-center justify-end gap-3">
                <Button variant="secondary" onClick={onClose} disabled={updateStatus.isPending}>
                  Close
                </Button>
                {canReview && (
                  <Button
                    onClick={handleSave}
                    disabled={!isDirty || updateStatus.isPending}
                    className="min-w-[100px] gap-2"
                  >
                    {updateStatus.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      'Save'
                    )}
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>,
    document.body,
  );
}
