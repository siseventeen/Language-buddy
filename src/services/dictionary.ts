import type { DictionaryEntry } from '../types'

const BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en'

export class DictionaryError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'DictionaryError'
    this.status = status
  }
}

export async function lookupWord(word: string): Promise<DictionaryEntry> {
  const response = await fetch(`${BASE_URL}/${encodeURIComponent(word)}`)

  if (!response.ok) {
    if (response.status === 404) {
      throw new DictionaryError(`No definition found for "${word}"`, 404)
    }
    throw new DictionaryError(`Dictionary lookup failed (${response.status})`, response.status)
  }

  const data: DictionaryEntry[] = await response.json()
  return data[0]
}
