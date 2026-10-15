"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

function SignInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callback") || "/";

    const handleCredentialsSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await authClient.signIn.email({
                email,
                password,
            });

            if (error) {
                toast.error(
                    error.message ||
                        "সাইন ইন করতে ব্যর্থ হয়েছে! সঠিক তথ্য দিন।",
                );
            } else {
                toast.success("সফলভাবে সাইন ইন করেছেন!");
                router.push(callbackUrl);
                router.refresh();
            }
        } catch {
            toast.error("কিছু ভুল হয়েছে! আবার চেষ্টা করুন।");
        } finally {
            setLoading(false);
        }
    };

    const handleSocialSignIn = async (provider: "google" | "github") => {
        try {
            await authClient.signIn.social({
                provider,
                callbackURL: callbackUrl,
            });
        } catch {
            toast.error("সোশ্যাল সাইন ইন ব্যর্থ হয়েছে!");
        }
    };

    return (
        <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200/80 p-8 shadow-sm space-y-6">
            <div className="text-center space-y-1">
                <h1 className="text-2xl font-extrabold text-gray-900">
                    সাইন ইন
                </h1>
                <p className="text-xs text-gray-500">
                    বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে
                    ঢুকুন।
                </p>
            </div>

            <form onSubmit={handleCredentialsSignIn} className="space-y-4">
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

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#058a47] hover:bg-[#04723a] text-white font-semibold text-sm py-3 rounded-xl transition duration-200 shadow-sm disabled:opacity-50"
                >
                    {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
                </button>
            </form>

            <div className="relative flex items-center justify-center">
                <div className="border-t border-gray-200 w-full"></div>
                <span className="bg-white px-3 text-xs text-gray-400 font-medium absolute">
                    অথবা
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                    onClick={() => handleSocialSignIn("google")}
                    className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 py-2.5 rounded-xl transition"
                >
                    <span>G</span>
                    <span>Google দিয়ে চালিয়ে যান</span>
                </button>

                <button
                    onClick={() => handleSocialSignIn("github")}
                    className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 py-2.5 rounded-xl transition"
                >
                    <span>🐙</span>
                    <span>GitHub দিয়ে চালিয়ে যান</span>
                </button>
            </div>

            <div className="text-center pt-2">
                <p className="text-xs text-gray-600">
                    অ্যাকাউন্ট নেই?{" "}
                    <Link
                        href="/signup"
                        className="text-[#058a47] font-bold hover:underline"
                    >
                        সাইন আপ করুন
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function SignInPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
            <Suspense
                fallback={
                    <div className="w-full max-w-md h-96 bg-white rounded-3xl animate-pulse" />
                }
            >
                <SignInForm />
            </Suspense>
        </div>
    );
}
