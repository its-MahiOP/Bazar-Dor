// src/components/ProductCard.tsx
import Link from "next/link";
import { Product } from "@/types";
import { toBengaliNumber, getUnitLabel, formatPrice } from "@/lib/utils";

export default function ProductCard({ product }: { product: Product }) {
    const isUp = product.change.dir === "up";
    const isDown = product.change.dir === "down";

    return (
        <Link
            href={`/product/${product.slug}`}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
        >
            {/* Top Part: Icon + Title + Unit */}
            <div>
                <div className="flex items-center gap-3.5 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#f4f6f4] flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                        {product.image}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-[#058a47] transition-colors text-base leading-snug">
                            {product.nameBn}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium">
                            {getUnitLabel(product.unit)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Part: Today Price + Change Percentage Badge */}
            <div className="mt-4 pt-2 flex items-end justify-between">
                <div>
                    <span className="text-xs text-gray-400 block font-medium mb-0.5">
                        আজকের দাম
                    </span>
                    <span className="text-lg font-extrabold text-gray-900">
                        {formatPrice(product.today)}
                    </span>
                </div>

                {/* Change Badge */}
                <div
                    className={`text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 ${
                        isUp
                            ? "bg-[#fdeded] text-[#d32f2f]"
                            : isDown
                              ? "bg-[#edf7ed] text-[#2e7d32]"
                              : "bg-gray-100 text-gray-600"
                    }`}
                >
                    <span>
                        {isUp && "▲"}
                        {isDown && "▼"}
                        {product.change.dir === "flat" && "—"}
                    </span>
                    <span>
                        {toBengaliNumber(Math.abs(product.change.pct))}%
                    </span>
                </div>
            </div>
        </Link>
    );
}
