// Tích hợp Python recommendation engine trực tiếp vào TypeScript
import { getAllProducts, getPopularProducts as getPopularFromCSV, getAllRatings } from "./data"

interface Product {
  product_id: string
  name: string
  category: string
  brand: string
  price: number
  rating: string
  features: string
  description: string
}

interface PopularProduct extends Product {
  num_ratings: number
  avg_rating: number
}

class RecommendationEngine {
  private products: Product[] = []
  private popularProducts: PopularProduct[] = []
  private ratings: any[] = []
  private contentSimilarity: number[][] = []
  private isInitialized = false

  async initialize() {
    if (this.isInitialized) return

    // Load data
    this.products = getAllProducts()
    this.popularProducts = getPopularFromCSV(50)
    this.ratings = getAllRatings()

    // Prepare content-based features
    this.prepareContentSimilarity()

    this.isInitialized = true
    console.log("🐍 Recommendation Engine initialized with", this.products.length, "products")
  }

  private prepareContentSimilarity() {
    // Tạo content vectors cho mỗi sản phẩm
    const contentVectors = this.products.map((product) => {
      const content = `${product.category} ${product.brand} ${product.features} ${product.description}`.toLowerCase()
      return this.createTfIdfVector(content)
    })

    // Tính cosine similarity matrix
    this.contentSimilarity = this.calculateCosineSimilarity(contentVectors)
  }

  private createTfIdfVector(text: string): { [key: string]: number } {
    const words = text.split(/\s+/).filter((word) => word.length > 2)
    const wordCount: { [key: string]: number } = {}

    // Count word frequencies
    words.forEach((word) => {
      wordCount[word] = (wordCount[word] || 0) + 1
    })

    // Simple TF-IDF approximation
    const vector: { [key: string]: number } = {}
    Object.keys(wordCount).forEach((word) => {
      vector[word] = wordCount[word] / words.length
    })

    return vector
  }

  private calculateCosineSimilarity(vectors: { [key: string]: number }[]): number[][] {
    const similarity: number[][] = []

    for (let i = 0; i < vectors.length; i++) {
      similarity[i] = []
      for (let j = 0; j < vectors.length; j++) {
        if (i === j) {
          similarity[i][j] = 1
        } else {
          similarity[i][j] = this.cosineSimilarity(vectors[i], vectors[j])
        }
      }
    }

    return similarity
  }

  private cosineSimilarity(vecA: { [key: string]: number }, vecB: { [key: string]: number }): number {
    const keysA = Object.keys(vecA)
    const keysB = Object.keys(vecB)
    const commonKeys = keysA.filter((key) => keysB.includes(key))

    if (commonKeys.length === 0) return 0

    let dotProduct = 0
    let normA = 0
    let normB = 0

    commonKeys.forEach((key) => {
      dotProduct += vecA[key] * vecB[key]
    })

    keysA.forEach((key) => {
      normA += vecA[key] * vecA[key]
    })

    keysB.forEach((key) => {
      normB += vecB[key] * vecB[key]
    })

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }

  // 🔥 Popular Products Algorithm
  async getPopularRecommendations(limit = 10) {
    await this.initialize()

    return this.popularProducts.slice(0, limit).map((product) => ({
      ...product,
      algorithm: "popular-based",
      score: product.avg_rating * Math.log(product.num_ratings + 1),
    }))
  }

  // 🎯 Content-Based Filtering Algorithm
  async getContentBasedRecommendations(productId: string, limit = 5) {
    await this.initialize()

    const productIndex = this.products.findIndex((p) => p.product_id === productId)
    if (productIndex === -1) return []

    // Get similarity scores for this product
    const similarities = this.contentSimilarity[productIndex]
      .map((score, index) => ({ index, score, product: this.products[index] }))
      .filter((item) => item.index !== productIndex) // Exclude the product itself
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    return similarities.map((item) => ({
      ...item.product,
      algorithm: "content-based",
      similarity_score: item.score,
      score: item.score,
    }))
  }

