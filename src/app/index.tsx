import { Badge } from "@/components/badge"
import { Input } from "@/components/input"
import { Label } from "@/components/label"
import { RadioGroup, RadioGroupItem } from "@/components/radio-group"
import { ScrollArea } from "@/components/scroll-area"
import { Separator } from "@/components/separator"
import type { Collocation } from "@/lib/scrapper"
import { remapType } from "@/lib/utils"
import { LoaderIcon } from "lucide-react"
import { useEffect, useState } from "react"

import { useCollocations } from "../hooks/useCollocations"

export function App() {
  const [selectedItem, setSelectedItem] = useState("")
  const [query, setQuery] = useState("")
  const { collocations, isLoading } = useCollocations(query)

  const selectedGroup = collocations.reduce((acc, item) => {
    item.collocationGroup.forEach((currentGroup) => {
      if (currentGroup.id !== selectedItem) return
      acc = currentGroup
    })
    return acc
  }, {} as Collocation)

  useEffect(() => {
    if (!collocations[0]?.collocationGroup[0]) return
    setSelectedItem(collocations[0].collocationGroup[0].id)
  }, [collocations])

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
        <div className="flex gap-2 h-full w-full items-center justify-center py-3">
          <ScrollArea className="pr-4 pl-2 py-4 border rounded-md w-1/2 h-full">
            {collocations.length === 0 && (
              <p className="text-muted-foreground">No result</p>
            )}
            {collocations.length > 0 && (
              <RadioGroup
                onValueChange={setSelectedItem}
                defaultValue={collocations[0].collocationGroup[0].id}>
                {collocations.map((group, groupIndex) => (
                  <div key={group.type}>
                    <p className="text-muted-foreground mb-1">{group.type}</p>
                    <ul className="space-y-2" key={group.type}>
                      {group.collocationGroup.map((group, index) => (
                        <li className="flex relative" key={group.id}>
                          <RadioGroupItem
                            autoFocus={index === 0 && groupIndex === 0}
                            className="peer absolute opacity-0"
                            value={group.id}
                            id={group.id}
                          />
                          <Label
                            className="flex justify-between items-center peer-aria-checked:bg-muted w-full px-3 py-2 rounded-md"
                            htmlFor={group.id}>
                            {remapType(group.type)}
                            <span className="rounded-md bg-background px-2 py-1">
                              {group.collocations.length}
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
          <ScrollArea className="p-3 border rounded-md w-full h-full">
            {collocations.length === 0 && (
              <p className="text-muted-foreground">No result</p>
            )}
            {collocations.length > 0 && !!selectedItem && (
              <div>
                <div className="flex flex-col gap-1">
                  <span>Type - {remapType(selectedGroup.type)}</span>
                  {!!selectedGroup.definition && (
                    <span>Definition - {selectedGroup?.definition}</span>
                  )}
                </div>

                <Separator className="my-3" />

                <div className="flex flex-wrap grow-0 gap-1 overflow-autuuo">
                  {selectedGroup?.collocations?.map((collocation) => (
                    <Badge key={collocation}>{collocation}</Badge>
                  ))}
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
