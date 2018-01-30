import * as App from './App'
import './index.css'
import * as ReactDOM from 'react-dom'
import {Store, attach} from 'reactive-lens'

declare const module: {hot: {accept: Function}}

const global = window as any as {reattach: Function}

if (global.reattach === undefined) {
  const root = document.body.appendChild(document.createElement('div'))
  global.reattach = attach(vn => ReactDOM.render(vn, root), App.init, App.App)
}

if (module.hot) {
  module.hot.accept(() => {
    global.reattach(App.App)
  })
}
