import { Badge } from "@/components/badge"
import { Input } from "@/components/input"
import { Label } from "@/components/label"
import { RadioGroup, RadioGroupItem } from "@/components/radio-group"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/resizable"
import { ScrollArea } from "@/components/scroll-area"
import { Separator } from "@/components/separator"
import { cn, remapType } from "@/lib/utils"
import { LoaderIcon } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "./components/tooltip"
import { useCollocations } from "./hooks/useCollocations"
import type { ScrapperItem } from "./lib/scrapper"

export function App() {
  const [selectedItem, setSelectedItem] = useState("")
  const [query, setQuery] = useState("")
  const { data, isLoading } = useCollocations(query)

  const selectedGroup = useMemo(() => {
    return data.reduce((acc, item) => {
      item.items.forEach((currentGroup) => {
        if (currentGroup.id !== selectedItem) return
        acc = currentGroup
      })
      return acc
    }, {} as ScrapperItem)
  }, [selectedItem])

  useEffect(() => {
    if (!data[0]?.items[0]) return
    setSelectedItem(data[0].items[0].id)
  }, [data])

  return (
    <div className="w-[620px] h-80 p-3 bg-background">
      <Input
        autoFocus
        placeholder="Type to start searching"
        value={query}
        onChange={(event) => {
          setQuery(event.currentTarget.value)
        }}
      />

      {isLoading && (
        <div className="flex flex-col gap-2 animate-pulse items-center justify-center h-full w-full">
          <LoaderIcon className="animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Loading</span>
        </div>
      )}

      {!isLoading && (
        <ResizablePanelGroup
          direction="horizontal"
          className="flex gap-2 h-full w-full items-center justify-center py-3">
          <ResizablePanel className="h-full" defaultSize={25}>
            <ScrollArea className="pr-4 pl-2 py-4 border rounded-md h-full">
              {data.length === 0 && (
                <p className="text-muted-foreground">No result</p>
              )}
              {data.length > 0 && (
                <RadioGroup
                  onValueChange={setSelectedItem}
                  defaultValue={data[0].items[0].id}>
                  {data.map((item, groupIndex) => (
                    <div key={item.id}>
                      <p className="text-muted-foreground mb-1">{item.title}</p>
                      <ul className="space-y-2">
                        {item.items.map((group, index) => (
                          <li className="flex relative" key={group.id}>
                            <RadioGroupItem
                              autoFocus={index === 0 && groupIndex === 0}
                              className="peer absolute opacity-0"
                              value={group.id}
                              id={group.id}
                            />
                            <Label
                              aria-label={`${group.totalCollocations} collocations as ${remapType(group.title)}`}
                              className="flex justify-between items-center peer-aria-checked:bg-muted w-full px-3 py-2 rounded-md"
                              htmlFor={group.id}>
                              {remapType(group.title)}
                              <span className="rounded-md bg-background px-2 py-1">
                                {group.totalCollocations}
                              </span>
                            </Label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </ScrollArea>
          </ResizablePanel>
          <ResizableHandle className="opacity-0 h-full" />
          <ResizablePanel className="h-full" defaultSize={50}>
            <ScrollArea className="p-3 border rounded-md h-full">
              {data.length === 0 && (
                <p className="text-muted-foreground">No result</p>
              )}
              {data.length > 0 && !!selectedItem && (
                <div>
                  <div className="flex flex-col gap-1">
                    <span>Type - {remapType(selectedGroup.title)}</span>
                    {!!selectedGroup.definition && (
                      <span>Definition - {selectedGroup?.definition}</span>
                    )}
                  </div>

                  <Separator className="my-3" />

                  <div className="flex flex-wrap grow-0 overflow-auto">
                    <TooltipProvider>
                      {selectedGroup?.collocations?.map((collocation) => (
                        <Tooltip delayDuration={300} key={collocation.id}>
                          <TooltipTrigger
                            className={cn(
                              "group flex flex-wrap rounded-md gap-1 p-1 m-1 ",
                              {
                                "[&:hover_div]:opacity-30 bg-muted":
                                  !!collocation.example
                              }
                            )}>
                            {collocation.words.map((word, index) => (
                              <Badge
                                key={index}
                                className={cn("transition", {
                                  "group-hover:opacity-100 group-hover:scale-105":
                                    collocation.example.includes(word),
                                  "group-hover:scale-95":
                                    !collocation.example.includes(word) &&
                                    !!collocation.example
                                })}>
                                {word
                                  .replace(/~/gi, query)
                                  .replace(/sth/gi, "something")}
                              </Badge>
                            ))}
                          </TooltipTrigger>
                          {!!collocation.example && (
                            <TooltipContent className="break-all break-words max-w-[384px]">
                              {collocation.example}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      ))}
                    </TooltipProvider>
                  </div>
                </div>
              )}
            </ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  )
}
