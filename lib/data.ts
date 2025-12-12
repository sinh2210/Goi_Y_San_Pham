import fs from "fs"
import path from "path"
import { parse } from "csv-parse/sync"

export interface Product {
  product_id: string
  name: string
  category: string
  brand: string
  price: number
  rating: string
  features: string
  description: string
  image_url?: string
}

export interface PopularProduct extends Product {
  num_ratings: number
  avg_rating: number
}

export interface Rating {
  user_id: string
  product_id: string
  rating: number
  timestamp: string
}

// Cache cho dữ liệu
let productsCache: Product[] | null = null
let popularProductsCache: PopularProduct[] | null = null
let ratingsCache: Rating[] | null = null
let productImagesCache: Record<string, string> | null = null

export function loadProductImages(): Record<string, string> {
  if (productImagesCache) {
    return productImagesCache
  }

  try {
    const filePath = path.join(process.cwd(), "public", "data", "products_with_image_links.csv")

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.warn("Product images CSV file not found")
      productImagesCache = {}
      return {}
    }

    const fileContent = fs.readFileSync(filePath, "utf-8")
    const lines = fileContent.split("\n")

    const images: Record<string, string> = {}

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      // Parse CSV line (handling commas in quoted fields)
      const values = []
      let current = ""
      let inQuotes = false

      for (let j = 0; j < line.length; j++) {
        const char = line[j]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === "," && !inQuotes) {
          values.push(current.trim())
          current = ""
        } else {
          current += char
        }
      }
      values.push(current.trim())

      if (values.length >= 4) {
        const productId = values[0]?.replace(/"/g, "")
        const imageUrl = values[3]?.replace(/"/g, "")

        if (productId && imageUrl) {
          images[productId] = imageUrl
        }
      }
    }

    productImagesCache = images
    return images
  } catch (error) {
    console.error("Error loading product images:", error)
    productImagesCache = {}
    return {}
  }
}

// Get product image URL with fallback
export function getProductImageUrl(productId: string): string {
  const images = loadProductImages()
  return images[productId] || `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(productId)}`
}

function loadCSV<T>(filename: string): T[] {
  try {
    const filePath = path.join(process.cwd(), "public", "data", filename)

    if (!fs.existsSync(filePath)) {
      console.warn(`CSV file not found: ${filename}`)
      return []
    }

    const fileContent = fs.readFileSync(filePath, "utf-8")
    return parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      cast: (value, context) => {
        // Convert price to number
        if (context.column === "price" && value) {
          return Number.parseFloat(value)
        }
        // Convert num_ratings to number
        if (context.column === "num_ratings" && value) {
          return Number.parseInt(value)
        }
        // Convert avg_rating to number
        if (context.column === "avg_rating" && value) {
          return Number.parseFloat(value)
        }
        // Convert rating to number for ratings data
        if (context.column === "rating" && value && !isNaN(Number(value))) {
          return Number.parseFloat(value)
        }
        return value
      },
    })
  } catch (error) {
    console.error(`Error loading ${filename}:`, error)
    return []
  }
}

export function getAllProducts(): Product[] {
  if (!productsCache) {
    productsCache = loadCSV<Product>("products.csv")
  }
  return productsCache
}

export function getPopularProducts(limit = 10): PopularProduct[] {
  if (!popularProductsCache) {
    popularProductsCache = loadCSV<PopularProduct>("popular_products.csv")
  }
  return popularProductsCache.slice(0, limit)
}

export function getAllRatings(): Rating[] {
  if (!ratingsCache) {
    ratingsCache = loadCSV<Rating>("ratings.csv")
  }
  return ratingsCache
}

export function getFeaturedProducts(limit = 6): Product[] {
  const products = getAllProducts()
  // Lấy sản phẩm có rating cao
  return products
    .filter((p) => Number.parseFloat(p.rating) >= 4.0)
    .sort((a, b) => Number.parseFloat(b.rating) - Number.parseFloat(a.rating))
    .slice(0, limit)
}

export function getProductById(id: string): Product | undefined {
  const products = getAllProducts()
  return products.find((p) => p.product_id === id)
}

export function getProductsByCategory(category: string, limit = 12): Product[] {
  const products = getAllProducts()

  // Mapping để tìm kiếm chính xác hơn
  const categoryMappings: Record<string, string[]> = {
    "Điện thoại": ["điện thoại", "phone", "smartphone"],
    Laptop: ["laptop", "máy tính", "computer"],
    "Dây sạc": ["dây sạc", "sạc", "charger", "cable"],
    "Đồng hồ thông minh": ["đồng hồ", "watch", "smartwatch"],
  }

  const searchTerms = categoryMappings[category] || [category.toLowerCase()]

  return products
    .filter((p) => {
      const productCategory = p.category.toLowerCase()
      return searchTerms.some((term) => productCategory.includes(term.toLowerCase()))
    })
    .slice(0, limit)
}

export function searchProducts(query: string, limit = 20): Product[] {
  const products = getAllProducts()
  const searchTerm = query.toLowerCase()

  return products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm) ||
        p.brand.toLowerCase().includes(searchTerm) ||
        p.features.toLowerCase().includes(searchTerm),
    )
    .slice(0, limit)
}

// Content-based recommendation system
export function getRecommendedProducts(productId: string, limit = 4): Product[] {
  const products = getAllProducts()
  const currentProduct = products.find((p) => p.product_id === productId)

  if (!currentProduct) return []

  // Tìm sản phẩm cùng category và brand
  const sameCategoryProducts = products.filter(
    (p) => p.product_id !== productId && p.category === currentProduct.category,
  )

  const sameBrandProducts = products.filter((p) => p.product_id !== productId && p.brand === currentProduct.brand)

  // Kết hợp và loại bỏ trùng lặp
  const recommendations = [...sameCategoryProducts, ...sameBrandProducts]
    .filter((product, index, self) => index === self.findIndex((p) => p.product_id === product.product_id))
    .sort((a, b) => Number.parseFloat(b.rating) - Number.parseFloat(a.rating))
    .slice(0, limit)

  return recommendations
}

export function getCategories(): string[] {
  const products = getAllProducts()
  const categories = [...new Set(products.map((p) => p.category))]
  return categories.sort()
}
