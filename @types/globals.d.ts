import { ReadableStreamDefaultController } from 'stream/web'

declare global {
  /* eslint-disable-next-line no-var */
  var eventControllers: Map<string, ReadableStreamDefaultController> | undefined
}

// Need this to make it a module and be picked up by TypeScript
export {} 