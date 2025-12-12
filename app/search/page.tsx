import { searchProducts, getProductImageUrl } from "@/lib/data"
import ProductCard from "@/components/product-card"

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const query = q || ""
  const results = query ? searchProducts(query, 20) : []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Kết quả tìm kiếm</h1>
          {query && (
            <p className="text-gray-600">
              Tìm thấy {results.length} sản phẩm cho "{query}"
            </p>
          )}
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((product) => (
              <ProductCard
                key={product.product_id}
                product={product}
                imageUrl={getProductImageUrl(product.product_id)}
              />
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
            <p className="text-gray-400 mt-2">Thử tìm kiếm với từ khóa khác</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nhập từ khóa để tìm kiếm sản phẩm</p>
          </div>
        )}
      </div>
    </div>
  )
}
