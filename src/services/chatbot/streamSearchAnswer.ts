/**
 * Streaming client for the medical AI search endpoint.
 *
 * The backend streams newline-delimited JSON chunks. Each chunk carries an
 * `event` discriminator. We only accumulate text from `answer_delta` events and
 * stop the live cursor on `done`.
 *
 * Sample chunks:
 *   {"event": "start", "message": "...", "prompt": "Hello"}
 *   {"event": "action", "message": "Mình đang hiểu ý", "step": "hieu_cau_hoi"}
 *   {"event": "answer_delta", "message": "", "delta": "<answer>\nChào bạn!"}
 *   {"event": "done", "message": "Mình đã trả lời xong", "cached": true}
 */

export type SearchStreamEvent =
  | { event: 'start'; message?: string; prompt?: string }
  | { event: 'action'; message?: string; step?: string }
  | { event: 'answer_delta'; message?: string; delta?: string }
  | { event: 'done'; message?: string; cached?: boolean }
  | { event: string; message?: string; [key: string]: unknown }

export interface StreamCallbacks {
  /** Fires on every text update with the full cleaned answer so far. */
  onAnswer?: (fullAnswer: string) => void
  /** Fires for non-answer lifecycle events (start/action), useful for a status line. */
  onStatus?: (message: string, event: SearchStreamEvent) => void
  /** Fires once the `done` event arrives. */
  onDone?: (fullAnswer: string) => void
  signal?: AbortSignal
}

// Matches both opening and closing answer wrapper tags emitted inside deltas.
const ANSWER_TAG = /<\/?answer>/g

// Production endpoint. Overridable via env for staging/cloudflare tunnels.
const DEFAULT_ENDPOINT = 'https://chatbot.svykhoa.com/model/generate/'

const buildRequestBody = (prompt: string) => ({
  prompt,
  max_new_tokens: 1024,
  temperature: 0.1,
  top_p: 0.9,
  top_k: 50,
  repetition_penalty: 1.0,
  do_sample: true,
  mode: 'normal',
  module: 'search_local',
})

/**
 * Streams an answer for `prompt`, invoking callbacks as chunks arrive.
 * Resolves with the final cleaned answer. Throws on network / HTTP errors
 * (AbortError is re-thrown so callers can ignore cancellations).
 */
export async function streamSearchAnswer(
  prompt: string,
  callbacks: StreamCallbacks = {},
): Promise<string> {
  const endpoint = import.meta.env.VITE_APT_CHAT_BOT || DEFAULT_ENDPOINT

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildRequestBody(prompt)),
    signal: callbacks.signal,
  })

  if (!response.ok || !response.body) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')

  let buffer = ''
  let rawAnswer = ''
  let fullText = '' // every decoded byte, for the legacy-format fallback
  let sawChunk = false

  const handleLine = (line: string) => {
    // Tolerate SSE-style `data:` prefixes and blank keep-alive lines.
    const trimmed = line.replace(/^data:\s*/, '').trim()
    if (!trimmed) return

    let chunk: SearchStreamEvent
    try {
      chunk = JSON.parse(trimmed)
      sawChunk = true
    } catch {
      return // ignore partial / non-JSON noise
    }

    switch (chunk.event) {
      case 'answer_delta': {
        if (typeof chunk.delta === 'string') {
          rawAnswer += chunk.delta
          // Strip wrapper tags from the accumulated string so tags split
          // across two deltas are still removed cleanly.
          callbacks.onAnswer?.(rawAnswer.replace(ANSWER_TAG, ''))
        }
        break
      }
      case 'done': {
        callbacks.onDone?.(rawAnswer.replace(ANSWER_TAG, ''))
        break
      }
      default: {
        if (chunk.message) callbacks.onStatus?.(chunk.message, chunk)
      }
    }
  }

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const text = decoder.decode(value, { stream: true })
    fullText += text
    buffer += text

    let newlineIndex: number
    while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
      handleLine(buffer.slice(0, newlineIndex))
      buffer = buffer.slice(newlineIndex + 1)
    }
  }

  // Flush any trailing chunk without a terminating newline.
  if (buffer.trim()) handleLine(buffer)

  // Fallback: the endpoint returned a non-streaming `<answer>...</answer>` blob
  // instead of NDJSON chunks. Surface its inner text so the panel isn't empty.
  if (!sawChunk && fullText.trim()) {
    const match = fullText.match(/<answer>([\s\S]*?)<\/answer>/)
    rawAnswer = match ? match[1] : fullText
    const answer = rawAnswer.replace(ANSWER_TAG, '').trim()
    callbacks.onAnswer?.(answer)
    callbacks.onDone?.(answer)
    return answer
  }

  return rawAnswer.replace(ANSWER_TAG, '')
}
