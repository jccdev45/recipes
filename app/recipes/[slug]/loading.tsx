import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full h-full">
      <div className="flex flex-col items-center justify-between lg:flex-row gap-y-4 lg:justify-center">
        <div className="w-5/6 h-full mx-auto rounded-lg lg:w-1/3">
          <Skeleton className="w-[316px] h-[253px] mx-auto" />
        </div>
        <div className="flex-col items-center w-full mx-auto gap-y-4 lg:w-1/2">
          <Skeleton className="h-6 mx-auto w-52" />
          <Skeleton className="h-12 mx-auto w-52" />
          <div className="flex items-center justify-center gap-x-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="w-16 h-6" />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 mt-8 h-96 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div className="w-full h-full col-span-full lg:col-span-1">
            <Skeleton key={index} className="w-5/6 h-full mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
