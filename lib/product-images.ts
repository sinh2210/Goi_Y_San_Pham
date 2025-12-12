// Product image mapping từ CSV file
export const productImages: Record<string, string> = {
  P0114:
    "https://www.globaltelecompk.com/wp-content/uploads/2023/04/be_fr_feature_energy_boost_for_two_at_a_time_53458391675.jpg",
  P0115:
    "https://images.samsung.com/is/image/samsung/p6pim/vn/eb-p3300xjegvn/gallery/vn-wireless-battery-pack-eb-p3300-eb-p3300xjegvn-537219513",
  P0116: "https://cdn.tgdd.vn/Products/Images/57/309037/samsung-galaxy-watch-6-44mm-bac-1.jpg",
  P0117:
    "https://images.samsung.com/is/image/samsung/p6pim/vn/sm-r510nzkaxev/gallery/vn-galaxy-buds2-pro-r510-sm-r510nzkaxev-534851690",
  P0118: "https://cdn.tgdd.vn/Products/Images/42/309831/samsung-galaxy-tab-s9-11-inch-wifi-xam-1.jpg",
  // Sẽ được load động từ CSV
}

// Load product images từ CSV
let imageCache: Record<string, string> | null = null

export async function loadProductImages(): Promise<Record<string, string>> {
  if (imageCache) {
    return imageCache
  }

  try {
    // Trong môi trường production, load từ CSV
    const response = await fetch("/data/products_with_image_links.csv")
    const csvContent = await response.text()

    const lines = csvContent.split("\n")
    const images: Record<string, string> = {}

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      // Parse CSV line
      const values = []
      let current = ""
      let inQuotes = false

      for (let j = 0; j < line.length; j++) {
        const char = line[j]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === "," && !inQuotes) {
          values.push(current.trim())
          current = ""
        } else {
          current += char
        }
      }
      values.push(current.trim())

      if (values.length >= 4) {
        const productId = values[0]?.replace(/"/g, "")
        const imageUrl = values[3]?.replace(/"/g, "")

        if (productId && imageUrl) {
          images[productId] = imageUrl
        }
      }
    }

    imageCache = images
    return images
  } catch (error) {
    console.error("Error loading product images:", error)
    return productImages // Fallback to static mapping
  }
}

// Helper function to get product image
export async function getProductImage(productId: string, category?: string): Promise<string> {
  const images = await loadProductImages()

  // Kiểm tra có ảnh riêng cho sản phẩm không
  if (images[productId]) {
    return images[productId]
  }

  // Fallback theo category
  const categoryImages: Record<string, string> = {
    "Điện thoại": "https://cdn.tgdd.vn/Products/Images/42/309831/samsung-galaxy-tab-s9-11-inch-wifi-xam-1.jpg",
    Laptop: "https://cdn.tgdd.vn/Products/Images/44/309037/samsung-galaxy-watch-6-44mm-bac-1.jpg",
    "Tai nghe":
      "https://images.samsung.com/is/image/samsung/p6pim/vn/sm-r510nzkaxev/gallery/vn-galaxy-buds2-pro-r510-sm-r510nzkaxev-534851690",
    "Đồng hồ thông minh": "https://cdn.tgdd.vn/Products/Images/57/309037/samsung-galaxy-watch-6-44mm-bac-1.jpg",
    Tablet: "https://cdn.tgdd.vn/Products/Images/42/309831/samsung-galaxy-tab-s9-11-inch-wifi-xam-1.jpg",
    "Dây sạc":
      "https://www.globaltelecompk.com/wp-content/uploads/2023/04/be_fr_feature_energy_boost_for_two_at_a_time_53458391675.jpg",
  }

  if (category && categoryImages[category]) {
    return categoryImages[category]
  }

  // Default placeholder
  return `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(productId)}`
}

// Sync version for client components
export function getProductImageSync(productId: string, category?: string): string {
  // Kiểm tra static mapping trước
  if (productImages[productId]) {
    return productImages[productId]
  }

  // Fallback theo category
  const categoryImages: Record<string, string> = {
    "Điện thoại": "https://cdn.tgdd.vn/Products/Images/42/309831/samsung-galaxy-tab-s9-11-inch-wifi-xam-1.jpg",
    Laptop: "https://cdn.tgdd.vn/Products/Images/44/309037/samsung-galaxy-watch-6-44mm-bac-1.jpg",
    "Tai nghe":
      "https://images.samsung.com/is/image/samsung/p6pim/vn/sm-r510nzkaxev/gallery/vn-galaxy-buds2-pro-r510-sm-r510nzkaxev-534851690",
    "Đồng hồ thông minh": "https://cdn.tgdd.vn/Products/Images/57/309037/samsung-galaxy-watch-6-44mm-bac-1.jpg",
    Tablet: "https://cdn.tgdd.vn/Products/Images/42/309831/samsung-galaxy-tab-s9-11-inch-wifi-xam-1.jpg",
    "Dây sạc":
      "https://www.globaltelecompk.com/wp-content/uploads/2023/04/be_fr_feature_energy_boost_for_two_at_a_time_53458391675.jpg",
  }

  if (category && categoryImages[category]) {
    return categoryImages[category]
  }

  return `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(productId)}`
}

// Get statistics
export async function getImageStats() {
  const images = await loadProductImages()

  // Phân tích domains
  const domains: Record<string, number> = {}
  Object.values(images).forEach((url) => {
    try {
      const domain = new URL(url).hostname
      domains[domain] = (domains[domain] || 0) + 1
    } catch (e) {
      // Invalid URL
    }
  })

  return {
    totalProducts: Object.keys(images).length,
    totalImages: Object.values(images).length,
    domains: Object.keys(domains).length,
    topDomains: Object.entries(domains)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([domain, count]) => ({ domain, count })),
  }
}
