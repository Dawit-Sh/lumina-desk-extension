const MENU_ITEMS = [
  { id: 'grammar', title: 'Check Grammar' },
  { id: 'paraphrase', title: 'Paraphrase' },
  { id: 'summarize', title: 'Summarize' },
  { id: 'translate', title: 'Translate' },
  { id: 'humanize', title: 'Humanize (AI Detection)' },
]

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'lumina-root',
    title: '✦ Lumina',
    contexts: ['selection'],
  })

  for (const item of MENU_ITEMS) {
    chrome.contextMenus.create({
      id: `lumina-${item.id}`,
      parentId: 'lumina-root',
      title: item.title,
      contexts: ['selection'],
    })
  }
})

// Open the popup pointing at the right tab when a context menu item is clicked.
// Since MV3 can't programmatically open the popup, we store the intent in
// session storage and the popup reads it on load.
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!info.menuItemId || !tab?.id) return
  const id = String(info.menuItemId)
  if (!id.startsWith('lumina-') || id === 'lumina-root') return

  const tool = id.replace('lumina-', '')
  chrome.storage.session.set({ pendingTool: tool, pendingText: info.selectionText ?? '' })
  chrome.action.openPopup?.()
})
