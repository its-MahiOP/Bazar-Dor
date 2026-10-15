import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-[70vh] bg-[#f4f6f4] flex flex-col items-center justify-center p-6 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">৪০৪</h1>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
                পেজটি পাওয়া যায়নি
            </h2>
            <p className="text-xs md:text-sm text-gray-500 max-w-md mb-6">
                আপনি যে লিংকটি অন্বেষণ করছেন তা সরিয়ে ফেলা হয়েছে অথবা লিংকটির
                ইউআরএল সঠিক নয়।
            </p>
            <Link
                href="/"
                className="bg-[#058a47] hover:bg-[#04723a] text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-sm transition-colors"
            >
                হোম পেজে ফিরে যান
            </Link>
        </div>
    );
}
