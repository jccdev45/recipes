import { cn } from "@/lib/utils"
import { TypographyH2 } from "@/components/ui/typography"

export function GradientBanner({ text }: { text?: string }) {
  const complementaryColors = {
    // {
    //   color1: "from-red-300 dark:from-red-900",
    //   color2: "via-orange-300 dark:via-orange-900",
    //   color3: "to-amber-300 dark:to-amber-900",
    // },
    // {
    //   color1: "from-yellow-300 dark:from-yellow-900",
    //   color2: "via-lime-300 dark:via-lime-900",
    //   color3: "to-green-300 dark:to-green-900",
    // },
    // {
    //   color1: "from-emerald-300 dark:from-emerald-900",
    //   color2: "via-teal-300 dark:via-teal-900",
    //   color3: "to-cyan-300 dark:to-cyan-900",
    // },
    // {
    //   color1: "from-sky-300 dark:from-sky-900",
    //   color2: "via-blue-300 dark:via-blue-900",
    //   color3: "to-indigo-300 dark:to-indigo-900",
    // },
    // {
    //   color1: "from-violet-300 dark:from-violet-900",
    //   color2: "via-purple-300 dark:via-purple-900",
    //   color3: "to-fuchsia-300 dark:to-fuchsia-900",
    // },
    // {
    // },
    // {
    //   light: {
    //     color1: "from-slate-400 dark:from-slate-800",
    //     color2: "via-gray-400 dark:via-gray-800",
    //     color3: "to-zinc-400 dark:to-zinc-800",
    //   },
    // },
    // {
    // }
  }

  const light = {
    color1: "from-sky-200 dark:from-sky-950",
    color2: "via-blue-200 dark:via-blue-950",
    color3: "to-indigo-200 dark:to-indigo-950",

    color4: "from-pink-500 dark:from-pink-700",
    color5: "via-rose-500 dark:via-rose-700",
    color6: "to-red-500 dark:to-red-700",

    // color1: "from-violet-300 dark:from-violet-900",
    // color2: "via-purple-300 dark:via-purple-900",
    // color3: "to-fuchsia-300 dark:to-fuchsia-900",
  }

  const dark = {
    color1: "from-zinc-400 dark:from-zinc-800",
    color2: "via-neutral-400 dark:via-neutral-800",
    color3: "to-stone-400 dark:to-stone-800",

    // color1: "from-slate-400 dark:from-slate-800",
    // color2: "via-gray-400 dark:via-gray-800",
    // color3: "to-zinc-400 dark:to-zinc-800",
  }

  const colorLight1 = light.color1
  const colorLight2 = light.color2
  const colorLight3 = light.color3
  const colorLight = `${colorLight1} ${colorLight2} ${colorLight3}`
  // const colorLight = `from-[#EF0000] from-10% via-black/10 via-20% to-[#004EF1] dark:via-white dark:to-[#004EF1]`

  const colorDark1 = dark.color1
  const colorDark2 = dark.color2
  const colorDark3 = dark.color3
  const colorDark = `${colorDark1} ${colorDark2} ${colorDark3}`

  const colorText = `${light.color4} ${light.color5} ${light.color6}`

  return (
    <div
      className={cn(
        `grid h-32 max-h-[8rem] w-full place-items-center rounded-sm bg-gradient-to-r md:h-52 md:max-h-[13rem]`,
        // colorLight
        `from-primary to-primary/90`
      )}
    >
      {text && <TypographyH2>{text}</TypographyH2>}
    </div>
  )
}
