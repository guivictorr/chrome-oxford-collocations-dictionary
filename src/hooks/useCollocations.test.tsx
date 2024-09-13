import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"
import React from "react"
import { describe, expect, it } from "vitest"

import { useCollocations } from "./useCollocations"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
})
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe("useCollocations", () => {
  it("should parse online oxford collocations dictionary", async () => {
    const { result } = renderHook(() => useCollocations("view"), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.collocations.length).toBeGreaterThan(0)
    expect(result.current.collocations[0]).toMatchObject({
      type: expect.any(String),
      collocationGroup: expect.any(Array)
    })
  })
})
