import { type NextRequest, NextResponse } from "next/server"

// Fallback data when Python is not available
const FALLBACK_DATA = {
  popular: [
    {
      product_id: "P0001",
      name: "iPhone 15 Pro Max 256GB",
      category: "Điện thoại",
      brand: "Apple",
      price: 29990000,
      rating: "4.8",
      features: "Camera 48MP, Chip A17 Pro, Titanium",
      num_ratings: 1250,
      avg_rating: 4.8,
    },
    {
      product_id: "P0002",
      name: "Samsung Galaxy S24 Ultra",
      category: "Điện thoại",
      brand: "Samsung",
      price: 26990000,
      rating: "4.7",
      features: "S Pen, Camera 200MP, AI Features",
      num_ratings: 980,
      avg_rating: 4.7,
    },
    {
      product_id: "P0003",
      name: "MacBook Pro M3 14 inch",
      category: "Laptop",
      brand: "Apple",
      price: 52990000,
      rating: "4.9",
      features: "Chip M3, 16GB RAM, 512GB SSD",
      num_ratings: 650,
      avg_rating: 4.9,
    },
    {
      product_id: "P0004",
      name: "AirPods Pro 2nd Gen",
      category: "Tai nghe",
      brand: "Apple",
      price: 6490000,
      rating: "4.6",
      features: "Active Noise Cancelling, Spatial Audio",
      num_ratings: 2100,
      avg_rating: 4.6,
    },
    {
      product_id: "P0005",
      name: "Apple Watch Series 9",
      category: "Đồng hồ thông minh",
      brand: "Apple",
      price: 9990000,
      rating: "4.5",
      features: "Always-On Display, Health Monitoring",
      num_ratings: 850,
      avg_rating: 4.5,
    },
    {
      product_id: "P0006",
      name: "iPad Pro M2 11 inch",
      category: "Tablet",
      brand: "Apple",
      price: 24990000,
      rating: "4.7",
      features: "Chip M2, Liquid Retina Display",
      num_ratings: 420,
      avg_rating: 4.7,
    },
  ],
  related: [
    {
      product_id: "P0007",
      name: "iPhone 15 Pro 128GB",
      category: "Điện thoại",
      brand: "Apple",
      price: 25990000,
      rating: "4.7",
      features: "Camera 48MP, Chip A17 Pro",
      similarity_score: 0.95,
    },
    {
      product_id: "P0008",
      name: "iPhone 14 Pro Max",
      category: "Điện thoại",
      brand: "Apple",
      price: 23990000,
      rating: "4.6",
      features: "Camera 48MP, Chip A16 Bionic",
      similarity_score: 0.88,
    },
    {
      product_id: "P0009",
      name: "iPhone 15 Plus",
      category: "Điện thoại",
      brand: "Apple",
      price: 22990000,
      rating: "4.5",
      features: "Camera 48MP, Large Display",
      similarity_score: 0.82,
    },
    {
      product_id: "P0010",
      name: "iPhone 13 Pro Max",
      category: "Điện thoại",
      brand: "Apple",
      price: 19990000,
      rating: "4.4",
      features: "Camera 12MP, Chip A15 Bionic",
      similarity_score: 0.75,
    },
  ],
  search: [
    {
      product_id: "P0011",
      name: "Samsung Galaxy S24",
      category: "Điện thoại",
      brand: "Samsung",
      price: 19990000,
      rating: "4.6",
      features: "AI Camera, Snapdragon 8 Gen 3",
    },
    {
      product_id: "P0012",
      name: "Samsung Galaxy Tab S9",
      category: "Tablet",
      brand: "Samsung",
      price: 16990000,
      rating: "4.5",
      features: "S Pen, AMOLED Display",
    },
    {
      product_id: "P0013",
      name: "Samsung Galaxy Watch 6",
      category: "Đồng hồ thông minh",
      brand: "Samsung",
      price: 7990000,
      rating: "4.4",
      features: "Health Monitoring, GPS",
    },
    {
      product_id: "P0014",
      name: "Samsung Galaxy Buds2 Pro",
      category: "Tai nghe",
      brand: "Samsung",
      price: 4990000,
      rating: "4.3",
      features: "ANC, 360 Audio",
    },
  ],
}

export async function GET(request: NextRequest) {
  // Wrap everything in try-catch to ensure we always return JSON
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") as "popular" | "related" | "category" | "search"
    const productId = searchParams.get("productId")
    const category = searchParams.get("category")
    const query = searchParams.get("query")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Validate type parameter
    if (!type || !["popular", "related", "category", "search"].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or missing type parameter",
        },
        { status: 400 },
      )
    }

    // For now, always use fallback data to ensure demo works
    // In production, you would try Python first, then fallback
    let fallbackData: any[] = []

    switch (type) {
      case "popular":
        fallbackData = FALLBACK_DATA.popular.slice(0, limit)
        break
      case "related":
        fallbackData = FALLBACK_DATA.related.slice(0, limit)
        break
      case "search":
        if (query?.toLowerCase().includes("samsung")) {
          fallbackData = FALLBACK_DATA.search.slice(0, limit)
        } else if (query?.toLowerCase().includes("apple")) {
          fallbackData = FALLBACK_DATA.popular.filter((p) => p.brand === "Apple").slice(0, limit)
        } else {
          fallbackData = FALLBACK_DATA.popular.slice(0, limit)
        }
        break
      case "category":
        if (category) {
          fallbackData = FALLBACK_DATA.popular
            .filter((p) => p.category.toLowerCase().includes(category.toLowerCase()))
            .slice(0, limit)
        } else {
          fallbackData = FALLBACK_DATA.popular.slice(0, limit)
        }
        break
      default:
        fallbackData = FALLBACK_DATA.popular.slice(0, limit)
    }

    return NextResponse.json({
      success: true,
      data: fallbackData,
      source: "demo",
      note: "Using demo data - Python engine will be activated when dependencies are installed",
      algorithm: type,
      count: fallbackData.length,
    })
  } catch (error) {
    // Ensure we always return valid JSON, even on error
    console.error("API Route Error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        data: [],
        source: "error",
      },
      { status: 500 },
    )
  }
}
