'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Card from '@/components/Card';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import { trpc } from '@/lib/trpc';
import Link from 'next/link';
import { Model } from '@/lib/types';

interface Suggestion {
  model: Model;
  reason?: string;
  similarityScore: number;
}

export default function SuggestionsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadModels = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trpc.catalog.getModels.query({});
      setModels(data);

      // Auto-select first model
      if (data.length > 0) {
        handleSelectModel(data[0]);
      }
    } catch (err) {
      setError('Failed to load models');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectModel = async (model: Model) => {
    setSelectedModel(model);
    setLoadingSuggestions(true);

    try {
      const response = await trpc.suggestions.getSuggestionsForModel.query({
        name: model.name,
        version: model.version,
      });
      setSuggestions((response.suggestions || []) as unknown as Suggestion[]);
    } catch (err) {
      console.error('Failed to load suggestions:', err);
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  if (loading) return <LoadingState message="Loading models..." />;
  if (error) return <ErrorState message={error} onRetry={loadModels} />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-semibold tracking-tight mb-4">Model Suggestions</h1>
            <p className="text-xl text-text-secondary">
              Find similar and alternative models based on your current choice
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Model Selector */}
            <div className="lg:col-span-1">
              <Card>
                <h3 className="text-xl font-semibold mb-4">Select a Model</h3>
                <div className="space-y-2 max-h-150 overflow-y-auto">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => handleSelectModel(model)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        selectedModel?.id === model.id
                          ? 'bg-primary text-white'
                          : 'bg-card-bg-hover text-text-secondary hover:bg-border hover:text-text-primary'
                      }`}
                    >
                      <div className="font-medium">{model.name}</div>
                      {model.provider && (
                        <div className="text-xs opacity-75 mt-1">{model.provider.name}</div>
                      )}
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Suggestions Display */}
            <div className="lg:col-span-2">
              {selectedModel && (
                <>
                  <Card className="mb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-semibold mb-2">{selectedModel.name}</h2>
                        {selectedModel.provider && (
                          <p className="text-text-tertiary">{selectedModel.provider.name}</p>
                        )}
                      </div>
                      <Link
                        href={`/models/${encodeURIComponent(
                          selectedModel.name
                        )}/${encodeURIComponent(selectedModel.version)}`}
                        className="btn-secondary"
                      >
                        View Details
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm">
                      {selectedModel.modelPricings && (
                        <>
                          <div>
                            <div className="text-text-tertiary mb-1">Input Price</div>
                            <div className="text-text-primary font-semibold">
                              $
                              {selectedModel.modelPricings.inputPricePerMillion?.toString() ||
                                'N/A'}
                              /M
                            </div>
                          </div>
                          <div>
                            <div className="text-text-tertiary mb-1">Output Price</div>
                            <div className="text-text-primary font-semibold">
                              $
                              {selectedModel.modelPricings.outputPricePerMillion?.toString() ||
                                'N/A'}
                              /M
                            </div>
                          </div>
                        </>
                      )}
                      {(() => {
                        if (!selectedModel.metadata) return null;
                        const metadata = selectedModel.metadata as {
                          contextWindowTokens?: number;
                          maxOutputTokens?: number;
                        };
                        return (
                          <>
                            {metadata.contextWindowTokens && (
                              <div>
                                <div className="text-text-tertiary mb-1">Context</div>
                                <div className="text-text-primary font-semibold">
                                  {metadata.contextWindowTokens.toLocaleString()}
                                </div>
                              </div>
                            )}
                            {metadata.maxOutputTokens && (
                              <div>
                                <div className="text-text-tertiary mb-1">Max Output</div>
                                <div className="text-text-primary font-semibold">
                                  {metadata.maxOutputTokens.toLocaleString()}
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </Card>

                  {loadingSuggestions ? (
                    <LoadingState message="Finding similar models..." />
                  ) : suggestions.length === 0 ? (
                    <Card>
                      <p className="text-center text-text-secondary py-8">
                        No similar models found for this selection.
                      </p>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold">
                        Similar Models ({suggestions.length})
                      </h3>

                      {suggestions.map((suggestion) => (
                        <Card key={suggestion.model.id} hover>
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <Link
                                  href={`/models/${encodeURIComponent(
                                    suggestion.model.name
                                  )}/${encodeURIComponent(suggestion.model.version)}`}
                                >
                                  <h4 className="text-xl font-semibold text-text-primary hover:text-primary transition-colors">
                                    {suggestion.model.name}
                                  </h4>
                                </Link>
                                {suggestion.model.provider && (
                                  <p className="text-sm text-text-tertiary mt-1">
                                    {suggestion.model.provider.name}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-primary">
                                  {(suggestion.similarityScore * 100).toFixed(0)}%
                                </div>
                                <div className="text-xs text-text-tertiary">Similarity</div>
                              </div>
                            </div>

                            <p className="text-text-secondary">{suggestion.reason}</p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-4 border-t border-border">
                              {suggestion.model.modelPricings && (
                                <>
                                  <div>
                                    <div className="text-text-tertiary mb-1">Input</div>
                                    <div className="text-text-primary font-medium">
                                      $
                                      {suggestion.model.modelPricings.inputPricePerMillion?.toString() ||
                                        'N/A'}
                                      /M
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-text-tertiary mb-1">Output</div>
                                    <div className="text-text-primary font-medium">
                                      $
                                      {suggestion.model.modelPricings.outputPricePerMillion?.toString() ||
                                        'N/A'}
                                      /M
                                    </div>
                                  </div>
                                </>
                              )}
                              {(() => {
                                const metadata = suggestion.model.metadata as {
                                  contextWindowTokens?: number;
                                };
                                return (
                                  metadata &&
                                  metadata.contextWindowTokens && (
                                    <div>
                                      <div className="text-text-tertiary mb-1">Context</div>
                                      <div className="text-text-primary font-medium">
                                        {metadata.contextWindowTokens.toLocaleString()}
                                      </div>
                                    </div>
                                  )
                                );
                              })()}
                              <div className="flex items-end">
                                <button
                                  onClick={() => handleSelectModel(suggestion.model)}
                                  className="text-primary hover:text-primary-hover text-sm transition-colors"
                                >
                                  Compare →
                                </button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
