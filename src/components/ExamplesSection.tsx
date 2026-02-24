import { RefreshCw, Sparkles, Settings } from 'lucide-react'

interface ExamplesSectionProps {
  examples: string[]
  loading: boolean
  error: string | null
  hasApiKey: boolean
  providerLabel: string
  contextLabels: string[]
  onRefresh: () => void
  onGoToSettings: () => void
}

/** Renders **word** markers as <strong> in a sentence string */
function HighlightedSentence({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <span>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className="font-semibold text-gray-900">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  )
}

function SkeletonLine({ width }: { width: string }) {
  return (
    <div className={`h-3.5 bg-gray-100 rounded animate-pulse ${width}`} />
  )
}

export function ExamplesSection({
  examples,
  loading,
  error,
  hasApiKey,
  providerLabel,
  contextLabels,
  onRefresh,
  onGoToSettings,
}: ExamplesSectionProps) {
  return (
    <div className="mt-5 pt-4 border-t border-gray-100">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Sparkles size={13} className="text-gray-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            In your world
          </span>
        </div>

        {hasApiKey && !loading && (
          <button
            onClick={onRefresh}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            title="Regenerate examples"
          >
            <RefreshCw size={12} />
            Refresh
          </button>
        )}
      </div>

      {/* Context chips */}
      {contextLabels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {contextLabels.map((label) => (
            <span
              key={label}
              className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {/* No API key */}
      {!hasApiKey && (
        <button
          onClick={onGoToSettings}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Settings size={13} />
          Add a {providerLabel} API key in Settings to see personalised examples
        </button>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <SkeletonLine width="w-full" />
            <SkeletonLine width="w-4/5" />
          </div>
          <div className="space-y-1.5">
            <SkeletonLine width="w-11/12" />
            <SkeletonLine width="w-3/5" />
          </div>
          <div className="space-y-1.5">
            <SkeletonLine width="w-full" />
            <SkeletonLine width="w-2/3" />
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="text-xs text-red-500 space-y-1">
          <p>{error}</p>
          <button
            onClick={onRefresh}
            className="underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Examples */}
      {!loading && !error && examples.length > 0 && (
        <ol className="space-y-2.5">
          {examples.map((sentence, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-600 leading-relaxed">
              <span className="text-gray-300 select-none tabular-nums">{i + 1}.</span>
              <HighlightedSentence text={sentence} />
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
