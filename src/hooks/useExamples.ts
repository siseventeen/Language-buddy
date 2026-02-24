import { useState, useEffect, useCallback } from 'react'
import { generateExamples as openaiGenerate } from '../services/openai'
import { generateExamples as geminiGenerate } from '../services/gemini'
import type { AiProvider, DictionaryEntry, UserProfile } from '../types'

interface UseExamplesResult {
  examples: string[]
  loading: boolean
  error: string | null
  refresh: () => void
}

interface ProviderConfig {
  provider: AiProvider
  openaiApiKey: string
  openaiModel: string
  geminiApiKey: string
  geminiModel: string
}

export function useExamples(
  entry: DictionaryEntry | null,
  profile: UserProfile,
  config: ProviderConfig,
): UseExamplesResult {
  const [examples, setExamples] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const activeKey =
    config.provider === 'gemini' ? config.geminiApiKey : config.openaiApiKey

  const run = useCallback(
    async (e: DictionaryEntry, p: UserProfile, cfg: ProviderConfig) => {
      const firstMeaning = e.meanings[0]
      if (!firstMeaning) return

      const key = cfg.provider === 'gemini' ? cfg.geminiApiKey : cfg.openaiApiKey
      const model = cfg.provider === 'gemini' ? cfg.geminiModel : cfg.openaiModel
      const fn = cfg.provider === 'gemini' ? geminiGenerate : openaiGenerate

      setLoading(true)
      setError(null)
      setExamples([])

      try {
        const result = await fn(
          e.word,
          firstMeaning.partOfSpeech,
          firstMeaning.definitions[0]?.definition ?? '',
          p,
          key,
          model,
        )
        setExamples(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate examples')
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  // Re-generate whenever the looked-up word or active API key changes
  useEffect(() => {
    if (entry && activeKey) {
      run(entry, profile, config)
    } else {
      setExamples([])
      setError(null)
      setLoading(false)
    }
    // profile is intentionally excluded: refresh button handles profile-driven regeneration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry?.word, activeKey, config.provider])

  const refresh = useCallback(() => {
    if (entry && activeKey) run(entry, profile, config)
  }, [entry, profile, config, activeKey, run])

  return { examples, loading, error, refresh }
}
