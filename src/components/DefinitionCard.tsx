import { useState, useRef } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import type { DictionaryEntry } from '../types'

interface DefinitionCardProps {
  entry: DictionaryEntry
}

export function DefinitionCard({ entry }: DefinitionCardProps) {
  const [audioError, setAudioError] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const phonetic = entry.phonetic || entry.phonetics.find((p) => p.text)?.text
  const audioUrl = entry.phonetics.find((p) => p.audio && p.audio.length > 0)?.audio

  const playAudio = () => {
    if (!audioUrl) return
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl)
      audioRef.current.onerror = () => setAudioError(true)
    }
    audioRef.current.currentTime = 0
    audioRef.current.play()
  }

  return (
    <div className="space-y-4">
      {/* Word header */}
      <div className="flex items-baseline gap-3">
        <h2 className="text-2xl font-bold text-gray-900">{entry.word}</h2>
        {phonetic && (
          <span className="text-sm text-gray-500">{phonetic}</span>
        )}
        {audioUrl && !audioError && (
          <button
            onClick={playAudio}
            className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            title="Play pronunciation"
          >
            <Volume2 size={18} />
          </button>
        )}
        {audioUrl && audioError && (
          <span className="p-1 text-gray-300" title="Audio unavailable">
            <VolumeX size={18} />
          </span>
        )}
      </div>

      {/* Meanings */}
      {entry.meanings.map((meaning, i) => (
        <div key={i} className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
              {meaning.partOfSpeech}
            </span>
          </div>

          <ol className="space-y-2 pl-4">
            {meaning.definitions.map((def, j) => (
              <li key={j} className="text-sm">
                <p className="text-gray-800">{def.definition}</p>
                {def.example && (
                  <p className="text-gray-500 mt-0.5 italic">
                    "{def.example}"
                  </p>
                )}
              </li>
            ))}
          </ol>

          {meaning.synonyms.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-gray-400">Synonyms:</span>
              {meaning.synonyms.slice(0, 6).map((syn) => (
                <span
                  key={syn}
                  className="text-gray-600 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded"
                >
                  {syn}
                </span>
              ))}
            </div>
          )}

          {meaning.antonyms.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-gray-400">Antonyms:</span>
              {meaning.antonyms.slice(0, 6).map((ant) => (
                <span
                  key={ant}
                  className="text-gray-600 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded"
                >
                  {ant}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
