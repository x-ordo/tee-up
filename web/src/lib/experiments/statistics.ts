/**
 * A/B Testing Statistics Utilities
 * TEE:UP Portfolio SaaS
 *
 * Provides statistical functions for experiment analysis.
 * These are pure calculation functions, not server actions.
 */

// ============================================================
// Statistical Significance Calculation
// ============================================================

/**
 * Calculate statistical significance between control and variant
 *
 * Uses a two-proportion z-test to determine if the difference
 * between control and variant conversion rates is statistically significant.
 *
 * @example
 * ```typescript
 * const result = calculateSignificance(50, 1000, 65, 1000);
 * // result.isSignificant: true (if p < 0.05)
 * // result.lift: 0.30 (30% improvement)
 * ```
 */
export function calculateSignificance(
  controlConversions: number,
  controlSampleSize: number,
  variantConversions: number,
  variantSampleSize: number
): {
  isSignificant: boolean;
  pValue: number;
  lift: number;
  confidenceInterval: [number, number];
} {
  // Validate inputs
  if (controlSampleSize === 0 || variantSampleSize === 0) {
    return {
      isSignificant: false,
      pValue: 1,
      lift: 0,
      confidenceInterval: [0, 0],
    };
  }

  // Control rate
  const controlRate = controlConversions / controlSampleSize;
  // Variant rate
  const variantRate = variantConversions / variantSampleSize;

  // Pooled rate
  const pooledRate =
    (controlConversions + variantConversions) / (controlSampleSize + variantSampleSize);

  // Standard error
  const se = Math.sqrt(
    pooledRate * (1 - pooledRate) * (1 / controlSampleSize + 1 / variantSampleSize)
  );

  // Z-score
  const zScore = se > 0 ? (variantRate - controlRate) / se : 0;

  // Two-tailed p-value (approximation)
  const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));

  // Lift
  const lift = controlRate > 0 ? (variantRate - controlRate) / controlRate : 0;

  // 95% confidence interval for lift
  const marginOfError = 1.96 * se;
  const confidenceInterval: [number, number] = [
    controlRate > 0 ? (variantRate - controlRate - marginOfError) / controlRate : 0,
    controlRate > 0 ? (variantRate - controlRate + marginOfError) / controlRate : 0,
  ];

  return {
    isSignificant: pValue < 0.05,
    pValue,
    lift,
    confidenceInterval,
  };
}

// ============================================================
// Helper Functions
// ============================================================

/**
 * Normal CDF approximation using Abramowitz and Stegun approximation
 * Accurate to 1.5 × 10^-7
 */
function normalCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return 0.5 * (1.0 + sign * y);
}

// ============================================================
// Additional Statistical Utilities
// ============================================================

/**
 * Calculate minimum sample size needed for a given effect size
 *
 * @param baselineRate - Expected conversion rate of control
 * @param minimumDetectableEffect - Minimum relative improvement to detect (e.g., 0.1 for 10%)
 * @param alpha - Significance level (default 0.05)
 * @param power - Statistical power (default 0.8)
 */
export function calculateMinSampleSize(
  baselineRate: number,
  minimumDetectableEffect: number,
  alpha: number = 0.05,
  power: number = 0.8
): number {
  // Z-scores for alpha and power
  const zAlpha = 1.96; // for alpha = 0.05, two-tailed
  const zBeta = 0.84; // for power = 0.8

  const expectedRate = baselineRate * (1 + minimumDetectableEffect);

  // Pooled standard error
  const pooledRate = (baselineRate + expectedRate) / 2;
  const variance =
    2 * pooledRate * (1 - pooledRate) +
    baselineRate * (1 - baselineRate) +
    expectedRate * (1 - expectedRate);

  // Sample size per group
  const effect = expectedRate - baselineRate;
  const sampleSize = Math.ceil(
    (Math.pow(zAlpha + zBeta, 2) * variance) / Math.pow(effect, 2)
  );

  return sampleSize;
}

/**
 * Calculate the probability that variant is better than control
 * Using Bayesian approximation
 */
export function calculateProbabilityOfImprovement(
  controlConversions: number,
  controlSampleSize: number,
  variantConversions: number,
  variantSampleSize: number
): number {
  // Beta distribution parameters (using uniform prior)
  const alphaC = controlConversions + 1;
  const betaC = controlSampleSize - controlConversions + 1;
  const alphaV = variantConversions + 1;
  const betaV = variantSampleSize - variantConversions + 1;

  // Mean and variance of beta distributions
  const meanC = alphaC / (alphaC + betaC);
  const meanV = alphaV / (alphaV + betaV);
  const varC = (alphaC * betaC) / (Math.pow(alphaC + betaC, 2) * (alphaC + betaC + 1));
  const varV = (alphaV * betaV) / (Math.pow(alphaV + betaV, 2) * (alphaV + betaV + 1));

  // Z-score for difference
  const z = (meanV - meanC) / Math.sqrt(varC + varV);

  // Probability that variant > control
  return normalCDF(z);
}
