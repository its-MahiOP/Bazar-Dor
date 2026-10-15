"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Category } from "@/types";
import logoIcon from "@/assets/logo-icon.png";
import { toBengaliNumber } from "@/lib/utils";
import { fetchCategories } from "@/lib/api";

function getBengaliDate(): string {
    const now = new Date();
    const days = [
        "রবিবার",
        "সোমবার",
        "মঙ্গলবার",
        "বুধবার",
        "বৃহস্পতিবার",
        "শুক্রবার",
        "শনিবার",
    ];
    const months = [
        "জানুয়ারি",
        "ফেব্রুয়ারি",
        "মার্চ",
        "এপ্রিল",
        "মে",
        "জুন",
        "জুলাই",
        "আগস্ট",
        "সেপ্টেম্বর",
        "অক্টোবর",
        "নভেম্বর",
        "ডিসেম্বর",
    ];

    const dayName = days[now.getDay()];
    const dateNum = toBengaliNumber(now.getDate());
    const monthName = months[now.getMonth()];
    const yearNum = toBengaliNumber(now.getFullYear());

    return `${dayName}, ${dateNum} ${monthName}, ${yearNum}`;
}

export default function Navbar({
    initialCategories = [],
}: {
    initialCategories?: Category[];
}) {
    const pathname = usePathname();
    const { data: session } = authClient.useSession();
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [formattedDate, setFormattedDate] = useState<string>("");

    useEffect(() => {
        setFormattedDate(getBengaliDate());

        // Fetch categories on mount if not provided via props
        if (categories.length === 0) {
            fetchCategories()
                .then((data) => setCategories(data))
                .catch((err) =>
                    console.error("Navbar category fetch error:", err),
                );
        }
    }, []);

    const handleSignOut = async () => {
        await authClient.signOut();
    };

    return (
        <header className="w-full bg-white font-sans border-b border-gray-100">
            {/* Top Bar */}
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-11 h-11 bg-[#058a47] rounded-xl flex items-center justify-center p-2 shadow-sm">
                        <Image
                            src={logoIcon}
                            alt="বাজার দর লোগো"
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">
                            বাজার দর
                        </h1>
                        <p className="text-xs text-gray-500 font-medium h-4">
                            {formattedDate}
                        </p>
                    </div>
                </Link>

                <div>
                    {session?.user ? (
                        <div className="flex items-center gap-3">
                            <Link
                                href="/profile"
                                className="text-sm font-semibold text-gray-700 hover:text-[#058a47] transition"
                            >
                                {session.user.name || "আমার প্রোফাইল"}
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className="text-xs font-medium border border-rose-200 text-rose-600 hover:bg-rose-50 px-3.5 py-1.5 rounded-md transition"
                            >
                                সাইন আউট
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                href="/signin"
                                className="text-sm font-semibold text-gray-800 hover:text-[#058a47] px-3 py-1.5 transition"
                            >
                                সাইন ইন
                            </Link>
                            <Link
                                href="/signup"
                                className="text-sm font-medium bg-[#058a47] text-white px-5 py-2 rounded-lg shadow-sm hover:bg-[#04723a] transition"
                            >
                                সাইন আপ
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Categories Row */}
            <nav className="bg-[#f9fafb] border-t border-b border-gray-100 overflow-x-auto">
                <div className="max-w-7xl mx-auto px-4 flex items-center gap-8 py-2.5 text-sm font-medium whitespace-nowrap min-height: 42px">
                    {categories.length === 0 ? (
                        <div className="flex items-center gap-6 animate-pulse">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-4 w-16 bg-gray-200 rounded"
                                ></div>
                            ))}
                        </div>
                    ) : (
                        categories.map((cat) => {
                            const isActive =
                                pathname === `/category/${cat.slug}`;
                            return (
                                <Link
                                    key={cat.id}
                                    href={`/category/${cat.slug}`}
                                    className={`flex items-center gap-2 transition ${
                                        isActive
                                            ? "text-[#058a47] font-bold"
                                            : "text-gray-700 hover:text-[#058a47]"
                                    }`}
                                >
                                    <span className="text-base">
                                        {cat.icon}
                                    </span>
                                    <span>{cat.nameBn}</span>
                                </Link>
                            );
                        })
                    )}
                </div>
            </nav>
        </header>
    );
}
