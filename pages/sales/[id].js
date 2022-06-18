import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import { getSales, getSalesCount } from '../../src/gql/sale'
import pageListStyle from '../../src/styleMUI/list'
import CardSale from '../../components/CardSale'
import { urlMain } from '../../src/const'
import LazyLoad from 'react-lazyload';
import { forceCheck } from 'react-lazyload';
import CardSalePlaceholder from '../../components/CardPlaceholder'
import { getClientGqlSsr } from '../../src/apollo'
import initialApp from '../../src/initialApp'
import Router from 'next/router'
import { useRouter } from 'next/router'
import { wrapper } from '../../src/redux/configureStore'
const height = 227
const filters = [
    {
        name: 'Все',
        value: ''
    },
    {
        name: 'Продажа',
        value: 'Продажа'
    },
    {
        name: 'Кредит',
        value: 'Кредит'
    },
    {
        name: 'Возврат',
        value: 'Возврат'
    },
    {
        name: 'Погашение кредита',
        value: 'Погашение кредита'
    },
    {
        name: 'Аванс',
        value: 'Аванс'
    },
    {
        name: 'Возврат аванса',
        value: 'Возврат аванса'
    }
]

const Sale = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const router = useRouter()
    const { branch, cashbox, cashier, date, filter, workShift, client } = props.app;
    let [show, setShow] = useState(false);
    const initialRender = useRef(true);
    const getList = async ()=>{
        setList(await getSales({legalObject: router.query.id, skip: 0, date, ...client?{client: client._id}:{},  ...workShift?{workShift: workShift._id}:{}, ...branch?{branch: branch._id}:{}, ...cashbox?{cashbox: cashbox._id}:{}, ...cashier?{cashier: cashier._id}:{}, type: filter}))
        setCount(await getSalesCount({legalObject: router.query.id, date, ...client?{client: client._id}:{}, ...workShift?{workShift: workShift._id}:{}, ...branch?{branch: branch._id}:{}, ...cashbox?{cashbox: cashbox._id}:{}, ...cashier?{cashier: cashier._id}:{}, type: filter}));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
    }
    useEffect(()=>{
        (async()=>{
            if(initialRender.current)
                initialRender.current = false;
            else
                await getList()
        })()
    },[date, branch, cashbox, cashier, filter, workShift, client])
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = await getSales({skip: list.length, legalObject: router.query.id, date, ...client?{client: client._id}:{}, ...workShift?{workShift: workShift._id}:{}, ...branch?{branch: branch._id}:{}, ...cashbox?{cashbox: cashbox._id}:{}, ...cashier?{cashier: cashier._id}:{}, type: filter})
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    return (
        <App dates={true} checkPagination={checkPagination} filters={filters} pageName='Операции' filterShow={{workShift: true, branch: true, cashbox: true, cashier: true, client: true}}>
            <Head>
                <title>Операции</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content='Операции' />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/sales/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/sales/${router.query.id}`}/>
            </Head>
            <div className='count' onClick={()=>setShow(!show)}>
                {`Всего: ${count.count}`}
                {
                    show?
                        <>
                        <div>
                            {`Продажи: ${count.sale} сом`}
                        </div>
                        {
                            count.returned?
                                <div>
                                    {`Возвраты: ${count.returned} сом`}
                                </div>
                                :
                                null
                        }
                        {
                            count.consignation?
                                <div>
                                    {`Кредит: ${count.consignation} сом`}
                                </div>
                                :
                                null
                        }
                        {
                            count.paidConsignation?
                                <div>
                                    {`Погашение кредита: ${count.paidConsignation} сом`}
                                </div>
                                :
                                null
                        }
                        {
                            count.prepayment?
                                <div>
                                    {`Авансы: ${count.prepayment} сом`}
                                </div>
                                :
                                null
                        }
                        {
                            count.discount?
                                <div>
                                    {`Скидка: ${count.discount} сом`}
                                </div>
                                :
                                null
                        }
                        {
                            count.extra?
                                <div>
                                    {`Наценка: ${count.extra} сом`}
                                </div>
                                :
                                null
                        }
                        </>
                        :
                        null
                }
            </div>
            <div className={classes.page}>
                {list?list.map((element, idx)=> {
                    if(idx<=data.limit)
                        return <CardSale element={element} limit={list.length} path={router.asPath}/>
                    else
                        return <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true} placeholder={<CardSalePlaceholder height={height}/>}>
                                   <CardSale element={element} limit={list.length} path={router.asPath}/>
                               </LazyLoad>
                }):null}
            </div>
        </App>
    )
})

Sale.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', 'superadmin', 'управляющий', 'кассир', 'супервайзер'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    store.getState().app.legalObject = {_id: ctx.query.id}
    let limit
    if(process.browser&&sessionStorage.scrollPostionLimit)
        limit = parseInt(sessionStorage.scrollPostionLimit)
    return {
        data: {
            limit,
            list: await getSales({
                skip: 0,
                limit,
                legalObject: ctx.query.id,
                ...store.getState().app.workShift?{workShift: store.getState().app.workShift._id}:{},
                ...store.getState().app.cashier?{cashier: store.getState().app.cashier._id}:{},
                ...store.getState().app.cashbox?{cashbox: store.getState().app.cashbox._id}:{},
                ...store.getState().app.client?{client: store.getState().app.client._id}:{},
                ...store.getState().app.branch?{branch: store.getState().app.branch._id}:{}}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            count: await getSalesCount({legalObject: ctx.query.id, ...store.getState().app.workShift?{workShift: store.getState().app.workShift._id}:{}, ...store.getState().app.cashier?{cashier: store.getState().app.cashier._id}:{}, ...store.getState().app.client?{client: store.getState().app.client._id}:{}, ...store.getState().app.cashbox?{cashbox: store.getState().app.cashbox._id}:{}, ...store.getState().app.branch?{branch: store.getState().app.branch._id}:{}}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
        }
    };
});

function mapStateToProps (state) {
    return {
        app: state.app,
    }
}

export default connect(mapStateToProps)(Sale);