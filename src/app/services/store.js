import { createStore, combineReducers, compose, applyMiddleware } from "redux"
import { createLogger } from "redux-logger"
import { routerReducer, routerMiddleware, routerActions } from "react-router-redux"
import { persistStore, autoRehydrate } from "redux-persist"
import createHistory from "history/createBrowserHistory"
import { apollo } from "./apollo"

class Store {
  constructor() {
    this.history = createHistory()
    this.apollo = apollo.client
    this.state = this.configureStore()
    persistStore(this.state)
    this.state.dispatch({ type: `INIT_STATE` })
  }

  composeEnhancers = typeof window === `object` && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ routerActions })
    : compose

  createReducer(asyncReducers) {
    return combineReducers({
      //apollo: this.apollo.reducer(),
      router: routerReducer,
      ...asyncReducers
    })
  }

  configureStore() {
    const loggerMiddleware = createLogger()
    const store = createStore(
      this.createReducer(),
      this.composeEnhancers(
        //applyMiddleware(this.apollo.middleware()),
        applyMiddleware(routerMiddleware(this.history)),
        autoRehydrate(),
        applyMiddleware(loggerMiddleware)
      )
    )
    store.asyncReducers = {}
    return store
  }

  addReducer(name, reducer) {
    let newReducers = {}
    newReducers[`${name}`] = reducer
    this.state.asyncReducers = { ...this.state.asyncReducers, ...newReducers }
    this.state.replaceReducer(this.createReducer(this.state.asyncReducers))
  }
}

export const store = new Store()

export const Reducer = Class =>
  class extends Class {
    constructor(...args) {
      super(...args)
      this.addToStore()
    }

    addToStore = () => {
      const name = super.constructor.name.toLowerCase().replace(`reducer`, ``)
      store.addReducer(name, this.reducer)
    }
  }
