import { Skeleton } from '@/components/ui/skeleton';

interface LoadingWrapperProps {
    isLoading: boolean;
    children: React.ReactNode;
    count?: number;
}

export function LoadingWrapper({ isLoading, children, count = 3 }: LoadingWrapperProps) {
    if (isLoading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-slate-100 h-[74px]">
                        <div className="flex items-center gap-3 w-full max-w-[80%]">
                            <Skeleton className="h-5 w-5 rounded-sm shrink-0" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                        <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                ))}
            </div>
        );
    }

    return <>{children}</>;
}
