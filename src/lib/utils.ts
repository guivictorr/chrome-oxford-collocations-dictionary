import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function remapType(type: string) {
  return (
    {
      "ADJ.": "Adjective",
      "PREP.": "Preposition",
      "ADV.": "Adverb",
      PHRASES: "Phrases",
      "QUANT.": "Quantity"
    }[type] ?? type
  )
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
