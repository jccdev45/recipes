"use client"

import { useCallback, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"

type HeroProps = {
  type: "image" | "video"
  src?: string
  alt?: string
  videoSources?: string[]
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
}

export function Hero({
  type = "image",
  src,
  alt,
  videoSources = [],
  title,
  subtitle,
  ctaText,
  ctaLink,
}: HeroProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const handleVideoEnded = useCallback(() => {
    setIsTransitioning(true)
    const nextIndex = (currentVideoIndex + 1) % videoSources.length

    // Start playing the next video
    if (videoRefs.current[nextIndex]) {
      videoRefs.current[nextIndex]!.play()
    }

    // After transition duration, update current video and reset transition state
    setTimeout(() => {
      setCurrentVideoIndex(nextIndex)
      setIsTransitioning(false)
    }, 1000) // Duration of fade transition
  }, [currentVideoIndex, videoSources.length])

  const renderVideo = (index: number) => (
    <video
      ref={(el) => {
        videoRefs.current[index] = el
        if (el && index === currentVideoIndex) {
          el.play()
        }
      }}
      key={index}
      muted
      playsInline
      onEnded={index === currentVideoIndex ? handleVideoEnded : undefined}
      className="absolute inset-0 size-full object-cover object-center transition-opacity duration-1000"
      style={{
        opacity:
          index === currentVideoIndex
            ? isTransitioning
              ? 0
              : 1
            : isTransitioning &&
                index === (currentVideoIndex + 1) % videoSources.length
              ? 1
              : 0,
      }}
    >
      <source src={videoSources[index]} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  )

  return (
    <section className="relative h-[400px] overflow-hidden lg:rounded-lg">
      {type === "image" ? (
        <Image
          src={src!}
          alt={alt || ""}
          className="size-full object-cover object-bottom"
          fill
          priority
        />
      ) : (
        <>{videoSources.map((_, index) => renderVideo(index))}</>
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70">
        <div className="space-y-4 text-center text-background dark:text-foreground">
          <Typography variant="h1">{title}</Typography>
          <Typography variant="large">{subtitle}</Typography>
          <div className="isolation-auto">
            <Button variant="secondary" size="lg" asChild>
              <Link href={ctaLink}>{ctaText}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
