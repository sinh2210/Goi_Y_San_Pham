import ImageUpload from "@/components/image-upload"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ProductImage from "@/components/product-image"
import { getAllProducts } from "@/lib/data"

export default function AdminImagesPage() {
  const products = getAllProducts().slice(0, 12) // Lấy 12 sản phẩm đầu

  const handleImageUpload = (file: File, productId: string) => {
    console.log("Uploading image for product:", productId, file.name)
    // Ở đây bạn sẽ upload lên server hoặc cloud storage
    // Ví dụ: uploadToCloudinary(file, productId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý ảnh sản phẩm</h1>
          <p className="text-gray-600">Upload và quản lý ảnh cho các sản phẩm</p>
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <ImageUpload onImageUpload={handleImageUpload} />
        </div>

        {/* Products Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.product_id} className="border rounded-lg p-4">
                  <ProductImage
                    productId={product.product_id}
                    productName={product.name}
                    category={product.category}
                    className="aspect-square rounded-lg mb-3"
                    width={200}
                    height={200}
                  />

                  <Badge variant="secondary" className="text-xs mb-2">
                    {product.category}
                  </Badge>

                  <h3 className="font-semibold text-sm line-clamp-2 mb-1">{product.name}</h3>

                  <p className="text-xs text-gray-600 mb-2">{product.brand}</p>

                  <p className="text-sm font-bold text-red-600">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.price)}
                  </p>

                  <div className="mt-3">
                    <ImageUpload onImageUpload={handleImageUpload} productId={product.product_id} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
