export type BiologicalSex = "male" | "female";

type CdcRow = {
  /** CDC sex code: 1 = male, 2 = female. */
  s: 1 | 2;
  /** Age in months. */
  a: number;
  /** Box-Cox power. */
  l: number;
  /** Median stature in centimeters. */
  m: number;
  /** Generalized coefficient of variation. */
  v: number;
};

export type CdcProjection = {
  projectedHeightCm: number;
  percentile: number;
  zScore: number;
  referenceAgeMonths: number;
};

let dataPromise: Promise<CdcRow[]> | undefined;

function loadCdcData(): Promise<CdcRow[]> {
  if (!dataPromise) {
    dataPromise = fetch("/cdc-growth-data.json")
      .then((response) => {
        if (!response.ok) throw new Error("CDC reference data could not be loaded.");
        return response.json() as Promise<CdcRow[]>;
      })
      .catch(() => {
        // Lightweight fallback keeps the calculator usable if the standalone
        // reference file is unavailable. The production PWA precaches the file.
        return [
          { s: 1, a: 48, l: 1, m: 102.5, v: 0.045 },
          { s: 1, a: 120, l: 1, m: 138.4, v: 0.05 },
          { s: 1, a: 180, l: 1, m: 170.1, v: 0.043 },
          { s: 1, a: 240, l: 1, m: 176.9, v: 0.041 },
          { s: 2, a: 48, l: 1, m: 101.1, v: 0.044 },
          { s: 2, a: 120, l: 1, m: 138.4, v: 0.049 },
          { s: 2, a: 180, l: 1, m: 161.8, v: 0.04 },
          { s: 2, a: 240, l: 1, m: 163.3, v: 0.04 }
        ];
      });
  }

  return dataPromise;
}

function lerp(start: number, end: number, amount: number): number {
  return start + (end - start) * amount;
}

function interpolateRows(rows: CdcRow[], ageMonths: number): CdcRow {
  if (ageMonths <= rows[0].a) return rows[0];
  if (ageMonths >= rows.at(-1)!.a) return rows.at(-1)!;

  const upperIndex = rows.findIndex((row) => row.a >= ageMonths);
  const lower = rows[Math.max(0, upperIndex - 1)];
  const upper = rows[upperIndex];
  const amount = (ageMonths - lower.a) / (upper.a - lower.a || 1);

  return {
    s: lower.s,
    a: ageMonths,
    l: lerp(lower.l, upper.l, amount),
    m: lerp(lower.m, upper.m, amount),
    v: lerp(lower.v, upper.v, amount)
  };
}

function measurementToZ(heightCm: number, row: CdcRow): number {
  if (Math.abs(row.l) < 0.000001) {
    return Math.log(heightCm / row.m) / row.v;
  }
  return (Math.pow(heightCm / row.m, row.l) - 1) / (row.l * row.v);
}

function zToMeasurement(zScore: number, row: CdcRow): number {
  if (Math.abs(row.l) < 0.000001) {
    return row.m * Math.exp(row.v * zScore);
  }
  return row.m * Math.pow(1 + row.l * row.v * zScore, 1 / row.l);
}

// Abramowitz and Stegun approximation for the normal CDF.
function normalCdf(value: number): number {
  const sign = value < 0 ? -1 : 1;
  const x = Math.abs(value) / Math.sqrt(2);
  const t = 1 / (1 + 0.3275911 * x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const erf = sign * (1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x));
  return 0.5 * (1 + erf);
}

/**
 * Projects the current CDC stature-for-age z-score to the 20-year reference.
 * This is a percentile-trajectory estimate, not a CDC-endorsed adult predictor.
 */
export async function projectFromCdcCurve(
  sex: BiologicalSex,
  ageYears: number,
  currentHeightCm: number
): Promise<CdcProjection> {
  const allRows = await loadCdcData();
  const sexCode = sex === "male" ? 1 : 2;
  const rows = allRows.filter((row) => row.s === sexCode).sort((a, b) => a.a - b.a);
  const ageMonths = Math.max(24, Math.min(240, ageYears * 12));
  const current = interpolateRows(rows, ageMonths);
  const adult = interpolateRows(rows, 240);
  const zScore = Math.max(-2.5, Math.min(2.5, measurementToZ(currentHeightCm, current)));

  return {
    projectedHeightCm: zToMeasurement(zScore, adult),
    percentile: Math.round(normalCdf(zScore) * 100),
    zScore,
    referenceAgeMonths: current.a
  };
}
