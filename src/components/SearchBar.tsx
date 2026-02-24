import { useState, type FormEvent } from 'react'
import { Search } from 'lucide-react'

interface SearchBarProps {
  onSearch: (word: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const word = input.trim().toLowerCase()
    if (word) {
      onSearch(word)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Look up a word..."
        className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent
          placeholder:text-gray-400"
      />
    </form>
  )
}
