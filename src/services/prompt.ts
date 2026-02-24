import type { UserProfile, VideoRecommendation } from '../types'

export function buildExamplePrompt(
  word: string,
  partOfSpeech: string,
  definition: string,
  profile: UserProfile,
): string {
  const contexts = [...profile.industries, ...profile.interests]

  const contextLine =
    contexts.length > 0
      ? `The learner works in / is passionate about: ${contexts.join(', ')}. Write each sentence so it fits naturally into one of those worlds — use domain-appropriate vocabulary, realistic situations, and the kind of language actually spoken or written there today.`
      : 'Write modern, conversational sentences that feel like something a real person would say or write today.'

  return `You are a language teacher helping someone learn English vocabulary in context.

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
}

export function buildVideoRecommendationPrompt(
  word: string,
  interests: string[],
): string {
  const list = interests.slice(0, 6).join(', ')

  return `You are a language-learning assistant. A user is learning the English word "${word}" and wants to find YouTube videos that use this word naturally in context.

The user is interested in these topics: ${list}

For EACH interest, generate one YouTube search query that would find a video where the word "${word}" is likely spoken or discussed in that topic area. Also write a short, friendly label (3-8 words) describing what the video is about.

Rules:
- One entry per interest, matching the order given
- The search query should be a natural YouTube search (3-6 words), designed to surface videos where "${word}" appears in speech
- The label should be engaging and describe the kind of video (not just repeat the interest)
- Return ONLY a JSON array, no markdown fences, no explanation

Example output format for word "iterate" and interests ["Technology", "Cooking"]:
[{"interest":"Technology","query":"agile iterate software sprint","label":"Agile dev sprint walkthroughs"},{"interest":"Cooking","query":"iterate recipe perfecting technique","label":"Chefs perfecting their recipes"}]

Now generate for word "${word}" and interests [${interests.slice(0, 6).map((i) => `"${i}"`).join(', ')}]:`
}

export function parseVideoRecommendations(raw: string): VideoRecommendation[] {
  const clean = raw
    .replace(/^```[a-z]*\n?/i, '')
    .replace(/```$/i, '')
    .trim()
  const parsed = JSON.parse(clean)
  if (!Array.isArray(parsed)) return []
  return parsed.filter(
    (item: unknown): item is VideoRecommendation =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as VideoRecommendation).interest === 'string' &&
      typeof (item as VideoRecommendation).query === 'string' &&
      typeof (item as VideoRecommendation).label === 'string',
  )
}
