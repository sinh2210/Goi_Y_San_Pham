"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Star, TrendingUp, Zap, Search, BarChart3, RefreshCw, Cpu } from "lucide-react"
import { getProductImageUrl } from "@/lib/data"

interface RecommendedProduct {
  product_id: string
  name: string
  category: string
  brand: string
  price: number
  rating: string
  features: string
  algorithm?: string
  score?: number
  similarity_score?: number
  num_ratings?: number
}

interface RecommendationStats {
  totalProducts: number
  totalRatings: number
  totalCategories: number
  totalBrands: number
  avgRating: number
  topCategories: { category: string; count: number }[]
  topBrands: { brand: string; count: number }[]
}

export default function UnifiedRecommendations() {
  const [popularProducts, setPopularProducts] = useState<RecommendedProduct[]>([])
  const [relatedProducts, setRelatedProducts] = useState<RecommendedProduct[]>([])
  const [searchResults, setSearchResults] = useState<RecommendedProduct[]>([])
  const [hybridResults, setHybridResults] = useState<RecommendedProduct[]>([])
  const [stats, setStats] = useState<RecommendationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("Samsung")
  const [selectedProductId, setSelectedProductId] = useState("")

  useEffect(() => {
    loadAllRecommendations()
  }, [])

  const loadAllRecommendations = async () => {
    setLoading(true)

    try {
      // Load popular products
      const popularResponse = await fetch("/api/recommendations?type=popular&limit=6")
      const popularData = await popularResponse.json()
      if (popularData.success) {
        setPopularProducts(popularData.data)
        if (popularData.data.length > 0) {
          setSelectedProductId(popularData.data[0].product_id)
        }
      }

      // Load stats
      const statsResponse = await fetch("/api/recommendations?type=stats")
      const statsData = await statsResponse.json()
      if (statsData.success) {
        setStats(statsData.data)
      }

      // Load related products if we have a product ID
      if (popularData.data && popularData.data.length > 0) {
        const productId = popularData.data[0].product_id
        await loadRelatedProducts(productId)
        await loadHybridRecommendations(productId)
      }

      // Load search results
      await performSearch(searchQuery)
    } catch (error) {
      console.error("Error loading recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadRelatedProducts = async (productId: string) => {
    try {
      const response = await fetch(`/api/recommendations?type=related&productId=${productId}&limit=4`)
      const data = await response.json()
      if (data.success) {
        setRelatedProducts(data.data)
      }
    } catch (error) {
      console.error("Error loading related products:", error)
    }
  }

  const loadHybridRecommendations = async (productId: string) => {
    try {
      const response = await fetch(`/api/recommendations?type=hybrid&productId=${productId}&limit=4`)
      const data = await response.json()
      if (data.success) {
        setHybridResults(data.data)
      }
    } catch (error) {
      console.error("Error loading hybrid recommendations:", error)
    }
  }

  const performSearch = async (query: string) => {
    if (!query.trim()) return

    try {
      const response = await fetch(`/api/recommendations?type=search&query=${encodeURIComponent(query)}&limit=4`)
      const data = await response.json()
      if (data.success) {
        setSearchResults(data.data)
      }
    } catch (error) {
      console.error("Error performing search:", error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(searchQuery)
  }

  const handleProductSelect = async (productId: string) => {
    setSelectedProductId(productId)
    await loadRelatedProducts(productId)
    await loadHybridRecommendations(productId)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang khởi tạo Recommendation Engine...</p>
        </div>
      </div>
    )
  }

  const selectedProduct = popularProducts.find((p) => p.product_id === selectedProductId)

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Cpu className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">🚀 Unified Recommendation Engine</h1>
        </div>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Hệ thống gợi ý thống nhất với nhiều thuật toán: Content-Based Filtering, Popular-Based, Category-Based, Search
          Algorithm và Hybrid Approach - tất cả trong một hệ thống Next.js
        </p>
      </div>

      {/* Stats Dashboard */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              Thống kê hệ thống
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalProducts}</div>
                <div className="text-sm text-gray-600">Sản phẩm</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.totalCategories}</div>
                <div className="text-sm text-gray-600">Danh mục</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.totalBrands}</div>
                <div className="text-sm text-gray-600">Thương hiệu</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.avgRating.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Rating TB</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Top Danh mục:</h4>
                {stats.topCategories.map((cat, index) => (
                  <div key={cat.category} className="flex justify-between text-sm">
                    <span>
                      {index + 1}. {cat.category}
                    </span>
                    <span className="text-gray-600">{cat.count}</span>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-semibold mb-2">Top Thương hiệu:</h4>
                {stats.topBrands.map((brand, index) => (
                  <div key={brand.brand} className="flex justify-between text-sm">
                    <span>
                      {index + 1}. {brand.brand}
                    </span>
                    <span className="text-gray-600">{brand.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Popular Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-red-500" />
            Popular-Based Algorithm
          </CardTitle>
          <p className="text-sm text-gray-600">Sản phẩm thịnh hành dựa trên số lượng đánh giá và rating</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularProducts.map((product, index) => (
              <div
                key={product.product_id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedProductId === product.product_id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"
                }`}
                onClick={() => handleProductSelect(product.product_id)}
              >
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  <img
                    src={getProductImageUrl(product.product_id) || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = `/placeholder.svg?height=150&width=150&text=${encodeURIComponent(product.name)}`
                    }}
                  />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                  <Badge className="bg-red-500 text-white text-xs">#{index + 1}</Badge>
                </div>
                <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.name}</h3>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{product.rating}</span>
                  {product.num_ratings && <span className="text-xs text-gray-500">({product.num_ratings})</span>}
                </div>
                <div className="text-xs text-blue-600 mb-2">Score: {product.score?.toFixed(2)}</div>
                <p className="text-sm font-bold text-red-600">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.price)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content-Based Recommendations */}
      {selectedProduct && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              Content-Based Filtering Algorithm
            </CardTitle>
            <p className="text-sm text-gray-600">
              Gợi ý cho: <strong>{selectedProduct.name}</strong> (TF-IDF + Cosine Similarity)
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((product) => (
                <div key={product.product_id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <img
                      src={getProductImageUrl(product.product_id) || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = `/placeholder.svg?height=120&width=120&text=${encodeURIComponent(product.name)}`
                      }}
                    />
                  </div>
                  <Badge variant="secondary" className="text-xs mb-2">
                    {product.category}
                  </Badge>
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{product.rating}</span>
                  </div>
                  <div className="text-xs text-blue-600 mb-2 font-mono">
                    Similarity: {((product.similarity_score || 0) * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm font-bold text-red-600">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.price)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Algorithm */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-green-500" />
            Smart Search Algorithm
          </CardTitle>
          <p className="text-sm text-gray-600">Tìm kiếm thông minh với scoring algorithm</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập từ khóa tìm kiếm..."
                className="flex-1"
              />
              <Button type="submit">Tìm kiếm</Button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {searchResults.map((product) => (
              <div key={product.product_id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  <img
                    src={getProductImageUrl(product.product_id) || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = `/placeholder.svg?height=120&width=120&text=${encodeURIComponent(product.name)}`
                    }}
                  />
                </div>
                <Badge variant="secondary" className="text-xs mb-2">
                  {product.category}
                </Badge>
                <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.name}</h3>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{product.rating}</span>
                </div>
                <div className="text-xs text-green-600 mb-2">Search Score: {product.score}</div>
                <p className="text-sm font-bold text-red-600">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.price)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hybrid Algorithm */}
      {selectedProduct && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-purple-500" />
              Hybrid Algorithm
            </CardTitle>
            <p className="text-sm text-gray-600">
              Kết hợp Content-Based + Category-Based cho: <strong>{selectedProduct.name}</strong>
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {hybridResults.map((product) => (
                <div key={product.product_id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <img
                      src={getProductImageUrl(product.product_id) || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = `/placeholder.svg?height=120&width=120&text=${encodeURIComponent(product.name)}`
                      }}
                    />
                  </div>
                  <Badge variant="secondary" className="text-xs mb-2">
                    {product.category}
                  </Badge>
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{product.rating}</span>
                  </div>
                  <div className="text-xs text-purple-600 mb-2">Hybrid Score: {product.score?.toFixed(2)}</div>
                  <p className="text-sm font-bold text-red-600">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.price)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Refresh Button */}
      <div className="text-center">
        <Button onClick={loadAllRecommendations} size="lg">
          <RefreshCw className="h-4 w-4 mr-2" />🔄 Refresh All Algorithms
        </Button>
      </div>
    </div>
  )
}
