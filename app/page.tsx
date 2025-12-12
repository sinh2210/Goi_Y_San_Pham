import { Suspense } from "react"
import Hero from "@/components/hero"
import PopularProducts from "@/components/popular-products"
import CategoryGrid from "@/components/category-grid"
import FeaturedProducts from "@/components/featured-products"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />

      <main className="container mx-auto px-4 py-8 space-y-16">
        {/* Sản phẩm thịnh hành - Nổi bật nhất */}
        <Suspense fallback={<div className="text-center">Đang tải sản phẩm thịnh hành...</div>}>
          <PopularProducts />
        </Suspense>

        {/* Danh mục sản phẩm */}
        <CategoryGrid />

        {/* Sản phẩm nổi bật */}
        <Suspense fallback={<div className="text-center">Đang tải sản phẩm nổi bật...</div>}>
          <FeaturedProducts />
        </Suspense>
      </main>
    </div>
  )
}
