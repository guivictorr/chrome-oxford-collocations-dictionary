import { describe, expect, it, vi } from "vitest"

import type { ScrapperResult } from "./lib/scrapper"
import { fireEvent, render, screen } from "./lib/tests/utils"
import IndexPopup from "./popup"

vi.mock("./hooks/useCollocations.ts", () => ({
  useCollocations: () => ({
    isLoading: false,
    isSuccess: true,
    data: [
      {
        id: "id1",
        title: "noun",
        items: [
          {
            title: "ADJ.",
            id: "id2",
            definition: "definition",
            totalCollocations: 2,
            collocations: [
              {
                id: "id3",
                example: "example",
                words: ["collocation-item", "collocation-item"]
              }
            ]
          },
          {
            title: "QUANT.",
            id: "id4",
            definition: "definition",
            totalCollocations: 1,
            collocations: [
              {
                id: "id5",
                example: "example",
                words: ["collocation-quant"]
              }
            ]
          }
        ]
      }
    ] satisfies ScrapperResult[]
  })
}))

describe("App", () => {
  it("should not duplicate collocations badges when the selection change", () => {
    render(<IndexPopup />)

    const option1 = screen.getByRole("radio", { name: /adjective/i })
    const option2 = screen.getByRole("radio", { name: /quantity/i })
    fireEvent.click(option2)
    fireEvent.click(option1)

    expect(option1).toBeChecked()

    expect(screen.getAllByText("collocation-item").length).toEqual(2)
  })
  it("should count the collocations correctly", () => {
    render(<IndexPopup />)
    expect(
      screen.getByRole("radio", { name: /1 collocations as quantity/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("radio", { name: /2 collocations as adjective/i })
    ).toBeInTheDocument()
  })
})
