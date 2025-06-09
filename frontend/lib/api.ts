// Token API functions
export async function getAllTokens(params?: {
  limit?: number;
  offset?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  filter?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.offset) searchParams.set("offset", params.offset.toString());
  if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params?.order) searchParams.set("order", params.order);
  if (params?.filter) searchParams.set("filter", params.filter);

  const response = await fetch(`/api/tokens?${searchParams}`);
  const result = await response.json();

  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function getTokenById(id: string) {
  const response = await fetch(`/api/tokens/${id}`);
  const result = await response.json();

  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function getTrendingTokens() {
  const response = await fetch("/api/tokens/trending");
  const result = await response.json();

  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function getRecentTokens() {
  const response = await fetch("/api/tokens/recent");
  const result = await response.json();

  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function getKingToken() {
  const response = await fetch("/api/tokens/king");
  const result = await response.json();

  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function createToken(tokenData: {
  token_name: string;
  token_symbol: string;
  token_image?: string;
  creator_allocation?: string;
  liquidity_amount: string;
  twitter?: string;
  telegram?: string;
  website?: string;
  creator_address?: string;
}) {
  const response = await fetch("/api/tokens", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tokenData),
  });

  const result = await response.json();
  if (!result.success) throw new Error(result.error);
  return result.token;
}

// Trading API functions
export async function buyToken(data: {
  token_id: string;
  user_address: string;
  usd_amount: number;
}) {
  const response = await fetch("/api/tokens/buy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!result.success) throw new Error(result.error);
  return result;
}

export async function sellToken(data: {
  token_id: string;
  user_address: string;
  token_amount: number;
}) {
  const response = await fetch("/api/tokens/sell", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!result.success) throw new Error(result.error);
  return result;
}

export async function getTokenPrice(data: {
  token_id: string;
  usd_amount?: number;
  token_amount?: number;
  action: "buy" | "sell";
}) {
  const response = await fetch("/api/tokens/price", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!result.success) throw new Error(result.error);
  return result;
}

// Transaction API functions
export async function getTokenTransactions(tokenId: string, limit = 50) {
  const response = await fetch(`/api/transactions/${tokenId}?limit=${limit}`);
  const result = await response.json();

  if (!result.success) throw new Error(result.error);
  return result.data;
}

// Portfolio API functions
export async function getUserPortfolio(address: string) {
  const response = await fetch(`/api/portfolio/${address}`);
  const result = await response.json();

  if (!result.success) throw new Error(result.error);
  return result;
}

export async function updateTokenImage(tokenId: string, imageUrl: string) {
  const response = await fetch(`/api/tokens/${tokenId}/image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_url: imageUrl }),
  });
}
