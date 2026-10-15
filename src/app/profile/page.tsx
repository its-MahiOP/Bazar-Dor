// src/app/profile/page.tsx
"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    if (isPending) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="w-full max-w-md bg-white p-8 rounded-3xl animate-pulse h-64 border" />
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
    };

    return (
        <div className="min-h-[80vh] bg-[#f4f6f4] py-10 px-4">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* User Card Header */}
                <div className="bg-white rounded-3xl border border-gray-200/80 p-6 md:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-[#058a47] text-white flex items-center justify-center text-2xl font-bold">
                            {session.user.name
                                ? session.user.name.charAt(0).toUpperCase()
                                : "U"}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                {session.user.name || "ব্যবহারকারী"}
                            </h1>
                            <p className="text-xs text-gray-500">
                                {session.user.email}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleSignOut}
                        className="text-xs font-semibold border border-rose-200 text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-xl transition"
                    >
                        ← সাইন আউট
                    </button>
                </div>

                {/* Profile Info Card */}
                <div className="bg-white rounded-3xl border border-gray-200/80 p-6 md:p-8 shadow-sm space-y-6">
                    <div className="border-b border-gray-100 pb-4">
                        <h2 className="text-lg font-bold text-gray-900">
                            তথ্য
                        </h2>
                        <p className="text-xs text-gray-500">
                            আপনার অ্যাকাউন্টের বিবরণ
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">
                                নাম
                            </label>
                            <div className="w-full border border-gray-200/80 bg-gray-50/50 rounded-xl px-4 py-3 text-sm text-gray-800 font-medium">
                                {session.user.name || "নাম সেট করা নেই"}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">
                                ইমেইল
                            </label>
                            <div className="w-full border border-gray-200/80 bg-gray-50/50 rounded-xl px-4 py-3 text-sm text-gray-800 font-medium">
                                {session.user.email}
                            </div>
                        </div>

                        {/* C3 Update Action Button */}
                        <div className="pt-2">
                            <Link
                                href="/profile/update"
                                className="inline-block w-full text-center bg-[#058a47] hover:bg-[#04723a] text-white font-semibold text-sm py-3 rounded-xl transition shadow-sm"
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
