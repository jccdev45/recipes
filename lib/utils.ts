import { ClassValue, clsx, type } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Ingredient } from '@/types/supabase';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

let count = 0
    
export function genId() {
  count = (count + 1) % Number.MAX_VALUE

  return count.toString()
}

export function toFraction(decimal: number) {
  // Check if the decimal is a whole number
  if (Number.isInteger(decimal)) {
    return decimal.toString(); // Return the decimal as it is
  }

  // Convert decimal to string
  const decimalStr = decimal.toString();

  // Check if the decimal has a fractional part
  if (!decimalStr.includes('.')) {
    return decimalStr; // No fractional part, return the decimal as it is
  }

  // Get the number of decimal places
  const decimalPlaces = decimalStr.length - decimalStr.indexOf('.') - 1;

  // Calculate the denominator (10^decimalPlaces)
  const denominator = Math.pow(10, decimalPlaces);

  // Calculate the numerator (decimal * denominator)
  const numerator = decimal * denominator;

  // Find the greatest common divisor (gcd) between the numerator and denominator
  const gcd = findGCD(numerator, denominator);

  // Simplify the fraction by dividing both numerator and denominator by the gcd
  const simplifiedNumerator = numerator / gcd;
  const simplifiedDenominator = denominator / gcd;

  // Return the fraction as a string
  return `${simplifiedNumerator}/${simplifiedDenominator}`;
}

// Helper function to find the greatest common divisor (gcd) using Euclid's algorithm
function findGCD(a: number, b: number) {
  if (b === 0) {
    return a;
  }

  return findGCD(b, a % b);
}

export function toSlug(input: string): string {
  return input
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with dashes
    .replace(/^-+|-+$/g, '') // Remove leading/trailing dashes
    .trim(); // Remove extra whitespace
}

// Borrowed from @hero-page/hero-recipe-utils that doesn't have @types
// fuck making a .d.ts file, all my homies hate making .d.ts files
export function scaleIngredients(ingredients: Ingredient[], servings: number): Ingredient[] {
  if (servings <= 0) {
    throw new Error('Invalid number of servings');
  }

  return ingredients.map((ingredient) => {
    if (!ingredient.hasOwnProperty('amount') || ingredient.amount < 0) {
      throw new Error(`Invalid quantity for ingredient: ${ingredient.ingredient}`);
    }

    return {
      ...ingredient,
      amount: ingredient.amount * servings,
    };
  });
}
