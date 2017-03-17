const { h, app } = hyperapp
const html = hyperx(h)
const htmlify = selector => () => {
  const $ = document.querySelector(selector)
  $.innerHTML = $.textContent
}

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
  view: (m,a) => html`
    <view->
      <nav>
        <icon-></icon->
        <h1>Hyperapp Docs</h1>
      </nav>
      <main>
        <aside>${m.menu}</aside>
        <article>${m.main}</article>
      </main>
    </view->`,
  subscriptions: [
    (m,a) => a.fetch('Sidebar')
      .then(a.setMenu)
      .then(htmlify('aside')),
    (m,a) => a.fetch(location.pathname === '/hyperapp-wiki/' ? 'Home' : location.pathname)
      .then(emojione.shortnameToImage)
      .then(a.setMain)
      .then(htmlify('article'))
      .then(hljs.initHighlighting),
  ],
})
