import { Settings } from 'lucide-react'

export function SettingsView() {
  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold text-gray-900 mb-4">Settings</h1>
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <Settings size={32} className="mb-3" />
        <p className="text-sm">Settings coming soon.</p>
        <p className="text-xs mt-1">Configure your API key, profile, and preferences.</p>
      </div>
    </div>
  )
}
