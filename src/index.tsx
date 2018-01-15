import * as App from './App'
import './index.css'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Store, attach} from 'reactive-lens'

const root = document.getElementById('root') as HTMLElement
const reattach = attach(vn => ReactDOM.render(vn, root), App.init, App.App)

declare const module: any
declare const require: any

if (module.hot) {
  module.hot.accept(() => {
    try {
      reattach(require('./App.tsx').App)
    } catch (e) {
      console.error(e)
    }
  })
}
