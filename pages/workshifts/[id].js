import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import { getWorkShifts, getWorkShiftsCount } from '../../src/gql/workShift'
import pageListStyle from '../../src/styleMUI/list'
import CardWorkshift from '../../components/CardWorkshift'
import LazyLoad from 'react-lazyload';
import { urlMain } from '../../src/const'
import { forceCheck } from 'react-lazyload';
import CardWorkshiftPlaceholder from '../../components/CardPlaceholder'
import { getClientGqlSsr } from '../../src/apollo'
import initialApp from '../../src/initialApp'
import Router from 'next/router'
import { useRouter } from 'next/router'
import { wrapper } from '../../src/redux/configureStore'
const height = 248
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

const Workshifts = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const router = useRouter()
    const { branch, cashbox, cashier, date, filter } = props.app;
    const initialRender = useRef(true);
    const getList = async ()=>{
        setList(await getWorkShifts({legalObject: router.query.id, skip: 0, ...branch?{branch: branch._id}:{}, ...cashier?{cashier: cashier._id}:{}, ...cashbox?{cashbox: cashbox._id}:{}, date, filter}))
        setCount(await getWorkShiftsCount({legalObject: router.query.id, ...branch?{branch: branch._id}:{}, ...cashier?{cashier: cashier._id}:{}, ...cashbox?{cashbox: cashbox._id}:{}, date, filter}));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
    }
    useEffect(()=>{
        (async()=>{
            if(initialRender.current)
                initialRender.current = false
            else
                await getList()
        })()
    },[branch, cashier, cashbox, date, filter])
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = await getWorkShifts({skip: list.length, legalObject: router.query.id, ...branch?{branch: branch._id}:{}, ...cashier?{cashier: cashier._id}:{}, ...cashbox?{cashbox: cashbox._id}:{}, date, filter})
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    return (
        <App dates={true} filters={filters} checkPagination={checkPagination} pageName='Смены' filterShow={{branch: true, cashbox: true, cashier: true}}>
            <Head>
                <title>Смены</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content='Смены' />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/workshifts/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/workshifts/${router.query.id}`}/>
            </Head>
            <div className='count'>
                {`Активно: ${count}`}
            </div>
            <div className={classes.page}>
                {list?list.map((element, idx)=>
                    <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardWorkshiftPlaceholder height={height}/>}>
                        <CardWorkshift list={list} key={element._id} setList={setList} element={element} idx={idx}/>
                    </LazyLoad>
                ):null}
            </div>
        </App>
    )
})

Workshifts.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
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
    return {
        data: {
            list: await getWorkShifts({skip: 0, legalObject: ctx.query.id,
                    ...store.getState().app.branch?{branch: store.getState().app.branch._id}:{},
                    ...store.getState().app.cashier?{cashier: store.getState().app.cashier._id}:{},
                    ...store.getState().app.cashbox?{cashbox: store.getState().app.cashbox._id}:{},
                    },
                ctx.req?await getClientGqlSsr(ctx.req):undefined),
            count: await getWorkShiftsCount({legalObject: ctx.query.id,
                ...store.getState().app.branch?{branch: store.getState().app.branch._id}:{},
                ...store.getState().app.cashier?{cashier: store.getState().app.cashier._id}:{},
                ...store.getState().app.cashbox?{cashbox: store.getState().app.cashbox._id}:{},
            }, ctx.req?await getClientGqlSsr(ctx.req):undefined),
        }
    };
});

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app,
    }
}

export default connect(mapStateToProps)(Workshifts);