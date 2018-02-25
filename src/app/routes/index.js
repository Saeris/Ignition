import { ApolloProvider } from "react-apollo"
import { MemoryRouter } from "react-router"
import { apollo } from "@services"
import { Layout } from "@components/structural"
import { Directory } from "@routes/directory"
import routes from "@routes/routes"

export const Root = () => (
  <ApolloProvider client={apollo}>
    <MemoryRouter>
      <Layout>
        <Directory paths={routes} />
      </Layout>
    </MemoryRouter>
  </ApolloProvider>
)
