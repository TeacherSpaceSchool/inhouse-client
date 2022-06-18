import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActions from '../../src/redux/actions/user'
import { getNotificationStatistics, getNotificationStatisticCount } from '../../src/gql/notificationStatistic'
import pageListStyle from '../../src/styleMUI/list'
import CardNotificationStatistic from '../../components/CardNotificationStatistic'
import { urlMain } from '../../src/const'
import LazyLoad from 'react-lazyload';
import CardNotificationStatisticPlaceholder from '../../components/CardPlaceholder'
import { getClientGqlSsr } from '../../src/apollo'
import initialApp from '../../src/initialApp'
import Router from 'next/router'
import { forceCheck } from 'react-lazyload';
import { wrapper } from '../../src/redux/configureStore'
const height = 440

const NotificationStatistic = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const { search } = props.app;
    const { profile } = props.user;
    let searchTimeOut = useRef(null);
    const initialRender = useRef(true);
    const getList = async ()=>{
        setList((await getNotificationStatistics({search, skip: 0})));
        setCount(await getNotificationStatisticCount({search}));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
    }
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
        if(paginationWork&&!initialRender.current){
            let addedList = await getNotificationStatistics({skip: list.length, search})
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    return (
        <App searchShow={true} checkPagination={checkPagination} pageName='Пуш-уведомления'>
            <Head>
                <title>Пуш-уведомления</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content='Пуш-уведомления' />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:image:width' content='512' />
                <meta property='og:image:height' content='512' />
                <meta property='og:url' content={`${urlMain}/notificationStatistic`} />
                <link rel='canonical' href={`${urlMain}/notificationStatistic`}/>
            </Head>
            <div className='count'>
                {`Всего: ${count}`}
            </div>
            <div className={classes.page}>
                {
                    profile.add?
                        <CardNotificationStatistic setList={setList} list={list}/>
                        :
                        null
                }
                {list?list.map((element)=>
                    <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardNotificationStatisticPlaceholder height={height}/>}>
                        <CardNotificationStatistic element={element}/>
                    </LazyLoad>
                ):null}
            </div>
        </App>
    )
})

NotificationStatistic.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', 'superadmin'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    return {
        data: {
            list: await getNotificationStatistics({search: '', skip: 0}, ctx.req ? await getClientGqlSsr(ctx.req) : undefined),
            count: await getNotificationStatisticCount({search: ''}, ctx.req ? await getClientGqlSsr(ctx.req) : undefined)
        }
    };
});

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationStatistic);