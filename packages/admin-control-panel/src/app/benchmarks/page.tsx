'use client';

import { useCallback, useEffect, useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import {
  DataTable,
  TableHeader,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from '@/components/DataTable';
import { Pagination } from '@/components/Pagination';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorState } from '@/components/ErrorState';
import { formatDateTime } from '@/lib/utils';

interface Benchmark {
  id: number;
  type: string;
  score: number;
  runAt: string;
  model: {
    id: number;
    name: string;
    version: string;
  };
}

export default function BenchmarksPage() {
  const [items, setItems] = useState<Benchmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState('runAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const itemsPerPage = 10;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchQuery,
        sortBy,
        sortOrder,
      });

      const response = await fetch(`/api/benchmarks?${params}`);
      const data = await response.json();

      if (data.success) {
        setItems(data.data.items);
        setTotalPages(data.data.totalPages);
        setTotalItems(data.data.total);
      } else {
        setError(data.error || 'Failed to fetch benchmarks');
      }
    } catch (error) {
      console.error('Failed to fetch benchmarks', error);
      setError('An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, sortBy, sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  if (loading && items.length === 0) return <LoadingSpinner size="lg" />;
  if (error && items.length === 0) return <ErrorState message={error} onRetry={fetchData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Benchmarks</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">View and manage benchmark results</p>
        </div>
      </div>

      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search by type..." />

      <DataTable>
        <TableHeader>
          <TableHead>Model</TableHead>
          <TableHead
            sortable
            sorted={sortBy === 'type' ? sortOrder : null}
            onClick={() => handleSort('type')}
          >
            Type
          </TableHead>
          <TableHead
            sortable
            sorted={sortBy === 'score' ? sortOrder : null}
            onClick={() => handleSort('score')}
          >
            Score
          </TableHead>
          <TableHead
            sortable
            sorted={sortBy === 'runAt' ? sortOrder : null}
            onClick={() => handleSort('runAt')}
          >
            Run At
          </TableHead>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                {item.model.name} {item.model.version}
              </TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.score.toFixed(2)}</TableCell>
              <TableCell>{formatDateTime(item.runAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
      />
    </div>
  );
}
