import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import { getReports, getReportsCount } from '../../src/gql/report'
import pageListStyle from '../../src/styleMUI/list'
import CardReport from '../../components/CardReport'
import { urlMain } from '../../src/const'
import LazyLoad from 'react-lazyload';
import { forceCheck } from 'react-lazyload';
import CardReportPlaceholder from '../../components/CardPlaceholder'
import { getClientGqlSsr } from '../../src/apollo'
import initialApp from '../../src/initialApp'
import Router from 'next/router'
import { useRouter } from 'next/router'
import { wrapper } from '../../src/redux/configureStore'
const height = 146

const Reports = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const router = useRouter()
    const { cashbox, date } = props.app;
    const initialRender = useRef(true);
    const getList = async ()=>{
        setList(await getReports({filter: router.query.type, legalObject: router.query.id, skip: 0, ...cashbox?{cashbox: cashbox._id}:{}, date}))
        setCount(await getReportsCount({filter: router.query.type, legalObject: router.query.id, ...cashbox?{cashbox: cashbox._id}:{}, date}));
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
    },[ cashbox, date, router.query.type])
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = await getReports({skip: list.length, legalObject: router.query.id})
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    return (
        <App checkPagination={checkPagination} dates={true} pageName={`${router.query.type}-Отчет`} filterShow={{cashbox: true, workShift: true}}>
            <Head>
                <title>{`${router.query.type}-Отчет`}</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content={`${router.query.type}-Отчет`} />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/reports/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/reports/${router.query.id}`}/>
            </Head>
            <div className='count'>
                {`Всего: ${count}`}
            </div>
            <div className={classes.page}>
                {list?list.map((element, idx)=>
                    <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardReportPlaceholder height={height}/>}>
                        <CardReport list={list} key={element._id} setList={setList} element={element} idx={idx}/>
                    </LazyLoad>
                ):null}
            </div>
        </App>
    )
})

Reports.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
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
            list: await getReports({filter: ctx.query.type, skip: 0, ...store.getState().app.cashbox?{cashbox: store.getState().app.cashbox._id}:{}, ...store.getState().app.workShift?{workShift: store.getState().app.workShift._id}:{}, legalObject: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            count: await getReportsCount({filter: ctx.query.type, ...store.getState().app.cashbox?{cashbox: store.getState().app.cashbox._id}:{}, ...store.getState().app.workShift?{workShift: store.getState().app.workShift._id}:{}, legalObject: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
        }
    };
});

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app,
    }
}

export default connect(mapStateToProps)(Reports);