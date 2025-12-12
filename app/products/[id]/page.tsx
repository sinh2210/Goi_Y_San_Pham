import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Heart, Share2 } from "lucide-react"
import Link from "next/link"
import { getProductById, getRecommendedProducts, getProductImageUrl } from "@/lib/data"
import CartButton from "@/components/cart-button"
import ProductCard from "@/components/product-card"
import ProductDetailImage from "@/components/product-detail-image"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = getProductById(id)

  if (!product) {
    notFound()
  }

  const recommendations = getRecommendedProducts(id, 4)
  const productImageUrl = getProductImageUrl(product.product_id)

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
          <span className="text-gray-900">{product.category}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg p-8 flex items-center justify-center shadow-sm">
              <ProductDetailImage
                productId={product.product_id}
                productName={product.name}
                imageUrl={productImageUrl}
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600">{product.brand}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(Number.parseFloat(product.rating))
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{product.rating}</span>
              <span className="text-gray-500">(128 đánh giá)</span>
            </div>

            <div className="text-3xl font-bold text-red-600">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(product.price)}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Tính năng nổi bật:</h3>
              <p className="text-gray-700">{product.features}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Mô tả sản phẩm:</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>

            <div className="flex gap-4">
              <CartButton productId={product.product_id} productName={product.name} className="flex-1" />
              <Button variant="outline" size="lg">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Ưu đãi đặc biệt</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Miễn phí giao hàng toàn quốc</li>
                <li>• Bảo hành chính hãng 12 tháng</li>
                <li>• Đổi trả trong 7 ngày</li>
                <li>• Hỗ trợ trả góp 0%</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        {recommendations.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((rec) => (
                <ProductCard key={rec.product_id} product={rec} imageUrl={getProductImageUrl(rec.product_id)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
