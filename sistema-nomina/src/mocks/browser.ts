// src/mocks/browser.ts
if (import.meta.env.DEV) {
  const { setupWorker } = await import('msw/browser')
  const { handlers } = await import('./handlers')
  const worker = setupWorker(...handlers)

  // Resuelve correctamente la ruta con el base de Vite
  const swUrl = `${import.meta.env.BASE_URL}mockServiceWorker.js`

  await worker.start({
    serviceWorker: { url: swUrl },
  })
}
