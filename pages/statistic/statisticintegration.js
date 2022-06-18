import Head from 'next/head';
import React, { useEffect, useState } from 'react';
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
import { getStatisticIntegration } from '../../src/gql/statistic'
import { bindActionCreators } from 'redux'
import * as appActions from '../../src/redux/actions/app'
import { wrapper } from '../../src/redux/configureStore'

const StatisticIntegration = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const { isMobileApp } = props.app;
    let [show, setShow] = useState(false);
    useEffect(()=>{
        if(process.browser){
            let appBody = document.getElementsByClassName('App-body')
            appBody[0].style.paddingBottom = '0px'
        }
    },[process.browser])
    return (
        <App pageName='Ошибка синхронизации ККМ' searchShow>
            <Head>
                <title>Ошибка синхронизации ККМ</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content='Ошибка синхронизации ККМ' />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/statistic/statisticintegration`} />
                <link rel='canonical' href={`${urlMain}/statistic/statisticintegration`}/>
            </Head>
            <Card className={classes.page}>
                <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignItems: 'flex-start'}}>
                    {
                        data?
                            <>
                            <Table row={(data.row).slice(1)} columns={data.columns} click={2}/>
                            <div className='count' onClick={()=>{setShow(!show)}}>
                                <div className={classes.rowStatic}>{`Всего: ${data.row[0].data[6]}`}</div>
                                {
                                    show?
                                        <>
                                        <div className={classes.rowStatic}>{`Налогоплательщики: ${data.row[0].data[0]}`}</div>
                                        <div className={classes.rowStatic}>{`Объекты: ${data.row[0].data[1]}`}</div>
                                        <div className={classes.rowStatic}>{`Кассы: ${data.row[0].data[2]}`}</div>
                                        <div className={classes.rowStatic}>{`Смены: ${data.row[0].data[3]}`}</div>
                                        <div className={classes.rowStatic}>{`Операции: ${data.row[0].data[4]}`}</div>
                                        <div className={classes.rowStatic}>{`Отчеты: ${data.row[0].data[5]}`}</div>
                                        </>
                                        :
                                        null
                                }
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

StatisticIntegration.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
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
    return {
        data: await getStatisticIntegration(ctx.req?await getClientGqlSsr(ctx.req):undefined)
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

export default connect(mapStateToProps, mapDispatchToProps)(StatisticIntegration);