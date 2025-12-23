'use client';

import { Button } from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          variant="secondary"
          size="sm"
        >
          Previous
        </Button>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          variant="secondary"
          size="sm"
        >
          Next
        </Button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{startItem}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <Button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!canGoPrevious}
              variant="secondary"
              size="sm"
              className="rounded-l-md"
            >
              Previous
            </Button>

            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              // Show first, last, current, and pages around current
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={page}
                    onClick={() => onPageChange(page)}
                    variant={page === currentPage ? 'primary' : 'secondary'}
                    size="sm"
                  >
                    {page}
                  </Button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="px-4 py-2 text-gray-700 dark:text-gray-300">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <Button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!canGoNext}
              variant="secondary"
              size="sm"
              className="rounded-r-md"
            >
              Next
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}
