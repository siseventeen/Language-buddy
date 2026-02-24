import type { UserProfile } from '../types'

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
