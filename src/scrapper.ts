export interface Collocation {
  id: string
  type: string
  collocations: string[]
  definition?: string
}

export function parseHtml(data: string) {
  const result: { type: string; collocationGroup: Collocation[] }[] = []

  // Parse the HTML string using DOMParser
  const parser = new DOMParser()
  const doc = parser.parseFromString(data, "text/html")

  // Extract the items with class "item" inside the div with id "leftnav"
  const items = doc.querySelectorAll("#leftnav .item")

  items.forEach((item) => {
    // Extract the type from the first "p" of the item which contains an "i" element
    const type = item.querySelector("p i")?.textContent?.trim() || ""

    // Initialize the collocations array for the current item
    const collocationsArray: Collocation[] = []
    // Initialize a variable to hold the current definition
    let currentDefinition = ""

    // Loop through each paragraph inside the item
    item.querySelectorAll("p").forEach((p) => {
      // Check if the paragraph contains a "tt" element for definition
      if (p.querySelector("tt")) {
        currentDefinition = p.querySelector("tt")?.textContent?.trim() || ""
      }

      // Check if the first child of the paragraph is a "u" element
      const firstChild = p.firstElementChild
      if (firstChild && firstChild.tagName.toLowerCase() === "u") {
        // Extract the text content of the "u" element
        const collocationType = firstChild.textContent?.trim() || ""

        // Extract the text content of all "b" elements within the same paragraph
        const collocations = Array.from(p.querySelectorAll("b")).map(
          (b) => b.textContent?.trim() || ""
        )

        // Split the collocations text content by comma and pipe, then flatten the array and filter out empty strings
        const flatCollocations = collocations
          .flatMap((c) =>
            c.split(",").flatMap((s) => s.split("|").map((str) => str.trim()))
          )
          .filter((str) => str.length > 0)

        // Add the extracted data to the collocations array
        collocationsArray.push({
          id: window.crypto.randomUUID(),
          type: collocationType,
          definition: currentDefinition,
          collocations: flatCollocations
        })
      }
    })

    // Add the extracted item with its collocations to the result array
    result.push({ type, collocationGroup: collocationsArray })
  })

  return result
}
