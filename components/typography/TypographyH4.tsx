import { cn } from "@/lib/utils";

export function TypographyH4({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h4
      className={cn(
        `text-xl font-semibold tracking-tight scroll-m-20`,
        className
      )}
    >
      {children}
    </h4>
  );
}
