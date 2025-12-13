export const safeNumber = (v: any, fallback = 0): number => {
  if (v == null) return fallback;
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }
  if (typeof v === "object") {
    try {
      if (typeof v.toNumber === "function") return v.toNumber();
      const s = String(v);
      const n = Number(s);
      return Number.isFinite(n) ? n : fallback;
    } catch {
      return fallback;
    }
  }
  return fallback;
};

export const formatCount = (v: any): string => {
  const n = Math.round(safeNumber(v, 0));
  try {
    return n.toLocaleString();
  } catch {
    return String(n);
  }
};

export const formatPrice = (v: any): string => {
  const n = safeNumber(v, NaN);
  if (!Number.isFinite(n)) return "N/A";
  return n.toFixed(2);
};

export const calculateModelCost = (
  inputPricePerMillion: any,
  outputPricePerMillion: any,
  inputTokens: number,
  outputTokens: number
): number => {
  const inputPrice = safeNumber(inputPricePerMillion, 0);
  const outputPrice = safeNumber(outputPricePerMillion, 0);
  const inputCost = (inputTokens / 1000000) * inputPrice;
  const outputCost = (outputTokens / 1000000) * outputPrice;
  return inputCost + outputCost;
};
