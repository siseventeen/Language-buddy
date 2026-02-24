import { useSettings } from '../hooks/useSettings'
import { INDUSTRIES, INTERESTS } from '../types'

function ChipGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string
  options: readonly string[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const active = selected.includes(option)
          return (
            <button
              key={option}
              onClick={() => onToggle(option)}
              className={`
                px-2.5 py-1 rounded-full text-xs font-medium border transition-colors
                ${active
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }
              `}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function SettingsView() {
  const { settings, loading, toggleIndustry, toggleInterest } = useSettings()

  if (loading) {
    return (
      <div className="p-4 text-sm text-gray-400">Loading…</div>
    )
  }

  const totalSelected =
    settings.profile.industries.length + settings.profile.interests.length

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-lg font-semibold text-gray-900">Settings</h1>

      {/* Scenario preferences */}
      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-800">Example sentence context</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Select your industries and interests so AI-generated examples feel relevant to you.
          </p>
        </div>

        <ChipGroup
          label="Industries"
          options={INDUSTRIES}
          selected={settings.profile.industries}
          onToggle={toggleIndustry}
        />

        <ChipGroup
          label="Interests & hobbies"
          options={INTERESTS}
          selected={settings.profile.interests}
          onToggle={toggleInterest}
        />

        {totalSelected > 0 && (
          <p className="text-xs text-gray-400">
            {totalSelected} context{totalSelected !== 1 ? 's' : ''} selected — examples will be tailored to your choices.
          </p>
        )}
      </section>
    </div>
  )
}
