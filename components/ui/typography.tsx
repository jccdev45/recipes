import { cn } from "@/lib/utils"

export function TypographyH1({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
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
  )
}
export function TypographyH2({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
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
  )
}
export function TypographyH3({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
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
  )
}
export function TypographyH4({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
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
  )
}
export function TypographyLarge({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn(`text-lg font-semibold`, className)}>{children}</div>
  )
}
export function TypographyLead({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p className={cn(`text-xl text-muted-foreground`, className)}>{children}</p>
  )
}
export function TypographyList({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <ul className={cn(`my-6 md:ml-6 list-disc [&>li]:mt-2`, className)}>
      {children}
    </ul>
  )
}
export function TypographyMuted({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
  )
}
export function TypographyP({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p className={cn(`leading-7 [&:not(:first-child)]:mt-6`, className)}>
      {children}
    </p>
  )
}
export function TypographyBlockquote({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <blockquote className={cn(`pl-6 mt-6 italic border-l-2`, className)}>
      {children}
    </blockquote>
  )
}
export function TypographySmall({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <small className={cn("text-sm font-medium leading-none", className)}>
      {children}
    </small>
  )
}
