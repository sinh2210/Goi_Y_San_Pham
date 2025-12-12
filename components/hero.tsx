import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">
            Thiết bị điện tử
            <span className="block text-yellow-300">chính hãng</span>
          </h1>
          <p className="text-base md:text-lg mb-6 text-blue-100">
            Khám phá hàng ngàn sản phẩm điện tử từ các thương hiệu uy tín với giá tốt nhất thị trường
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="default" className="bg-yellow-500 hover:bg-yellow-600 text-black">
              <Link href="/categories">Mua sắm ngay</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="default"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              <Link href="/categories">Xem khuyến mãi</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
