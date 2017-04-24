import urljoin from 'url-join'
export default (options) => ({
  events: {
    loaded: (s,a) => addEventListener("click", (e) => {

      const localizePath = path =>
        !!location.hostname.match(/.*\.github\.io/)
        ? urljoin('/hyperapp-wiki', path.replace('/hyperapp-wiki', '/'))
        : path

      if (e.metaKey || e.shiftKey || e.ctrlKey || e.altKey) return
      var target = e.target
      while (target && target.localName !== "a") {
        target = target.parentNode
      }
      if (target && target.host === location.host && !target.hasAttribute("data-no-routing")) {
        var element = document.querySelector(target.hash === "" ? element : target.hash)
        if (element) {
          element.scrollIntoView(true)
        } else {
          e.preventDefault()
          a.router.go(localizePath(target.pathname))
        }
      }
    })
  }
})
