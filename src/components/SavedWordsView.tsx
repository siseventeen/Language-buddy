import { BookMarked } from 'lucide-react'

export function SavedWordsView() {
  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold text-gray-900 mb-4">Saved Words</h1>
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <BookMarked size={32} className="mb-3" />
        <p className="text-sm">No saved words yet.</p>
        <p className="text-xs mt-1">Search for a word and save it to start building your vocabulary.</p>
      </div>
    </div>
  )
}
