import {
  QueryClient,
  QueryClientProvider,
  useQuery
} from "@tanstack/react-query"
import { useEffect, useState } from "react"

import "./style/style.css"

import React from "react"

import { useDebounce } from "./hooks/useDebounce"
import { parseHtml, type Collocation } from "./scrapper"
import { remapType } from "./utils"

const queryClient = new QueryClient()

function IndexPopup() {
  return (
    <QueryClientProvider client={queryClient}>
      <Content />
    </QueryClientProvider>
  )
}

function Content() {
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
      <header>
        <input
          type="text"
          placeholder="Type to start searching"
          data-loading={isLoading}
          className="w-full bg-slate-50 border-b border-slate-200 p-3 text-sm outline-none data-[loading='true']:animate-pulse"
          autoFocus
          onChange={(event) => {
            setQuery(event.currentTarget.value)
          }}
        />
      </header>
      {isLoading && (
        <p className="h-52 flex items-center justify-center">Loading...</p>
      )}
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
            <section
              aria-label="Details"
              className="grow h-52 overflow-auto divide-y divide-slate-200">
              <div className="p-1">
                <p>
                  <span className="font-medium">Type</span> -{" "}
                  {remapType(selectedGroup.type)}
                </p>
                {selectedGroup.definition && (
                  <p>
                    <span className="font-medium">Definition</span> -{" "}
                    {selectedGroup.definition}
                  </p>
                )}
              </div>
              <div className="p-1">
                <p className="font-medium">Collocations</p>
                <ul className="flex gap-1 flex-wrap mt-1">
                  {selectedGroup.collocations.map((collocation) => (
                    <li
                      key={collocation}
                      className="px-1.5 py-0.5 bg-slate-500 text-slate-200 rounded-md">
                      {collocation}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}
        </main>
      )}
    </div>
  )
}

export default IndexPopup
