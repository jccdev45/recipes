import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="grid grid-cols-1 gap-2 p-12 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton key={i} className="w-[368px] h-[356px] col-span-1" />
        // <div className="col-span-1" key={i}>
        //   <Skeleton className="w-[325px] h-[215px]" />
        //   <Skeleton className="w-12 h-5"></Skeleton>
        //   <Skeleton className="h-5 w-[182px]"></Skeleton>
        //   <Skeleton className="w-24 h-5"></Skeleton>
        // </div>
      ))}
    </section>
  );
}
