import { Store, Lens } from "reactive-lens"
import { tag, s, VNode } from "snabbis"

export interface State {
  readonly greeting: string,
  readonly ticks: number,
  readonly interval: number,
  readonly active_timer: number | null
}

export const init: State = {
  greeting: 'snabbis-create-app',
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

export function View(store: Store<State>): VNode {
  const state = store.get()
  return tag('.container',
    tag('h1', state.greeting),
    tag('div', 'Greeting: ', s.input(store.at('greeting'))),
    tag('div', 'App running for ', state.ticks / 1000, ' s'),
    tag('div', 'Tick every ',
      tag('input',
        s.attrs({
          type: 'range',
          min: 100,
          max: 2000,
          step: 100,
        }),
        s.on('change')((e: Event) => store.at('interval').set((e.target as any).valueAsNumber)),
        s.on('input')((e: Event) => store.at('interval').set((e.target as any).valueAsNumber)),
        s.hook('insert')((vn: VNode) => vn.elm && ((vn.elm as HTMLInputElement).value = state.interval + ''))
      ),
      state.interval, ' ms')
    )
}
