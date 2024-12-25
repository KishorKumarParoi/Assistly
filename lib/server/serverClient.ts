import {
  ApolloClient,
  createHttpLink,
  DefaultOptions,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

export const BASE_URL =
  process.env.NODE_ENV !== "development"
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000";

const httpLink = createHttpLink({
  uri: `${BASE_URL}/api/graphql`, // Point to new api route
});

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
  mutate: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
};

const serverClient = new ApolloClient({
  ssrMode: true,
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Apikey ${process.env.NEXT_PUBLIC_GRAPHQL_TOKEN}`,
    },
    fetch,
  }),
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
});

export default serverClient;
