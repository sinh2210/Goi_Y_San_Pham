import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold">ElectroShop</span>
            </div>
            <p className="text-gray-400 mb-4">
              Sàn thương mại điện tử hàng đầu chuyên cung cấp thiết bị điện tử chính hãng với giá tốt nhất.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-white transition-colors">
                  Chính sách giao hàng
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-white transition-colors">
                  Đổi trả
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Danh mục</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories/dien-thoai" className="text-gray-400 hover:text-white transition-colors">
                  Điện thoại
                </Link>
              </li>
              <li>
                <Link href="/categories/laptop" className="text-gray-400 hover:text-white transition-colors">
                  Laptop
                </Link>
              </li>
              <li>
                <Link href="/categories/tai-nghe" className="text-gray-400 hover:text-white transition-colors">
                  Tai nghe
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/dong-ho-thong-minh"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Đồng hồ thông minh
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Thông tin liên hệ</h3>
            <div className="space-y-2 text-gray-400">
              <p>📍 123 Đường ABC, Quận 1, TP.HCM</p>
              <p>📞 1900 1234</p>
              <p>✉️ support@electroshop.vn</p>
              <p>🕒 8:00 - 22:00 (Thứ 2 - CN)</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 ElectroShop. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}
