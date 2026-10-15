export default function Footer() {
    return (
        <footer className="w-full bg-white border-t border-gray-200/80 mt-auto py-6">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs md:text-sm text-gray-600 font-medium">
                {/* Left Side */}
                <div>
                    <span>বাজার দর</span> —{" "}
                    <span>প্রয়োজনীয় পণ্যের দাম এক নজরে।</span>
                </div>

                {/* Right Side */}
                <div className="text-gray-500 italic text-center md:text-right">
                    “সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত
                    হয়।”
                </div>
            </div>
        </footer>
    );
}
