"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import Link from "next/link";

export default function ProfileUpdatePage() {
    const { data: session, isPending } = authClient.useSession();
    const [name, setName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imgError, setImgError] = useState(false);
    const [updating, setUpdating] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || "");
            setImageUrl(session.user.image || "");
        }
    }, [session]);

    if (isPending) {
        return (
            <div className="min-h-[70vh] bg-[#f4f6f4] flex items-center justify-center p-4">
                <div className="w-full max-w-xl bg-white p-8 rounded-3xl animate-pulse h-64 border border-gray-100" />
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
            const cleanImage = imageUrl.trim();
            const { error } = await authClient.updateUser({
                name,
                image: cleanImage || undefined,
            });

            if (error) {
                toast.error(error.message || "তথ্য আপডেট করতে ব্যর্থ হয়েছে!");
            } else {
                toast.success("প্রোফাইল তথ্য সফলভাবে আপডেট করা হয়েছে!");
                router.push("/profile");
                router.refresh();
            }
        } catch {
            toast.error("কিছু ভুল হয়েছে! আবার চেষ্টা করুন।");
        } finally {
            setUpdating(false);
        }
    };

    const userInitial = (name || "U").charAt(0).toUpperCase();

    return (
        <div className="min-h-[85vh] bg-[#f4f6f4] py-10 px-4">
            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900">
                        আমার প্রোফাইল
                    </h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                        আপনার অ্যাকাউন্টের তথ্য এখানে আপডেট করুন।
                    </p>
                </div>

                {/* Avatar Preview */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-2xl bg-gray-100 text-gray-800 font-bold flex items-center justify-center text-3xl overflow-hidden border border-gray-200 shrink-0 relative">
                            {imageUrl && !imgError ? (
                                <Image
                                    src={imageUrl}
                                    alt={name || "User Avatar"}
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
                                {name || "ব্যবহারকারী"}
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {session.user.email}
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/profile"
                        className="flex items-center gap-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold px-4 py-2.5 rounded-xl transition"
                    >
                        বাতিল
                    </Link>
                </div>

                {/* Update Form */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-4">
                    <h3 className="text-lg font-bold text-gray-900">
                        তথ্য আপডেট করুন
                    </h3>

                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                নাম
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="নতুন নাম প্রবেশ করুন"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#058a47]"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                প্রোফাইল ছবির ইউআরএল (Profile Picture URL)
                            </label>
                            <input
                                type="url"
                                value={imageUrl}
                                onChange={(e) => {
                                    setImageUrl(e.target.value);
                                    setImgError(false);
                                }}
                                placeholder="https://example.com/photo.jpg"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#058a47]"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={updating}
                            className="w-full bg-[#058a47] hover:bg-[#04723a] text-white font-bold text-sm py-3.5 rounded-2xl transition duration-200 shadow-sm disabled:opacity-50"
                        >
                            {updating ? "আপডেট হচ্ছে..." : "আপডেট"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
