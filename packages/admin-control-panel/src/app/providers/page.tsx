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
import { Modal, ConfirmDialog } from '@/components/Modal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorState } from '@/components/ErrorState';
import toast from 'react-hot-toast';

interface Provider {
  id: number;
  name: string;
  country: string;
  _count?: {
    models: number;
  };
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [formData, setFormData] = useState({ name: '', country: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemsPerPage = 10;

  const fetchProviders = useCallback(async () => {
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

      const response = await fetch(`/api/providers?${params}`);
      const data = await response.json();

      if (data.success) {
        setProviders(data.data.items);
        setTotalPages(data.data.totalPages);
        setTotalItems(data.data.total);
      } else {
        setError(data.error || 'Failed to fetch providers');
      }
    } catch (error) {
      console.error('Failed to fetch providers', error);
      setError('An error occurred while fetching providers');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, sortBy, sortOrder]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleCreate = () => {
    setFormData({ name: '', country: '' });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (provider: Provider) => {
    setSelectedProvider(provider);
    setFormData({ name: provider.name, country: provider.country });
    setIsEditModalOpen(true);
  };

  const handleDelete = (provider: Provider) => {
    setSelectedProvider(provider);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmitCreate = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Provider created successfully');
        setIsCreateModalOpen(false);
        fetchProviders();
      } else {
        toast.error(data.error || 'Failed to create provider');
      }
    } catch (error) {
      console.error('Failed to create provider', error);
      toast.error('An error occurred while creating provider');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (!selectedProvider) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/providers/${selectedProvider.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Provider updated successfully');
        setIsEditModalOpen(false);
        fetchProviders();
      } else {
        toast.error(data.error || 'Failed to update provider');
      }
    } catch (error) {
      console.error('Failed to update provider', error);
      toast.error('An error occurred while updating provider');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedProvider) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/providers/${selectedProvider.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Provider deleted successfully');
        setIsDeleteDialogOpen(false);
        fetchProviders();
      } else {
        toast.error(data.error || 'Failed to delete provider');
      }
    } catch (error) {
      console.error('Failed to delete provider', error);
      toast.error('An error occurred while deleting provider');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && providers.length === 0) {
    return <LoadingSpinner size="lg" />;
  }

  if (error && providers.length === 0) {
    return <ErrorState message={error} onRetry={fetchProviders} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Providers</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Manage AI service providers</p>
        </div>
        <Button onClick={handleCreate}>Add New Provider</Button>
      </div>

      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search providers..." />

      <DataTable>
        <TableHeader>
          <TableHead
            sortable
            sorted={sortBy === 'name' ? sortOrder : null}
            onClick={() => handleSort('name')}
          >
            Name
          </TableHead>
          <TableHead
            sortable
            sorted={sortBy === 'country' ? sortOrder : null}
            onClick={() => handleSort('country')}
          >
            Country
          </TableHead>
          <TableHead>Models</TableHead>
          <TableHead>Actions</TableHead>
        </TableHeader>
        <TableBody>
          {providers.map((provider) => (
            <TableRow key={provider.id}>
              <TableCell className="font-medium">{provider.name}</TableCell>
              <TableCell>{provider.country}</TableCell>
              <TableCell>{provider._count?.models || 0}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => handleEdit(provider)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(provider)}>
                    Delete
                  </Button>
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

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Provider"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsCreateModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitCreate} isLoading={isSubmitting}>
              Create
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter provider name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Country
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter country"
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Provider"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitEdit} isLoading={isSubmitting}>
              Save Changes
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Country
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Provider"
        message={`Are you sure you want to delete "${selectedProvider?.name}"? This will affect all associated models.`}
        confirmText="Delete"
        isLoading={isSubmitting}
      />
    </div>
  );
}
