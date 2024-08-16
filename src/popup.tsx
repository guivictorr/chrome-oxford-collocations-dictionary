import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import "./style/style.css"

import { App } from "./app"

const queryClient = new QueryClient()

function IndexPopup() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  )
}

export default IndexPopup
