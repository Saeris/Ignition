import { Route } from "react-router"
import { ApolloProvider } from "react-apollo"
import { ConnectedRouter } from "react-router-redux"
import { apollo, store } from "../services"
import Home from "./home/home"

export const Root = () =>
  <ApolloProvider store={store.state} client={apollo.client}>
    <ConnectedRouter history={store.history}>
      <Route exact path="/" component={Home} />
    </ConnectedRouter>
  </ApolloProvider>
