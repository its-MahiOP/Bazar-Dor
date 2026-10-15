import Link from "next/link";
import { Product } from "@/types";
import { toBengaliNumber, getUnitLabel, formatPrice } from "@/lib/utils";

export default function ProductCard({ product }: { product: Product }) {
    const isUp = product.change.dir === "up";
    const isDown = product.change.dir === "down";

    return (
        <Link
            href={`/product/${product.slug}`}
            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
        >
            <div>
                <div className="flex items-center gap-3.5 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl border border-gray-100 group-hover:scale-105 transition-transform">
                        {product.image}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-[#058a47] transition-colors">
                            {product.nameBn}
                        </h3>
                        <p className="text-xs text-gray-500">
                            {getUnitLabel(product.unit)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                    <span className="text-[11px] text-gray-400 block font-medium">
                        আজকের দাম
                    </span>
                    <span className="text-base font-extrabold text-gray-900">
                        {formatPrice(product.today)}
                    </span>
                </div>

                <div
                    className={`text-xs px-2.5 py-1 rounded-md font-bold flex items-center gap-1 ${
                        isUp
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : isDown
                              ? "bg-rose-50 text-rose-700 border border-rose-100"
                              : "bg-gray-100 text-gray-600 border border-gray-200"
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
