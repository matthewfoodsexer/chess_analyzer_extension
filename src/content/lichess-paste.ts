import { Chess } from 'chess.js'

async function run() {
  const result = await chrome.storage.local.get('pendingPgn')
  const raw = result.pendingPgn
  if (!raw) return

  await chrome.storage.local.remove('pendingPgn')

  let pgn: string
  try {
    const data = JSON.parse(raw as string)
    if (data.uciMoves && Array.isArray(data.uciMoves)) {
      pgn = uciToPgn(data.uciMoves, data.headers ?? {})
    } else {
      pgn = raw as string
    }
  } catch {
    pgn = raw as string
  }

  // Wait for textarea to be rendered
  const textarea = await waitForElement<HTMLTextAreaElement>('textarea')
  if (!textarea) return
  textarea.value = pgn

  await chrome.storage.local.set({ autoAnalyze: true })

  const form = textarea.closest('form')
  if (form) form.submit()
}

function uciToPgn(uciMoves: string[], headers: Record<string, string>): string {
  const chess = new Chess()

  for (const uci of uciMoves) {
    const from = uci.slice(0, 2)
    const to = uci.slice(2, 4)
    const promotion = uci.length > 4 ? uci[4] : undefined
    try {
      chess.move({ from, to, promotion })
    } catch {
      let fallback = ''
      for (const [key, value] of Object.entries(headers)) {
        fallback += `[${key} "${value}"]\n`
      }
      if (Object.keys(headers).length > 0) fallback += '\n'
      fallback += uciMoves.join(' ')
      return fallback.trim()
    }
  }

  let pgn = ''
  for (const [key, value] of Object.entries(headers)) {
    pgn += `[${key} "${value}"]\n`
  }
  if (Object.keys(headers).length > 0) pgn += '\n'
  pgn += chess.history().reduce((acc, move, i) => {
    if (i % 2 === 0) acc += `${Math.floor(i / 2) + 1}. `
    acc += move + ' '
    return acc
  }, '')

  return pgn.trim()
}

function waitForElement<T extends Element>(selector: string, timeout = 10000): Promise<T | null> {
  const el = document.querySelector<T>(selector)
  if (el) return Promise.resolve(el)

  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      const el = document.querySelector<T>(selector)
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
