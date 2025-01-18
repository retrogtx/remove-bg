import { NextResponse } from 'next/server'

// Initialize global event controllers if not exists
if (!global.eventControllers) {
  global.eventControllers = new Map()
}

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const clientId = crypto.randomUUID()
      global.eventControllers!.set(clientId, controller)

      return () => {
        global.eventControllers!.delete(clientId)
      }
    }
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}