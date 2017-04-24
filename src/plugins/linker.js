export default (options) => ({
  events: {
    loaded: (s,a) => addEventListener("click", (e) => {
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
          a.router.go(target.pathname)
        }
      }
    })
  }
})
