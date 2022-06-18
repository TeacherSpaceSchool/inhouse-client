import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import { getPayments, getPaymentsCount } from '../src/gql/payment'
import pageListStyle from '../src/styleMUI/list'
import CardPayment from '../components/CardPayment'
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import { urlMain } from '../src/const'
import LazyLoad from 'react-lazyload';
import { forceCheck } from 'react-lazyload';
import CardPaymentPlaceholder from '../components/CardPlaceholder'
import { getClientGqlSsr } from '../src/apollo'
import initialApp from '../src/initialApp'
import Router from 'next/router'
import { wrapper } from '../src/redux/configureStore'
const height = 221

const Payment = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const { search, legalObject, date } = props.app;
    const { profile } = props.user;
    let searchTimeOut = useRef(null);
    const initialRender = useRef(true);
    const getList = async ()=>{
        setList(await getPayments({skip: 0, search, date, ...legalObject?{legalObject: legalObject._id}:{}}))
        setCount(await getPaymentsCount({search, date, ...legalObject?{legalObject: legalObject._id}:{}}));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
    }
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current) 
                await getList()
        })()
    },[legalObject, date])
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
    },[ search])
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = await getPayments({skip: list.length, search, ...legalObject?{legalObject: legalObject._id}:{}})
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    return (
        <App dates={true} checkPagination={checkPagination} searchShow={true} pageName='Платежи' filterShow={{legalObject: true}}>
            <Head>
                <title>Платежи</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content='Платежи' />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/payments`} />
                <link rel='canonical' href={`${urlMain}/payments`}/>
            </Head>
            <div className='count'>
                {`Всего: ${count}`}
            </div>
            <div className={classes.page}>
                {list?list.map((element, idx)=>
                    <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardPaymentPlaceholder height={height}/>}>
                        <CardPayment link='Payment' list={list} key={element._id} setList={setList} element={element} idx={idx}/>
                    </LazyLoad>
                ):null}
            </div>
            {
                profile.payment?
                    <Link href='/payment/[id]' as={`/payment/new`}>
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

Payment.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!(['admin', 'superadmin', 'управляющий', 'оператор'].includes(store.getState().user.profile.role)||['кассир', 'супервайзер'].includes(store.getState().user.profile.role)&&store.getState().user.profile.payment))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    if(store.getState().user.profile.legalObject)
        store.getState().app.legalObject = {_id: store.getState().user.profile.legalObject}
    else
        store.getState().app.legalObject = undefined
    return {
        data: {
            list: await getPayments({
                ...store.getState().app.legalObject?{legalObject: store.getState().app.legalObject._id}:{},
                skip: 0
            }, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            count: await getPaymentsCount({
                ...store.getState().app.legalObject?{legalObject: store.getState().app.legalObject._id}:{},
            }, ctx.req?await getClientGqlSsr(ctx.req):undefined),
        }
    };
})

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app,
    }
}

export default connect(mapStateToProps)(Payment);