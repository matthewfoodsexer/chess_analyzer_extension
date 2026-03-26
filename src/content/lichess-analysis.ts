// After game is imported, auto-click "REQUEST A COMPUTER ANALYSIS" button
async function run() {
  const result = await chrome.storage.local.get('autoAnalyze')
  if (!result.autoAnalyze) return

  await chrome.storage.local.remove('autoAnalyze')

  // Wait for the analysis request button to appear
  const btn = await waitForElement<HTMLButtonElement>('button.button.text')
  if (!btn) return

  // Find the button with "analysis" text
  const buttons = document.querySelectorAll('button.button, a.button')
  for (const b of buttons) {
    if (b.textContent?.toLowerCase().includes('computer analysis')) {
      ;(b as HTMLElement).click()
      return
    }
  }
}

function waitForElement<T extends Element>(selector: string, timeout = 10000): Promise<T | null> {
  return new Promise((resolve) => {
    const el = document.querySelector<T>(selector)
    if (el) return resolve(el)

    const observer = new MutationObserver(() => {
      const el = document.querySelector<T>(selector)
      if (el) {
        observer.disconnect()
        resolve(el)
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })
    setTimeout(() => {
      observer.disconnect()
      resolve(null)
    }, timeout)
  })
}

run()
