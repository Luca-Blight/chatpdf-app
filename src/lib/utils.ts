import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// enable conditional tailwind styling to be much easier
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToAscii(inputString: string){
  const asciiString = inputString.replace(/[^\x00-\x7F]/g, "").replace(/[^A-Za-z0-9_-]/g, '_');
  return asciiString
}