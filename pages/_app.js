import '../scss/app.scss'
import * as React from 'react';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import theme from '../src/styleMUI/theme';
import createEmotionCache from '../src/createEmotionCache';
import { wrapper } from '../src/redux/configureStore'
import { ApolloProvider } from '@apollo/client';
import { getClientGql, getClientGqlSsr } from '../src/apollo'
import 'react-awesome-lightbox/build/style.css';
import { register, checkDisableSubscribe } from '../src/subscribe'

const clientSideEmotionCache = createEmotionCache();

function MyApp(props) {
    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
    const client = process.browser?getClientGql():getClientGqlSsr()
    if(process.browser){
        checkDisableSubscribe()
        register(true)
    }
    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" />
            </Head>
            <ApolloProvider client={client}>
                <ThemeProvider theme={theme}>
                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                    <CssBaseline />
                    <Component {...pageProps} />
                </ThemeProvider>
            </ApolloProvider>
        </CacheProvider>
    );
}

export default wrapper.withRedux(MyApp)