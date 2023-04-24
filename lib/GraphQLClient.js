import { GraphQLClient }                    from "graphql-request";
import { SHPF_ENDPOINT, SHPF_ACCESS_TOKEN } from "./config.js";

const endpoint = SHPF_ENDPOINT;
const headers = {
    "X-Shopify-Access-Token": SHPF_ACCESS_TOKEN
};

const client = new GraphQLClient(endpoint, { headers });

export default client;