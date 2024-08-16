interface SearchProps {
  onSearchChange?: (word: string) => void
}

export function Search({ onSearchChange }: SearchProps) {
  return (
    <header>
      <input
        type="text"
        placeholder="Type to start searching"
        className="w-full bg-slate-50 border-b border-slate-200 p-3 text-sm outline-none"
        autoFocus
        onChange={(event) => {
          onSearchChange(event.currentTarget.value)
        }}
      />
    </header>
  )
}
