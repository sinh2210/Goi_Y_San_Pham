"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { getProductImageSync } from "@/lib/product-images"

interface ProductImageProps {
  productId: string
  productName: string
  category?: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
}

export default function ProductImage({
  productId,
  productName,
  category,
  className = "",
  width = 300,
  height = 300,
  priority = false,
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [imageSrc, setImageSrc] = useState<string>("")

  useEffect(() => {
    // Load image URL
    const loadImage = async () => {
      try {
        const imageUrl = getProductImageSync(productId, category)
        setImageSrc(imageUrl)
      } catch (error) {
        console.error("Error loading image:", error)
        setImageSrc(`/placeholder.svg?height=${height}&width=${width}&text=${encodeURIComponent(productName)}`)
      }
    }

    loadImage()
  }, [productId, category, productName, width, height])

  const fallbackSrc = `/placeholder.svg?height=${height}&width=${width}&text=${encodeURIComponent(productName)}`

  if (!imageSrc) {
    return (
      <div className={`relative overflow-hidden bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      <Image
        src={imageError ? fallbackSrc : imageSrc}
        alt={productName}
        width={width}
        height={height}
        className="w-full h-full object-cover transition-opacity duration-300"
        priority={priority}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageError(true)
          setIsLoading(false)
        }}
        unoptimized // Cho phép load ảnh từ external domains
      />

      {/* Overlay effect on hover */}
      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300" />
    </div>
  )
}
