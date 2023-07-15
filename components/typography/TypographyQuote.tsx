import { cn } from '@/lib/utils';

export function TypographyBlockquote({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <blockquote className={cn(`pl-6 mt-6 italic border-l-2`, className)}>
      {children}
    </blockquote>
  );
}
