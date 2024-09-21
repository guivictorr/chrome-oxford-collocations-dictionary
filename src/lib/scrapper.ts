export interface Collocation {
  words: string[]
  id: string
  example: string
}

export interface ScrapperItem {
  title: string
  id: string
  definition?: string
  totalCollocations: number
  collocations: Collocation[]
}

export interface ScrapperResult {
  title: string
  id: string
  items: ScrapperItem[]
}

const uuid = () => window.crypto.randomUUID()
function extractSingleItalic(text: string) {
  const match = text.match(/<i>(.*?)<\/i>/)
  return match ? match[1].trim() : ""
}
function stripHtmlAndItalics(text: string) {
  return text.replace(/<i>.*?<\/i>|<[^>]+>/g, "")
}

export function scrapper(data: string): ScrapperResult[] {
  const result: ScrapperResult[] = []

  // Parse the HTML string using DOMParser
  const parser = new DOMParser()
  const doc = parser.parseFromString(data, "text/html")

  // Extract the items with class "item" inside the div with id "leftnav"
  const items = doc.querySelectorAll(".item")

  items.forEach((item) => {
    // Extract the type from the first "p" of the item which contains an "i" element
    const title = item.querySelector("p.word i")?.textContent?.trim() || ""

    // Initialize the collocations array for the current item
    const items: ScrapperItem[] = []
    // Initialize a variable to hold the current definition
    let currentDefinition = ""

    // Loop through each paragraph inside the item
    item.querySelectorAll("p:not(.item)").forEach((p) => {
      // Check if the paragraph contains a "tt" element for definition
      if (p.querySelector("tt")) {
        currentDefinition = p.querySelector("tt")?.textContent?.trim() || ""
      }

      // Check if the first child of the paragraph is a "u" element
      const firstChild = p.firstElementChild
      if (firstChild && firstChild.tagName.toLowerCase() === "u") {
        // Extract the text content of the "u" element
        const itemTitle = firstChild.textContent?.trim() || ""

        const wordsToFilter = ["etc."]
        const collocations = p.innerHTML
          .replace(/<u>.*?<\/u>/gi, "")
          .split("|")
          .map((item) => item.trim())
          .map((item) => {
            return {
              example: extractSingleItalic(item),
              words: stripHtmlAndItalics(item)
                .split(",")
                .map((item) => item.trim())
                .filter((word) => !wordsToFilter.includes(word)),
              id: uuid()
            }
          })

        const totalCollocations = collocations.reduce((total, collocation) => {
          total += collocation.words.length
          return total
        }, 0)

        // Add the extracted data to the collocations array
        items.push({
          id: uuid(),
          title: itemTitle,
          definition: currentDefinition,
          totalCollocations,
          collocations
        })
      }
    })

    // Add the extracted item with its collocations to the result array
    result.push({ title, id: uuid(), items })
  })

  return result
}
