'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorState } from '@/components/ErrorState';
import { SearchBar } from '@/components/SearchBar';
import toast from 'react-hot-toast';

interface ProviderOption {
  id: number;
  name: string;
}

interface PricingOption {
  id: number;
  name: string;
}

interface FieldOption {
  id: number;
  name: string;
}

export default function NewModelPage() {
  const router = useRouter();

  const [providers, setProviders] = useState<ProviderOption[]>([]);
  const [pricings, setPricings] = useState<PricingOption[]>([]);
  const [fields, setFields] = useState<FieldOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    name: '',
    version: '',
    providerName: '',
    modelPricingId: '',
    status: 'active',
    deprecated: false,
    releaseDate: new Date().toISOString().split('T')[0],
    capabilities: '{}',
    modalities: '[]',
    supportedFormats: '[]',
    languages: '[]',
    metadata: '{}',
    fieldIds: [] as number[],
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const [providerRes, pricingRes, fieldsRes] = await Promise.all([
          fetch('/api/providers?limit=100'),
          fetch('/api/pricing?limit=100'),
          fetch('/api/fields?limit=100'),
        ]);

        const [providerJson, pricingJson, fieldsJson] = await Promise.all([
          providerRes.json(),
          pricingRes.json(),
          fieldsRes.json(),
        ]);

        if (!providerJson.success || !pricingJson.success || !fieldsJson.success) {
          throw new Error('Failed to load reference data');
        }

        setProviders(providerJson.data.items);
        setPricings(pricingJson.data.items);
        setFields(fieldsJson.data.items);
      } catch (err) {
        console.error('Failed to load form data', err);
        setError('Unable to load form data');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const updateFieldIds = (id: number, checked: boolean) => {
    setForm((prev) => {
      const fieldIds = new Set(prev.fieldIds);
      if (checked) {
        fieldIds.add(id);
      } else {
        fieldIds.delete(id);
      }
      return { ...prev, fieldIds: Array.from(fieldIds) };
    });
  };

  const parseJsonSafe = (label: string, value: string) => {
    try {
      return value ? JSON.parse(value) : undefined;
    } catch (err) {
      console.error(`Invalid JSON for ${label}`, err);
      throw new Error(`${label} must be valid JSON`);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        name: form.name.trim(),
        version: form.version.trim(),
        providerName: form.providerName,
        modelPricingId: Number(form.modelPricingId),
        status: form.status,
        deprecated: form.deprecated,
        releaseDate: form.releaseDate,
        capabilities: parseJsonSafe('Capabilities', form.capabilities),
        modalities: parseJsonSafe('Modalities', form.modalities),
        supportedFormats: parseJsonSafe('Supported formats', form.supportedFormats),
        languages: parseJsonSafe('Languages', form.languages),
        metadata: parseJsonSafe('Metadata', form.metadata),
        fieldIds: form.fieldIds,
      };

      const res = await fetch('/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || 'Failed to create model');
      }

      toast.success('Model created');
      router.push('/models');
    } catch (err: any) {
      toast.error(err.message || 'Unable to create model');
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => location.reload()} />;
  }

  const filteredFields = fields.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">New Model</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Create a new AI model record</p>
        </div>
        <Button variant="secondary" onClick={() => router.push('/models')}>
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Version
            </label>
            <input
              type="text"
              value={form.version}
              onChange={(e) => setForm({ ...form, version: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Provider
            </label>
            <select
              value={form.providerName}
              onChange={(e) => setForm({ ...form, providerName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select provider</option>
              {providers.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pricing
            </label>
            <select
              value={form.modelPricingId}
              onChange={(e) => setForm({ ...form, modelPricingId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select pricing</option>
              {pricings.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="deprecated"
              type="checkbox"
              checked={form.deprecated}
              onChange={(e) => setForm({ ...form, deprecated: e.target.checked })}
            />
            <label htmlFor="deprecated" className="text-sm text-gray-700 dark:text-gray-300">
              Deprecated
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Release date
            </label>
            <input
              type="date"
              value={form.releaseDate}
              onChange={(e) => setForm({ ...form, releaseDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="space-y-4">
          {[
            { label: 'Capabilities (JSON)', key: 'capabilities' },
            { label: 'Modalities (JSON)', key: 'modalities' },
            { label: 'Supported formats (JSON)', key: 'supportedFormats' },
            { label: 'Languages (JSON)', key: 'languages' },
            { label: 'Metadata (JSON)', key: 'metadata' },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}
              </label>
              <textarea
                value={(form as any)[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value } as any)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                rows={3}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Fields</h2>
          <div className="w-64">
            <SearchBar value={search} onChange={setSearch} placeholder="Search fields..." />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-900">
          {filteredFields.map((field) => {
            const checked = form.fieldIds.includes(field.id);
            return (
              <label
                key={field.id}
                className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => updateFieldIds(field.id, e.target.checked)}
                />
                {field.name}
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={() => router.push('/models')}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Create Model</Button>
      </div>
    </div>
  );
}
