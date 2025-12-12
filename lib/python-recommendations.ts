// Interface để gọi Python recommendation engine
export interface RecommendationRequest {
  type: "popular" | "related" | "category" | "search"
  productId?: string
  category?: string
  query?: string
  limit?: number
}

export interface RecommendationResponse {
  success: boolean
  data?: any[]
  error?: string
}

export async function getRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
  try {
    const params = new URLSearchParams()
    params.append("type", request.type)

    if (request.productId) params.append("productId", request.productId)
    if (request.category) params.append("category", request.category)
    if (request.query) params.append("query", request.query)
    if (request.limit) params.append("limit", request.limit.toString())

    const response = await fetch(`/api/recommendations?${params.toString()}`)
    const result = await response.json()

    return result
  } catch (error) {
    console.error("Error calling recommendation API:", error)
    return {
      success: false,
      error: "Failed to get recommendations",
    }
  }
}

// Wrapper functions for easier use
export async function getPopularProducts(limit = 10) {
  return getRecommendations({ type: "popular", limit })
}

export async function getRelatedProducts(productId: string, limit = 4) {
  return getRecommendations({ type: "related", productId, limit })
}

export async function getCategoryProducts(category: string, limit = 8) {
  return getRecommendations({ type: "category", category, limit })
}

export async function searchProducts(query: string, limit = 20) {
  return getRecommendations({ type: "search", query, limit })
}
