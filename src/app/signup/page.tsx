"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function SignUpPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("পাসওয়ার্ড দুটি মিলছে না!");
            return;
        }

        if (password.length < 8) {
            toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে!");
            return;
        }

        setLoading(true);

        try {
            const { error } = await authClient.signUp.email({
                name,
                email,
                password,
            });

            if (error) {
                toast.error(error.message || "নিবন্ধন করতে ব্যর্থ হয়েছে!");
            } else {
                toast.success(
                    "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! এখন সাইন ইন করুন।",
                );
                router.push("/signin");
            }
        } catch {
            toast.error("কিছু ভুল হয়েছে! আবার চেষ্টা করুন।");
        } finally {
            setLoading(false);
        }
    };

    const handleSocialSignUp = async (provider: "google" | "github") => {
        try {
            await authClient.signIn.social({
                provider,
                callbackURL: "/",
            });
        } catch {
            toast.error("সোশ্যাল সাইন আপ ব্যর্থ হয়েছে!");
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
            <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200/80 p-8 shadow-sm space-y-6">
                {/* Header Title */}
                <div className="text-center space-y-1">
                    <h1 className="text-2xl font-extrabold text-gray-900">
                        অ্যাকাউন্ট তৈরি করুন
                    </h1>
                    <p className="text-xs text-gray-500">
                        বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
                    </p>
                </div>

                {/* Credentials Form */}
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            নাম
                        </label>
                        <input
                            type="text"
                            placeholder="যেমন: রহিম উদ্দিন"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#058a47]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            ইমেইল
                        </label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#058a47]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            পাসওয়ার্ড
                        </label>
                        <input
                            type="password"
                            placeholder="কমপক্ষে ৮ অক্ষর"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#058a47]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            পাসওয়ার্ড নিশ্চিত করুন
                        </label>
                        <input
                            type="password"
                            placeholder="আবার লিখুন"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#058a47]"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#058a47] hover:bg-[#04723a] text-white font-semibold text-sm py-3 rounded-xl transition duration-200 shadow-sm disabled:opacity-50"
                    >
                        {loading
                            ? "অ্যাকাউন্ট তৈরি হচ্ছে..."
                            : "অ্যাকাউন্ট তৈরি করুন"}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative flex items-center justify-center">
                    <div className="border-t border-gray-200 w-full"></div>
                    <span className="bg-white px-3 text-xs text-gray-400 font-medium absolute">
                        অথবা
                    </span>
                </div>

                {/* Social Logins */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                        onClick={() => handleSocialSignUp("google")}
                        className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 py-2.5 rounded-xl transition"
                    >
                        <span>G</span>
                        <span>Google দিয়ে চালিয়ে যান</span>
                    </button>

                    <button
                        onClick={() => handleSocialSignUp("github")}
                        className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 py-2.5 rounded-xl transition"
                    >
                        <span>🐙</span>
                        <span>GitHub দিয়ে চালিয়ে যান</span>
                    </button>
                </div>

                {/* Footer Redirect */}
                <div className="text-center pt-2">
                    <p className="text-xs text-gray-600">
                        অ্যাকাউন্ট আছে?{" "}
                        <Link
                            href="/signin"
                            className="text-[#058a47] font-bold hover:underline"
                        >
                            সাইন ইন করুন
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
