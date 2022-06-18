import * as React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import theme from '../src/styleMUI/theme';
import createEmotionCache from '../src/createEmotionCache';

export default class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
            <Head>
                <meta charSet='utf-8' />
                {/* PWA primary color */}
                <meta name="theme-color" content={theme.palette.primary.main} />
                <link rel="shortcut icon" href="/favicon.ico" />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                />
                <meta name='format-detection' content='telephone=no' />
                <meta httpEquiv='x-dns-prefetch-control' content='on'/>
                <link rel='shortcut icon' href={`/favicon.ico`} type='image/x-icon' />
                <link rel='manifest' href='/manifest.json'/>
                <link rel='icon' sizes='192x192' href='/192x192.png'/>
                <link rel='apple-touch-icon' href='/192x192.png'/>
                <meta name='msapplication-square310x310logo' content='/192x192.png'/>
                <meta name='google' content='notranslate'/>
                {/* Inject MUI styles first to match with the prepend: true configuration. */}
                {this.props.emotionStyleTags}
            </Head>
            <body>
            <Main />
            <NextScript />
            </body>
            </Html>
        );
    }
}

MyDocument.getInitialProps = async (ctx) => {

    const originalRenderPage = ctx.renderPage;

    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App) =>
                function EnhanceApp(props) {
                    return <App emotionCache={cache} {...props} />;
                },
        });

    const initialProps = await Document.getInitialProps(ctx);
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
        <style
            data-emotion={`${style.key} ${style.ids.join(' ')}`}
            key={style.key}
            dangerouslySetInnerHTML={{ __html: style.css }}
        />
    ));

    return {
        ...initialProps,
        emotionStyleTags,
    };
};