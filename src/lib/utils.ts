import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// enable conditional tailwind styling to be much easier
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToAscii(inputStirng: string){
  const asciiString = inputStirng.replace(/[^\x00-\x7F]/g, "");
  return asciiString
}