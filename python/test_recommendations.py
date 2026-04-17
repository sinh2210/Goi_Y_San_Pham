"""
test_recommendations.py
-----------------------
Script kiểm tra nhanh các thuật toán gợi ý sản phẩm bằng cách
đọc dữ liệu CSV và in kết quả ra console.

Chạy:
    python python/test_recommendations.py

Yêu cầu:
    pip install pandas scikit-learn
"""

import csv
import os
import math
from collections import defaultdict


# =============================================
# CẤU HÌNH ĐƯỜNG DẪN
# =============================================
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "public", "data")

PRODUCTS_CSV = os.path.join(DATA_DIR, "products.csv")
POPULAR_CSV = os.path.join(DATA_DIR, "popular_products.csv")
RATINGS_CSV = os.path.join(DATA_DIR, "ratings.csv")


# =============================================
# ĐỌC DỮ LIỆU
# =============================================
def load_csv(filepath: str) -> list[dict]:
    """Đọc file CSV và trả về danh sách dict."""
    if not os.path.exists(filepath):
        print(f"[LỖI] Không tìm thấy file: {filepath}")
        return []
    with open(filepath, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return list(reader)


# =============================================
# 1. POPULAR-BASED RECOMMENDATION
# =============================================
def get_popular_products(limit: int = 10) -> list[dict]:
    """Lấy top sản phẩm thịnh hành theo số lượng đánh giá và điểm trung bình."""
    products = load_csv(POPULAR_CSV)
    for p in products:
        p["num_ratings"] = int(p.get("num_ratings", 0) or 0)
        p["avg_rating"] = float(p.get("avg_rating", 0) or 0)
        # Score = avg_rating × log(num_ratings + 1)
        p["score"] = p["avg_rating"] * math.log(p["num_ratings"] + 1)

    products.sort(key=lambda x: x["score"], reverse=True)
    return products[:limit]


# =============================================
# 2. CONTENT-BASED FILTERING
# =============================================
def cosine_similarity(vec_a: dict, vec_b: dict) -> float:
    """Tính độ tương đồng cosine giữa hai vector tf-idf."""
    common_keys = set(vec_a) & set(vec_b)
    if not common_keys:
        return 0.0

    dot_product = sum(vec_a[k] * vec_b[k] for k in common_keys)
    norm_a = math.sqrt(sum(v * v for v in vec_a.values()))
    norm_b = math.sqrt(sum(v * v for v in vec_b.values()))

    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot_product / (norm_a * norm_b)


def text_to_vector(text: str) -> dict:
    """Tạo TF vector từ văn bản."""
    words = [w for w in text.lower().split() if len(w) > 2]
    count: dict[str, int] = defaultdict(int)
    for w in words:
        count[w] += 1
    total = len(words) or 1
    return {w: c / total for w, c in count.items()}


def get_related_products(product_id: str, limit: int = 5) -> list[dict]:
    """Content-based filtering: tìm sản phẩm tương tự dựa trên đặc điểm."""
    products = load_csv(PRODUCTS_CSV)
    target = next((p for p in products if p["product_id"] == product_id), None)

    if not target:
        print(f"[CẢNH BÁO] Không tìm thấy sản phẩm: {product_id}")
        return []

    target_vec = text_to_vector(
        f"{target['category']} {target['brand']} {target.get('features', '')} {target.get('description', '')}"
    )

    results = []
    for p in products:
        if p["product_id"] == product_id:
            continue
        vec = text_to_vector(
            f"{p['category']} {p['brand']} {p.get('features', '')} {p.get('description', '')}"
        )
        sim = cosine_similarity(target_vec, vec)
        if sim > 0:
            results.append({**p, "similarity_score": round(sim, 4)})

    results.sort(key=lambda x: x["similarity_score"], reverse=True)
    return results[:limit]


# =============================================
# 3. SEARCH-BASED RECOMMENDATION
# =============================================
def search_products(query: str, limit: int = 10) -> list[dict]:
    """Tìm kiếm sản phẩm theo từ khóa với scoring."""
    products = load_csv(PRODUCTS_CSV)
    q = query.lower()

    scored = []
    for p in products:
        score = 0
        if q in p.get("name", "").lower():      score += 10
        if q in p.get("brand", "").lower():     score += 8
        if q in p.get("category", "").lower():  score += 6
        if q in p.get("features", "").lower():  score += 4
        if q in p.get("description", "").lower(): score += 2
        if score > 0:
            scored.append({**p, "search_score": score})

    scored.sort(key=lambda x: x["search_score"], reverse=True)
    return scored[:limit]


# =============================================
# HIỂN THỊ KẾT QUẢ
# =============================================
def print_products(products: list[dict], title: str, fields: list[str] = None) -> None:
    """In danh sách sản phẩm ra console đẹp."""
    print(f"\n{'='*60}")
    print(f"  {title}  ({len(products)} sản phẩm)")
    print("=" * 60)

    if not products:
        print("  (Không có kết quả)")
        return

    default_fields = ["product_id", "name", "category", "brand", "price"]
    show_fields = fields or default_fields

    for i, p in enumerate(products, 1):
        print(f"\n  [{i}] {p.get('name', 'N/A')[:55]}")
        for f in show_fields:
            if f in p and f != "name":
                val = p[f]
                if f == "price":
                    try:
                        val = f"{float(val):,.0f} VNĐ"
                    except (ValueError, TypeError):
                        pass
                print(f"       {f:20s}: {val}")


# =============================================
# MAIN – CHẠY DEMO
# =============================================
def main():
    print("\n🛒 HỆ THỐNG GỢI Ý SẢN PHẨM – ElectroShop")
    print("Kiểm tra 3 thuật toán: Popular | Content-Based | Search\n")

    # 1. Popular-based
    popular = get_popular_products(limit=5)
    print_products(popular, "🔥 TOP SẢN PHẨM THỊNH HÀNH (Popular-Based)",
                   ["product_id", "category", "brand", "price", "avg_rating", "num_ratings", "score"])

    # 2. Content-based
    demo_product_id = "P0080"
    related = get_related_products(demo_product_id, limit=5)
    print_products(related, f"🎯 SẢN PHẨM LIÊN QUAN với '{demo_product_id}' (Content-Based)",
                   ["product_id", "category", "brand", "price", "similarity_score"])

    # 3. Search-based
    query = "Samsung"
    results = search_products(query, limit=5)
    print_products(results, f"🔍 TÌM KIẾM: '{query}' (Search-Based)",
                   ["product_id", "category", "brand", "price", "search_score"])

    print("\n✅ HOÀN THÀNH kiểm tra hệ thống gợi ý!\n")


if __name__ == "__main__":
    main()
