# 🛒 Hệ Thống Gợi Ý Sản Phẩm – ElectroShop

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)

**Sàn thương mại điện tử tích hợp hệ thống gợi ý sản phẩm thông minh**  
sử dụng Content-Based Filtering, Popular-Based và Hybrid Recommendation

</div>

---

## 📖 Giới thiệu

**ElectroShop** là một ứng dụng web thương mại điện tử chuyên bán thiết bị điện tử, được xây dựng với **Next.js 15** và tích hợp hệ thống **gợi ý sản phẩm thông minh** triển khai trực tiếp trong TypeScript (không yêu cầu Python server riêng).

Hệ thống gợi ý hoạt động dựa trên **3 thuật toán chính**:

| Thuật toán | Mô tả |
|------------|-------|
| 🔥 **Popular-Based** | Gợi ý sản phẩm thịnh hành nhất dựa trên số lượng đánh giá và điểm trung bình |
| 🎯 **Content-Based Filtering** | Tìm sản phẩm tương tự dựa trên cosine similarity của TF-IDF vector |
| 🔗 **Hybrid** | Kết hợp content-based + category-based để tăng độ chính xác |
| 🔍 **Search-Based** | Tìm kiếm thông minh có tính điểm ưu tiên theo tên, thương hiệu, danh mục |

---

## 🏗️ Kiến trúc hệ thống

```
┌──────────────────────────────────────────────────────────┐
│                      Next.js 15 App                      │
│                                                          │
│  ┌─────────────┐    ┌──────────────────────────────────┐ │
│  │   Frontend  │    │         API Routes               │ │
│  │  (React 19) │◄──►│  /api/recommendations            │ │
│  │  TailwindCSS│    │  /api/product-images             │ │
│  └─────────────┘    └──────────────┬─────────────────── ┘ │
│                                    │                      │
│                     ┌──────────────▼──────────────────┐  │
│                     │     Recommendation Engine        │  │
│                     │  • Popular-Based Algorithm       │  │
│                     │  • Content-Based (TF-IDF +       │  │
│                     │    Cosine Similarity)            │  │
│                     │  • Hybrid Algorithm              │  │
│                     │  • Smart Search                  │  │
│                     └──────────────┬───────────────────┘  │
│                                    │                      │
│                     ┌──────────────▼───────────────────┐  │
│                     │        Data Layer (CSV)           │  │
│                     │  products.csv | ratings.csv       │  │
│                     │  popular_products.csv             │  │
│                     └──────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## 📁 Cấu trúc dự án

```
Goi_Y_San_Pham/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Trang chủ
│   ├── layout.tsx                # Layout chung (Header + Footer)
│   ├── globals.css               # CSS toàn cục
│   ├── products/[id]/            # Trang chi tiết sản phẩm
│   ├── categories/               # Trang danh mục
│   ├── search/                   # Trang tìm kiếm
│   ├── admin/                    # Trang quản trị
│   ├── demo/                     # Demo hệ thống gợi ý
│   ├── unified-demo/             # Demo tổng hợp
│   ├── images-demo/              # Demo ảnh sản phẩm
│   └── api/
│       ├── recommendations/      # API gợi ý sản phẩm
│       ├── product-images/       # API ảnh sản phẩm
│       └── python-recommendations/ # API tích hợp Python
│
├── components/                   # React Components
│   ├── header.tsx                # Thanh điều hướng
│   ├── footer.tsx                # Chân trang
│   ├── hero.tsx                  # Banner chính
│   ├── product-card.tsx          # Card hiển thị sản phẩm
│   ├── category-grid.tsx         # Lưới danh mục
│   ├── popular-products.tsx      # Sản phẩm thịnh hành
│   ├── featured-products.tsx     # Sản phẩm nổi bật
│   ├── unified-recommendations.tsx # Gợi ý tổng hợp
│   ├── recommendation-showcase.tsx # Showcase demo
│   ├── image-upload.tsx          # Upload ảnh
│   └── ui/                       # shadcn/ui components
│
├── lib/                          # Logic & Utilities
│   ├── data.ts                   # Đọc dữ liệu CSV
│   ├── recommendation-engine.ts  # Engine gợi ý chính
│   ├── python-engine.ts          # Tích hợp Python
│   ├── python-recommendations.ts # Client gọi API Python
│   ├── product-images.ts         # Quản lý ảnh sản phẩm
│   └── utils.ts                  # Tiện ích chung
│
├── public/data/                  # Dữ liệu CSV
│   ├── products.csv              # ~100 sản phẩm điện tử
│   ├── popular_products.csv      # Sản phẩm thịnh hành
│   ├── ratings.csv               # Đánh giá người dùng
│   └── products_with_image_links.csv # Ảnh sản phẩm
│
├── python/                       # Script Python kiểm tra
│   └── test_recommendations.py   # Test thuật toán offline
│
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.mjs
```

---

## ⚙️ Cài đặt & Chạy

### Yêu cầu hệ thống
- **Node.js** ≥ 18
- **pnpm** (package manager được dùng trong dự án)

### Bước 1: Clone repository

```bash
git clone https://github.com/sinh2210/Goi_Y_San_Pham.git
cd Goi_Y_San_Pham
```

### Bước 2: Cài đặt pnpm (nếu chưa có)

```bash
# Windows (PowerShell)
npm install -g pnpm

