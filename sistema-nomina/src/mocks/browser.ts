// src/mocks/browser.ts
if (import.meta.env.DEV) {
  const { setupWorker } = await import('msw/browser')
  // Import handlers robustly: support named export `handlers` or default export
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mod: any = await import('./handlers')
  const handlers = mod.handlers ?? mod.default ?? []
  const worker = setupWorker(...handlers)

  // Resuelve correctamente la ruta con el base de Vite
  const swUrl = `${import.meta.env.BASE_URL}mockServiceWorker.js`

  await worker.start({
    serviceWorker: { url: swUrl },
    onUnhandledRequest: 'bypass',
  })
}
