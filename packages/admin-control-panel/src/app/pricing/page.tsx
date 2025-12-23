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
import { formatDate } from '@/lib/utils';

interface ModelPricing {
  id: number;
  name: string;
  outputPricePerMillion: string;
  inputPricePerMillion: string;
  cachedPricePerMillion: string | null;
  trainingPricePerMillion: string | null;
  currency: string;
  unit: string;
  effectiveAt: string;
  normalizedPerMillion: string | null;
  _count?: { model: number };
}

interface FormData {
  name: string;
  outputPricePerMillion: string;
  inputPricePerMillion: string;
  cachedPricePerMillion: string;
  trainingPricePerMillion: string;
  currency: string;
  unit: string;
  effectiveAt: string;
  normalizedPerMillion: string;
}

export default function PricingPage() {
  const [items, setItems] = useState<ModelPricing[]>([]);
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
  const [selectedItem, setSelectedItem] = useState<ModelPricing | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    outputPricePerMillion: '',
    inputPricePerMillion: '',
    cachedPricePerMillion: '',
    trainingPricePerMillion: '',
    currency: 'USD',
    unit: 'tokens',
    effectiveAt: new Date().toISOString().split('T')[0],
    normalizedPerMillion: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      const response = await fetch(`/api/pricing?${params}`);
      const data = await response.json();

      if (data.success) {
        setItems(data.data.items);
        setTotalPages(data.data.totalPages);
        setTotalItems(data.data.total);
      } else {
        setError(data.error || 'Failed to fetch pricing data');
      }
    } catch (error) {
      console.error('Failed to fetch pricing', error);
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

  const handleCreate = () => {
    setFormData({
      name: '',
      outputPricePerMillion: '',
      inputPricePerMillion: '',
      cachedPricePerMillion: '',
      trainingPricePerMillion: '',
      currency: 'USD',
      unit: 'tokens',
      effectiveAt: new Date().toISOString().split('T')[0],
      normalizedPerMillion: '',
    });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (item: ModelPricing) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      outputPricePerMillion: item.outputPricePerMillion.toString(),
      inputPricePerMillion: item.inputPricePerMillion.toString(),
      cachedPricePerMillion: item.cachedPricePerMillion?.toString() || '',
      trainingPricePerMillion: item.trainingPricePerMillion?.toString() || '',
      currency: item.currency,
      unit: item.unit,
      effectiveAt: new Date(item.effectiveAt).toISOString().split('T')[0],
      normalizedPerMillion: item.normalizedPerMillion?.toString() || '',
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (item: ModelPricing) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmitCreate = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Pricing created successfully');
        setIsCreateModalOpen(false);
        fetchData();
      } else {
        toast.error(data.error || 'Failed to create pricing');
      }
    } catch (error) {
      console.error('Failed to create pricing', error);
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (!selectedItem) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/pricing/${selectedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Pricing updated successfully');
        setIsEditModalOpen(false);
        fetchData();
      } else {
        toast.error(data.error || 'Failed to update pricing');
      }
    } catch (error) {
      console.error('Failed to update pricing', error);
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/pricing/${selectedItem.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Pricing deleted successfully');
        setIsDeleteDialogOpen(false);
        fetchData();
      } else {
        toast.error(data.error || 'Failed to delete pricing');
      }
    } catch (error) {
      console.error('Failed to delete pricing', error);
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && items.length === 0) return <LoadingSpinner size="lg" />;
  if (error && items.length === 0) return <ErrorState message={error} onRetry={fetchData} />;

  const PricingForm = () => (
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Input Price/M
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.inputPricePerMillion}
            onChange={(e) => setFormData({ ...formData, inputPricePerMillion: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Output Price/M
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.outputPricePerMillion}
            onChange={(e) => setFormData({ ...formData, outputPricePerMillion: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Currency
          </label>
          <input
            type="text"
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Unit
          </label>
          <input
            type="text"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Effective At
        </label>
        <input
          type="date"
          value={formData.effectiveAt}
          onChange={(e) => setFormData({ ...formData, effectiveAt: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Model Pricing</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Manage pricing configurations</p>
        </div>
        <Button onClick={handleCreate}>Add New Pricing</Button>
      </div>

      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search pricing..." />

      <DataTable>
        <TableHeader>
          <TableHead
            sortable
            sorted={sortBy === 'name' ? sortOrder : null}
            onClick={() => handleSort('name')}
          >
            Name
          </TableHead>
          <TableHead>Input $/M</TableHead>
          <TableHead>Output $/M</TableHead>
          <TableHead>Currency</TableHead>
          <TableHead>Effective At</TableHead>
          <TableHead>Actions</TableHead>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>${item.inputPricePerMillion}</TableCell>
              <TableCell>${item.outputPricePerMillion}</TableCell>
              <TableCell>{item.currency}</TableCell>
              <TableCell>{formatDate(item.effectiveAt)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => handleEdit(item)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(item)}>
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
        title="Create New Pricing"
        size="lg"
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
        <PricingForm />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Pricing"
        size="lg"
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
        <PricingForm />
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Pricing"
        message={`Are you sure you want to delete "${selectedItem?.name}"?`}
        confirmText="Delete"
        isLoading={isSubmitting}
      />
    </div>
  );
}
