"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Zap, TrendingUp, Search } from "lucide-react"
import { getPopularProducts, getRelatedProducts, searchProducts } from "@/lib/python-recommendations"

export default function RecommendationShowcase() {
  const [popularProducts, setPopularProducts] = useState([])
  const [relatedProducts, setRelatedProducts] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRecommendations()
  }, [])

  const loadRecommendations = async () => {
    setLoading(true)

    try {
      // Load popular products
      const popularResponse = await getPopularProducts(6)
      if (popularResponse.success) {
        setPopularProducts(popularResponse.data || [])
      }

      // Load related products for demo
      const relatedResponse = await getRelatedProducts("P0080", 4)
      if (relatedResponse.success) {
        setRelatedProducts(relatedResponse.data || [])
      }

      // Load search results for demo
      const searchResponse = await searchProducts("Samsung", 4)
      if (searchResponse.success) {
        setSearchResults(searchResponse.data || [])
      }
    } catch (error) {
      console.error("Error loading recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải hệ thống gợi ý Python...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">🐍 Hệ thống gợi ý Python</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Demo hệ thống gợi ý sản phẩm được xây dựng bằng Python với các thuật toán Content-Based Filtering,
          Collaborative Filtering và Hybrid Recommendations
        </p>
      </div>

      {/* Popular Products */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-red-500" />
              Sản phẩm thịnh hành (Popular-Based)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularProducts.map((product: any) => (
                <div key={product.product_id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <img
                      src={`/placeholder.svg?height=150&width=150`}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <Badge variant="secondary" className="text-xs mb-2">
                    {product.category}
                  </Badge>
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{product.brand}</p>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{product.rating}</span>
                    {product.num_ratings && <span className="text-xs text-gray-500">({product.num_ratings})</span>}
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
      </section>

      {/* Related Products */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              Sản phẩm liên quan (Content-Based)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Gợi ý cho sản phẩm: "Amazfit Đồng hồ thông minh 837"</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((product: any) => (
                <div key={product.product_id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <img
                      src={`/placeholder.svg?height=120&width=120`}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
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
                  {product.similarity_score && (
                    <div className="text-xs text-blue-600 mb-2">
                      Độ tương đồng: {(product.similarity_score * 100).toFixed(1)}%
                    </div>
                  )}
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
      </section>

      {/* Search Results */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-green-500" />
              Kết quả tìm kiếm (Search-Based)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Kết quả tìm kiếm cho: "Samsung"</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {searchResults.map((product: any) => (
                <div key={product.product_id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <img
                      src={`/placeholder.svg?height=120&width=120`}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <Badge variant="secondary" className="text-xs mb-2">
                    {product.category}
                  </Badge>
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{product.brand}</p>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{product.rating}</span>
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
      </section>

      {/* Refresh Button */}
      <div className="text-center">
        <Button onClick={loadRecommendations} size="lg">
          🔄 Tải lại gợi ý
        </Button>
      </div>
    </div>
  )
}
