export const safeNumber = (v: unknown, fallback = 0): number => {
  if (v == null) return fallback;
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }
  if (typeof v === "object") {
    try {
      if (typeof (v as { toNumber?: () => number }).toNumber === "function") return (v as { toNumber: () => number }).toNumber();
      const s = String(v);
      const n = Number(s);
      return Number.isFinite(n) ? n : fallback;
    } catch {
      return fallback;
    }
  }
  return fallback;
};

export const formatCount = (v: unknown): string => {
  const n = Math.round(safeNumber(v, 0));
  try {
    return n.toLocaleString();
  } catch {
    return String(n);
  }
};

export const formatPrice = (v: unknown): string => {
  const n = safeNumber(v, NaN);
  if (!Number.isFinite(n)) return "N/A";
  return n.toFixed(2);
};

export const calculateModelCost = (
  inputPricePerMillion: unknown,
  outputPricePerMillion: unknown,
  inputTokens: number,
  outputTokens: number
): number => {
  const inputPrice = safeNumber(inputPricePerMillion, 0);
  const outputPrice = safeNumber(outputPricePerMillion, 0);
  const inputCost = (inputTokens / 1000000) * inputPrice;
  const outputCost = (outputTokens / 1000000) * outputPrice;
  return inputCost + outputCost;
};
