import { RefreshCw, Play, Tv, Settings } from 'lucide-react'
import type { VideoRecommendation } from '../types'

interface VideoRecommendationsProps {
  recommendations: VideoRecommendation[]
  loading: boolean
  error: string | null
  hasApiKey: boolean
  hasInterests: boolean
  providerLabel: string
  onRefresh: () => void
  onGoToSettings: () => void
}

function SkeletonCard() {
  return (
    <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gray-50 border border-gray-100 animate-pulse">
      <div className="w-8 h-8 rounded bg-gray-200 shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-2.5 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  )
}

export function VideoRecommendations({
  recommendations,
  loading,
  error,
  hasApiKey,
  hasInterests,
  providerLabel,
  onRefresh,
  onGoToSettings,
}: VideoRecommendationsProps) {
  return (
    <div className="mt-5 pt-4 border-t border-gray-100">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Tv size={13} className="text-gray-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Videos for you
          </span>
        </div>

        {hasApiKey && hasInterests && !loading && recommendations.length > 0 && (
          <button
            onClick={onRefresh}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            title="Get new recommendations"
          >
            <RefreshCw size={12} />
            Refresh
          </button>
        )}
      </div>

      {/* No API key */}
      {!hasApiKey && (
        <button
          onClick={onGoToSettings}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Settings size={13} />
          Add a {providerLabel} API key in Settings to see personalised video picks
        </button>
      )}

      {/* No interests selected */}
      {hasApiKey && !hasInterests && (
        <button
          onClick={onGoToSettings}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Settings size={13} />
          Select your interests in Settings to get video recommendations
        </button>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-2">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="text-xs text-red-500 space-y-1">
          <p>{error}</p>
          <button onClick={onRefresh} className="underline hover:no-underline">
            Try again
          </button>
        </div>
      )}

      {/* Recommendation cards */}
      {!loading && !error && recommendations.length > 0 && (
        <div className="space-y-1.5">
          {recommendations.map((rec) => (
            <a
              key={rec.interest}
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(rec.query)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gray-50 border border-gray-100 hover:border-gray-200 hover:bg-white transition-all group"
            >
              <div className="w-8 h-8 rounded bg-red-50 flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
                <Play size={14} className="text-red-500 ml-0.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate group-hover:text-gray-900 transition-colors">
                  {rec.label}
                </p>
                <p className="text-[10px] text-gray-400 truncate">
                  {rec.interest}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
