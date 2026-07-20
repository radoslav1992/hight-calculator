import type { PredictionInput, PredictionResult } from "./engine";

export type HistoryRecord = {
  id: string;
  createdAt: string;
  input: PredictionInput;
  result: PredictionResult;
};

const STORAGE_KEY = "tallwise-predictions-v1";
const MAX_RECORDS = 8;

export function getHistory(): HistoryRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const records = JSON.parse(raw) as unknown;
    return Array.isArray(records) ? (records as HistoryRecord[]) : [];
  } catch {
    return [];
  }
}

export function savePrediction(input: PredictionInput, result: PredictionResult): HistoryRecord[] {
  const record: HistoryRecord = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    input,
    result
  };
  const next = [record, ...getHistory()].slice(0, MAX_RECORDS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("tallwise:history", { detail: next }));
  return next;
}

export function removePrediction(id: string): HistoryRecord[] {
  const next = getHistory().filter((record) => record.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("tallwise:history", { detail: next }));
  return next;
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("tallwise:history", { detail: [] }));
}
