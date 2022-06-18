import Head from 'next/head';
import React, { useEffect } from 'react';
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
import { getStatisticStorageSize } from '../../src/gql/statistic'
import { bindActionCreators } from 'redux'
import * as appActions from '../../src/redux/actions/app'
import { wrapper } from '../../src/redux/configureStore'

const StatisticStorageSize = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const { isMobileApp } = props.app;
    useEffect(()=>{
        if(process.browser){
            let appBody = document.getElementsByClassName('App-body')
            appBody[0].style.paddingBottom = '0px'
        }
    },[process.browser])
    return (
        <App pageName='Хранилище коллекций' searchShow>
            <Head>
                <title>Хранилище коллекций</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content='Хранилище коллекций' />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/statistic/statisticstoragesize`} />
                <link rel='canonical' href={`${urlMain}/statistic/statisticstoragesize`}/>
            </Head>
            <Card className={classes.page}>
                <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignItems: 'flex-start'}}>
                    {
                        data?
                            <>
                            <Table row={(data.row).slice(1)} columns={data.columns}/>
                            <div className='count'>
                                <div className={classes.rowStatic}>{`Вес: ${data.row[0].data[0]} MB`}</div>
                                <div className={classes.rowStatic}>{`Объектов: ${data.row[0].data[1]} штук`}</div>
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

StatisticStorageSize.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    store.getState().app.filter = false
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
            ...await getStatisticStorageSize(ctx.req?await getClientGqlSsr(ctx.req):undefined)
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(StatisticStorageSize);