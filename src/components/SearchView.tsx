import { SearchBar } from './SearchBar'
import { DefinitionCard } from './DefinitionCard'
import { useDictionary } from '../hooks/useDictionary'
import { Loader2, AlertCircle } from 'lucide-react'

export function SearchView() {
  const { entry, loading, error, search } = useDictionary()

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold text-gray-900 mb-4">Language Buddy</h1>
      <SearchBar onSearch={search} />

      <div className="mt-4">
        {loading && (
          <div className="flex items-center justify-center py-12 text-gray-400">
            <Loader2 size={24} className="animate-spin" />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {entry && <DefinitionCard entry={entry} />}
      </div>
    </div>
  )
}
