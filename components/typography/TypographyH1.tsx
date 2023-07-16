import { cn } from "@/lib/utils";

export function TypographyH1({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={cn(
        `text-4xl font-extrabold tracking-tight scroll-m-20 lg:text-5xl`,
        className
      )}
    >
      {children}
    </h1>
  );
}
