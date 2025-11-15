import { ReactNode } from "react"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

import type { ComponentProps } from "react"

export type EmptyStateDisplayProps = ComponentProps<typeof Empty> & {
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  mediaVariant?: ComponentProps<typeof EmptyMedia>["variant"]
  children?: ReactNode
}

export function EmptyStateDisplay({
  icon,
  title,
  description,
  mediaVariant = "icon",
  children,
  className,
  ...props
}: EmptyStateDisplayProps) {
  return (
    <Empty className={className} {...props}>
      <EmptyHeader>
        {icon ? <EmptyMedia variant={mediaVariant}>{icon}</EmptyMedia> : null}
        <EmptyTitle>{title}</EmptyTitle>
        {description ? (
          <EmptyDescription>{description}</EmptyDescription>
        ) : null}
      </EmptyHeader>
      {children ? <EmptyContent>{children}</EmptyContent> : null}
    </Empty>
  )
}
