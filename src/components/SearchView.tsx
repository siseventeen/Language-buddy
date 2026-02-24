import { useState } from 'react'
import { SearchBar } from './SearchBar'

export function SearchView() {
  const [query, setQuery] = useState('')

  const handleSearch = (word: string) => {
    setQuery(word)
  }

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold text-gray-900 mb-4">Language Buddy</h1>
      <SearchBar onSearch={handleSearch} />
      {query && (
        <div className="mt-4 text-sm text-gray-500">
          Results for "<span className="font-medium text-gray-700">{query}</span>" will appear here.
        </div>
      )}
    </div>
  )
}
