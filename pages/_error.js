import Head from 'next/head'

const MyError = () => <div style={{
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    color: 'red'
}}>
    <Head>
        <title>Ошибка</title>
    </Head>
    <h1>
        Приносим извинения, но что-то пошло не так :(
    </h1>
</div>

export default MyError