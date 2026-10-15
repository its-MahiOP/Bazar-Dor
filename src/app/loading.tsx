// src/app/loading.tsx
import ProductSkeleton from "@/components/ProductSkeleton";

export default function Loading() {
    return (
        <div className="bg-[#f4f6f4] min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 space-y-8">
                <div className="h-48 bg-white rounded-3xl animate-pulse" />
                <div className="space-y-4">
                    <div className="h-6 w-40 bg-gray-200 rounded-md animate-pulse" />
                    <ProductSkeleton count={6} />
                </div>
            </div>
        </div>
    );
}
