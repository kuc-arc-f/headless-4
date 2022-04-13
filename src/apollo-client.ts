import { ApolloClient, InMemoryCache } from "@apollo/client";

//console.log("APOLLO_SV_URI=", process.env.APOLLO_SV_URI);
const client = new ApolloClient({
  uri: process.env.APOLLO_SV_URI,
  cache: new InMemoryCache(),
});

export default client;
