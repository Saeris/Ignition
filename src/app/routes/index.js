import { ApolloProvider } from "react-apollo"
import { ConnectedRouter } from "react-router-redux"
import { apollo, store } from "@services"
import { Directory } from "@routes/directory"
import routes from "@routes/routes"

export const Root = () => (
  <ApolloProvider store={store.state} client={apollo}>
    <ConnectedRouter history={store.history}>
      <Directory paths={routes} />
    </ConnectedRouter>
  </ApolloProvider>
)
