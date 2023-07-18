import { cn } from "@/lib/utils";

export function TypographyH3({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        `text-2xl font-semibold tracking-tight scroll-m-20`,
        className
      )}
    >
      {children}
    </h3>
  );
}
