import { notFound } from "next/navigation"
import Link from "next/link"
import { getProductsByCategory, getProductImageUrl } from "@/lib/data"
import ProductCard from "@/components/product-card"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

const categoryMap: Record<string, string> = {
  "dien-thoai": "Điện thoại",
  laptop: "Laptop",
  "day-sac": "Dây sạc",
  "dong-ho-thong-minh": "Đồng hồ thông minh",
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const categoryName = categoryMap[slug]

  if (!categoryName) {
    notFound()
  }

  const products = getProductsByCategory(categoryName, 20)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link href="/categories" className="hover:text-blue-600">
            Danh mục
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{categoryName}</span>
        </nav>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{categoryName}</h1>
          <p className="text-gray-600">
            Tìm thấy {products.length} sản phẩm trong danh mục {categoryName}
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.product_id}
                product={product}
                imageUrl={getProductImageUrl(product.product_id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Không có sản phẩm nào trong danh mục này</p>
            <Link href="/categories" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
              ← Quay lại danh mục
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
