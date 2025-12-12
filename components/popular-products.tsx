import { TrendingUp, FlameIcon as Fire } from "lucide-react"
import { getPopularProducts, getProductImageUrl } from "@/lib/data"
import ProductCard from "./product-card"

export default async function PopularProducts() {
  const products = await getPopularProducts(8)

  return (
    <section className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center gap-2">
          <Fire className="h-8 w-8 text-red-500" />
          <TrendingUp className="h-6 w-6 text-red-500" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Sản phẩm thịnh hành</h2>
          <p className="text-red-600 font-medium">🔥 Bán chạy nhất tuần này</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <ProductCard
            key={product.product_id}
            product={product}
            imageUrl={getProductImageUrl(product.product_id)}
            showRanking={true}
            rankingIndex={index}
            variant="trending"
          />
        ))}
      </div>
    </section>
  )
}
