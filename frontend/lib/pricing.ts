// lib/pricing.ts
export interface PricingParams {
  liquidityAmount: number;
  totalSupply: number;
  currentSupply: number; // tokens already sold
}

// Linear bonding curve: price = (liquidity * 2 * currentSupply) / (totalSupply^2)
export function calculateTokenPrice(params: PricingParams): number {
  const { liquidityAmount, totalSupply, currentSupply } = params;

  if (currentSupply >= totalSupply) return 0;

  return (liquidityAmount * 2 * currentSupply) / (totalSupply * totalSupply);
}

export function calculatePurchaseCost(
  params: PricingParams,
  tokensToBuy: number
): { cost: number; newPrice: number; avgPrice: number } {
  const { liquidityAmount, totalSupply, currentSupply } = params;

  if (currentSupply + tokensToBuy > totalSupply) {
    throw new Error("Not enough tokens available");
  }

  // Integral of pricing function from currentSupply to currentSupply + tokensToBuy
  const newSupply = currentSupply + tokensToBuy;
  const cost =
    (liquidityAmount *
      (newSupply * newSupply - currentSupply * currentSupply)) /
    (totalSupply * totalSupply);

  const newPrice = calculateTokenPrice({ ...params, currentSupply: newSupply });
  const avgPrice = cost / tokensToBuy;

  return { cost, newPrice, avgPrice };
}

export function calculateSellReturn(
  params: PricingParams,
  tokensToSell: number
): { returnAmount: number; newPrice: number; avgPrice: number } {
  const { liquidityAmount, totalSupply, currentSupply } = params;

  if (tokensToSell > currentSupply) {
    throw new Error("Cannot sell more tokens than in circulation");
  }

  const newSupply = currentSupply - tokensToSell;
  const returnAmount =
    (liquidityAmount *
      (currentSupply * currentSupply - newSupply * newSupply)) /
    (totalSupply * totalSupply);

  const newPrice = calculateTokenPrice({ ...params, currentSupply: newSupply });
  const avgPrice = returnAmount / tokensToSell;

  return { returnAmount, newPrice, avgPrice };
}
