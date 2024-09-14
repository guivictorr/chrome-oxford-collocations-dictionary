import { scrapper } from "@/lib/scrapper"
import { useQuery } from "@tanstack/react-query"

import { useDebounce } from "./useDebounce"

const URL = "https://m.freecollocation.com/browse"

export function useCollocations(word: string) {
  const deferredQuery = useDebounce(word, 700)
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["word", deferredQuery],
    queryFn: () => fetch(`${URL}/${deferredQuery}`).then((res) => res.text()),
    select: scrapper,
    staleTime: Infinity,
    enabled: !!deferredQuery
  })

  return { data: data ?? [], isLoading, isSuccess }
}
