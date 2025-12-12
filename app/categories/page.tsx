import { getCategories, getAllProducts, getProductImageUrl } from "@/lib/data"
import ProductCard from "@/components/product-card"
import Link from "next/link"

export default async function CategoriesPage() {
  const categories = getCategories()
  const allProducts = getAllProducts()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Tất cả danh mục</h1>

        <div className="space-y-12">
          {categories.map((category) => {
            const categoryProducts = allProducts.filter((p) => p.category === category).slice(0, 4)

            return (
              <section key={category}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{category}</h2>
                  <Link
                    href={`/categories/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, "-"))}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Xem tất cả →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {categoryProducts.map((product) => (
                    <ProductCard
                      key={product.product_id}
                      product={product}
                      imageUrl={getProductImageUrl(product.product_id)}
                    />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
