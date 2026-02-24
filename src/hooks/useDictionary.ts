import { useState, useCallback } from 'react'
import { lookupWord, DictionaryError } from '../services/dictionary'
import type { DictionaryEntry } from '../types'

interface UseDictionaryResult {
  entry: DictionaryEntry | null
  loading: boolean
  error: string | null
  search: (word: string) => Promise<void>
  clear: () => void
}

export function useDictionary(): UseDictionaryResult {
  const [entry, setEntry] = useState<DictionaryEntry | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (word: string) => {
    setLoading(true)
    setError(null)
    setEntry(null)

    try {
      const result = await lookupWord(word)
      setEntry(result)
    } catch (err) {
      if (err instanceof DictionaryError) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const clear = useCallback(() => {
    setEntry(null)
    setError(null)
    setLoading(false)
  }, [])

  return { entry, loading, error, search, clear }
}
