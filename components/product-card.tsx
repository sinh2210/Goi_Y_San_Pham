"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import Link from "next/link"

interface Product {
  product_id: string
  name: string
  category: string
  brand: string
  price: number
  rating: string
  features?: string
  num_ratings?: number
}

interface ProductCardProps {
  product: Product
  imageUrl?: string
  showRanking?: boolean
  rankingIndex?: number
  variant?: "default" | "featured" | "trending"
}

export default function ProductCard({
  product,
  imageUrl,
  showRanking = false,
  rankingIndex = 0,
  variant = "default",
}: ProductCardProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(product.name)}`
  }

  return (
    <Link href={`/products/${product.product_id}`}>
      <Card
        className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
          variant === "trending" ? "relative overflow-hidden" : ""
        }`}
      >
        {showRanking && rankingIndex < 3 && (
          <div className="absolute top-2 left-2 z-10">
            <Badge className="bg-red-500 text-white">#{rankingIndex + 1} Hot</Badge>
          </div>
        )}

        <CardContent className="p-4">
          <div
            className={`bg-gray-100 rounded-lg mb-4 flex items-center justify-center ${
              variant === "featured" ? "aspect-video" : "aspect-square"
            } ${variant === "trending" ? "bg-white shadow-sm" : ""}`}
          >
            <img
              src={imageUrl || `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(product.name)}`}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
              onError={handleImageError}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                {product.category}
              </Badge>
              {variant === "featured" && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Nổi bật
                </Badge>
              )}
            </div>

            <h3
              className={`font-semibold line-clamp-2 transition-colors ${
                variant === "trending" ? "text-sm group-hover:text-red-600" : "group-hover:text-blue-600"
              }`}
            >
              {product.name}
            </h3>

            <p className="text-xs text-gray-600">{product.brand}</p>

            {product.features && variant === "featured" && (
              <p className="text-sm text-gray-700 line-clamp-2">{product.features}</p>
            )}

            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.rating}</span>
              {product.num_ratings && <span className="text-xs text-gray-500">({product.num_ratings})</span>}
            </div>

            <p className={`font-bold text-red-600 ${variant === "featured" ? "text-xl" : "text-lg"}`}>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(product.price)}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
