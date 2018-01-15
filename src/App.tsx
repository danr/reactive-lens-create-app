import * as React from 'react'
import {Store} from 'reactive-lens'

type VNode = React.ReactElement<{}>

export interface State {
  readonly greeting: string
  readonly count: number
  readonly increase: number
}

export const init: State = {
  greeting: 'reactive-lens-create-app',
  count: 0,
  increase: 1,
}

export const json = (s: any) => JSON.stringify(s, undefined, 2)

export function App(store: Store<State>): () => VNode {
  const global = window as any
  global.store = store
  global.reset = () => store.set(init)
  store.on(x => console.log(json(x)))
  store.storage_connect('snabbis-create-app')
  store.at('greeting').location_connect(s => s, s => s.slice(1))
  return () => View(store)
}

export function View(store: Store<State>): VNode {
  const state = store.get()
  return (
    <div className="container">
      <h1>{state.greeting}</h1>
      <div>
        Greeting: <Input store={store.at('greeting')} />
      </div>
      <div>
        <span>Counter: {state.count} </span>
        <button onClick={() => store.update({count: state.count + state.increase})}>+</button>
      </div>
      <div>
        Increase by
        <ValueInput type="range" store={store.at('increase')} min={-1} max={5} />
        {state.increase}
      </div>
    </div>
  )
}

type InputAttrs = React.InputHTMLAttributes<HTMLInputElement>

function Input({store, ...props}: {store: Store<string>} & InputAttrs) {
  return <input {...props} value={store.get()} onChange={e => store.set(e.target.value)} />
}

function ValueInput({store, ...props}: {store: Store<number>} & InputAttrs) {
  return <input {...props} value={store.get()} onChange={e => store.set(e.target.valueAsNumber)} />
}
