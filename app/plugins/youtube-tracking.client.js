export default defineNuxtPlugin(() => {
  const attachPlayers = () => {
    const iframes = document.querySelectorAll('iframe[src*="youtube.com/embed"][src*="enablejsapi"]')
    iframes.forEach(iframe => {
      if (iframe.dataset.ytInit) return
      iframe.dataset.ytInit = '1'
      new window.YT.Player(iframe, {
        events: {
          onStateChange: (e) => {
            if (e.data === 1) window.umami?.track('youtube-play')
          }
        }
      })
    })
  }

  const loadAPI = () => {
    if (window.YT?.Player) {
      attachPlayers()
      return
    }
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
    window.onYouTubeIframeAPIReady = attachPlayers
  }

  const router = useRouter()
  router.afterEach(() => nextTick(loadAPI))
  nextTick(loadAPI)
})
