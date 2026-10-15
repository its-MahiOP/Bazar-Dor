// src/app/product/[slug]/page.tsx
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { fetchProductBySlug } from "@/lib/api";
import { toBengaliNumber, getUnitLabel, formatPrice } from "@/lib/utils";
import Link from "next/link";
import { connection } from "next/server";

async function ProductDetailsContent({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    // Dynamic execution boundary for cacheComponents
    await connection();

    const { slug } = await params;

    // 1. Session Check via headers
    let session = null;
    try {
        session = await auth.api.getSession({
            headers: await headers(),
        });
    } catch (e) {
        console.error("Auth session fetch error:", e);
    }

    if (!session) {
        redirect(`/signin?callback=/product/${slug}`);
    }

    // 2. Product Data Fetch
    const product = await fetchProductBySlug(slug);

    if (!product) {
        redirect("/not-found");
    }

    const allMinPrices = product.markets.map((m) => m.min);
    const allMaxPrices = product.markets.map((m) => m.max);

    const minPrice = Math.min(...allMinPrices);
    const maxPrice = Math.max(...allMaxPrices);
    const avgPrice = Math.round(
        product.markets.reduce((acc, m) => acc + (m.min + m.max) / 2, 0) /
            product.markets.length,
    );

    const cheapestMarket = product.markets.reduce((prev, curr) =>
        curr.min < prev.min ? curr : prev,
    );
    const expensiveMarket = product.markets.reduce((prev, curr) =>
        curr.max > prev.max ? curr : prev,
    );

    return (
        <div className="bg-[#f4f6f4] min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 space-y-6">
                <nav className="flex items-center gap-2 text-xs text-gray-500">
                    <Link href="/" className="hover:text-[#058a47]">
                        হোম
                    </Link>
                    <span>/</span>
                    <Link
                        href={`/category/${product.category}`}
                        className="hover:text-[#058a47]"
                    >
                        {product.categoryNameBn}
                    </Link>
                    <span>/</span>
                    <span className="text-gray-800 font-semibold">
                        {product.nameBn}
                    </span>
                </nav>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-2xl bg-[#f4f6f4] flex items-center justify-center text-4xl border border-gray-200/60">
                            {product.image}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#e8f5e9] text-[#058a47]">
                                    {product.categoryIcon}{" "}
                                    {product.categoryNameBn}
                                </span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500">
                                    {getUnitLabel(product.unit)}
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                                {product.nameBn}
                            </h1>
                            <p className="text-xs md:text-sm text-gray-500 mt-1">
                                গতকালের তুলনায় আজ দাম{" "}
                                {product.change.dir === "up"
                                    ? "বেড়েছে"
                                    : product.change.dir === "down"
                                      ? "কমেছে"
                                      : "একই আছে"}{" "}
                                {toBengaliNumber(Math.abs(product.change.pct))}%
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#f4f6f4] p-4 rounded-xl border border-gray-200/50 text-right">
                        <span className="text-xs text-gray-500 font-medium block">
                            আজকের গড় দাম
                        </span>
                        <span className="text-2xl font-black text-[#058a47]">
                            {formatPrice(product.today)}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <span className="text-xs font-medium text-gray-400 block">
                            সর্বনিম্ন দাম
                        </span>
                        <p className="text-2xl font-bold text-[#2e7d32] mt-1">
                            {formatPrice(minPrice)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            সবচেয়ে কম:{" "}
                            <span className="font-medium text-gray-700">
                                {cheapestMarket.market}
                            </span>
                        </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <span className="text-xs font-medium text-gray-400 block">
                            সর্বাধিক দাম
                        </span>
                        <p className="text-2xl font-bold text-[#d32f2f] mt-1">
                            {formatPrice(maxPrice)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            সবচেয়ে বেশি:{" "}
                            <span className="font-medium text-gray-700">
                                {expensiveMarket.market}
                            </span>
                        </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <span className="text-xs font-medium text-gray-400 block">
                            গড় দাম
                        </span>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                            {formatPrice(avgPrice)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            মোট {toBengaliNumber(product.markets.length)}টি
                            বাজারের তথ্যের ভিত্তিতে
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="p-5 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">
                            বাজারভিত্তিক আজকের দাম
                        </h2>
                        <p className="text-xs text-gray-500">
                            বিভিন্ন বিভাগ ও বাজারের সর্বনিম্ন ও সর্বাধিক দর
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-700">
                            <thead className="bg-[#f4f6f4] text-xs font-semibold text-gray-600 border-b border-gray-200/80 uppercase">
                                <tr>
                                    <th className="p-4">বাজার</th>
                                    <th className="p-4">বিভাগ</th>
                                    <th className="p-4">সর্বনিম্ন</th>
                                    <th className="p-4">সর্বাধিক</th>
                                    <th className="p-4">গড়</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {product.markets.map((m, idx) => {
                                    const marketAvg = Math.round(
                                        (m.min + m.max) / 2,
                                    );
                                    return (
                                        <tr
                                            key={idx}
                                            className="hover:bg-gray-50/80 transition-colors"
                                        >
                                            <td className="p-4 font-semibold text-gray-900">
                                                {m.market}
                                            </td>
                                            <td className="p-4 text-gray-600">
                                                {m.division}
                                            </td>
                                            <td className="p-4 font-medium text-[#2e7d32]">
                                                {formatPrice(m.min)}
                                            </td>
                                            <td className="p-4 font-medium text-[#d32f2f]">
                                                {formatPrice(m.max)}
                                            </td>
                                            <td className="p-4 font-bold text-gray-900">
                                                {formatPrice(marketAvg)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProductDetailsPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    return (
        <Suspense
            fallback={
                <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
                    <div className="h-32 bg-white rounded-2xl animate-pulse" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="h-28 bg-white rounded-2xl animate-pulse" />
                        <div className="h-28 bg-white rounded-2xl animate-pulse" />
                        <div className="h-28 bg-white rounded-2xl animate-pulse" />
                    </div>
                </div>
            }
        >
            <ProductDetailsContent params={params} />
        </Suspense>
    );
}
