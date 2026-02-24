import type { UserProfile } from '../types'

export async function generateExamples(
  word: string,
  partOfSpeech: string,
  definition: string,
  profile: UserProfile,
  apiKey: string,
  model = 'gpt-4o-mini',
): Promise<string[]> {
  const contexts = [...profile.industries, ...profile.interests]

  const contextLine =
    contexts.length > 0
      ? `The learner works in / is passionate about: ${contexts.join(', ')}. Write each sentence so it fits naturally into one of those worlds — use domain-appropriate vocabulary, realistic situations, and the kind of language actually spoken or written there today.`
      : 'Write modern, conversational sentences that feel like something a real person would say or write today.'

  const prompt = `You are a language teacher helping someone learn English vocabulary in context.

Generate exactly 3 short example sentences (1–2 lines each) using the word "${word}" as a ${partOfSpeech}.
Word meaning: ${definition}

${contextLine}

Rules:
- Bold the target word by wrapping it with ** on each side, e.g. **${word}**
- Keep sentences concise and natural, not textbook-stiff
- Vary the scenarios across the three sentences
- Return ONLY a JSON array of 3 strings, no markdown fences, no explanation

Example output format:
["Sentence one with **${word}** here.", "Sentence two.", "Sentence three."]`

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

  // Strip accidental markdown fences before parsing
  const clean = content.replace(/^```[a-z]*\n?/i, '').replace(/```$/i, '').trim()
  return JSON.parse(clean) as string[]
}
