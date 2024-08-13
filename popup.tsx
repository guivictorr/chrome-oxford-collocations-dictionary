import {
  QueryClient,
  QueryClientProvider,
  useQuery
} from "@tanstack/react-query"

import { parseHtml, type Collocation } from "~scrapper"

import "./style.css"

import { useDeferredValue, useEffect, useState } from "react"

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
  const deferredQuery = useDeferredValue(query)
  const { data, isLoading } = useQuery({
    queryKey: ["word", deferredQuery],
    queryFn: () =>
      fetch(
        `https://www.freecollocation.com/search?word=${deferredQuery}`
      ).then((res) => res.text()),
    select: parseHtml,
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
    <div className="w-96 text-slate-800">
      <header>
        <input
          type="text"
          placeholder="Type to start searching"
          className="w-full border-b border-slate-200 p-3 text-sm outline-none focus:border-b-slate-400"
          onChange={(event) => {
            setQuery(event.currentTarget.value)
          }}
        />
      </header>
      {!isLoading ? (
        <>
          {!!data && (
            <main className="flex items-start">
              <ul className="p-1 h-52 w-2/5 border-r border-slate-200 overflow-auto shrink-0">
                {data.map((item) => (
                  <li key={item.type}>
                    <span className="text-slate-500 mb-1">{item.type}</span>
                    <ul>
                      {item.collocationGroup.map((group) => (
                        <li key={group.id}>
                          <button
                            data-selected={selectedGroup?.id === group.id}
                            className="flex justify-between items-center gap-1 px-2 py-1 hover:bg-slate-100 data-[selected='true']:bg-slate-100 rounded-md w-full"
                            type="button"
                            onLoad={() => {
                              setSelectedGroup(group)
                            }}
                            onClick={() => {
                              setSelectedGroup(group)
                            }}>
                            <span className="truncate text-start">
                              {group.type}
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
                    <p>Type - {selectedGroup.type}</p>
                    {selectedGroup.definition && (
                      <p>Definition - {selectedGroup.definition}</p>
                    )}
                  </div>
                  <div className="p-1">
                    <p>Collocations</p>
                    <ul className="flex gap-1 flex-wrap mt-1">
                      {selectedGroup.collocations.map((collocation, index) => (
                        <li
                          key={index}
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
        </>
      ) : (
        <p className="h-52 flex items-center justify-center">Loading...</p>
      )}
    </div>
  )
}

export default IndexPopup
