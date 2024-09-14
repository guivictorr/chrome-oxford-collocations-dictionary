import { describe, expect, it } from "vitest"

import { fireEvent, render, screen } from "./lib/tests/utils"
import IndexPopup from "./popup"

vi.mock("./hooks/useCollocations.ts", () => ({
  useCollocations: () => ({
    isLoading: false,
    isSuccess: true,
    collocations: [
      {
        type: "noun",
        collocationGroup: [
          {
            id: "id1",
            type: "ADJ.",
            collocations: ["collocation-item", "collocation-item"],
            definition: "definition"
          },
          {
            id: "id2",
            type: "QUANT.",
            collocations: ["collocation-quant"],
            definition: "definition"
          }
        ]
      }
    ]
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
})
