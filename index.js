const { h, app, Router } = hyperapp

const localizePath = path => {
  if(!!location.hostname.match(/.*\.github\.io/))
  return 'hyperapp-wiki/pages/' + path.replace('/hyperapp-wiki/','')
  return 'pages/' + path.replace('/hyperapp-wiki/','')
}

const redirect = sessionStorage.redirect;
delete sessionStorage.redirect;
if (redirect && redirect != location.href) {
  history.replaceState(null, null, redirect);
}

/** @jsx h */

app({
  model: {
    menu: '',
    main: '',
  },
  actions: {
    setMenu: (m,d) => ({ menu: d }),
    setMain: (m,d) => ({ main: d }),
    fetch: (m,d,a) =>
      fetch(`/${localizePath(d)}.md`)
      .then(d => d.text())
      .then(marked)
      .then(DOMPurify.sanitize)
  },
  view: {
    '*': (m,a) =>
      <view->
        <nav>
          <icon-></icon->
          <h1>Hyperapp Docs</h1>
        </nav>
        <main>
          <aside onUpdate={e => e.innerHTML=m.menu}></aside>
          <article onUpdate={e => e.innerHTML=m.main}></article>
        </main>
      </view->
  },
  subscriptions: [
    (m,a) => a.fetch('Sidebar')
      .then(a.setMenu),
    (m,a) => a.fetch(location.pathname === '/hyperapp-wiki/' ? 'Home' : location.pathname)
      .then(emojione.shortnameToImage)
      .then(a.setMain)
      .then(() => setTimeout(hljs.initHighlighting, 0)),
    (m,a) =>
      addEventListener("click", (e) => {
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
            a.fetch(location.pathname === '/hyperapp-wiki/' ? 'Home' : location.pathname)
            .then(emojione.shortnameToImage)
            .then(a.setMain)
            .then(() => setTimeout(hljs.initHighlighting, 0))
          }
        }
      }),
  ],
  plugins: [Router],
})
