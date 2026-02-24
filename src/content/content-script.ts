// Content script for Language Buddy
// Listens for messages from the service worker for future features
// (e.g., highlighting saved words on page, tooltip definitions)

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GET_SELECTION') {
    const selection = window.getSelection()?.toString().trim()
    sendResponse({ selection: selection || null })
  }
  return true
})

export {}
