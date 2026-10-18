export const INP_BLOCKING_DELAY_MS = 450;

export function blockMainThread(durationInMs: number) {
  const startTime = globalThis.performance.now();

  while (globalThis.performance.now() - startTime < durationInMs) {
    // Intentionally empty: this simulates synchronous work blocking the main thread.
  }
}
