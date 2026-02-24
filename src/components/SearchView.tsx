import { SearchBar } from './SearchBar'
import { DefinitionCard } from './DefinitionCard'
import { ExamplesSection } from './ExamplesSection'
import { YouGlishPlayer } from './YouGlishPlayer'
import { useDictionary } from '../hooks/useDictionary'
import { useExamples } from '../hooks/useExamples'
import { useSettings } from '../hooks/useSettings'
import { Loader2, AlertCircle } from 'lucide-react'

interface SearchViewProps {
  onGoToSettings: () => void
}

export function SearchView({ onGoToSettings }: SearchViewProps) {
  const { entry, loading, error, search } = useDictionary()
  const { settings } = useSettings()

  const activeKey =
    settings.aiProvider === 'gemini' ? settings.geminiApiKey : settings.openaiApiKey

  const { examples, loading: exLoading, error: exError, refresh } = useExamples(
    entry,
    settings.profile,
    {
      provider: settings.aiProvider,
      openaiApiKey: settings.openaiApiKey,
      openaiModel: settings.openaiModel,
      geminiApiKey: settings.geminiApiKey,
      geminiModel: settings.geminiModel,
    },
  )

  const allInterests = [...settings.profile.industries, ...settings.profile.interests]
  const providerLabel = settings.aiProvider === 'gemini' ? 'Gemini' : 'OpenAI'

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

        <ExamplesSection
          examples={examples}
          loading={exLoading}
          error={exError}
          hasApiKey={!!activeKey}
          providerLabel={providerLabel}
          contextLabels={allInterests}
          onRefresh={refresh}
          onGoToSettings={onGoToSettings}
        />
        <YouGlishPlayer
          word={entry?.word ?? ''}
          interests={allInterests}
        />
      </div>
    </div>
  )
}
