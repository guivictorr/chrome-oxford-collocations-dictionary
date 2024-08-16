import { useEffect, useState } from "react"

import { Details } from "./detais"
import { useCollocations } from "./hooks/useCollocations"
import { type Collocation } from "./lib/scrapper"
import { remapType } from "./lib/utils"
import { Loading } from "./loading"
import { Search } from "./search"

export function App() {
  const [selectedGroup, setSelectedGroup] = useState<Collocation | null>(null)

  const [query, setQuery] = useState("")
  const { collocations, isLoading } = useCollocations(query)

  useEffect(() => {
    if (
      collocations === undefined ||
      (collocations && collocations.length <= 0)
    ) {
      setSelectedGroup(null)
      return
    }
    setSelectedGroup(collocations[0].collocationGroup[0])
  }, [collocations])

  return (
    <div className="w-[420px] bg-slate-50 text-slate-800">
      <Search onSearchChange={setQuery} />
      {isLoading && <Loading />}
      {!!collocations && (
        <main className="flex items-start">
          <ul className="p-1 h-52 w-2/5 border-r border-slate-200 overflow-auto shrink-0">
            {collocations.map((item) => (
              <li key={item.type}>
                <span className="text-slate-500 block my-2">{item.type}</span>
                <ul className="space-y-1">
                  {item.collocationGroup.map((group) => (
                    <li key={group.id}>
                      <button
                        data-selected={selectedGroup?.id === group.id}
                        className="flex justify-between items-center gap-1 px-2 py-1 hover:bg-slate-200 collocations-[selected='true']:bg-slate-200 rounded-md w-full"
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
          {!!selectedGroup && !!collocations && (
            <Details selectedGroup={selectedGroup} />
          )}
        </main>
      )}
    </div>
  )
}
