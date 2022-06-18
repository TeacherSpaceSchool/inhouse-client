import Head from 'next/head'

const MyError = () => <div style={{
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}}>
    <Head>
        <title>Нет подключения к УНО и ОФД</title>
    </Head>
    <h1>
        Нет подключения к УНО и ОФД
    </h1>
</div>

export default MyError