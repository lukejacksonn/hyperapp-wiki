import { h, app, Router } from 'hyperapp'
import marked from 'marked'
import highlight from 'highlight.js'

import Linker from './plugins/linker'

marked.setOptions({
  highlight: (code) => highlight.highlightAuto(code).value
})

const fetchMarkdown = x =>
  fetch(`${
    x === '/' ? '/docs/README' : x
  }.md`)
  .then(data => data.text())
  .then(marked)

const Article = ({html, a}) => {

  html ? null :
    fetchMarkdown(location.pathname)
    .then(a.setArticle)

  return <article class='markdown-body' onUpdate={ e => e.innerHTML = html }></article>

}

const Aside = ({html, a}) => {

  html ? null :
    fetchMarkdown('/docs/CONTENTS')
    .then(a.setAside)

  return <aside class='markdown-body' onUpdate={ e => e.innerHTML = html }></aside>

}

app({
  state: {
    aside: '',
    article: '',
  },
  actions: {
    setArticle: (s,d) => ({ article: d }),
    setAside: (s,d) => ({ aside: d }),
  },
  events: {
    route: (s,a,d) => {
      fetchMarkdown(location.pathname)
      .then(a.setArticle)
    },
  },
  view: (s,a,d) =>
    <page->
      <header>
        <icon-></icon->
        <h1>Hyperapp Docs</h1>
      </header>
      <main>
        <Aside html={s.aside} a={a} />
        <Article html={s.article} a={a} />
      </main>
    </page->,
  plugins: [Router, Linker],
})
