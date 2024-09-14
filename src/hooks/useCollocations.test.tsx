import { wrapper } from "@/lib/tests/utils"
import { renderHook, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useCollocations } from "./useCollocations"

describe("useCollocations", () => {
  it.todo("should parse online oxford collocations dictionary", async () => {
    const { result } = renderHook(() => useCollocations("view"), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data.length).toBeGreaterThan(0)
    expect(result.current.data[0]).toMatchObject({
      type: expect.any(String),
      collocationGroup: expect.any(Array)
    })
  })
})
