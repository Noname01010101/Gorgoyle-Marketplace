export interface Provider {
  id: number;
  name: string;
  country?: string;
}

export interface ModelPricing {
  id: number;
  name: string;
  inputPricePerMillion: any;
  outputPricePerMillion: any;
  cachedPricePerMillion?: any;
  trainingPricePerMillion?: any;
  currency: string;
  unit: string;
  effectiveAt: string | Date;
  normalizedPerMillion?: any;
}

export interface ModelField {
  id: number;
  name: string;
}

export interface Model {
  id: number;
  name: string;
  version: string;
  providerName?: string;
  description?: string;
  releaseDate?: string | Date;
  status?: string;
  deprecated?: boolean;
  capabilities?: any;
  modalities?: any;
  supportedFormats?: any;
  languages?: any;
  metadata?: Record<string, any> | null;
  modelPricingId?: number;
  provider?: Provider | null;
  modelPricings?: ModelPricing | null;
  fields?: ModelField[];
}

export interface Benchmark {
  id: number;
  modelId?: number;
  type: string;
  score: number;
  maxScore?: number;
  metadata?: Record<string, any> | null;
}

export interface BenchmarkSummary {
  modelId: number;
  model: Model;
  averageScore: number;
  totalBenchmarks: number;
  categories: string[];
}

export interface Suggestion {
  model: Model;
  reason?: string;
  similarityScore: number;
}

export interface MatchResult {
  model: Model;
  score: number;
  reasoning: string;
}
