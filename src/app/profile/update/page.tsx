// src/app/profile/update/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import Link from "next/link";

export default function ProfileUpdatePage() {
    const { data: session, isPending } = authClient.useSession();
    const [name, setName] = useState("");
    const [updating, setUpdating] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (session?.user?.name) {
            setName(session.user.name);
        }
    }, [session]);

    if (isPending) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="w-full max-w-md bg-white p-8 rounded-3xl animate-pulse h-64 border" />
            </div>
        );
    }

    if (!session?.user) {
        router.push("/signin?callback=/profile/update");
        return null;
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);

        try {
            const { error } = await authClient.updateUser({
                name,
            });

            if (error) {
                toast.error(error.message || "তথ্য আপডেট করতে ব্যর্থ হয়েছে!");
            } else {
                toast.success("তথ্য সফলভাবে আপডেট করা হয়েছে!");
                router.push("/profile");
                router.refresh();
            }
        } catch {
            toast.error("কিছু ভুল হয়েছে! আবার চেষ্টা করুন।");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="min-h-[80vh] bg-[#f4f6f4] py-10 px-4">
            <div className="max-w-md mx-auto bg-white rounded-3xl border border-gray-200/80 p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            তথ্য আপডেট করুন
                        </h1>
                        <p className="text-xs text-gray-500">
                            নতুন নাম পরিবর্তন করুন
                        </p>
                    </div>
                    <Link
                        href="/profile"
                        className="text-xs text-gray-500 hover:text-gray-800"
                    >
                        বাতিল
                    </Link>
                </div>

                <form onSubmit={handleUpdate} className="space-y-4">
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

                    <button
                        type="submit"
                        disabled={updating}
                        className="w-full bg-[#058a47] hover:bg-[#04723a] text-white font-semibold text-sm py-3 rounded-xl transition duration-200 shadow-sm disabled:opacity-50"
                    >
                        {updating ? "আপডেট হচ্ছে..." : "আপডেট"}
                    </button>
                </form>
            </div>
        </div>
    );
}