# Hoặc
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

### Bước 3: Cài đặt dependencies

```bash
pnpm install
```

### Bước 4: Chạy môi trường phát triển

```bash
pnpm dev
```

Mở trình duyệt và truy cập: **http://localhost:3000**

---

## 🗺️ Các trang chính

| URL | Mô tả |
|-----|-------|
| `/` | Trang chủ – Banner, sản phẩm thịnh hành, danh mục |
| `/products/:id` | Chi tiết sản phẩm + gợi ý liên quan |
| `/categories` | Danh sách danh mục sản phẩm |
| `/search?q=...` | Trang tìm kiếm thông minh |
| `/demo` | Demo hệ thống gợi ý Python |
| `/unified-demo` | Demo tổng hợp tất cả thuật toán |
| `/admin` | Trang quản trị (thống kê, upload ảnh) |

---

## 🔌 API Endpoints

### `GET /api/recommendations`

Gọi hệ thống gợi ý sản phẩm với các thuật toán khác nhau.

| Tham số | Bắt buộc | Mô tả |
|---------|----------|-------|
| `type` | ✅ | `popular` \| `related` \| `category` \| `search` \| `hybrid` \| `stats` |
| `limit` | ❌ | Số sản phẩm trả về (mặc định: 10) |
| `productId` | Khi `type=related\|hybrid` | ID sản phẩm gốc |
| `category` | Khi `type=category` | Tên danh mục |
| `query` | Khi `type=search` | Từ khóa tìm kiếm |

**Ví dụ:**

```bash
# Lấy sản phẩm thịnh hành
GET /api/recommendations?type=popular&limit=6

# Lấy sản phẩm liên quan (Content-Based)
GET /api/recommendations?type=related&productId=P0080&limit=5

# Tìm kiếm sản phẩm
GET /api/recommendations?type=search&query=Samsung&limit=10

# Gợi ý lai (Hybrid)
GET /api/recommendations?type=hybrid&productId=P0080&limit=6

# Thống kê hệ thống
GET /api/recommendations?type=stats
```

**Response mẫu:**

```json
{
  "success": true,
  "data": [
    {
      "product_id": "P0001",
      "name": "Samsung Galaxy S24 Ultra",
      "category": "Điện thoại",
      "brand": "Samsung",
      "price": 28000000,
      "rating": "4.8",
      "algorithm": "popular-based",
      "score": 12.54
    }
  ],
  "algorithm": "popular-based",
  "count": 6
}
```

---

## 🧠 Chi tiết thuật toán gợi ý

### 1. Popular-Based
Sắp xếp sản phẩm theo **điểm thịnh hành**:
```
score = avg_rating × log(num_ratings + 1)
```
> Cân bằng giữa điểm đánh giá cao và số lượng đánh giá đủ lớn để đáng tin cậy.

### 2. Content-Based Filtering
1. Tạo **TF vector** cho mỗi sản phẩm từ `category + brand + features + description`
2. Tính **Cosine Similarity** giữa sản phẩm gốc và tất cả sản phẩm còn lại
3. Trả về top N sản phẩm có độ tương đồng cao nhất

### 3. Hybrid Algorithm
Kết hợp kết quả của:
- **Content-Based** (4 sản phẩm) + **Category-Based** (4 sản phẩm)
- Loại bỏ trùng lặp, sắp xếp theo `score + rating × 0.1`

### 4. Smart Search
Tính điểm tìm kiếm theo mức độ ưu tiên:
| Trường khớp | Điểm |
|-------------|------|
| Tên sản phẩm | +10 |
| Thương hiệu | +8 |
| Danh mục | +6 |
| Tính năng | +4 |
| Mô tả | +2 |

---

## 🐍 Kiểm tra bằng Python (offline)

Script Python độc lập để kiểm tra thuật toán mà không cần chạy server:

```bash
python python/test_recommendations.py
```

> Script sẽ đọc trực tiếp file CSV và chạy 3 thuật toán: Popular, Content-Based, Search — sau đó in kết quả ra console.

---

## 📊 Dữ liệu

Dữ liệu được lưu dưới dạng CSV trong `public/data/`:

| File | Nội dung |
|------|----------|
| `products.csv` | ~100 sản phẩm điện tử (tên, danh mục, thương hiệu, giá, mô tả) |
| `popular_products.csv` | Sản phẩm thịnh hành kèm số lượt đánh giá |
| `ratings.csv` | Lịch sử đánh giá của người dùng |
| `products_with_image_links.csv` | URL ảnh sản phẩm từ nguồn ngoài |

---

## 🛠️ Tech Stack

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| Next.js | 15.2.4 | Framework fullstack |
| React | 19 | UI Components |
| TypeScript | 5.x | Type safety |
| TailwindCSS | 3.x | Styling |
| shadcn/ui | latest | UI Component Library |
| Recharts | 2.15 | Biểu đồ thống kê |
| Lucide React | 0.454 | Icons |
| csv-parse | latest | Đọc file CSV |
| Sonner | latest | Toast notifications |

---

## 👨‍💻 Tác giả

**Do Van Sinh** – [@sinh2210](https://github.com/sinh2210)

---

<div align="center">
  Made with ❤️ · Next.js 15 · TypeScript · TailwindCSS
</div>
