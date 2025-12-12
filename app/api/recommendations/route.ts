import { type NextRequest, NextResponse } from "next/server"
import {
  getPopularRecommendations,
  getContentBasedRecommendations,
  getCategoryRecommendations,
  searchProductsWithAI,
  getHybridRecommendations,
  getRecommendationStats,
} from "@/lib/recommendation-engine"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const productId = searchParams.get("productId")
  const category = searchParams.get("category")
  const query = searchParams.get("query")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  try {
    let data: any[] = []

    switch (type) {
      case "popular":
        data = await getPopularRecommendations(limit)
        break

      case "related":
        if (!productId) {
          return NextResponse.json({ success: false, error: "productId required" }, { status: 400 })
        }
        data = await getContentBasedRecommendations(productId, limit)
        break

      case "category":
        if (!category) {
          return NextResponse.json({ success: false, error: "category required" }, { status: 400 })
        }
        data = await getCategoryRecommendations(category, limit)
        break

      case "search":
        if (!query) {
          return NextResponse.json({ success: false, error: "query required" }, { status: 400 })
        }
        data = await searchProductsWithAI(query, limit)
        break

      case "hybrid":
        if (!productId) {
          return NextResponse.json({ success: false, error: "productId required" }, { status: 400 })
        }
        data = await getHybridRecommendations(productId, limit)
        break

      case "stats":
        const stats = await getRecommendationStats()
        return NextResponse.json({ success: true, data: stats })

      default:
        return NextResponse.json({ success: false, error: "Invalid type parameter" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data,
      algorithm: data[0]?.algorithm || type,
      count: data.length,
    })
  } catch (error) {
    console.error("Recommendation API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
