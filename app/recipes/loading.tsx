import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <section className="grid grid-cols-1 gap-2 p-12 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton key={i} className="col-span-1 h-[356px] w-[368px]" />
      ))}
    </section>
  )
}
