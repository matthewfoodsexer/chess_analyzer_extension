const ENCODE_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?'
const FULL_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?{~}(^)[_]@#$,./=+-*'
const PROMO_PIECES = ['q', 'r', 'b', 'n']

function decodeSquare(char: string): string {
  const index = ENCODE_CHARS.indexOf(char)
  if (index < 0 || index > 63) return ''
  const file = String.fromCharCode('a'.charCodeAt(0) + (index % 8))
  const rank = Math.floor(index / 8) + 1
  return `${file}${rank}`
}

function decodePromoTo(char: string, fromSquare: string): { square: string; piece: string } | null {
  const index = FULL_CHARS.indexOf(char)
  if (index < 64) return null
  const promoIdx = index - 64
  const piece = PROMO_PIECES[Math.floor(promoIdx / 8)] ?? 'q'
  const fromRank = parseInt(fromSquare[1])
  const rank = fromRank === 7 ? 8 : 1
  return { square: `${fromSquare[0]}${rank}`, piece }
}

function decodeMoveList(moveList: string): string[] {
  const moves: string[] = []
  let i = 0
  while (i + 1 < moveList.length) {
    const from = decodeSquare(moveList[i])
    if (!from) { i++; continue }

    const toChar = moveList[i + 1]
    const toIndex = ENCODE_CHARS.indexOf(toChar)

    if (toIndex >= 0 && toIndex <= 63) {
      const to = decodeSquare(toChar)
      moves.push(from + to)
      i += 2
      continue
    }

    const promo = decodePromoTo(toChar, from)
    if (promo) {
      moves.push(from + promo.square + promo.piece)
      i += 2
      continue
    }

    i += 2
  }
  return moves
}

function extractGameId(url: string): string | null {
  const match = url.match(/\/(?:game|live|play)\/(?:live|daily|computer)?\/?\/?(\d+)/)
  return match?.[1] ?? null
}

async function fetchPgn(gameId: string): Promise<string | null> {
  try {
    const response = await fetch(`https://www.chess.com/callback/live/game/${gameId}`)
    if (!response.ok) return null

    const data = await response.json()
    const game = data?.game
    if (!game) return null

    // Direct PGN
    if (game.pgn) return game.pgn

    // Build PGN from moveList + pgnHeaders
    if (game.moveList) {
      const headers = game.pgnHeaders ?? {}
      const uciMoves = decodeMoveList(game.moveList as string)

      // We need to convert UCI to SAN for PGN - but we don't have chess.js here.
      // Instead, pass UCI moves and headers and let the content script build PGN via chess.js.
      return JSON.stringify({ uciMoves, headers })
    }

    return null
  } catch {
    return null
  }
}

// Icon click → fetch PGN → open lichess paste
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.url) return

  const gameId = extractGameId(tab.url)
  if (!gameId) return

  const pgn = await fetchPgn(gameId)
  if (!pgn) return

  // Store PGN for the content script to pick up
  await chrome.storage.local.set({ pendingPgn: pgn })

  // Open lichess paste page
  await chrome.tabs.create({ url: 'https://lichess.org/paste' })
})
