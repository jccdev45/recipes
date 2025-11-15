"use client"

import { useCallback, useEffect, useRef, useState } from "react"
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
  const [isPaused, setIsPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(event.matches)
      if (event.matches) {
        setIsPaused(true)
      }
    }

    handleChange(mediaQuery)

    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return

      if (isPaused) {
        video.pause()
        return
      }

      if (index === currentVideoIndex) {
        void video.play().catch(() => undefined)
      } else {
        video.pause()
        video.currentTime = 0
      }
    })
  }, [isPaused, currentVideoIndex])

  const handleVideoEnded = useCallback(() => {
    if (isPaused) {
      return
    }

    setIsTransitioning(true)
    const nextIndex = (currentVideoIndex + 1) % videoSources.length

    // Start playing the next video
    if (videoRefs.current[nextIndex]) {
      void videoRefs.current[nextIndex]!.play()
    }

    // After transition duration, update current video and reset transition state
    setTimeout(() => {
      setCurrentVideoIndex(nextIndex)
      setIsTransitioning(false)
    }, 1000) // Duration of fade transition
  }, [currentVideoIndex, videoSources.length, isPaused])

  const togglePlayback = () => {
    setIsPaused((previous) => !previous)
  }

  const renderVideo = (index: number) => (
    <video
      ref={(el) => {
        videoRefs.current[index] = el
        if (el && index === currentVideoIndex && !isPaused) {
          void el.play().catch(() => undefined)
        }
      }}
      key={index}
      muted
      playsInline
      aria-hidden="true"
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
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 dark:bg-black/70">
        <div className="text-background dark:text-foreground space-y-4 text-center">
          <Typography variant="h1">{title}</Typography>
          <Typography variant="large">{subtitle}</Typography>
          <div className="isolation-auto">
            <Button variant="secondary" size="lg" asChild>
              <Link href={ctaLink}>{ctaText}</Link>
            </Button>
          </div>
          {type === "video" && videoSources.length > 0 ? (
            <div className="flex justify-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={togglePlayback}
                aria-pressed={!isPaused}
                aria-label={
                  isPaused ? "Play background video" : "Pause background video"
                }
              >
                {isPaused ? "Play background video" : "Pause background video"}
              </Button>
            </div>
          ) : null}
          {prefersReducedMotion && type === "video" ? (
            <p className="text-background/90 dark:text-foreground/90 text-xs">
              Motion reduced per your system preference.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
