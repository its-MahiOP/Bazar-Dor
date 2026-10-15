"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { fetchCategories } from "@/lib/api";
import { Category } from "@/types";
import { toBengaliNumber } from "@/lib/utils";
import logo from "@/assets/logo-icon.png";

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

    return `${days[now.getDay()]}, ${toBengaliNumber(now.getDate())} ${months[now.getMonth()]}, ${toBengaliNumber(now.getFullYear())}`;
}

export default function Navbar() {
    const { data: session } = authClient.useSession();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [bengaliDate, setBengaliDate] = useState<string>("");

    const dropdownRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        setBengaliDate(getBengaliDate());

        async function loadCategories() {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (err) {
                console.error("Failed to load categories in navbar:", err);
            }
        }
        loadCategories();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        await authClient.signOut();
        setDropdownOpen(false);
        router.push("/");
        router.refresh();
    };

    const userInitial = (session?.user?.name || "U").charAt(0).toUpperCase();

    return (
        <header className="bg-white border-b border-gray-200/80 sticky top-0 z-50">
            {/* Top Header Row: Logo + Bangla Date & Auth Dropdown */}
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Brand Logo + Date */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-10 h-10 rounded-xl bg-[#058a47] flex items-center justify-center p-1.5 shadow-sm">
                        <Image
                            src={logo}
                            alt="বাজার দর"
                            width={28}
                            height={28}
                            className="object-contain"
                        />
                    </div>
                    <div>
                        <span className="font-extrabold text-xl text-gray-900 tracking-tight block leading-none">
                            বাজার দর
                        </span>
                        <span className="text-[10px] text-gray-500 font-medium block mt-1 min-h-3.5">
                            {bengaliDate || "প্রয়োজনীয় পণ্যের দাম এক নজরে"}
                        </span>
                    </div>
                </Link>

                {/* Auth Section */}
                {session?.user ? (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2.5 p-1.5 rounded-2xl hover:bg-gray-100 transition-colors"
                        >
                            <div className="w-9 h-9 rounded-2xl bg-gray-200 text-gray-800 font-bold flex items-center justify-center text-sm overflow-hidden border border-gray-300/60 relative">
                                {session.user.image && !imgError ? (
                                    <Image
                                        src={session.user.image}
                                        alt={session.user.name || "User"}
                                        fill
                                        unoptimized
                                        className="object-cover"
                                        onError={() => setImgError(true)}
                                    />
                                ) : (
                                    <span>{userInitial}</span>
                                )}
                            </div>
                            <span className="text-sm font-semibold text-gray-800 max-w-30] truncate hidden sm:inline">
                                {session.user.name || "প্রোফাইল"}
                            </span>
                            <span className="text-xs text-gray-500">▾</span>
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 space-y-3 z-50">
                                <div className="border-b border-gray-100 pb-3">
                                    <p className="font-bold text-sm text-gray-900 truncate">
                                        {session.user.name || "ব্যবহারকারী"}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate mt-0.5">
                                        {session.user.email}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <Link
                                        href="/profile"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-[#f4f6f4] hover:text-[#058a47] transition-colors"
                                    >
                                        <span>👤</span>
                                        <span>আমার প্রোফাইল</span>
                                    </Link>

                                    <button
                                        onClick={handleSignOut}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                                    >
                                        <span>↵</span>
                                        <span>সাইন আউট</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link
                            href="/signin"
                            className="bg-[#058a47] hover:bg-[#04723a] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-sm"
                        >
                            সাইন ইন
                        </Link>
                        <Link
                            href="/signup"
                            className="hidden sm:inline-block border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition"
                        >
                            সাইন আপ
                        </Link>
                    </div>
                )}
            </div>

            {/* Middle Category Navigation Bar */}
            <div className="border-t border-gray-100 bg-[#fafafa]">
                <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-2 no-scrollbar">
                    {categories.map((cat) => {
                        const isActive = pathname === `/category/${cat.slug}`;
                        return (
                            <Link
                                key={cat.slug}
                                href={`/category/${cat.slug}`}
                                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                                    isActive
                                        ? "bg-[#058a47] text-white font-bold shadow-sm"
                                        : "text-gray-600 hover:bg-gray-200/60 hover:text-gray-900"
                                }`}
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.nameBn}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </header>
    );
}
