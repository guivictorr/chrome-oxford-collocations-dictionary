import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, type RenderOptions } from "@testing-library/react"
import React from "react"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
})
export const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

const customRender = (ui: React.ReactNode, options?: RenderOptions) =>
  render(ui, { wrapper, ...options })

// re-export everything
export * from "@testing-library/react"

// override render method
export { customRender as render }
