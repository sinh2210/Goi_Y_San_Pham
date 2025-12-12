import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Smartphone, Laptop, Cable, Watch } from "lucide-react"

const categories = [
  {
    name: "Điện thoại",
    icon: Smartphone,
    slug: "dien-thoai",
    color: "bg-blue-500",
    description: "iPhone, Samsung, Xiaomi...",
  },
  {
    name: "Laptop",
    icon: Laptop,
    slug: "laptop",
    color: "bg-green-500",
    description: "MacBook, Dell, HP, Asus...",
  },
  {
    name: "Dây sạc",
    icon: Cable,
    slug: "day-sac",
    color: "bg-orange-500",
    description: "Sạc nhanh, dây USB, adapter...",
  },
  {
    name: "Đồng hồ thông minh",
    icon: Watch,
    slug: "dong-ho-thong-minh",
    color: "bg-purple-500",
    description: "Apple Watch, Samsung Galaxy Watch...",
  },
]

export default function CategoryGrid() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Danh mục sản phẩm</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((category) => {
          const IconComponent = category.icon
          return (
            <Link key={category.slug} href={`/categories/${category.slug}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
                <CardContent className="p-6 text-center h-full flex flex-col justify-center">
                  <div
                    className={`w-16 h-16 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
