// src/components/ProductSkeleton.tsx
export default function ProductSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(count)].map((_, i) => (
                <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm animate-pulse flex flex-col justify-between h-37.5"
                >
                    {/* Top Row: Icon Skeleton + Title Skeleton */}
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-gray-200 shrink-0" />
                        <div className="space-y-2 grow">
                            <div className="h-4 bg-gray-200 rounded-md w-3/4" />
                            <div className="h-3 bg-gray-100 rounded-md w-1/2" />
                        </div>
                    </div>

                    {/* Bottom Row: Price Skeleton + Badge Skeleton */}
                    <div className="flex items-end justify-between pt-2">
                        <div className="space-y-1">
                            <div className="h-3 bg-gray-100 rounded-md w-16" />
                            <div className="h-5 bg-gray-200 rounded-md w-24" />
                        </div>
                        <div className="h-6 w-16 bg-gray-200 rounded-lg" />
                    </div>
                </div>
            ))}
        </div>
    );
}
