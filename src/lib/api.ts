import { Category, Product } from "@/types";

const BASE_URL_1 = "https://api.api-store.workers.dev/api/bazardor";
const BASE_URL_2 = "https://api.abcz.workers.dev/api/bazardor";

async function fetchWithFallback(endpoint: string) {
    try {
        const res = await fetch(`${BASE_URL_1}${endpoint}`, {
            next: { revalidate: 60 },
        });
        if (res.ok) return res.json();
    } catch {
        // try secondary endpoint
    }

    const res2 = await fetch(`${BASE_URL_2}${endpoint}`, {
        next: { revalidate: 60 },
    });
    if (!res2.ok) throw new Error(`Failed to fetch ${endpoint}`);
    return res2.json();
}

export async function fetchCategories(): Promise<Category[]> {
    return fetchWithFallback("/categories");
}

export async function fetchProducts(category?: string): Promise<Product[]> {
    const endpoint = category ? `/products?category=${category}` : "/products";
    return fetchWithFallback(endpoint);
}

export async function fetchProductBySlug(
    slug: string,
): Promise<Product | null> {
    const products = await fetchProducts();
    return products.find((p) => p.slug === slug) || null;
}
