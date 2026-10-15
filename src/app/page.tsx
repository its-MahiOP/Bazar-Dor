import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/types";

export default async function HomePage() {
    let products: Product[] = [];

    try {
        products = await fetchProducts();
    } catch (error) {
        console.error("Failed to load products:", error);
    }

    const risers = products.filter((p) => p.change.dir === "up").slice(0, 6);
    const fallers = products.filter((p) => p.change.dir === "down").slice(0, 6);

    return (
        <div className="flex-grow">
            <Hero />

            <div className="max-w-7xl mx-auto px-4 py-10 space-y-12 w-full">
                {/* Section A: Today Risers */}
                {risers.length > 0 && (
                    <section>
                        <div className="mb-4">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <span>আজ দাম বেড়েছে</span>
                                <span className="text-emerald-600">▲</span>
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

                {/* Section B: Today Fallers */}
                {fallers.length > 0 && (
                    <section>
                        <div className="mb-4">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <span>আজ দাম কমেছে</span>
                                <span className="text-rose-600">▼</span>
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
                            সকল নিত্যপ্রয়োজনীয় পণ্যের তালিকা ও আজকের দাম
                        </p>
                    </div>

                    {products.length === 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-36 bg-gray-200/80 animate-pulse rounded-xl border"
                                ></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
