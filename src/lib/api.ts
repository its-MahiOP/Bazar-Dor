import { Category, Product } from "@/types";

const BASE_URL = "https://api.api-store.workers.dev/api/bazardor";

export async function fetchCategories(): Promise<Category[]> {
    const res = await fetch(`${BASE_URL}/categories`, {
        next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
}

export async function fetchProducts(category?: string): Promise<Product[]> {
    const url = category
        ? `${BASE_URL}/products?category=${category}`
        : `${BASE_URL}/products`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
}

export async function fetchProductBySlug(
    slug: string,
): Promise<Product | null> {
    const products = await fetchProducts();
    return products.find((p) => p.slug === slug) || null;
}
