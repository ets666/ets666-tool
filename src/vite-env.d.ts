/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface Window {
  electron?: {
    ping: () => void
  }
  ipc: {
    invoke: (channel: string, ...args: any[]) => Promise<any>
    send: (channel: string, ...args: any[]) => void
    on: (channel: string, listener: (event: any, ...args: any[]) => void) => void
    removeListener: (channel: string, listener: (event: any, ...args: any[]) => void) => void
  }
}