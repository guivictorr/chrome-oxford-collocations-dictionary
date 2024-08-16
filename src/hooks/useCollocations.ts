import { parseHtml } from "@/lib/scrapper"
import { useQuery } from "@tanstack/react-query"

import { useDebounce } from "./useDebounce"

const URL = "https://www.freecollocation.com/search"

export function useCollocations(word: string) {
  const deferredQuery = useDebounce(word, 500)
  const { data, isLoading } = useQuery({
    queryKey: ["word", deferredQuery],
    queryFn: () =>
      fetch(`${URL}?word=${deferredQuery}`).then((res) => res.text()),
    select: parseHtml,
    staleTime: Infinity,
    enabled: !!deferredQuery
  })

  return { collocations: data, isLoading }
}
