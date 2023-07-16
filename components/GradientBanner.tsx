import { cn } from '@/lib/utils';

export function GradientBanner() {
  const complementaryColors = [
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
    {
      color1: "from-violet-300 dark:from-violet-900",
      color2: "via-purple-300 dark:via-purple-900",
      color3: "to-fuchsia-300 dark:to-fuchsia-900",
    },
    {
      color1: "from-pink-300 dark:from-pink-900",
      color2: "via-rose-300 dark:via-rose-900",
      color3: "to-red-300 dark:to-red-900",
    },
    {
      color1: "from-slate-400 dark:from-slate-800",
      color2: "via-gray-400 dark:via-gray-800",
      color3: "to-zinc-400 dark:to-zinc-800",
    },
    {
      color1: "from-zinc-400 dark:from-zinc-800",
      color2: "via-neutral-400 dark:via-neutral-800",
      color3: "to-stone-400 dark:to-stone-800",
    },
  ];
  let index = Math.floor(Math.random() * complementaryColors.length);

  const color1 = complementaryColors[index].color1;
  const color2 = complementaryColors[index].color2;
  const color3 = complementaryColors[index].color3;

  let color = `${color1} ${color2} ${color3}`;
  return (
    <div className={cn(`w-screen h-32 md:h-52 bg-gradient-to-l`, color)}></div>
  );
}
