'use client';

import {
  useState,
  useRef,
  useEffect,
  useId,
  useCallback,
  type KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, Loader2, AlertCircle, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface MultiSelectOption<T = string | number> {
  value: T;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface MultiSelectProps<T = string | number> {
  options: MultiSelectOption<T>[];
  value: T[];
  onChange: (values: T[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  isLoading?: boolean;
  isError?: boolean;
  errorText?: string;
  disabled?: boolean;
  maxDisplay?: number;
  /** Show a search box inside the dropdown */
  searchable?: boolean;
  /** Render a custom chip for each selected item */
  renderChip?: (option: MultiSelectOption<T>, onRemove: () => void) => React.ReactNode;
  /** Render a custom row in the dropdown */
  renderOption?: (option: MultiSelectOption<T>, isSelected: boolean) => React.ReactNode;
  className?: string;
  hasError?: boolean;
}

const DROPDOWN_MAX_HEIGHT = 280;
const DROPDOWN_MIN_WIDTH = 200;
const VIEWPORT_MARGIN = 8;

export function MultiSelect<T extends string | number = string>({
  options,
  value,
  onChange,
  placeholder = 'Select options…',
  searchPlaceholder = 'Search…',
  isLoading,
  isError,
  errorText = 'Failed to load options',
  disabled,
  maxDisplay = 3,
  searchable = true,
  renderChip,
  renderOption,
  className,
  hasError,
}: MultiSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const [mounted, setMounted] = useState(false);

  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const id = useId();

  useEffect(() => { setMounted(true); }, []);

  const selectedOptions = options.filter((o) => value.includes(o.value));

  const filtered = searchable && search
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  const computePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_MARGIN;
    const spaceAbove = rect.top - VIEWPORT_MARGIN;
    const openBelow = spaceBelow >= Math.min(DROPDOWN_MAX_HEIGHT, 120) || spaceBelow >= spaceAbove;
    const width = Math.max(rect.width, DROPDOWN_MIN_WIDTH);

    if (openBelow) {
      setDropdownStyle({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width,
        maxHeight: Math.min(spaceBelow, DROPDOWN_MAX_HEIGHT),
      });
    } else {
      setDropdownStyle({
        top: rect.top + window.scrollY - Math.min(spaceAbove, DROPDOWN_MAX_HEIGHT) - 4,
        left: rect.left + window.scrollX,
        width,
        maxHeight: Math.min(spaceAbove, DROPDOWN_MAX_HEIGHT),
      });
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    computePosition();
    if (searchable) setTimeout(() => searchRef.current?.focus(), 10);

    const onScroll = () => computePosition();
    const onResize = () => computePosition();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  }, [open, computePosition, searchable]);

  useEffect(() => {
    if (!open) { setSearch(''); return; }
    function onPointerDown(e: PointerEvent) {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        dropdownRef.current?.contains(e.target as Node)
      ) return;
      setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  const toggle = (optValue: T) => {
    onChange(
      value.includes(optValue)
        ? value.filter((v) => v !== optValue)
        : [...value, optValue],
    );
  };

  const remove = (optValue: T, e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optValue));
  };

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
    }
    if (e.key === 'Escape') setOpen(false);
  };

  const handleOptionKeyDown = (e: KeyboardEvent<HTMLLIElement>, optValue: T) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(optValue); }
    if (e.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); (e.currentTarget.nextElementSibling as HTMLElement)?.focus(); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); (e.currentTarget.previousElementSibling as HTMLElement)?.focus(); }
  };

  const displayedChips = selectedOptions.slice(0, maxDisplay);
  const overflowCount = selectedOptions.length - maxDisplay;

  const dropdown = (
    <div
      ref={dropdownRef}
      role="listbox"
      aria-multiselectable="true"
      aria-labelledby={id}
      style={{ ...dropdownStyle, position: 'absolute', zIndex: 9999 }}
      className="rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden dark:border-gray-700 dark:bg-gray-900 flex flex-col"
    >
      {searchable && (
        <div className="p-2 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); } }}
              placeholder={searchPlaceholder}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>
        </div>
      )}

      <ul className="overflow-y-auto" style={{ maxHeight: (dropdownStyle.maxHeight as number) - (searchable ? 52 : 0) }}>
        {filtered.length === 0 ? (
          <li className="px-4 py-3 text-sm text-gray-400 text-center">No options found</li>
        ) : (
          filtered.map((opt) => {
            const isSelected = value.includes(opt.value);
            return (
              <li
                key={String(opt.value)}
                role="option"
                aria-selected={isSelected}
                tabIndex={opt.disabled ? -1 : 0}
                onKeyDown={(e) => handleOptionKeyDown(e, opt.value)}
                onClick={() => !opt.disabled && toggle(opt.value)}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer outline-none',
                  'transition-colors focus:bg-blue-50 dark:focus:bg-blue-950',
                  'hover:bg-gray-50 dark:hover:bg-gray-800',
                  opt.disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
                )}
              >
                {/* Checkbox */}
                <div
                  className={cn(
                    'h-4 w-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
                    isSelected
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-gray-300 dark:border-gray-600',
                  )}
                >
                  {isSelected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                </div>

                {renderOption ? (
                  renderOption(opt, isSelected)
                ) : (
                  <span className="flex flex-col min-w-0">
                    <span className="text-gray-900 dark:text-white font-medium truncate">{opt.label}</span>
                    {opt.description && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{opt.description}</span>
                    )}
                  </span>
                )}
              </li>
            );
          })
        )}
      </ul>

      {value.length > 0 && (
        <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-2 flex items-center justify-between shrink-0 bg-gray-50 dark:bg-gray-900">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {value.length} selected
          </span>
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div
        ref={triggerRef}
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        tabIndex={disabled || isLoading ? -1 : 0}
        onKeyDown={handleTriggerKeyDown}
        onClick={() => { if (!disabled && !isLoading) setOpen((o) => !o); }}
        className={cn(
          'w-full min-h-[42px] flex items-center flex-wrap gap-1.5 rounded-lg border bg-white px-3 py-2 text-sm',
          'transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'dark:bg-gray-900 dark:text-white',
          hasError
            ? 'border-red-400 dark:border-red-500'
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600',
          (disabled || isLoading) ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
          className,
        )}
      >
        {isLoading ? (
          <span className="flex items-center gap-2 text-gray-400 text-sm">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Loading…
          </span>
        ) : isError ? (
          <span className="flex items-center gap-1.5 text-red-500 text-xs">
            <AlertCircle className="h-3.5 w-3.5" />
            {errorText}
          </span>
        ) : selectedOptions.length === 0 ? (
          <span className="text-gray-400 dark:text-gray-500 text-sm flex-1">{placeholder}</span>
        ) : (
          <>
            {displayedChips.map((opt) =>
              renderChip ? (
                renderChip(opt, () => onChange(value.filter((v) => v !== opt.value)))
              ) : (
                <span
                  key={String(opt.value)}
                  className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                >
                  {opt.label}
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={(e) => remove(opt.value, e)}
                    onKeyDown={(e) => e.key === 'Enter' && remove(opt.value, e)}
                    className="rounded-full p-0.5 hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors"
                    aria-label={`Remove ${opt.label}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )
            )}
            {overflowCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                +{overflowCount} more
              </span>
            )}
          </>
        )}

        <ChevronDown
          className={cn(
            'h-4 w-4 text-gray-400 shrink-0 ml-auto transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </div>

      {mounted && open && createPortal(dropdown, document.body)}
    </>
  );
}
