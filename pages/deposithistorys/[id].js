import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import { getDepositHistorys, getDepositHistorysCount } from '../../src/gql/depositHistory'
import pageListStyle from '../../src/styleMUI/list'
import CardDepositHistorys from '../../components/CardDepositHistorys'
import { urlMain } from '../../src/const'
import LazyLoad from 'react-lazyload';
import { forceCheck } from 'react-lazyload';
import CardDepositHistorysPlaceholder from '../../components/CardPlaceholder'
import { getClientGqlSsr } from '../../src/apollo'
import initialApp from '../../src/initialApp'
import Router from 'next/router'
import { useRouter } from 'next/router'
import { wrapper } from '../../src/redux/configureStore'
const height = 194

const DepositHistorys = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const router = useRouter()
    const { branch, cashier, cashbox, workShift, date } = props.app;
    const initialRender = useRef(true);
    const getList = async ()=>{
        setList(await getDepositHistorys({legalObject: router.query.id, date, skip: 0, ...branch?{branch: branch._id}:{}, ...cashier?{cashier: cashier._id}:{}, ...cashbox?{cashbox: cashbox._id}:{}, ...workShift?{workShift: workShift._id}:{}}))
        setCount(await getDepositHistorysCount({legalObject: router.query.id, date, ...branch?{branch: branch._id}:{}, ...cashier?{cashier: cashier._id}:{}, ...cashbox?{cashbox: cashbox._id}:{}, ...workShift?{workShift: workShift._id}:{}}));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
    }
    useEffect(()=>{
        (async()=>{
            if(initialRender.current) {
                initialRender.current = false;
            } else {
                await getList()
            }
        })()
    },[branch, cashier, cashbox, workShift, date])
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = await getDepositHistorys({skip: list.length, date, legalObject: router.query.id, ...branch?{branch: branch._id}:{}, ...cashier?{cashier: cashier._id}:{}, ...cashbox?{cashbox: cashbox._id}:{}, ...workShift?{workShift: workShift._id}:{}})
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    return (
        <App checkPagination={checkPagination} dates={true} pageName='Внесение средств' filterShow={{branch: true, cashbox: true, cashier: true, workShift: true}}>
            <Head>
                <title>Внесение средств</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content='Внесение средств' />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/deposithistorys/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/deposithistorys/${router.query.id}`}/>
            </Head>
            <div className='count'>
                <div>{`Всего: ${count.count}`}</div>
                <div>{`Сумма: ${count.amount} сом`}</div>
            </div>
            <div className={classes.page}>
                {list?list.map((element, idx)=>
                    <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardDepositHistorysPlaceholder height={height}/>}>
                        <CardDepositHistorys list={list} key={element._id} setList={setList} element={element} idx={idx}/>
                    </LazyLoad>
                ):null}
            </div>
        </App>
    )
})

DepositHistorys.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', 'superadmin', 'управляющий', 'супервайзер', 'кассир'].includes(store.getState().user.profile.role))
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
            list: await getDepositHistorys({skip: 0,
                ...store.getState().app.workShift?{workShift: store.getState().app.workShift._id}:{},
                ...store.getState().app.cashier?{cashier: store.getState().app.cashier._id}:{},
                ...store.getState().app.cashbox?{cashbox: store.getState().app.cashbox._id}:{},
                ...store.getState().app.branch?{branch: store.getState().app.branch._id}:{},
                legalObject: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            count: await getDepositHistorysCount({
                ...store.getState().app.workShift?{workShift: store.getState().app.workShift._id}:{},
                ...store.getState().app.cashier?{cashier: store.getState().app.cashier._id}:{},
                ...store.getState().app.cashbox?{cashbox: store.getState().app.cashbox._id}:{},
                ...store.getState().app.branch?{branch: store.getState().app.branch._id}:{},
                legalObject: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
        }
    };
});

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app,
    }
}

export default connect(mapStateToProps)(DepositHistorys);