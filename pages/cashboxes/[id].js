import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import { getCashboxes, getCashboxesCount } from '../../src/gql/cashbox'
import pageListStyle from '../../src/styleMUI/list'
import CardCashbox from '../../components/CardCashbox'
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import { urlMain } from '../../src/const'
import LazyLoad from 'react-lazyload';
import { forceCheck } from 'react-lazyload';
import CardCashboxPlaceholder from '../../components/CardPlaceholder'
import { getClientGqlSsr } from '../../src/apollo'
import initialApp from '../../src/initialApp'
import Router from 'next/router'
import { wrapper } from '../../src/redux/configureStore'
import { useRouter } from 'next/router'
const height = 120
const filters = [
    {
        name: 'Все',
        value: ''
    },
    {
        name: 'Активные',
        value: 'active'
    }
]

const Cashboxes = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const router = useRouter()
    const { search, branch, filter } = props.app;
    const { profile } = props.user;
    let searchTimeOut = useRef(null);
    const initialRender = useRef(true);
    const getList = async ()=>{
        setList(await getCashboxes({legalObject: router.query.id, skip: 0, search, ...branch?{branch: branch._id}:{}, filter}))
        setCount(await getCashboxesCount({legalObject: router.query.id, search, ...branch?{branch: branch._id}:{}, filter}));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
    }
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current) {
                await getList()
            }
        })()
    },[filter, branch])
    useEffect(()=>{
        (async()=>{
            if(initialRender.current) {
                initialRender.current = false;
            } else {
                if(searchTimeOut.current)
                    clearTimeout(searchTimeOut.current)
                searchTimeOut.current = setTimeout(async()=>{
                    await getList()
                }, 500)

            }
        })()
    },[search])
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = await getCashboxes({skip: list.length, search, legalObject: router.query.id, ...branch?{branch: branch._id}:{}, filter})
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    return (
        <App filters={filters} checkPagination={checkPagination} searchShow={true} pageName='Кассы' filterShow={{branch: true}}>
            <Head>
                <title>Кассы</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content='Кассы' />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/cashboxs/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/cashboxs/${router.query.id}`}/>
            </Head>
            <div className='count'>
                {`Всего: ${count}`}
            </div>
            <div className={classes.page}>
                {list?list.map((element)=>
                    <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardCashboxPlaceholder height={height}/>}>
                        <CardCashbox list={list} element={element}/>
                    </LazyLoad>
                ):null}
            </div>
            {
                ['admin', 'superadmin', 'оператор'].includes(profile.role)&&profile.add?
                    <Link href='/cashbox/[id]' as={`/cashbox/new`}>
                        <Fab color='primary' aria-label='add' className={classes.fab}>
                            <AddIcon />
                        </Fab>
                    </Link>
                    :
                    null
            }
        </App>
    )
})

Cashboxes.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', 'superadmin', 'управляющий', 'супервайзер', 'оператор'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    store.getState().app.legalObject = {_id: ctx.query.id}
    return {
        data: {
            list: await getCashboxes({skip: 0, legalObject: ctx.query.id, ...store.getState().app.branch?{branch: store.getState().app.branch._id}:{}}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            count: await getCashboxesCount({legalObject: ctx.query.id, ...store.getState().app.branch?{branch: store.getState().app.branch._id}:{}}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
        }
    };
})

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app,
    }
}

export default connect(mapStateToProps)(Cashboxes);