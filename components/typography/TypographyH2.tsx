import { cn } from "@/lib/utils";

export function TypographyH2({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        `pb-2 text-3xl font-semibold tracking-tight transition-colors border-b scroll-m-20 first:mt-0`,
        className
      )}
    >
      {children}
    </h2>
  );
}
