"use client";

import { useState, useEffect, use, Suspense } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { fetchProducts, fetchCategories } from "@/lib/api";
import { Product, Category } from "@/types";
import { toBengaliNumber } from "@/lib/utils";

function CategoryContent({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const slug = resolvedParams.slug;

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortOption, setSortOption] = useState<"default" | "asc" | "desc">(
        "default",
    );

    useEffect(() => {
        async function loadCategoryData() {
            setLoading(true);
            try {
                const [allCats, catProducts] = await Promise.all([
                    fetchCategories(),
                    fetchProducts(slug),
                ]);
                setCategories(allCats);
                setProducts(catProducts);
            } catch (err) {
                console.error("Error fetching category items:", err);
            } finally {
                setLoading(false);
            }
        }

        loadCategoryData();
    }, [slug]);

    const currentCategory = categories.find((c) => c.slug === slug);

    const sortedProducts = [...products].sort((a, b) => {
        if (sortOption === "asc") return a.today - b.today;
        if (sortOption === "desc") return b.today - a.today;
        return 0;
    });

    if (!loading && (!currentCategory || products.length === 0)) {
        return (
            <div className="bg-[#f4f6f4] min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    ক্যাটাগরি বা পণ্য পাওয়া যায়নি
                </h1>
                <p className="text-sm text-gray-500 mb-6">
                    আপনি যে ক্যাটাগরি খুঁজছেন তা বিদ্যমান নেই অথবা এতে কোনো পণ্য
                    নেই।
                </p>
                <Link
                    href="/"
                    className="bg-[#058a47] hover:bg-[#04723a] text-white text-sm font-medium px-6 py-2.5 rounded-xl shadow-sm transition"
                >
                    হোম পেজে ফিরে যান
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[#f4f6f4] min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">
                                {currentCategory?.icon}
                            </span>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {currentCategory?.nameBn}
                                </h1>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {loading
                                        ? "পণ্য লোড হচ্ছে..."
                                        : `মোট ${toBengaliNumber(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন`}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <label
                            htmlFor="sort-dropdown"
                            className="text-xs font-semibold text-gray-600"
                        >
                            সাজান:
                        </label>
                        <select
                            id="sort-dropdown"
                            value={sortOption}
                            onChange={(e) =>
                                setSortOption(
                                    e.target.value as
                                        | "default"
                                        | "asc"
                                        | "desc",
                                )
                            }
                            className="border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-medium text-gray-800 bg-[#f4f6f4] focus:outline-none focus:ring-2 focus:ring-[#058a47] cursor-pointer"
                        >
                            <option value="default">ডিফল্ট</option>
                            <option value="asc">দাম: কম থেকে বেশি</option>
                            <option value="desc">দাম: বেশি থেকে কম</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="h-36 bg-gray-200/80 animate-pulse rounded-2xl"
                            ></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                        {sortedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    return (
        <Suspense
            fallback={
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="h-24 bg-white rounded-2xl animate-pulse mb-6" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="h-36 bg-gray-200/80 animate-pulse rounded-2xl"
                            />
                        ))}
                    </div>
                </div>
            }
        >
            <CategoryContent params={params} />
        </Suspense>
    );
}
