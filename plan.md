# Language Buddy - Chrome Extension Implementation Plan

## Architecture Overview

```
language-buddy/
├── public/
│   └── icons/                    # Extension icons (16, 48, 128px)
├── src/
│   ├── background/
│   │   └── service-worker.ts     # Background service worker (context menu, alarms)
│   ├── content/
│   │   └── content-script.ts     # Content script for webpage interactions
│   ├── sidepanel/
│   │   ├── SidePanel.tsx         # Main side panel app root
│   │   ├── index.html            # Side panel HTML entry
│   │   └── main.tsx              # React entry point
│   ├── components/
│   │   ├── SearchBar.tsx         # Word input + search
│   │   ├── DefinitionCard.tsx    # Dictionary definition display
│   │   ├── ExamplesCard.tsx      # AI-generated personalized examples
│   │   ├── YouGlishPlayer.tsx    # YouGlish widget embed
│   │   ├── FlashcardReview.tsx   # Flashcard shown during loading
│   │   ├── SavedWords.tsx        # Saved words list view
│   │   ├── Settings.tsx          # Settings page (API key, profile categories)
│   │   └── ProfileSetup.tsx      # Predefined category selector
│   ├── services/
│   │   ├── dictionary.ts         # Free Dictionary API client
│   │   ├── openai.ts             # OpenAI API client for sentence generation
│   │   ├── storage.ts            # chrome.storage.local wrapper
│   │   └── fsrs.ts               # FSRS spaced repetition logic (ts-fsrs)
│   ├── hooks/
│   │   ├── useDictionary.ts      # Dictionary lookup hook
│   │   ├── useOpenAI.ts          # AI example generation hook
│   │   ├── useSavedWords.ts      # Saved words CRUD hook
│   │   └── useFlashcards.ts      # Flashcard scheduling hook
│   ├── types/
│   │   └── index.ts              # Shared TypeScript types
│   └── utils/
│       └── index.ts              # Shared utilities
├── manifest.json                 # Chrome extension manifest (MV3)
├── vite.config.ts                # Vite build config for Chrome extension
├── package.json
├── tsconfig.json
└── tailwind.config.js            # Tailwind CSS config (optional, for styling)
```

## Implementation Steps

### Phase 1: Project Scaffolding
1. Initialize Vite + React + TypeScript project
2. Install dependencies: `ts-fsrs`, `@anthropic-ai/sdk` (future), Tailwind CSS
3. Configure `vite.config.ts` for Chrome extension (multi-entry: side panel, service worker, content script)
4. Create `manifest.json` (MV3) with permissions: `sidePanel`, `storage`, `unlimitedStorage`, `contextMenus`, `activeTab`
5. Set up Tailwind CSS for styling

### Phase 2: Core Extension Shell
6. Create side panel HTML + React entry point
7. Create background service worker skeleton
8. Create content script skeleton
9. Build navigation/routing within the side panel (Search view, Saved Words view, Settings view)
10. Verify the extension loads in Chrome and side panel opens

### Phase 3: Dictionary Lookup
11. Build `dictionary.ts` service - fetch from Free Dictionary API (`https://api.dictionaryapi.dev/api/v2/entries/en/{word}`)
12. Build `SearchBar.tsx` - text input with search trigger
13. Build `DefinitionCard.tsx` - display word, phonetics, IPA, audio playback button, part of speech, definitions, and example sentences from dictionary
14. Wire up `useDictionary` hook to manage loading/error/data states

### Phase 4: Flashcard-as-Loading-State UX
15. Build `fsrs.ts` service - wrapper around `ts-fsrs` for scheduling cards, rating reviews
16. Build `FlashcardReview.tsx` - shows a due flashcard (front: word, back: definition + example) while content is loading
17. Integrate into the search flow: when user searches a word → show flashcard of a due card → once dictionary + AI results arrive, transition to results

### Phase 5: AI-Powered Personalized Examples
18. Build `Settings.tsx` with OpenAI API key input (stored encrypted/obfuscated in chrome.storage.local)
19. Build `ProfileSetup.tsx` with predefined categories:
    - **Industry**: Tech, Finance, Healthcare, Education, Legal, Marketing, Engineering, Science, Creative Arts, Hospitality
    - **Interests**: Sports, Travel, Cooking, Music, Gaming, Reading, Fitness, Movies, Nature, Fashion
20. Build `openai.ts` service:
    - Takes a word + user's selected categories
    - Sends prompt to OpenAI API (gpt-4o-mini for cost efficiency) requesting 3 contextual example sentences tailored to the user's profile
    - Parses and returns structured examples
21. Build `ExamplesCard.tsx` - displays AI-generated sentences with the target word highlighted
22. Wire up `useOpenAI` hook with loading state that triggers the flashcard display

### Phase 6: YouGlish Integration
23. Build `YouGlishPlayer.tsx`:
    - Embed YouGlish widget via their JS widget API
    - Pass the searched word to the widget
    - Include "Powered by YouGlish.com" attribution
    - Controls: play/pause, next/previous clip, playback speed
24. Add YouGlish section below definitions and examples in the search results view

### Phase 7: Save Words & Context Menu
25. Build `storage.ts` service:
    - CRUD operations for saved words in `chrome.storage.local`
    - Each saved word stores: word, definition, examples, date saved, FSRS card metadata, source URL (if from webpage)
26. Add "Save" button to search results view
27. Build `SavedWords.tsx` - list of all saved words with search/filter, delete capability
28. Add context menu in service worker: `chrome.contextMenus.create({ title: "Save to Language Buddy", contexts: ["selection"] })`
29. Content script: on context menu click, send selected text to service worker → auto-lookup and save

### Phase 8: Polish & Final Integration
30. Connect flashcard scheduling to saved words - when words are saved, create FSRS cards
31. Implement flashcard rating (Again/Hard/Good/Easy) during the loading-state reviews, persist to storage
32. Add onboarding flow for first-time users (profile setup + API key)
33. Error handling: no API key set, API failures, network errors, empty results
34. Extension icons and branding

## Key Technical Decisions

- **Storage**: `chrome.storage.local` with `unlimitedStorage` for all data. IndexedDB deferred to future if needed.
- **State management**: React hooks + context. No Redux - overkill for this scope.
- **Styling**: Tailwind CSS for rapid UI development within the side panel.
- **OpenAI model**: `gpt-4o-mini` by default (cheap, fast). User can change in settings later.
- **YouGlish**: Widget embed (not full API) for MVP. Widget is simpler and free for non-commercial use with attribution.
- **FSRS**: `ts-fsrs` package for modern spaced repetition. Cards created when words are saved.

## Manifest V3 Permissions
```json
{
  "permissions": [
    "sidePanel",
    "storage",
    "unlimitedStorage",
    "contextMenus",
    "activeTab"
  ]
}
```
