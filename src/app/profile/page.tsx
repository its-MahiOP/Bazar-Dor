"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { data: session, isPending } = authClient.useSession();
    const [imgError, setImgError] = useState(false);
    const router = useRouter();

    if (isPending) {
        return (
            <div className="min-h-[70vh] bg-[#f4f6f4] flex items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-white p-8 rounded-3xl animate-pulse h-64 border border-gray-100" />
            </div>
        );
    }

    if (!session?.user) {
        router.push("/signin?callback=/profile");
        return null;
    }

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push("/");
        router.refresh();
    };

    const userInitial = (session.user.name || "U").charAt(0).toUpperCase();

    return (
        <div className="min-h-[85vh] bg-[#f4f6f4] py-10 px-4">
            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900">
                        আমার প্রোফাইল
                    </h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                        আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
                    </p>
                </div>

                {/* User Card */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-2xl bg-gray-100 text-gray-800 font-bold flex items-center justify-center text-3xl overflow-hidden border border-gray-200 shrink-0 relative">
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
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {session.user.name || "ব্যবহারকারী"}
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {session.user.email}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold px-4 py-2.5 rounded-xl transition"
                    >
                        <span>↵</span>
                        <span>সাইন আউট</span>
                    </button>
                </div>

                {/* Info Card */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-4">
                    <h3 className="text-lg font-bold text-gray-900">তথ্য</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                নাম
                            </label>
                            <div className="w-full border border-gray-200 bg-gray-50/50 rounded-xl px-4 py-3 text-sm text-gray-800 font-medium">
                                {session.user.name || "নাম সেট করা নেই"}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                ইমেইল
                            </label>
                            <div className="w-full border border-gray-200 bg-gray-50/50 rounded-xl px-4 py-3 text-sm text-gray-800 font-medium">
                                {session.user.email}
                            </div>
                        </div>

                        <div className="pt-2">
                            <Link
                                href="/profile/update"
                                className="inline-block w-full text-center bg-[#058a47] hover:bg-[#04723a] text-white font-bold text-sm py-3.5 rounded-2xl transition duration-200 shadow-sm"
                            >
                                আপডেট
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
