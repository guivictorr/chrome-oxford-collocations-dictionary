export function remapType(type: string) {
  return (
    {
      "ADJ.": "Adjective",
      "PREP.": "Preposition",
      "ADV.": "Adverb",
      PHRASES: "Phrases"
    }[type] ?? type
  )
}
