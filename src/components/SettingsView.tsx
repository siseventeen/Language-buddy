import { useState } from 'react'
import { Eye, EyeOff, Check } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'
import { INDUSTRIES, INTERESTS } from '../types'
import type { AiProvider } from '../types'

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

function ApiKeyField({
  value,
  placeholder,
  onSave,
}: {
  value: string
  placeholder: string
  onSave: (key: string) => void
}) {
  const [draft, setDraft] = useState(value)
  const [visible, setVisible] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    onSave(draft.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const masked = draft ? `${draft.slice(0, 7)}${'•'.repeat(Math.min(20, draft.length - 7))}` : ''

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type={visible ? 'text' : 'password'}
            value={draft}
            onChange={(e) => { setDraft(e.target.value); setSaved(false) }}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder={placeholder}
            className="w-full text-xs px-2.5 py-1.5 pr-8 rounded border border-gray-200 focus:border-gray-400 focus:outline-none font-mono"
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {visible ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
        </div>
        <button
          onClick={handleSave}
          disabled={draft.trim() === value}
          className={`
            flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium transition-colors
            ${saved
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-gray-900 text-white disabled:opacity-40'
            }
          `}
        >
          {saved ? <><Check size={11} /> Saved</> : 'Save'}
        </button>
      </div>
      {value && !visible && (
        <p className="text-[10px] text-gray-400 font-mono">{masked}</p>
      )}
    </div>
  )
}

const PROVIDERS: { value: AiProvider; label: string; description: string }[] = [
  { value: 'gemini', label: 'Gemini', description: 'Free tier available' },
  { value: 'openai', label: 'OpenAI', description: 'Requires paid key' },
]

export function SettingsView() {
  const { settings, loading, updateSettings, toggleIndustry, toggleInterest } = useSettings()

  if (loading) {
    return <div className="p-4 text-sm text-gray-400">Loading…</div>
  }

  const totalSelected =
    settings.profile.industries.length + settings.profile.interests.length

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-lg font-semibold text-gray-900">Settings</h1>

      {/* AI provider */}
      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-800">AI provider</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Choose which model generates your example sentences.
          </p>
        </div>

        {/* Provider toggle */}
        <div className="flex gap-1.5 p-0.5 bg-gray-100 rounded-lg w-fit">
          {PROVIDERS.map((p) => (
            <button
              key={p.value}
              onClick={() => updateSettings({ aiProvider: p.value })}
              className={`
                px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                ${settings.aiProvider === p.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                }
              `}
            >
              {p.label}
              <span className="ml-1 text-[10px] font-normal text-gray-400">
                {p.description}
              </span>
            </button>
          ))}
        </div>

        {/* Gemini key */}
        {settings.aiProvider === 'gemini' && (
          <div className="space-y-1.5">
            <p className="text-xs text-gray-500">
              Get a free API key at{' '}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:no-underline"
              >
                aistudio.google.com
              </a>
            </p>
            <ApiKeyField
              value={settings.geminiApiKey}
              placeholder="AIza..."
              onSave={(key) => updateSettings({ geminiApiKey: key })}
            />
          </div>
        )}

        {/* OpenAI key */}
        {settings.aiProvider === 'openai' && (
          <div className="space-y-1.5">
            <p className="text-xs text-gray-500">
              Your key is stored locally and never sent anywhere except OpenAI.
            </p>
            <ApiKeyField
              value={settings.openaiApiKey}
              placeholder="sk-..."
              onSave={(key) => updateSettings({ openaiApiKey: key })}
            />
          </div>
        )}
      </section>

      {/* Scenario preferences */}
      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-800">Example sentence context</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Pick the industries and interests that matter to you — AI examples will use language from those worlds.
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
