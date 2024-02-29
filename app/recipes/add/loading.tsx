import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <>
      <div className="grid -translate-y-20 grid-cols-1 gap-y-4 px-4 lg:-translate-y-20 lg:grid-cols-5 lg:gap-0">
        <form className="order-last col-span-1 mx-auto grid w-full max-w-4xl grid-cols-1 gap-y-6 p-4 md:col-span-3 md:p-6 lg:ml-auto lg:w-5/6">
          <div className="col-span-1 grid grid-cols-1 lg:grid-cols-2">
            <div className="col-span-2 w-full space-y-2 lg:col-span-1">
              <label className="leading-none">
                <Skeleton className="w-[32px] max-w-full" />
              </label>
              <div className="flex h-9 w-full border border-border px-3 py-1 shadow-sm transition-colors file:border-0">
                <Skeleton className="w-[96px] max-w-full" />
              </div>
            </div>
            <div className="col-span-2 w-full space-y-2 lg:col-span-1">
              <label className="leading-none">
                <Skeleton className="w-[40px] max-w-full" />
              </label>
              <div className="flex h-9 w-full border border-input px-3 py-1 shadow-sm transition-colors file:border-0">
                <Skeleton className="w-[176px] max-w-full" />
              </div>
            </div>
          </div>
          <div className="col-span-1 my-2 h-1 w-full shrink-0 bg-border"></div>
          <div className="col-span-1 space-y-6">
            <div>
              <div className="flex items-center gap-y-4">
                <div className="grid w-full grid-cols-4 items-end gap-2 lg:grid-cols-8">
                  <div className="col-span-1 space-y-2 lg:col-span-1">
                    <label className="block leading-none">
                      <Skeleton className="w-[48px] max-w-full" />
                    </label>
                    <div className="col-span-1 flex h-9 w-full border border-border p-2 shadow-sm transition-colors file:border-0">
                      <Skeleton className="w-[24px] max-w-full" />
                    </div>
                  </div>
                  <div className="col-span-3 space-y-2 lg:col-span-2">
                    <label className="block leading-none">
                      <Skeleton className="w-[128px] max-w-full" />
                    </label>
                    <div className="[&amp;>span]:line-clamp-1 flex h-9 w-full items-center justify-between border border-input px-3 py-2 shadow-sm">
                      <span>
                        <Skeleton className="w-[160px] max-w-full" />
                      </span>
                      <Skeleton className="h-[15px] w-[15px]" />
                    </div>
                  </div>
                  <div className="col-span-3 space-y-2 lg:col-span-4">
                    <label className="block leading-none">
                      <Skeleton className="w-[80px] max-w-full" />
                    </label>
                    <div className="col-span-1 flex h-9 w-full border border-border p-2 shadow-sm transition-colors file:border-0">
                      <Skeleton className="w-[40px] max-w-full" />
                    </div>
                  </div>
                  <div className="col-span-1 inline-flex h-9 items-center justify-center px-4 py-2 shadow-sm shadow-primary/50 hover:translate-x-smX hover:translate-y-smY hover:shadow-none">
                    <Skeleton className="w-[48px] max-w-full" />
                  </div>
                </div>
              </div>
              <div className="mx-auto my-4 inline-flex h-9 items-center justify-center px-4 py-2 shadow-primary/50 hover:translate-x-baseX hover:translate-y-baseY hover:shadow-none">
                <Skeleton className="w-[112px] max-w-full" />
                <Skeleton className="h-[24px] w-[24px]" />
              </div>
            </div>
            <div className="my-2 h-1 w-full shrink-0 bg-border"></div>
            <div>
              <div className="flex items-center gap-y-4">
                <div className="grid w-full grid-cols-1 items-end lg:grid-cols-8 lg:gap-x-2">
                  <div className="col-span-3 space-y-2 lg:col-span-7">
                    <label className="block leading-none">
                      <Skeleton className="w-[96px] max-w-full" />
                    </label>
                    <div className="flex h-9 w-full border border-border p-2 shadow-sm transition-colors file:border-0">
                      <Skeleton className="w-[144px] max-w-full" />
                    </div>
                  </div>
                  <div className="col-span-1 ml-auto inline-flex h-9 w-1/4 items-center justify-center px-4 py-2 shadow-sm shadow-primary/50 hover:translate-x-smX hover:translate-y-smY hover:shadow-none lg:w-full">
                    <Skeleton className="w-[48px] max-w-full" />
                  </div>
                </div>
              </div>
              <div className="mx-auto my-4 inline-flex h-9 items-center justify-center px-4 py-2 shadow-primary/50 hover:translate-x-baseX hover:translate-y-baseY hover:shadow-none">
                <Skeleton className="w-[64px] max-w-full" />
                <Skeleton className="h-[24px] w-[24px]" />
              </div>
            </div>
            <div className="my-2 h-1 w-full shrink-0 bg-border"></div>
            <div>
              <div className="flex items-center gap-y-4">
                <div className="grid w-full grid-cols-1 items-end lg:w-2/3 lg:grid-cols-7 lg:gap-x-2">
                  <div className="col-span-6 space-y-2">
                    <label className="block leading-none">
                      <Skeleton className="w-[32px] max-w-full" />
                    </label>
                    <div className="mx-auto inline-flex h-9 w-full items-center justify-between border border-input px-4 py-2 shadow-sm shadow-primary/50 hover:translate-x-smX hover:translate-y-smY hover:shadow-none">
                      <Skeleton className="w-[104px] max-w-full" />
                      <Skeleton className="lucide-chevrons-up-down ml-2 h-[24px] w-[24px] shrink-0" />
                    </div>
                  </div>
                  <div className="col-span-1 ml-auto inline-flex h-9 w-1/4 items-center justify-center px-4 py-2 shadow-sm shadow-primary/50 hover:translate-x-smX hover:translate-y-smY hover:shadow-none lg:w-full">
                    <Skeleton className="w-[48px] max-w-full" />
                  </div>
                </div>
              </div>
              <div className="col-span-1 my-4 inline-flex h-9 items-center justify-center px-4 py-2 shadow-primary/50 hover:translate-x-baseX hover:translate-y-baseY hover:shadow-none">
                <Skeleton className="w-[56px] max-w-full" />
                <Skeleton className="h-[24px] w-[24px]" />
              </div>
            </div>
          </div>
          <div className="ml-auto inline-flex h-9 w-1/4 items-center justify-center px-4 py-2 shadow-primary/50 hover:translate-x-baseX hover:translate-y-baseY hover:shadow-none md:w-1/5">
            <Skeleton className="w-[48px] max-w-full" />
          </div>
        </form>
        <div className="col-span-1 md:col-span-2">
          <Skeleton className="mx-auto h-[300px] w-[300px] translate-x-0 md:w-2/3 lg:translate-x-8" />
        </div>
      </div>
    </>
  )
}
