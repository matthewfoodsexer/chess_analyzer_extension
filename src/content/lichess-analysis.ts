async function run() {
  const result = await chrome.storage.local.get('autoAnalyze')
  if (!result.autoAnalyze) return

  await chrome.storage.local.remove('autoAnalyze')

  // Wait for the analysis button to appear after page render
  const btn = await waitForButton()
  if (btn) btn.click()
}

function waitForButton(timeout = 10000): Promise<HTMLElement | null> {
  const find = () => {
    for (const b of document.querySelectorAll('button.button, a.button')) {
      if (b.textContent?.toLowerCase().includes('computer analysis')) {
        return b as HTMLElement
      }
    }
    return null
  }

  const el = find()
  if (el) return Promise.resolve(el)

  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      const el = find()
      if (el) {
        observer.disconnect()
        resolve(el)
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
    setTimeout(() => { observer.disconnect(); resolve(null) }, timeout)
  })
}

run()
