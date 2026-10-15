// src/components/Ticker.tsx
"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import { toBengaliNumber } from "@/lib/utils";
import { fetchProducts } from "@/lib/api";

export default function Ticker({
    initialProducts = [],
}: {
    initialProducts?: Product[];
}) {
    const [products, setProducts] = useState<Product[]>(initialProducts);

    useEffect(() => {
        if (products.length === 0) {
            fetchProducts()
                .then((data) => setProducts(data))
                .catch((err) =>
                    console.error("Ticker product fetch error:", err),
                );
        }
    }, []);

    if (products.length === 0) {
        return (
            <div className="bg-[#f9fafb] border-b border-gray-200 py-2 px-4 text-xs text-gray-400 animate-pulse">
                দাম লোড হচ্ছে...
            </div>
        );
    }

    // Duplicate list to create seamless infinite scrolling effect
    const displayProducts = [...products, ...products];

    return (
        <div className="bg-[#f9fafb] border-b border-gray-200 overflow-hidden py-2 whitespace-nowrap">
            <div className="inline-flex animate-marquee items-center text-xs font-medium text-gray-800">
                {displayProducts.map((p, index) => (
                    <div
                        key={`${p.id}-${index}`}
                        className="inline-flex items-center gap-2 px-5 border-r border-gray-200"
                    >
                        <span className="text-sm">{p.image}</span>
                        <span className="font-semibold text-gray-800">
                            {p.nameBn}
                        </span>
                        <span className="text-gray-600">
                            {toBengaliNumber(p.today)} টাকা/
                            {p.unit === "kg" ? "কেজি" : p.unit}
                        </span>
                        <span
                            className={`font-semibold ${
                                p.change.dir === "up"
                                    ? "text-emerald-600"
                                    : p.change.dir === "down"
                                      ? "text-rose-600"
                                      : "text-gray-500"
                            }`}
                        >
                            {p.change.dir === "up" && "▲ "}
                            {p.change.dir === "down" && "▼ "}
                            {p.change.dir === "flat" && "— "}
                            {toBengaliNumber(Math.abs(p.change.pct))}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
