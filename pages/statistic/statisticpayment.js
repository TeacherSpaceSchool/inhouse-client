import Head from 'next/head';
import React, { useEffect, useState, useRef } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import pageListStyle from '../../src/styleMUI/list'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Router from 'next/router'
import { urlMain } from '../../src/const'
import initialApp from '../../src/initialApp'
import Table from '../../components/app/Table'
import { getClientGqlSsr } from '../../src/apollo'
import { getStatisticPayment } from '../../src/gql/statistic'
import { bindActionCreators } from 'redux'
import * as appActions from '../../src/redux/actions/app'
import { wrapper } from '../../src/redux/configureStore'

const StatisticPayment = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const [statistic, setStatistic] = useState(data);
    const { isMobileApp, date } = props.app;
    const initialRender = useRef(true);
    useEffect(()=>{
        if(process.browser){
            let appBody = document.getElementsByClassName('App-body')
            appBody[0].style.paddingBottom = '0px'
        }
    },[process.browser])
    useEffect(()=>{
        (async()=>{
            if(initialRender.current) {
                initialRender.current = false;
            } else {
                setStatistic(await getStatisticPayment({dateStart: date}))
            }
        })()
    },[date])
    return (
        <App dates={true} pageName='Статистика платежей' searchShow>
            <Head>
                <title>Статистика платежей</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content='Статистика платежей' />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/statistic/statisticpayment`} />
                <link rel='canonical' href={`${urlMain}/statistic/statisticpayment`}/>
            </Head>
            <Card className={classes.page}>
                <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignItems: 'flex-start'}}>
                    {
                        statistic?
                            <>
                            <Table row={(statistic.row).slice(1)} columns={statistic.columns}/>
                            <div className='count'>
                                <div className={classes.rowStatic}>{`Выручка: ${statistic.row[0].data[0]} сом`}</div>
                                <div className={classes.rowStatic}>{`Возвраты: ${statistic.row[0].data[1]} сом`}</div>
                            </div>
                            </>
                            :
                            null
                    }
                </CardContent>
            </Card>
        </App>
    )
})

StatisticPayment.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    store.getState().app.filter = false
    if(!['admin', 'superadmin'].includes(store.getState().user.profile.role)||!store.getState().user.profile.statistic)
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    let dateStart = new Date()
    if (dateStart.getHours()<3)
        dateStart.setDate(dateStart.getDate() - 1)
    return {
        data: await getStatisticPayment({}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
    };
});

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

function mapDispatchToProps(dispatch) {
    return {

        appActions: bindActionCreators(appActions, dispatch),

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StatisticPayment);