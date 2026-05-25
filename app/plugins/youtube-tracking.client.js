export default defineNuxtPlugin(() => {
  window.addEventListener('message', (event) => {
    if (event.origin !== 'https://www.youtube.com') return
    try {
      const data = JSON.parse(event.data)
      if (data.event === 'onStateChange' && data.info === 1) {
        window.umami?.track('youtube-play')
      }
    } catch {}
  })
})
