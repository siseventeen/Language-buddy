import type { UserProfile, VideoRecommendation } from '../types'
import { buildExamplePrompt, buildVideoRecommendationPrompt, parseVideoRecommendations } from './prompt'

export async function generateExamples(
  word: string,
  partOfSpeech: string,
  definition: string,
  profile: UserProfile,
  apiKey: string,
  model = 'gpt-4o-mini',
): Promise<string[]> {
  const prompt = buildExamplePrompt(word, partOfSpeech, definition, profile)

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.85,
      max_tokens: 400,
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error((err as { error?: { message?: string } })?.error?.message ?? `OpenAI error ${response.status}`)
  }

  const data = await response.json()
  const content: string = data.choices[0]?.message?.content ?? '[]'

  const clean = content.replace(/^```[a-z]*\n?/i, '').replace(/```$/i, '').trim()
  return JSON.parse(clean) as string[]
}

export async function generateVideoRecommendations(
  word: string,
  interests: string[],
  apiKey: string,
  model = 'gpt-4o-mini',
): Promise<VideoRecommendation[]> {
  const prompt = buildVideoRecommendationPrompt(word, interests)

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 500,
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error((err as { error?: { message?: string } })?.error?.message ?? `OpenAI error ${response.status}`)
  }

  const data = await response.json()
  const content: string = data.choices[0]?.message?.content ?? '[]'

  return parseVideoRecommendations(content)
}
