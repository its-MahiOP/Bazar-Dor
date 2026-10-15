import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { fetchProductBySlug } from "@/lib/api";
import { toBengaliNumber, formatPrice } from "@/lib/utils";
import Link from "next/link";
import { connection } from "next/server";

async function ProductDetailsContent({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    await connection();

    const { slug } = await params;

    // Session Authentication Check
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

    // Fetch product data
    const product = await fetchProductBySlug(slug);

    if (!product) {
        redirect("/not-found");
    }

    // Calculate Price Metrics
    const allMinPrices = product.markets.map((m) => m.min);
    const allMaxPrices = product.markets.map((m) => m.max);

    const minPrice = Math.min(...allMinPrices);
    const maxPrice = Math.max(...allMaxPrices);
    const avgPrice = Math.round(
        product.markets.reduce((acc, m) => acc + (m.min + m.max) / 2, 0) /
            product.markets.length,
    );

    const priceDiff = Math.abs(product.today - product.yesterday);
    const isUp = product.change.dir === "up";
    const isDown = product.change.dir === "down";

    const unitText =
        product.unit === "kg"
            ? "কেজি"
            : product.unit === "litre"
              ? "লিটার"
              : product.unit === "dozen"
                ? "ডজন"
                : "পিস";

    return (
        <div className="bg-[#f4f6f4] min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 space-y-6">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                    <Link href="/" className="hover:text-[#058a47]">
                        হোম
                    </Link>
                    <span>›</span>
                    <Link
                        href={`/category/${product.category}`}
                        className="hover:text-[#058a47]"
                    >
                        {product.categoryNameBn}
                    </Link>
                    <span>›</span>
                    <span className="text-gray-800 font-semibold">
                        {product.nameBn}
                    </span>
                </nav>

                {/* Top Header Card */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-5">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#f4f6f4] flex items-center justify-center text-3xl md:text-4xl border border-gray-100 shrink-0">
                            {product.image}
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                                {product.nameBn}
                            </h1>
                            <p className="text-xs md:text-sm text-gray-500 font-medium">
                                প্রতি {unitText} · {product.categoryNameBn}
                            </p>
                            <p className="text-xs text-gray-500 pt-1">
                                গতকালের তুলনায় আজ দাম{" "}
                                <span className="font-bold text-gray-800">
                                    {isUp
                                        ? "বেড়েছে"
                                        : isDown
                                          ? "কমেছে"
                                          : "একই আছে"}
                                </span>{" "}
                                · {toBengaliNumber(priceDiff)} টাকা
                            </p>
                        </div>
                    </div>

                    {/* Today's Price Widget */}
                    <div className="bg-[#f4f6f4] p-5 rounded-2xl border border-gray-200/50 text-center min-w-40 self-end md:self-auto">
                        <span className="text-xs text-gray-500 font-medium block">
                            আজকের দাম
                        </span>
                        <span className="text-3xl font-black text-gray-900 block my-0.5">
                            {toBengaliNumber(product.today)}
                        </span>
                        <span className="text-xs text-gray-500 font-medium block">
                            টাকা / {unitText}
                        </span>
                        <span
                            className={`text-xs font-bold inline-flex items-center gap-0.5 mt-1 ${
                                isUp
                                    ? "text-[#d32f2f]"
                                    : isDown
                                      ? "text-[#2e7d32]"
                                      : "text-gray-500"
                            }`}
                        >
                            {isUp && "▲ "}
                            {isDown && "▼ "}
                            {product.change.dir === "flat" && "— "}
                            {toBengaliNumber(Math.abs(product.change.pct))}%
                        </span>
                    </div>
                </div>

                {/* Price Summary Section */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-4">
                    <h2 className="text-lg font-bold text-gray-900">
                        দামের সারসংক্ষেপ
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Minimum Price Box */}
                        <div className="bg-[#f9fafb] p-5 rounded-xl border border-gray-100">
                            <span className="text-xs font-medium text-gray-500 block">
                                সর্বনিম্ন দাম
                            </span>
                            <p className="text-2xl font-bold text-[#2e7d32] my-1">
                                {toBengaliNumber(minPrice)} টাকা
                            </p>
                            <span className="text-[11px] text-gray-400 block font-medium">
                                সবচেয়ে কম দামের বাজার
                            </span>
                        </div>

                        {/* Maximum Price Box */}
                        <div className="bg-[#f9fafb] p-5 rounded-xl border border-gray-100">
                            <span className="text-xs font-medium text-gray-500 block">
                                সর্বাধিক দাম
                            </span>
                            <p className="text-2xl font-bold text-[#d32f2f] my-1">
                                {toBengaliNumber(maxPrice)} টাকা
                            </p>
                            <span className="text-[11px] text-gray-400 block font-medium">
                                সবচেয়ে বেশি দামের বাজার
                            </span>
                        </div>

                        {/* Average Price Box */}
                        <div className="bg-[#f9fafb] p-5 rounded-xl border border-gray-100">
                            <span className="text-xs font-medium text-gray-500 block">
                                গড় দাম
                            </span>
                            <p className="text-2xl font-bold text-[#2e7d32] my-1">
                                {toBengaliNumber(avgPrice)} টাকা
                            </p>
                            <span className="text-[11px] text-gray-400 block font-medium">
                                প্রতি {unitText}-এর হিসাবে
                            </span>
                        </div>
                    </div>
                </div>

                {/* Market Table Section */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-4">
                    <h2 className="text-lg font-bold text-gray-900">
                        বাজারভিত্তিক আজকের দাম
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-700">
                            <thead className="border-b border-gray-200 text-xs font-bold text-gray-500">
                                <tr>
                                    <th className="py-3 px-2">বাজার</th>
                                    <th className="py-3 px-2">বিভাগ</th>
                                    <th className="py-3 px-2">সর্বনিম্ন</th>
                                    <th className="py-3 px-2">সর্বাধিক</th>
                                    <th className="py-3 px-2">গড়</th>
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
                                            <td className="py-3.5 px-2 font-medium text-gray-900">
                                                {m.market}
                                            </td>
                                            <td className="py-3.5 px-2 text-gray-600">
                                                {m.division}
                                            </td>
                                            <td className="py-3.5 px-2 font-medium text-gray-900">
                                                {formatPrice(m.min)}
                                            </td>
                                            <td className="py-3.5 px-2 font-medium text-gray-900">
                                                {formatPrice(m.max)}
                                            </td>
                                            <td className="py-3.5 px-2 font-bold text-gray-900">
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
