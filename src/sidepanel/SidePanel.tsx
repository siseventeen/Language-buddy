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
    <div className="flex flex-col h-screen w-full bg-[#fafafa]">
      {/* Horizontal top nav */}
      <nav className="flex items-center gap-1 bg-white border-b border-gray-200 px-3 h-12 shrink-0">
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveView(id)}
            title={label}
            className={`
              flex items-center gap-1.5 px-3 h-8 rounded-md text-sm font-medium transition-colors
              ${activeView === id
                ? 'bg-gray-900 text-white'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }
            `}
          >
            <Icon size={16} />
            <span>{label}</span>
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
