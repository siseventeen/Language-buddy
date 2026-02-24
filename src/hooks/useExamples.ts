import { useState, useEffect, useCallback } from 'react'
import { generateExamples } from '../services/openai'
import type { DictionaryEntry, UserProfile } from '../types'

interface UseExamplesResult {
  examples: string[]
  loading: boolean
  error: string | null
  refresh: () => void
}

export function useExamples(
  entry: DictionaryEntry | null,
  profile: UserProfile,
  apiKey: string,
): UseExamplesResult {
  const [examples, setExamples] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(async (e: DictionaryEntry, p: UserProfile, key: string) => {
    const firstMeaning = e.meanings[0]
    if (!firstMeaning) return

    setLoading(true)
    setError(null)
    setExamples([])

    try {
      const result = await generateExamples(
        e.word,
        firstMeaning.partOfSpeech,
        firstMeaning.definitions[0]?.definition ?? '',
        p,
        key,
      )
      setExamples(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate examples')
    } finally {
      setLoading(false)
    }
  }, [])

  // Re-generate whenever the looked-up word changes (and we have a key)
  useEffect(() => {
    if (entry && apiKey) {
      run(entry, profile, apiKey)
    } else {
      setExamples([])
      setError(null)
      setLoading(false)
    }
    // profile is intentionally excluded: refresh button handles profile-driven regeneration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry?.word, apiKey])

  const refresh = useCallback(() => {
    if (entry && apiKey) run(entry, profile, apiKey)
  }, [entry, profile, apiKey, run])

  return { examples, loading, error, refresh }
}
