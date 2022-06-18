import { urlGQLSSR, urlGQL, urlGQLws } from './const';
import { getJWT } from './lib'
import { store } from './redux/configureStore'
import { createUploadLink } from 'apollo-upload-client'
import { split, ApolloLink, ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { showSnackBar } from './redux/actions/snackbar'
let client, jwt

export const getClientGql = (req) => {
    if(client)
        return client
    if(!jwt)
        jwt = getJWT(req?req.headers.cookie:document&&document.cookie?document.cookie:'')
    const uploadLink = createUploadLink({
        uri: urlGQL,
        credentials: 'include'
    });
    const authLink = new ApolloLink((operation, forward) => {
        operation.setContext(({ headers }) => {
            return {
                headers: {
                    ...headers,
                    authorization: jwt ? `Bearer ${jwt}` : '',
                }
            }
        });
        return forward(operation);
    });
    const linkError = onError((ctx) => {
        if (ctx.graphQLErrors)
            ctx.graphQLErrors.map(({ message, locations, path }) =>{
                if(store) {
                    store.dispatch(showSnackBar('Ошибка', 'error'))
                }
                console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
            });
        if (ctx.networkError) console.log(`[Network error]: ${ctx.networkError}`);
    });
    let mainLink;
    if(jwt) {
        const wsLink = new GraphQLWsLink(
            createClient({
                url: urlGQLws,
                reconnect: true,
                connectionParams: {
                    authorization: jwt ? `Bearer ${jwt}` : ''
                }
            }),
        );
        mainLink = split(
            ({query}) => {
                const definition = getMainDefinition(query);
                return (
                    definition.kind === 'OperationDefinition' &&
                    definition.operation === 'subscription'
                );
            },
            wsLink,
            uploadLink,
        );
    }
    else
        mainLink = uploadLink
    const link = ApolloLink.from([
        linkError,
        authLink,
        mainLink
    ]);
    client = new ApolloClient({
        ssrMode: true,
        link: link,
        cache: new InMemoryCache(),
        defaultOptions: {
            watchQuery: {
                fetchPolicy: 'cache-and-network',
                errorPolicy: 'ignore',
            },
            query: {
                fetchPolicy: 'network-only',
                errorPolicy: 'all',
            },
            mutate: {
                errorPolicy: 'all',
            },
        },

    })
    return client

}

export const getClientGqlSsr = (req) => {
    const httpLink = new HttpLink({ uri: urlGQLSSR });
    const authLink = new ApolloLink((operation, forward) => {
        operation.setContext(({ headers }) => {
            if(req) {
                let jwt = getJWT(req.headers.cookie)
                return {
                    headers: {
                        ...headers,
                        authorization: jwt ? `Bearer ${jwt}` : '',
                    }
                }
            }
            else return {
                headers
            }
        });
        return forward(operation);
    });
    const link = ApolloLink.from([
        authLink,
        httpLink
    ]);
    return new ApolloClient({
        ssrMode: true,
        link: link,
        cache: new InMemoryCache(),
        defaultOptions: {
            watchQuery: {
                fetchPolicy: 'cache-and-network',
                errorPolicy: 'ignore',
            },
            query: {
                fetchPolicy: 'network-only',
                errorPolicy: 'all',
            },
            mutate: {
                errorPolicy: 'all',
            },
        },

    })
}