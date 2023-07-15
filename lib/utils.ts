import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Ingredient } from '@/types/supabase';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

export const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

let count = 0;

export function genId() {
  count = (count + 1) % Number.MAX_VALUE;

  return count.toString();
}

export function improperFractionToMixedFraction(
  improperFraction: string
): string {
  // Split the improper fraction into the numerator and denominator.
  var numerator, denominator;
  var parts = improperFraction.split("/");
  numerator = parts[0];
  denominator = parts[1];

  // Get the quotient of the numerator and denominator.
  var quotient = Math.floor(Number(numerator) / Number(denominator));

  // Get the remainder of the numerator and denominator.
  var remainder = Number(numerator) % Number(denominator);

  // If the remainder is 0, then the fraction is already a mixed fraction.
  if (remainder === 0) {
    return improperFraction;
  } else if (quotient === 0) {
    // If the quotient is 0, then the fraction is simply 1/denominator.
    return "1/" + denominator;
  } else {
    // Otherwise, the fraction is improper. Return the mixed fraction.
    return quotient + " " + "1/" + denominator;
  }
}

export function toSlug(input: string): string {
  return input
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with dashes
    .replace(/^-+|-+$/g, "") // Remove leading/trailing dashes
    .trim(); // Remove extra whitespace
}

// Borrowed (and modified) from @hero-page/hero-recipe-utils
// fuck making a .d.ts file, all my homies hate making .d.ts files
export function scaleIngredients(
  ingredients: Ingredient[],
  servings: number
): Ingredient[] {
  if (!servings || servings <= 0) {
    return ingredients;
  }

  return ingredients.map((ingredient) => {
    if (!ingredient.hasOwnProperty("amount") || ingredient.amount < 0) {
      throw new Error(
        `Invalid quantity for ingredient: ${ingredient.ingredient}`
      );
    }

    return {
      ...ingredient,
      amount: ingredient.amount * servings,
    };
  });
}

// Also borrowed (and modified) from @hero-page/hero-recipe-utils
export function cookTimeEstimator(ingredients: Ingredient[]) {
  const defaultCookTimes: { [name: string]: number } = {
    carrot: 1,
    potato: 2,
    onion: 1,
    garlic: 1,
    pasta: 10,
    rice: 15,
    chicken: 30,
    beef: 45,
    pork: 30,
    fish: 20,
    tofu: 20,
    vegetables: 5,
    fruit: 5,
    bread: 10,
    milk: 5,
    eggs: 3,
    cheese: 5,
    beans: 10,
    lentils: 15,
    yogurt: 5,
    nuts: 5,
    seeds: 5,
    butter: 5,
    oil: 5,
    spices: 1,
    herbs: 1,
  };

  let cookTime = 0;

  for (const ingredient of ingredients) {
    const ingredientName = ingredient.ingredient.toLowerCase();

    const matchedIngredient = Object.keys(
      defaultCookTimes
    ).find((defaultIngredient) => ingredientName.includes(defaultIngredient));

    if (matchedIngredient && ingredient.amount > 0) {
      cookTime += defaultCookTimes[matchedIngredient] * ingredient.amount;
    }
  }

  cookTime === 0 && `-`;

  const roundedCookTime = Math.ceil(cookTime);
  const minutes = roundedCookTime % 60;
  const hours = Math.floor(roundedCookTime / 60);

  const cookTimeStr = `${hours} hour(s) ${minutes} minute(s)`;
  return hours === 0 ? `${minutes} minutes` : cookTimeStr;
}

export function trimAvatarUrl(fullUrl: string) {
  const match = fullUrl.match(/public\/(.+)/);
  if (match) {
    return match[1];
  }
  return "";
}
