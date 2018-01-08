import * as React from 'react'
import { Store, Lens } from "reactive-lens"

type VNode = React.ReactElement<{}>

export interface State {
  readonly greeting: string,
  readonly ticks: number,
  readonly interval: number,
  readonly active_timer: number | null
}

export const init: State = {
  greeting: 'reactive-lens-create-app',
  ticks: 0,
  interval: 1000,
  active_timer: null
}

export function json(s: any): string {
  return JSON.stringify(s, undefined, 2)
}

export function App(store: Store<State>): () => VNode {
  const global = window as any
  global.store = store
  global.reset = () => store.set(init)
  store.on(x => console.log(json(x)))
  store.storage_connect('snabbis-create-app')
  function timer() {
    const { active_timer } = store.get()
    if (active_timer !== null) {
      console.log(active_timer)
      window.clearTimeout(active_timer)
    }
    const delay = store.get().interval
    store.at('active_timer').set(
      window.setTimeout(() => (store.at('ticks').modify(x => x + delay)), delay)
    )
  }
  timer()
  store.at('ticks').ondiff((new_value, old_value) => new_value != old_value && timer())
  return () => View(store)
}

export const Input = (store: Store<string>) =>
  <input value={store.get()} onChange={(e: React.ChangeEvent<HTMLInputElement>) => store.set(e.target.value)}/>

export const RangeInput = ({store, ...props}: {store: Store<number>} & React.InputHTMLAttributes<HTMLInputElement>) =>
  <input {...props} type="range" value={store.get()} onChange={(e: React.ChangeEvent<HTMLInputElement>) => store.set(e.target.valueAsNumber)}/>

export function View(store: Store<State>): VNode {
  const state = store.get()
  return (
    <div className="container">
      <h1>{state.greeting}</h1>
      <div>Greeting: {Input(store.at('greeting'))}</div>
      <div>App running for {state.ticks / 1000}s</div>
      <div>Tick every
        <RangeInput store={store.at('interval')} type="range" min="100" max="2000" step="100"/>
        {state.interval} ms
      </div>
    </div>
  )
}
