'use client';

import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { Booking } from '@/types';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import {
  Eye, Pencil, Ban,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ChevronUp, ChevronDown, ChevronsUpDown,
  User, Mail, Phone,
} from 'lucide-react';

interface BookingsTableProps {
  data: Booking[];
  onView?: (booking: Booking) => void;
  onEdit?: (booking: Booking) => void;
  onCancel?: (booking: Booking) => void;
}

type BookingStatus = Booking['status'];

const STATUS_CONFIG: Record<BookingStatus, { variant: 'success' | 'warning' | 'error' | 'info' | 'default'; label: string }> = {
  PENDING:     { variant: 'warning', label: 'Pending'     },
  CONFIRMED:   { variant: 'info',    label: 'Confirmed'   },
  CHECKED_IN:  { variant: 'success', label: 'Checked In'  },
  CHECKED_OUT: { variant: 'default', label: 'Checked Out' },
  CANCELLED:   { variant: 'error',   label: 'Cancelled'   },
  COMPLETED:   { variant: 'success', label: 'Completed'   },
};

const CANCELLABLE: BookingStatus[] = ['PENDING', 'CONFIRMED'];

function SortIcon({ isSorted }: { isSorted: false | 'asc' | 'desc' }) {
  if (isSorted === 'asc')  return <ChevronUp   className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />;
  if (isSorted === 'desc') return <ChevronDown className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />;
  return <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />;
}

function SortableHeader({
  label,
  isSorted,
  onToggle,
}: {
  label: string;
  isSorted: false | 'asc' | 'desc';
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-white transition-colors"
    >
      {label}
      <SortIcon isSorted={isSorted} />
    </button>
  );
}

export function BookingsTable({ data, onView, onEdit, onCancel }: BookingsTableProps) {
  const [sorting, setSorting]           = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination]     = useState({ pageIndex: 0, pageSize: 10 });

  const columns = useMemo<ColumnDef<Booking>[]>(
    () => [
      {
        accessorKey: 'id',
        header: ({ column }) => (
          <SortableHeader
            label="Booking ID"
            isSorted={column.getIsSorted()}
            onToggle={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          />
        ),
        cell: ({ row }) => (
          <span className="font-mono text-xs font-semibold text-gray-500 dark:text-gray-400">
            #{row.original.id}
          </span>
        ),
      },
      {
        id: 'guest',
        accessorFn: (row) => row.guest.name,
        header: ({ column }) => (
          <SortableHeader
            label="Guest"
            isSorted={column.getIsSorted()}
            onToggle={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          />
        ),
        cell: ({ row }) => {
          const { name, email, phone } = row.original.guest;
          return (
            <div className="flex flex-col gap-0.5 min-w-[160px]">
              <span className="flex items-center gap-1.5 font-medium text-gray-900 dark:text-white">
                <User className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                {name}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <Mail className="h-3 w-3 shrink-0" />
                {email}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <Phone className="h-3 w-3 shrink-0" />
                {phone}
              </span>
            </div>
          );
        },
      },
      {
        id: 'room',
        accessorFn: (row) => row.room.roomNumber,
        header: ({ column }) => (
          <SortableHeader
            label="Room"
            isSorted={column.getIsSorted()}
            onToggle={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          />
        ),
        cell: ({ row }) => {
          const { roomNumber, roomType } = row.original.room;
          return (
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-gray-900 dark:text-white">{roomNumber}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{roomType.name}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'checkIn',
        header: ({ column }) => (
          <SortableHeader
            label="Check-in"
            isSorted={column.getIsSorted()}
            onToggle={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-gray-900 dark:text-white">
            {formatDate(row.original.checkIn)}
          </span>
        ),
      },
      {
        accessorKey: 'checkOut',
        header: ({ column }) => (
          <SortableHeader
            label="Check-out"
            isSorted={column.getIsSorted()}
            onToggle={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-gray-900 dark:text-white">
            {formatDate(row.original.checkOut)}
          </span>
        ),
      },
      {
        accessorKey: 'numberOfGuests',
        header: ({ column }) => (
          <SortableHeader
            label="Guests"
            isSorted={column.getIsSorted()}
            onToggle={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-gray-900 dark:text-white">
            {row.original.numberOfGuests}
          </span>
        ),
      },
      {
        accessorKey: 'totalPrice',
        header: ({ column }) => (
          <SortableHeader
            label="Total"
            isSorted={column.getIsSorted()}
            onToggle={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          />
        ),
        cell: ({ row }) => (
          <span className="font-semibold text-gray-900 dark:text-white">
            {formatCurrency(row.original.totalPrice)}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <SortableHeader
            label="Status"
            isSorted={column.getIsSorted()}
            onToggle={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          />
        ),
        cell: ({ row }) => {
          const cfg = STATUS_CONFIG[row.original.status] ?? { variant: 'default', label: row.original.status };
          return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
        },
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <SortableHeader
            label="Created"
            isSorted={column.getIsSorted()}
            onToggle={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          />
        ),
        cell: ({ row }) => (
          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {formatDateTime(row.original.createdAt)}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
        cell: ({ row }) => {
          const canCancel = CANCELLABLE.includes(row.original.status);
          return (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView?.(row.original)}
                className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                title="View"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit?.(row.original)}
                className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                title="Edit"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              {canCancel && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCancel?.(row.original)}
                  className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                  title="Cancel"
                >
                  <Ban className="h-4 w-4" />
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [onView, onEdit, onCancel]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    state: { sorting, columnFilters, pagination },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-gray-950">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-gray-50 dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      'text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400',
                      header.column.getCanSort() && 'select-none',
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-400"
                >
                  No bookings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Rows per page:</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          >
            {[10, 20, 50].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => table.setPageIndex(0)}              disabled={!table.getCanPreviousPage()} className="h-8 w-8 p-0"><ChevronsLeft  className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => table.previousPage()}               disabled={!table.getCanPreviousPage()} className="h-8 w-8 p-0"><ChevronLeft   className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()}                   disabled={!table.getCanNextPage()}     className="h-8 w-8 p-0"><ChevronRight  className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} className="h-8 w-8 p-0"><ChevronsRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
