import { NextResponse } from "next/server"
import { loadProductImages, getImageStats } from "@/lib/product-images"

export async function GET() {
  try {
    const images = await loadProductImages()
    const stats = await getImageStats()

    return NextResponse.json({
      success: true,
      data: {
        images,
        stats,
      },
    })
  } catch (error) {
    console.error("Error loading product images:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to load product images",
      },
      { status: 500 },
    )
  }
}
