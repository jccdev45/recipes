import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="h-full w-full">
      <div className="flex flex-col items-center justify-between gap-y-4 lg:flex-row lg:justify-center">
        <div className="mx-auto h-full w-5/6 rounded-lg lg:w-1/3">
          <Skeleton className="mx-auto h-[253px] w-[316px]" />
        </div>
        <div className="mx-auto w-full flex-col items-center gap-y-4 lg:w-1/2">
          <Skeleton className="mx-auto h-6 w-52" />
          <Skeleton className="mx-auto h-12 w-52" />
          <div className="flex items-center justify-center gap-x-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-6 w-16" />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid h-96 grid-cols-1 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="col-span-full h-full w-full lg:col-span-1"
          >
            <Skeleton className="mx-auto h-full w-5/6" />
          </div>
        ))}
      </div>
    </div>
  )
}
