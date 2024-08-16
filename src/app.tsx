import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"

import { Details } from "./detais"
import { useDebounce } from "./hooks/useDebounce"
import { parseHtml, type Collocation } from "./lib/scrapper"
import { remapType } from "./lib/utils"
import { Loading } from "./loading"
import { Search } from "./search"

export function App() {
  const [selectedGroup, setSelectedGroup] = useState<Collocation | null>(null)

  const [query, setQuery] = useState("")
  const deferredQuery = useDebounce(query, 500)
  const { data, isLoading } = useQuery({
    queryKey: ["word", deferredQuery],
    queryFn: () =>
      fetch(
        `https://www.freecollocation.com/search?word=${deferredQuery}`
      ).then((res) => res.text()),
    select: parseHtml,
    staleTime: Infinity,
    enabled: !!deferredQuery
  })

  useEffect(() => {
    if (data === undefined || (data && data.length <= 0)) {
      setSelectedGroup(null)
      return
    }
    setSelectedGroup(data[0].collocationGroup[0])
  }, [data])

  return (
    <div className="w-[420px] bg-slate-50 text-slate-800">
      <Search onSearchChange={setQuery} />
      {isLoading && <Loading />}
      {!!data && (
        <main className="flex items-start">
          <ul className="p-1 h-52 w-2/5 border-r border-slate-200 overflow-auto shrink-0">
            {data.map((item) => (
              <li key={item.type}>
                <span className="text-slate-500 block my-2">{item.type}</span>
                <ul className="space-y-1">
                  {item.collocationGroup.map((group) => (
                    <li key={group.id}>
                      <button
                        data-selected={selectedGroup?.id === group.id}
                        className="flex justify-between items-center gap-1 px-2 py-1 hover:bg-slate-200 data-[selected='true']:bg-slate-200 rounded-md w-full"
                        type="button"
                        onClick={() => {
                          setSelectedGroup(group)
                        }}>
                        <span className="truncate text-start">
                          {remapType(group.type)}
                        </span>
                        <span className="bg-slate-300 font-medium rounded-md text-xs px-1.5 py-0.5">
                          {group.collocations.length}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          {!!selectedGroup && !!data && (
            <Details selectedGroup={selectedGroup} />
          )}
        </main>
      )}
    </div>
  )
}
