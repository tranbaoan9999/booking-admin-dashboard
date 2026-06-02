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
import { Check, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface SelectOption<T = string | number> {
  value: T;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface SingleSelectProps<T = string | number> {
  options: SelectOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  placeholder?: string;
  isLoading?: boolean;
  isError?: boolean;
  errorText?: string;
  disabled?: boolean;
  /** Render a custom preview inside the trigger for the selected option */
  renderSelected?: (option: SelectOption<T>) => React.ReactNode;
  /** Render a custom row in the dropdown */
  renderOption?: (option: SelectOption<T>, isSelected: boolean) => React.ReactNode;
  className?: string;
  /** Applied to the trigger button when in an error state */
  hasError?: boolean;
}

const DROPDOWN_MAX_HEIGHT = 260;
const DROPDOWN_MIN_WIDTH = 180;
const VIEWPORT_MARGIN = 8;

export function SingleSelect<T extends string | number = string>({
  options,
  value,
  onChange,
  placeholder = 'Select an option…',
  isLoading,
  isError,
  errorText = 'Failed to load options',
  disabled,
  renderSelected,
  renderOption,
  className,
  hasError,
}: SingleSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const [mounted, setMounted] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();

  useEffect(() => { setMounted(true); }, []);

  const selected = options.find((o) => o.value === value) ?? null;

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

    const onScroll = () => computePosition();
    const onResize = () => computePosition();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  }, [open, computePosition]);

  useEffect(() => {
    if (!open) return;
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

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
    }
    if (e.key === 'Escape') setOpen(false);
  };

  const handleSelect = (option: SelectOption<T>) => {
    if (option.disabled) return;
    onChange(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleOptionKeyDown = (e: KeyboardEvent<HTMLLIElement>, option: SelectOption<T>) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect(option); }
    if (e.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); (e.currentTarget.nextElementSibling as HTMLElement)?.focus(); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); (e.currentTarget.previousElementSibling as HTMLElement)?.focus(); }
  };

  const dropdown = (
    <div
      ref={dropdownRef}
      role="listbox"
      aria-labelledby={id}
      style={{ ...dropdownStyle, position: 'absolute', zIndex: 9999 }}
      className="rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden dark:border-gray-700 dark:bg-gray-900"
    >
      <ul ref={listRef} className="overflow-y-auto" style={{ maxHeight: dropdownStyle.maxHeight }}>
        {options.length === 0 ? (
          <li className="px-4 py-3 text-sm text-gray-400 text-center">No options available</li>
        ) : (
          options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li
                key={String(opt.value)}
                role="option"
                aria-selected={isSelected}
                tabIndex={opt.disabled ? -1 : 0}
                onKeyDown={(e) => handleOptionKeyDown(e, opt)}
                onClick={() => handleSelect(opt)}
                className={cn(
                  'flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer outline-none',
                  'transition-colors focus:bg-blue-50 dark:focus:bg-blue-950',
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                  opt.disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
                )}
              >
                {renderOption ? (
                  renderOption(opt, isSelected)
                ) : (
                  <span className="flex flex-col">
                    <span className={cn('font-medium', isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white')}>
                      {opt.label}
                    </span>
                    {opt.description && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">{opt.description}</span>
                    )}
                  </span>
                )}
                {isSelected && <Check className="h-4 w-4 text-blue-500 shrink-0 ml-3" />}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );

  return (
    <>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled || isLoading}
        onKeyDown={handleTriggerKeyDown}
        onClick={() => { if (!disabled && !isLoading) { setOpen((o) => !o); } }}
        className={cn(
          'w-full flex items-center justify-between gap-2 rounded-lg border bg-white px-3 py-2.5 text-sm text-left',
          'transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'dark:bg-gray-900 dark:text-white',
          hasError
            ? 'border-red-400 dark:border-red-500'
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600',
          (disabled || isLoading) && 'opacity-60 cursor-not-allowed',
          className,
        )}
      >
        <span className="flex-1 min-w-0 flex items-center gap-2">
          {isLoading ? (
            <span className="flex items-center gap-2 text-gray-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Loading…
            </span>
          ) : isError ? (
            <span className="flex items-center gap-1.5 text-red-500 text-xs">
              <AlertCircle className="h-3.5 w-3.5" />
              {errorText}
            </span>
          ) : selected ? (
            renderSelected ? renderSelected(selected) : (
              <span className="font-medium text-gray-900 dark:text-white truncate">{selected.label}</span>
            )
          ) : (
            <span className="text-gray-400 dark:text-gray-500">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-gray-400 shrink-0 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>

      {mounted && open && createPortal(dropdown, document.body)}
    </>
  );
}
