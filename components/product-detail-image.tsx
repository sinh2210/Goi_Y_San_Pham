"use client"

import type React from "react"
import { useState } from "react"

interface ProductDetailImageProps {
  productId: string
  productName: string
  imageUrl: string
  className?: string
}

export default function ProductDetailImage({
  productId,
  productName,
  imageUrl,
  className = "",
}: ProductDetailImageProps) {
  const [imageSrc, setImageSrc] = useState(imageUrl)
  const [isLoading, setIsLoading] = useState(true)

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageSrc(`/placeholder.svg?height=400&width=400&text=${encodeURIComponent(productName)}`)
    setIsLoading(false)
  }

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      <img
        src={imageSrc || "/placeholder.svg"}
        alt={productName}
        className="w-full h-full object-cover rounded-lg"
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  )
}
