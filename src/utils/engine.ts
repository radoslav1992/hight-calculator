import { projectFromCdcCurve, type BiologicalSex } from "./cdcLookup";

export type PubertyStage = "not-started" | "growth-spurt" | "slowing" | "finished";
export type SleepBand = "under-7" | "7-to-9" | "9-plus";
export type NutritionRating = "poor" | "moderate" | "optimal";

export type PredictionInput = {
  name?: string;
  sex: BiologicalSex;
  ageYears: number;
  currentHeightCm: number;
  currentWeightKg: number;
  motherHeightCm: number;
  fatherHeightCm: number;
  pubertyStage: PubertyStage;
  sleep: SleepBand;
  nutrition: NutritionRating;
};

export type PredictionResult = {
  estimateCm: number;
  lowCm: number;
  highCm: number;
  tannerCm: number;
  khamisRocheCm: number;
  cdcCm: number;
  percentile: number;
  lifestyleAdjustmentCm: number;
  agreement: "close" | "moderate" | "wide";
};

type Coefficients = readonly [
  age: number,
  intercept: number,
  height: number,
  weight: number,
  midParent: number
];

// Erratum-corrected Khamis–Roche coefficients. The published equation uses
// inches for stature and pounds for weight, so metric inputs are converted.
const MALE_COEFFICIENTS: readonly Coefficients[] = [
  [4, -10.2567, 1.23812, -0.087235, 0.50286],
  [4.5, -10.719, 1.15964, -0.074454, 0.52887],
  [5, -11.0213, 1.10674, -0.064778, 0.53919],
  [5.5, -11.1556, 1.0748, -0.05776, 0.53691],
  [6, -11.1138, 1.05923, -0.052947, 0.52513],
  [6.5, -11.0221, 1.05542, -0.049892, 0.50692],
  [7, -10.9984, 1.05877, -0.048144, 0.48538],
  [7.5, -11.0214, 1.06467, -0.047256, 0.46361],
  [8, -11.0696, 1.06853, -0.046778, 0.44469],
  [8.5, -11.122, 1.06572, -0.046261, 0.43171],
  [9, -11.1571, 1.05166, -0.045254, 0.42776],
  [9.5, -11.1405, 1.02174, -0.043311, 0.43593],
  [10, -11.038, 0.97135, -0.039981, 0.45932],
  [10.5, -10.8286, 0.89589, -0.034814, 0.50101],
  [11, -10.4917, 0.81239, -0.02905, 0.54781],
  [11.5, -10.0065, 0.74134, -0.024167, 0.58409],
  [12, -9.3522, 0.68325, -0.020076, 0.60927],
  [12.5, -8.6055, 0.63869, -0.016681, 0.62279],
  [13, -7.8632, 0.60818, -0.013895, 0.62407],
  [13.5, -7.1348, 0.59228, -0.011624, 0.61253],
  [14, -6.4299, 0.59151, -0.009776, 0.58762],
  [14.5, -5.7578, 0.60643, -0.008261, 0.54875],
  [15, -5.1282, 0.63757, -0.006988, 0.49536],
  [15.5, -4.5092, 0.68548, -0.005863, 0.42687],
  [16, -3.9292, 0.75069, -0.004795, 0.34271],
  [16.5, -3.4873, 0.83375, -0.003695, 0.24231],
  [17, -3.283, 0.9352, -0.00247, 0.1251],
  [17.5, -3.4156, 1.05558, -0.001027, -0.0095]
];

const FEMALE_COEFFICIENTS: readonly Coefficients[] = [
  [4, -8.1325, 1.24768, -0.19435, 0.44774],
  [4.5, -6.47656, 1.22177, -0.18519, 0.41381],
  [5, -5.13582, 1.19932, -0.1753, 0.38467],
  [5.5, -4.13791, 1.1788, -0.16484, 0.36039],
  [6, -3.51039, 1.15866, -0.154, 0.34105],
  [6.5, -3.14322, 1.13737, -0.14294, 0.32672],
  [7, -2.87645, 1.11342, -0.13184, 0.31748],
  [7.5, -2.66291, 1.08525, -0.12086, 0.3134],
  [8, -2.45559, 1.05135, -0.11019, 0.31457],
  [8.5, -2.20728, 1.01018, -0.09999, 0.32105],
  [9, -1.87098, 0.9602, -0.09044, 0.33291],
  [9.5, -1.0633, 0.89989, -0.08171, 0.35025],
  [10, 0.33468, 0.82771, -0.07397, 0.37312],
  [10.5, 1.97366, 0.74213, -0.06739, 0.40161],
  [11, 3.50436, 0.67173, -0.06136, 0.42042],
  [11.5, 4.57747, 0.6415, -0.05518, 0.41686],
  [12, 4.84365, 0.64452, -0.04894, 0.3949],
  [12.5, 4.27869, 0.67386, -0.04272, 0.3585],
  [13, 3.21417, 0.7226, -0.03661, 0.31163],
  [13.5, 1.83456, 0.78383, -0.03067, 0.25826],
  [14, 0.32425, 0.85062, -0.025, 0.20235],
  [14.5, -1.13224, 0.91605, -0.01967, 0.14787],
  [15, -2.35055, 0.97319, -0.01477, 0.0988],
  [15.5, -3.10326, 1.01514, -0.01037, 0.05909],
  [16, -3.17885, 1.03496, -0.00655, 0.03272],
  [16.5, -2.41657, 1.02573, -0.0034, 0.02364],
  [17, -0.65579, 0.98054, -0.001, 0.03584],
  [17.5, 2.26429, 0.89246, 0.00057, 0.07327]
];

