export type View = 'search' | 'saved' | 'settings'

export interface DictionaryEntry {
  word: string
  phonetic?: string
  phonetics: Phonetic[]
  meanings: Meaning[]
  sourceUrls?: string[]
}

export interface Phonetic {
  text?: string
  audio?: string
}

export interface Meaning {
  partOfSpeech: string
  definitions: Definition[]
  synonyms: string[]
  antonyms: string[]
}

export interface Definition {
  definition: string
  example?: string
  synonyms: string[]
  antonyms: string[]
}

export interface SavedWord {
  id: string
  word: string
  definition: string
  phonetic?: string
  examples: string[]
  aiExamples: string[]
  sourceUrl?: string
  savedAt: number
  // FSRS card metadata
  fsrsCard: FSRSCardData
}

export interface FSRSCardData {
  due: string
  stability: number
  difficulty: number
  elapsed_days: number
  scheduled_days: number
  reps: number
  lapses: number
  state: number
  last_review?: string
}

export interface UserProfile {
  industries: string[]
  interests: string[]
}

export type AiProvider = 'gemini' | 'openai'

export interface AppSettings {
  aiProvider: AiProvider
  openaiApiKey: string
  openaiModel: string
  geminiApiKey: string
  geminiModel: string
  profile: UserProfile
  onboardingComplete: boolean
}

export const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Legal',
  'Marketing',
  'Engineering',
  'Science',
  'Creative Arts',
  'Hospitality',
] as const

export const INTERESTS = [
  'Sports',
  'Travel',
  'Cooking',
  'Music',
  'Gaming',
  'Reading',
  'Fitness',
  'Movies',
  'Nature',
  'Fashion',
] as const

export interface VideoRecommendation {
  interest: string
  query: string
  label: string
}
