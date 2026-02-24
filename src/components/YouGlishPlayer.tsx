import { useEffect, useRef, useState, useCallback } from 'react'
import { SkipBack, SkipForward, Video, ExternalLink } from 'lucide-react'

interface YouGlishPlayerProps {
  word: string
  interests: string[]
}

export function YouGlishPlayer({ word, interests }: YouGlishPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [totalResults, setTotalResults] = useState<number | null>(null)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [totalTracks, setTotalTracks] = useState(0)
  const [apiReady, setApiReady] = useState(false)

  // Listen for messages from the sandbox iframe
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const d = event.data
      if (!d?.type) return

      switch (d.type) {
        case 'apiReady':
          setApiReady(true)
          break
        case 'fetchDone':
          setTotalResults(d.totalResults)
          break
        case 'videoChange':
          setCurrentTrack(d.trackNumber)
          setTotalTracks(d.totalTracks)
          break
      }
    }

    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  // Send fetch command when word changes and API is ready
  useEffect(() => {
    if (word && apiReady && iframeRef.current?.contentWindow) {
      setTotalResults(null)
      setCurrentTrack(0)
      setTotalTracks(0)
      iframeRef.current.contentWindow.postMessage(
        { type: 'fetch', word, language: 'english' },
        '*',
      )
    }
  }, [word, apiReady])

  const sendCommand = useCallback((type: string) => {
    iframeRef.current?.contentWindow?.postMessage({ type }, '*')
  }, [])

  // Empty state — no word searched yet
  if (!word) {
    return (
      <div className="mt-5 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1.5 mb-2">
          <Video size={13} className="text-gray-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Hear it in context
          </span>
        </div>
        <p className="text-xs text-gray-400 text-center py-6">
          Search for a word above to hear it in real conversations
        </p>
      </div>
    )
  }

  // YouGlish links ranked by the user's selected interest areas
  const interestClips = interests.slice(0, 6).map((interest) => ({
    label: interest,
    url: `https://youglish.com/pronounce/${encodeURIComponent(word)}/english`,
  }))

  return (
    <div className="mt-5 pt-4 border-t border-gray-100 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Video size={13} className="text-gray-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Hear it in context
          </span>
        </div>
        {totalResults !== null && totalResults > 0 && (
          <span className="text-[10px] text-gray-400 tabular-nums">
            clip {currentTrack} / {totalTracks}
          </span>
        )}
      </div>

      {/* YouGlish iframe */}
      <div className="rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
        <iframe
          ref={iframeRef}
          src="youglish-sandbox.html"
          className="w-full"
          style={{ height: 280, border: 'none' }}
          sandbox="allow-scripts allow-same-origin allow-popups"
          title="YouGlish pronunciation player"
        />
      </div>

      {/* Nav controls */}
      {totalResults !== null && totalResults > 0 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => sendCommand('previous')}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
            title="Previous clip"
          >
            <SkipBack size={16} />
          </button>
          <button
            onClick={() => sendCommand('next')}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
            title="Next clip"
          >
            <SkipForward size={16} />
          </button>
        </div>
      )}

      {/* No results fallback */}
      {totalResults === 0 && (
        <p className="text-xs text-gray-400 text-center py-1">
          No clips found — try a different word
        </p>
      )}

      {/* Attribution */}
      <p className="text-[10px] text-gray-300 text-center">
        Powered by{' '}
        <a
          href="https://youglish.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-400"
        >
          YouGlish.com
        </a>
      </p>

      {/* Interest-ranked YouGlish clip links */}
      {interestClips.length > 0 && (
        <div className="pt-2 border-t border-gray-50 space-y-1.5">
          <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
            Browse clips by your interests
          </span>
          <div className="flex flex-wrap gap-1.5">
            {interestClips.map(({ label, url }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors"
              >
                <ExternalLink size={9} className="shrink-0" />
                {label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
