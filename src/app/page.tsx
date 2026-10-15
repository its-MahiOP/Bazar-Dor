import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/types";
import { toBengaliNumber } from "@/lib/utils";

export default async function HomePage() {
    let products: Product[] = [];

    try {
        products = await fetchProducts();
    } catch (error) {
        console.error("Failed to load products:", error);
    }

    // Risers: sorted descending by positive change percentage (Top 6)
    const risers = products
        .filter((p) => p.change.dir === "up")
        .sort((a, b) => Math.abs(b.change.pct) - Math.abs(a.change.pct))
        .slice(0, 6);

    // Fallers: sorted descending by drop magnitude percentage (Top 6)
    const fallers = products
        .filter((p) => p.change.dir === "down")
        .sort((a, b) => Math.abs(b.change.pct) - Math.abs(a.change.pct))
        .slice(0, 6);

    return (
        <div className="grow bg-[#f4f6f4] min-h-screen">
            <Hero />

            <div className="max-w-7xl mx-auto px-4 py-8 space-y-12 w-full">
                {/* Section A: Today Risers (Red ▲ Heading + Red Badges) */}
                {risers.length > 0 && (
                    <section>
                        <div className="mb-5 flex items-center gap-2">
                            <span className="text-[#d32f2f] text-sm">▲</span>
                            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                                আজ দাম বেড়েছে
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                            {risers.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Section B: Today Fallers (Green ▼ Heading + Green Badges) */}
                {fallers.length > 0 && (
                    <section>
                        <div className="mb-5 flex items-center gap-2">
                            <span className="text-[#2e7d32] text-sm">▼</span>
                            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                                আজ দাম কমেছে
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                            {fallers.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Section C: All Products */}
                <section id="সব-পণ্য" className="scroll-mt-8">
                    <div className="mb-5">
                        <h2 className="text-2xl font-bold text-gray-900">
                            সব পণ্য
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">
                            মোট {toBengaliNumber(products.length)}টি পণ্য দেখানো
                            হচ্ছে
                        </p>
                    </div>

                    {products.length === 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                            {[...Array(9)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-40 bg-gray-200/80 animate-pulse rounded-2xl"
                                ></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