function roundTo(value: number, precision = 1): number {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}

function getCoefficients(sex: BiologicalSex, ageYears: number): Coefficients {
  const table = sex === "male" ? MALE_COEFFICIENTS : FEMALE_COEFFICIENTS;
  const age = clamp(ageYears, 4, 17.5);
  const position = (age - 4) / 0.5;
  const lower = table[Math.floor(position)];
  const upper = table[Math.ceil(position)] ?? lower;
  const amount = position - Math.floor(position);

  return [
    age,
    lower[1] + (upper[1] - lower[1]) * amount,
    lower[2] + (upper[2] - lower[2]) * amount,
    lower[3] + (upper[3] - lower[3]) * amount,
    lower[4] + (upper[4] - lower[4]) * amount
  ];
}

function validateInput(input: PredictionInput): void {
  const checks: Array<[boolean, string]> = [
    [input.ageYears >= 4 && input.ageYears <= 17.5, "Age must be between 4 and 17.5 years."],
    [input.currentHeightCm >= 80 && input.currentHeightCm <= 210, "Current height looks outside the supported range."],
    [input.currentWeightKg >= 12 && input.currentWeightKg <= 160, "Current weight looks outside the supported range."],
    [input.motherHeightCm >= 130 && input.motherHeightCm <= 220, "Mother's height looks outside the supported range."],
    [input.fatherHeightCm >= 130 && input.fatherHeightCm <= 220, "Father's height looks outside the supported range."]
  ];
  const failed = checks.find(([valid]) => !valid);
  if (failed) throw new RangeError(failed[1]);
}

export function calculateTannerTarget(input: PredictionInput): number {
  const sexAdjustment = input.sex === "male" ? 13 : -13;
  return (input.motherHeightCm + input.fatherHeightCm + sexAdjustment) / 2;
}

export function calculateKhamisRoche(input: PredictionInput): number {
  const [, intercept, heightFactor, weightFactor, parentFactor] = getCoefficients(
    input.sex,
    input.ageYears
  );
  const currentHeightIn = input.currentHeightCm / 2.54;
  const currentWeightLb = input.currentWeightKg * 2.2046226218;
  const midParentIn = (input.motherHeightCm + input.fatherHeightCm) / 2 / 2.54;
  const predictedIn =
    intercept +
    heightFactor * currentHeightIn +
    weightFactor * currentWeightLb +
    parentFactor * midParentIn;

  return predictedIn * 2.54;
}

function calculateLifestyleAdjustment(input: PredictionInput): number {
  const pubertyEffect: Record<PubertyStage, number> = {
    "not-started": 0.35,
    "growth-spurt": 0.25,
    slowing: -0.15,
    finished: -0.4
  };
  const sleepEffect: Record<SleepBand, number> = {
    "under-7": -0.45,
    "7-to-9": 0,
    "9-plus": 0.1
  };
  const nutritionEffect: Record<NutritionRating, number> = {
    poor: -0.55,
    moderate: 0,
    optimal: 0.1
  };

  return clamp(
    pubertyEffect[input.pubertyStage] + sleepEffect[input.sleep] + nutritionEffect[input.nutrition],
    -1.4,
    0.7
  );
}

export async function calculatePrediction(input: PredictionInput): Promise<PredictionResult> {
  validateInput(input);

  const tannerCm = calculateTannerTarget(input);
  const khamisRocheCm = calculateKhamisRoche(input);
  const cdc = await projectFromCdcCurve(input.sex, input.ageYears, input.currentHeightCm);
  const lifestyleAdjustmentCm = calculateLifestyleAdjustment(input);
  const estimate = 0.55 * khamisRocheCm + 0.25 * tannerCm + 0.2 * cdc.projectedHeightCm;
  const adjusted = Math.max(input.currentHeightCm, estimate + lifestyleAdjustmentCm);
  const methods = [tannerCm, khamisRocheCm, cdc.projectedHeightCm];
  const spread = Math.max(...methods) - Math.min(...methods);
  const ageUncertainty = clamp((14 - input.ageYears) * 0.2, 0, 2.2);
  const margin = clamp(3.4 + ageUncertainty + spread * 0.22, 3.4, 8.5);

  return {
    estimateCm: roundTo(adjusted),
    lowCm: roundTo(Math.max(input.currentHeightCm, adjusted - margin)),
    highCm: roundTo(adjusted + margin),
    tannerCm: roundTo(tannerCm),
    khamisRocheCm: roundTo(khamisRocheCm),
    cdcCm: roundTo(cdc.projectedHeightCm),
    percentile: clamp(cdc.percentile, 1, 99),
    lifestyleAdjustmentCm: roundTo(lifestyleAdjustmentCm),
    agreement: spread < 4 ? "close" : spread < 8 ? "moderate" : "wide"
  };
}

export function formatImperial(centimeters: number): string {
  const totalInches = centimeters / 2.54;
  let feet = Math.floor(totalInches / 12);
  let inches = Math.round(totalInches - feet * 12);
  if (inches === 12) {
    feet += 1;
    inches = 0;
  }
  return `${feet}′ ${inches}″`;
}
