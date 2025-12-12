import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ProductImage from "@/components/product-image"
import { getAllProducts } from "@/lib/data"
import { getImageStats } from "@/lib/product-images"

export default async function ImagesDemoPage() {
  const products = getAllProducts().slice(0, 12) // Lấy 12 sản phẩm đầu
  const imageStats = await getImageStats()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🖼️ Demo Ảnh Sản Phẩm</h1>
          <p className="text-gray-600">Hiển thị ảnh sản phẩm từ CSV file với {imageStats.totalProducts} ảnh</p>
        </div>

        {/* Stats */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>📊 Thống kê ảnh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{imageStats.totalProducts}</div>
                <div className="text-sm text-gray-600">Sản phẩm có ảnh</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{imageStats.domains}</div>
                <div className="text-sm text-gray-600">Domains</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{imageStats.totalImages}</div>
                <div className="text-sm text-gray-600">Tổng ảnh</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">100%</div>
                <div className="text-sm text-gray-600">Coverage</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Top domains:</h4>
              <div className="flex flex-wrap gap-2">
                {imageStats.topDomains.map(({ domain, count }) => (
                  <Badge key={domain} variant="outline">
                    {domain} ({count})
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Sản phẩm với ảnh thật</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.product_id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <ProductImage
                    productId={product.product_id}
                    productName={product.name}
                    category={product.category}
                    className="aspect-square rounded-lg mb-3"
                    width={250}
                    height={250}
                  />

                  <Badge variant="secondary" className="text-xs mb-2">
                    {product.category}
                  </Badge>

                  <h3 className="font-semibold text-sm line-clamp-2 mb-1">{product.name}</h3>

                  <p className="text-xs text-gray-600 mb-2">{product.brand}</p>

                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm">{product.rating}</span>
                  </div>

                  <p className="text-sm font-bold text-red-600">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.price)}
                  </p>

                  <div className="mt-2 text-xs text-gray-500">ID: {product.product_id}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
