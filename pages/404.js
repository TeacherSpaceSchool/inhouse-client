import Head from 'next/head'

const My404 = () => <div style={{
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
    padding: 20
}}>
    <Head>
        <title>404</title>
    </Head>
    <h1>
        Этой страницы не существет :(
    </h1>
</div>

export default My404