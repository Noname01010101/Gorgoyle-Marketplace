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

interface Field {
  id: number;
  name: string;
  _count?: {
    aiModels: number;
  };
}

export default function FieldsPage() {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemsPerPage = 10;

  const fetchFields = useCallback(async () => {
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

      const response = await fetch(`/api/fields?${params}`);
      const data = await response.json();

      if (data.success) {
        setFields(data.data.items);
        setTotalPages(data.data.totalPages);
        setTotalItems(data.data.total);
      } else {
        setError(data.error || 'Failed to fetch fields');
      }
    } catch (error) {
      console.error('Failed to fetch fields', error);
      setError('An error occurred while fetching fields');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, sortBy, sortOrder]);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleCreate = () => {
    setFormData({ name: '' });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (field: Field) => {
    setSelectedField(field);
    setFormData({ name: field.name });
    setIsEditModalOpen(true);
  };

  const handleDelete = (field: Field) => {
    setSelectedField(field);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmitCreate = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Field created successfully');
        setIsCreateModalOpen(false);
        fetchFields();
      } else {
        toast.error(data.error || 'Failed to create field');
      }
    } catch (error) {
      console.error('Failed to create field', error);
      toast.error('An error occurred while creating field');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (!selectedField) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/fields/${selectedField.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Field updated successfully');
        setIsEditModalOpen(false);
        fetchFields();
      } else {
        toast.error(data.error || 'Failed to update field');
      }
    } catch (error) {
      console.error('Failed to update field', error);
      toast.error('An error occurred while updating field');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedField) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/fields/${selectedField.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Field deleted successfully');
        setIsDeleteDialogOpen(false);
        fetchFields();
      } else {
        toast.error(data.error || 'Failed to delete field');
      }
    } catch (error) {
      console.error('Failed to delete field', error);
      toast.error('An error occurred while deleting field');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && fields.length === 0) {
    return <LoadingSpinner size="lg" />;
  }

  if (error && fields.length === 0) {
    return <ErrorState message={error} onRetry={fetchFields} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Fields</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage model fields and attributes
          </p>
        </div>
        <Button onClick={handleCreate}>Add New Field</Button>
      </div>

      {/* Search */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search fields..." />

      {/* Table */}
      <DataTable>
        <TableHeader>
          <TableHead
            sortable
            sorted={sortBy === 'name' ? sortOrder : null}
            onClick={() => handleSort('name')}
          >
            Name
          </TableHead>
          <TableHead>Models Using</TableHead>
          <TableHead>Actions</TableHead>
        </TableHeader>
        <TableBody>
          {fields.map((field) => (
            <TableRow key={field.id}>
              <TableCell className="font-medium">{field.name}</TableCell>
              <TableCell>{field._count?.aiModels || 0}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => handleEdit(field)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(field)}>
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
      />

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Field"
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
              onChange={(e) => setFormData({ name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter field name"
            />
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Field"
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
              onChange={(e) => setFormData({ name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Field"
        message={`Are you sure you want to delete the field "${selectedField?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isSubmitting}
      />
    </div>
  );
}
