import { useState, useEffect, useCallback } from 'react'
import { generateVideoRecommendations as geminiVideoRecs } from '../services/gemini'
import { generateVideoRecommendations as openaiVideoRecs } from '../services/openai'
import type { AiProvider, VideoRecommendation } from '../types'

interface ProviderConfig {
  provider: AiProvider
  openaiApiKey: string
  openaiModel: string
  geminiApiKey: string
  geminiModel: string
}

interface UseVideoRecommendationsResult {
  recommendations: VideoRecommendation[]
  loading: boolean
  error: string | null
  refresh: () => void
}

export function useVideoRecommendations(
  word: string | null,
  interests: string[],
  config: ProviderConfig,
): UseVideoRecommendationsResult {
  const [recommendations, setRecommendations] = useState<VideoRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const activeKey =
    config.provider === 'gemini' ? config.geminiApiKey : config.openaiApiKey

  const run = useCallback(
    async (w: string, ints: string[], cfg: ProviderConfig) => {
      const key = cfg.provider === 'gemini' ? cfg.geminiApiKey : cfg.openaiApiKey
      const model = cfg.provider === 'gemini' ? cfg.geminiModel : cfg.openaiModel
      const fn = cfg.provider === 'gemini' ? geminiVideoRecs : openaiVideoRecs

      setLoading(true)
      setError(null)
      setRecommendations([])

      try {
        const result = await fn(w, ints, key, model)
        setRecommendations(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate recommendations')
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    if (word && activeKey && interests.length > 0) {
      run(word, interests, config)
    } else {
      setRecommendations([])
      setError(null)
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word, activeKey, config.provider])

  const refresh = useCallback(() => {
    if (word && activeKey && interests.length > 0) {
      run(word, interests, config)
    }
  }, [word, interests, config, activeKey, run])

  return { recommendations, loading, error, refresh }
}
