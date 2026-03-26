async function run() {
  const result = await chrome.storage.local.get('autoAnalyze')
  if (!result.autoAnalyze) return

  await chrome.storage.local.remove('autoAnalyze')

  const buttons = document.querySelectorAll('button.button, a.button')
  for (const b of buttons) {
    if (b.textContent?.toLowerCase().includes('computer analysis')) {
      ;(b as HTMLElement).click()
      return
    }
  }
}

run()
