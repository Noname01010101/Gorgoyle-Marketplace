'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DataTableProps {
  children: ReactNode;
  className?: string;
}

export function DataTable({ children, className }: DataTableProps) {
  return (
    <div
      className={cn(
        'overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700',
        className
      )}
    >
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">{children}</table>
    </div>
  );
}

interface TableHeaderProps {
  children: ReactNode;
}

export function TableHeader({ children }: TableHeaderProps) {
  return (
    <thead className="bg-gray-50 dark:bg-gray-800">
      <tr>{children}</tr>
    </thead>
  );
}

interface TableBodyProps {
  children: ReactNode;
}

export function TableBody({ children }: TableBodyProps) {
  return (
    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
      {children}
    </tbody>
  );
}

interface TableHeadProps {
  children: ReactNode;
  onClick?: () => void;
  sortable?: boolean;
  sorted?: 'asc' | 'desc' | null;
}

export function TableHead({ children, onClick, sortable, sorted }: TableHeadProps) {
  return (
    <th
      onClick={sortable ? onClick : undefined}
      className={cn(
        'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
        sortable && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none'
      )}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortable && (
          <span className="text-gray-400">
            {sorted === 'asc' ? '↑' : sorted === 'desc' ? '↓' : '↕'}
          </span>
        )}
      </div>
    </th>
  );
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
}

export function TableCell({ children, className }: TableCellProps) {
  return (
    <td
      className={cn(
        'px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100',
        className
      )}
    >
      {children}
    </td>
  );
}

interface TableRowProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function TableRow({ children, onClick, className }: TableRowProps) {
  return (
    <tr
      onClick={onClick}
      className={cn(onClick && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800', className)}
    >
      {children}
    </tr>
  );
}
