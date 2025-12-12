import { getFeaturedProducts, getProductImageUrl } from "@/lib/data"
import ProductCard from "./product-card"

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts(6)

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm nổi bật</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.product_id}
            product={product}
            imageUrl={getProductImageUrl(product.product_id)}
            variant="featured"
          />
        ))}
      </div>
    </section>
  )
}
