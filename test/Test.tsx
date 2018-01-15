import * as App from '../src/App'
import {Store} from 'reactive-lens'
import * as React from 'react'
import {shallow, configure} from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import {test} from 'ava'

configure({adapter: new Adapter()})

test('View', t => {
  const store = Store.init(App.init)

  const view = () => shallow(App.View(store))

  const sanity = () => {
    t.regex(view().text(), new RegExp(store.get().greeting))
    t.regex(view().text(), new RegExp('' + store.get().count))
    t.regex(view().text(), new RegExp('' + store.get().increase))
  }

  sanity()

  store.on(s => {
    t.log(App.json(s))
    t.log(view().debug())
    t.snapshot(s)
    t.snapshot(view().debug())
    sanity()
  })

  view().find('Input').dive().simulate('Change', {target: {value: 'testing with enzyme'}})
  view().find('button').simulate('Click')
  view().find('ValueInput').dive().simulate('Change', {target: {valueAsNumber: 5}})
  view().find('button').simulate('Click')
})

