// Open side panel when clicking the extension action button
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id })
  }
})

// Set up context menu for saving words from webpages
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'save-to-language-buddy',
    title: 'Save "%s" to Language Buddy',
    contexts: ['selection'],
  })
})

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'save-to-language-buddy' && info.selectionText) {
    const word = info.selectionText.trim().toLowerCase()
    if (word && tab?.id) {
      // Send the word to the side panel via storage event
      chrome.storage.local.set({
        pendingWord: { word, sourceUrl: tab.url, timestamp: Date.now() },
      })
      // Open side panel to show the word
      chrome.sidePanel.open({ tabId: tab.id })
    }
  }
})

export {}
