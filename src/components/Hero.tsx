"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import heroImg from "@/assets/bazar-hero.png";
import { toBengaliNumber } from "@/lib/utils";

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

export default function Hero() {
    const [formattedDate, setFormattedDate] = useState<string>("");

    useEffect(() => {
        setFormattedDate(getBengaliDate());
    }, []);

    return (
        <section className="bg-[#f4f6f4] py-8 px-4">
            <div className="max-w-7xl mx-auto bg-white rounded-3xl border border-gray-200/80 p-8 md:p-12 shadow-sm">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Left Text Content */}
                    <div className="max-w-xl space-y-5">
                        {/* Dynamic Date Badge */}
                        <div className="inline-block bg-[#e8f5e9] text-[#058a47] font-semibold text-xs px-3.5 py-1.5 rounded-full">
                            {formattedDate || "মঙ্গলবার, ৬ অক্টোবর, ২০২৬"}
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl lg:text-[40px] font-extrabold text-gray-900 tracking-tight leading-tight">
                            আজকের বাজারের দাম এক নজরে
                        </h1>

                        {/* Subtitle */}
                        <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
                            বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং
                            দামের পরিবর্তন এক জায়গায়।
                        </p>

                        {/* CTA Button */}
                        <div className="pt-2">
                            <a
                                href="#সব-পণ্য"
                                className="inline-block bg-[#058a47] hover:bg-[#04723a] text-white font-medium text-sm px-6 py-3 rounded-lg shadow-sm transition-colors duration-200"
                            >
                                সব পণ্য দেখুন
                            </a>
                        </div>
                    </div>

                    {/* Right Banner Image */}
                    <div className="w-full md:w-auto flex justify-center items-center">
                        <div className="relative w-60 h-60 md:w-72 md:h-72 flex items-center justify-center">
                            <Image
                                src={heroImg}
                                alt="বাজার দর বাস্কেট"
                                width={280}
                                height={280}
                                priority
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
