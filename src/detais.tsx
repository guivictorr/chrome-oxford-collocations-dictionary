import type { Collocation } from "./lib/scrapper"
import { remapType } from "./lib/utils"

interface DetailsProps {
  selectedGroup: Collocation
}

export function Details({ selectedGroup }: DetailsProps) {
  return (
    <section
      aria-label="Details"
      className="grow h-72 overflow-auto divide-y divide-slate-200">
      <div className="p-2">
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
      <div className="p-2">
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
  )
}
