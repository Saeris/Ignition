import { ApolloClient, createBatchingNetworkInterface} from 'react-apollo'

class Apollo {
  constructor() {
    // http://dev.apollodata.com/core/network.html

    // Configure the client to use the api provider from our api config
    let networkInterface = createBatchingNetworkInterface({
      uri: `https://api.github.com/graphql`,
      batchInterval: 10
    })

    // Add authorization tokens to our request headers before making calls to the api
    networkInterface.use([{
      applyBatchMiddleware(req, next) {
        if (!req.options.headers) {
          req.options.headers = {}
        }
        //req.options.headers.authorization = `bearer ${token}`
        next()
      }
    }])

    this.client = new ApolloClient({
      networkInterface,
      queryDeduplication: true,
      dataIdFromObject: o => o.id
    })
  }
}

// Export our Apollo client instance as a singleton
export const apollo = new Apollo()
