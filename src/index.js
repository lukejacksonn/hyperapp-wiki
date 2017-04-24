import { h, app, Router } from 'hyperapp'
import marked from 'marked'
import urljoin from 'url-join'
import highlight from 'highlight.js'

import Linker from './plugins/linker'

marked.setOptions({
  highlight: (code) => highlight.highlightAuto(code).value
})

const handleErrors = res => {
  if (!res.ok) throw Error(res.statusText)
  return res
}

const localizePath = path =>
  !!location.hostname.match(/.*\.github\.io/)
  ? urljoin('/hyperapp-wiki/docs', path.replace('/hyperapp-wiki', '/'))
  : '/docs' + path

const fetchMarkdown = file =>
  fetch(`${localizePath(file)}.md`)
  .then(handleErrors)
  .then(data => data.text())
  .then(marked)

const Article = ({html, a}) =>
  <article class='markdown-body' onUpdate={ e => e.innerHTML = html }></article>

const Aside = ({html, a}) =>
  <aside class='markdown-body' onUpdate={ e => e.innerHTML = html }></aside>

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
    loaded: (s,a,d) =>
      fetchMarkdown('/CONTENTS')
      .then(a.setAside)
      .catch(a.setAside),
    route: (s,a,d) =>
      fetchMarkdown(
        localizePath(location.pathname) === localizePath('/')
        ? '/README'
        : location.pathname
      )
      .then(a.setArticle)
      .catch(a.setArticle),
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
