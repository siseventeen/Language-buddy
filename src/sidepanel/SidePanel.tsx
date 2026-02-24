import { useState } from 'react'
import { Search, BookMarked, Settings } from 'lucide-react'
import { SearchView } from '../components/SearchView'
import { SavedWordsView } from '../components/SavedWordsView'
import { SettingsView } from '../components/SettingsView'
import type { View } from '../types'

const NAV_ITEMS: { id: View; icon: typeof Search; label: string }[] = [
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'saved', icon: BookMarked, label: 'Saved' },
  { id: 'settings', icon: Settings, label: 'Settings' },
]

export function SidePanel() {
  const [activeView, setActiveView] = useState<View>('search')

  return (
    <div className="flex h-screen w-full bg-[#fafafa]">
      {/* Icon sidebar */}
      <nav className="flex flex-col items-center gap-1 bg-white border-r border-gray-200 py-4 px-2 w-14 shrink-0">
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveView(id)}
            title={label}
            className={`
              flex items-center justify-center w-10 h-10 rounded-lg transition-colors
              ${activeView === id
                ? 'bg-gray-900 text-white'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }
            `}
          >
            <Icon size={20} />
          </button>
        ))}
      </nav>

      {/* Content area */}
      <main className="flex-1 overflow-y-auto">
        {activeView === 'search' && <SearchView />}
        {activeView === 'saved' && <SavedWordsView />}
        {activeView === 'settings' && <SettingsView />}
      </main>
    </div>
  )
}
