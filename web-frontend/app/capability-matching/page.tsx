'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Card from '@/components/Card';
import LoadingState from '@/components/LoadingState';
import MatchForm from '@/components/matching/MatchForm';
import MatchResultCard from '@/components/matching/MatchResultCard';
import ExampleTasks from '@/components/matching/ExampleTasks';
import { trpc } from '@/lib/trpc';
import { MatchResult } from '@/lib/types';

export default function CapabilityMatchingPage() {
  const [taskDescription, setTaskDescription] = useState('');
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [costWeight, setCostWeight] = useState(0.5);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!taskDescription.trim()) {
      setError('Please describe your task');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      const response = await trpc.match.matchModelsForTask.query({
        taskDescription,
        constraints: maxPrice ? { maxPricePerMillionTokens: maxPrice } : undefined,
        preferences: { costWeight },
      });

      setResults((response.results as unknown as MatchResult[]) || []);
    } catch (err) {
      setError('Failed to find matching models');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exampleTasks = [
    'Code generation and debugging assistance',
    'Customer support chatbot with high accuracy',
    'Content writing and creative storytelling',
    'Data analysis and report generation',
    'Translation between multiple languages',
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-semibold tracking-tight mb-4">Find Your Perfect Match</h1>
            <p className="text-xl text-text-secondary">
              Tell us what you need, and we&apos;ll recommend the best AI models for your use case
            </p>
          </div>

          <MatchForm
            taskDescription={taskDescription}
            onTaskChange={setTaskDescription}
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
            costWeight={costWeight}
            onCostWeightChange={setCostWeight}
            onSubmit={handleSearch}
            loading={loading}
          />

          {!hasSearched && <ExampleTasks tasks={exampleTasks} onSelectTask={setTaskDescription} />}

          {error && !loading && (
            <Card className="mb-8 border-red-500">
              <p className="text-red-500">{error}</p>
            </Card>
          )}

          {loading && <LoadingState message="Analyzing your requirements..." />}

          {!loading && hasSearched && results.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Recommended Models ({results.length})</h2>

              {results.map((result, index) => (
                <MatchResultCard key={result.model.id} result={result} rank={index + 1} />
              ))}
            </div>
          )}

          {!loading && hasSearched && results.length === 0 && (
            <Card>
              <p className="text-center text-text-secondary py-8">
                No models found matching your criteria. Try adjusting your requirements.
              </p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
