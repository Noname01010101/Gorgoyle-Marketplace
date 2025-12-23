'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/Button';
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
import Link from 'next/link';

interface AIModel {
  id: number;
  name: string;
  version: string;
  provider: { name: string; country: string };
  status: string;
  deprecated: boolean;
  releaseDate: string;
  _count?: { benchmarks: number };
}

export default function ModelsPage() {
  const [items, setItems] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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

      const response = await fetch(`/api/models?${params}`);
      const data = await response.json();

      if (data.success) {
        setItems(data.data.items);
        setTotalPages(data.data.totalPages);
        setTotalItems(data.data.total);
      } else {
        setError(data.error || 'Failed to fetch models');
      }
    } catch (error) {
      console.error('Failed to fetch models', error);
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Models</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage AI models and configurations
          </p>
        </div>
        <Link href="/models/new">
          <Button>Add New Model</Button>
        </Link>
      </div>

      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search models..." />

      <DataTable>
        <TableHeader>
          <TableHead
            sortable
            sorted={sortBy === 'name' ? sortOrder : null}
            onClick={() => handleSort('name')}
          >
            Name
          </TableHead>
          <TableHead>Version</TableHead>
          <TableHead>Provider</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Benchmarks</TableHead>
          <TableHead>Actions</TableHead>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.version}</TableCell>
              <TableCell>{item.provider.name}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    item.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {item.status}
                </span>
              </TableCell>
              <TableCell>{item._count?.benchmarks || 0}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Link href={`/models/${item.id}`}>
                    <Button size="sm" variant="secondary">
                      View
                    </Button>
                  </Link>
                </div>
              </TableCell>
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
