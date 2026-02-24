import type { UserProfile, VideoRecommendation } from '../types'
import { buildExamplePrompt, buildVideoRecommendationPrompt, parseVideoRecommendations } from './prompt'

export async function generateExamples(
  word: string,
  partOfSpeech: string,
  definition: string,
  profile: UserProfile,
  apiKey: string,
  model = 'gemini-2.0-flash',
): Promise<string[]> {
  const prompt = buildExamplePrompt(word, partOfSpeech, definition, profile)

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 400,
      },
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    const msg =
      (err as { error?: { message?: string } })?.error?.message ??
      `Gemini error ${response.status}`
    throw new Error(msg)
  }

  const data = await response.json()
  const content: string =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]'

  const clean = content
    .replace(/^```[a-z]*\n?/i, '')
    .replace(/```$/i, '')
    .trim()
  return JSON.parse(clean) as string[]
}

export async function generateVideoRecommendations(
  word: string,
  interests: string[],
  apiKey: string,
  model = 'gemini-2.0-flash',
): Promise<VideoRecommendation[]> {
  const prompt = buildVideoRecommendationPrompt(word, interests)

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 500,
      },
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    const msg =
      (err as { error?: { message?: string } })?.error?.message ??
      `Gemini error ${response.status}`
    throw new Error(msg)
  }

  const data = await response.json()
  const content: string =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]'

  return parseVideoRecommendations(content)
}
