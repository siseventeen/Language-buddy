import { useState, useEffect } from 'react'
import type { AppSettings } from '../types'

const STORAGE_KEY = 'language_buddy_settings'

const defaultSettings: AppSettings = {
  openaiApiKey: '',
  openaiModel: 'gpt-4o-mini',
  profile: {
    industries: [],
    interests: [],
  },
  onboardingComplete: false,
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    chrome.storage.sync.get(STORAGE_KEY, (result) => {
      if (result[STORAGE_KEY]) {
        setSettings({ ...defaultSettings, ...result[STORAGE_KEY] })
      }
      setLoading(false)
    })
  }, [])

  const updateSettings = (patch: Partial<AppSettings>) => {
    const updated = { ...settings, ...patch }
    setSettings(updated)
    chrome.storage.sync.set({ [STORAGE_KEY]: updated })
  }

  const toggleIndustry = (industry: string) => {
    const industries = settings.profile.industries.includes(industry)
      ? settings.profile.industries.filter((i) => i !== industry)
      : [...settings.profile.industries, industry]
    updateSettings({ profile: { ...settings.profile, industries } })
  }

  const toggleInterest = (interest: string) => {
    const interests = settings.profile.interests.includes(interest)
      ? settings.profile.interests.filter((i) => i !== interest)
      : [...settings.profile.interests, interest]
    updateSettings({ profile: { ...settings.profile, interests } })
  }

  return { settings, loading, updateSettings, toggleIndustry, toggleInterest }
}
