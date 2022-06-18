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
import { getStatisticActivityLegalObject } from '../../src/gql/statistic'
import { bindActionCreators } from 'redux'
import * as appActions from '../../src/redux/actions/app'
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { getUsers } from '../../src/gql/user'
import AutocomplectOnline from '../../components/app/AutocomplectOnline'
import { wrapper } from '../../src/redux/configureStore'
const types = ['Налогоплательщик', 'Агент']

const StatisticActivityLegalObject = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const [statistic, setStatistic] = useState(data);
    const { isMobileApp } = props.app;
    const { profile } = props.user;
    const initialRender = useRef(true);
    let [agent, setAgent] = useState();
    let [type, setType] = useState('Налогоплательщик');
    let handleType =  (event) => {
        setType(event.target.value)
    };
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
                setStatistic(await getStatisticActivityLegalObject({type, ...agent?{agent: agent._id}:{}}))
            }
        })()
    },[agent, type])
    return (
        <App pageName='Статистика активности налогоплательщиков' searchShow>
            <Head>
                <title>Статистика активности налогоплательщиков</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content='Статистика активности налогоплательщиков' />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/statistic/statisticactivitylegalobject`} />
                <link rel='canonical' href={`${urlMain}/statistic/statisticactivitylegalobject`}/>
            </Head>
            <Card className={classes.page}>
                <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignItems: 'flex-start'}}>
                    {
                        statistic?
                            <>
                            {
                                profile.role!=='агент'?
                                    <div className={classes.row}>
                                        <FormControl className={classes.input}>
                                            <InputLabel>Тип данных</InputLabel>
                                            <Select variant='standard' value={type} onChange={handleType}>
                                                {types.map((element)=>
                                                    <MenuItem key={element} value={element}>{element}</MenuItem>
                                                )}
                                            </Select>
                                        </FormControl>
                                        <AutocomplectOnline
                                            defaultValue={agent}
                                            className={classes.input}
                                            setElement={setAgent}
                                            getElements={async (search)=>{return await getUsers({
                                                search, role: 'агент'
                                            })}}
                                            label={'агента'}
                                        />
                                    </div>
                                    :
                                    null
                            }
                            <Table row={(statistic.row).slice(1)} columns={statistic.columns} click={3}/>
                            <div className='count' >
                                <div className={classes.rowStatic}>{`Активные: ${statistic.row[0].data[0]}`}</div>
                                <div className={classes.rowStatic}>{`Неактивные: ${statistic.row[0].data[1]}`}</div>
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

StatisticActivityLegalObject.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    store.getState().app.filter = false
    if((!['admin', 'superadmin', 'агент'].includes(store.getState().user.profile.role)))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    return {
        data: await getStatisticActivityLegalObject({
            type: 'Налогоплательщик'
        }, ctx.req?await getClientGqlSsr(ctx.req):undefined)
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

export default connect(mapStateToProps, mapDispatchToProps)(StatisticActivityLegalObject);