  // 🏷️ Category-Based Algorithm
  async getCategoryRecommendations(category: string, limit = 8) {
    await this.initialize()

    const categoryProducts = this.products
      .filter((product) => product.category.toLowerCase().includes(category.toLowerCase()))
      .sort((a, b) => Number.parseFloat(b.rating) - Number.parseFloat(a.rating))
      .slice(0, limit)

    return categoryProducts.map((product) => ({
      ...product,
      algorithm: "category-based",
      score: Number.parseFloat(product.rating),
    }))
  }

  // 🔍 Smart Search Algorithm
  async searchProducts(query: string, limit = 20) {
    await this.initialize()

    const queryLower = query.toLowerCase()
    const searchResults = this.products
      .map((product) => {
        let score = 0

        // Exact name match gets highest score
        if (product.name.toLowerCase().includes(queryLower)) score += 10

        // Brand match
        if (product.brand.toLowerCase().includes(queryLower)) score += 8

        // Category match
        if (product.category.toLowerCase().includes(queryLower)) score += 6

        // Features match
        if (product.features.toLowerCase().includes(queryLower)) score += 4

        // Description match
        if (product.description.toLowerCase().includes(queryLower)) score += 2

        return { ...product, algorithm: "search-based", score }
      })
      .filter((product) => product.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    return searchResults
  }

  // 🚀 Hybrid Algorithm (combines multiple approaches)
  async getHybridRecommendations(productId: string, limit = 6) {
    await this.initialize()

    const currentProduct = this.products.find((p) => p.product_id === productId)
    if (!currentProduct) return []

    // Get content-based recommendations
    const contentRecs = await this.getContentBasedRecommendations(productId, 4)

    // Get category-based recommendations
    const categoryRecs = await this.getCategoryRecommendations(currentProduct.category, 4)

    // Combine and deduplicate
    const allRecs = [...contentRecs, ...categoryRecs]
    const uniqueRecs = allRecs.filter(
      (rec, index, self) => index === self.findIndex((r) => r.product_id === rec.product_id),
    )

    // Sort by combined score
    return uniqueRecs
      .map((rec) => ({
        ...rec,
        algorithm: "hybrid",
        score: (rec.score || 0) + Number.parseFloat(rec.rating) * 0.1,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  // 📊 Get recommendation statistics
  async getStats() {
    await this.initialize()

    return {
      totalProducts: this.products.length,
      totalRatings: this.ratings.length,
      totalCategories: new Set(this.products.map((p) => p.category)).size,
      totalBrands: new Set(this.products.map((p) => p.brand)).size,
      avgRating: this.products.reduce((sum, p) => sum + Number.parseFloat(p.rating), 0) / this.products.length,
      topCategories: this.getTopCategories(5),
      topBrands: this.getTopBrands(5),
    }
  }

  private getTopCategories(limit: number) {
    const categoryCount: { [key: string]: number } = {}
    this.products.forEach((product) => {
      categoryCount[product.category] = (categoryCount[product.category] || 0) + 1
    })

    return Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([category, count]) => ({ category, count }))
  }

  private getTopBrands(limit: number) {
    const brandCount: { [key: string]: number } = {}
    this.products.forEach((product) => {
      brandCount[product.brand] = (brandCount[product.brand] || 0) + 1
    })

    return Object.entries(brandCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([brand, count]) => ({ brand, count }))
  }
}

// Singleton instance
const recommendationEngine = new RecommendationEngine()

// Export functions
export async function getPopularRecommendations(limit = 10) {
  return recommendationEngine.getPopularRecommendations(limit)
}

export async function getContentBasedRecommendations(productId: string, limit = 5) {
  return recommendationEngine.getContentBasedRecommendations(productId, limit)
}

export async function getCategoryRecommendations(category: string, limit = 8) {
  return recommendationEngine.getCategoryRecommendations(category, limit)
}

export async function searchProductsWithAI(query: string, limit = 20) {
  return recommendationEngine.searchProducts(query, limit)
}

export async function getHybridRecommendations(productId: string, limit = 6) {
  return recommendationEngine.getHybridRecommendations(productId, limit)
}

export async function getRecommendationStats() {
  return recommendationEngine.getStats()
}
