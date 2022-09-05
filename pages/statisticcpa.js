import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import { getStatisticCpa, getUnloadStatisticCpa } from '../src/gql/cpa'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import pageListStyle from '../src/styleMUI/list'
import { urlMain } from '../src/const'
import { cloneObject, pdDatePicker } from '../src/lib'
import Router from 'next/router'
import { forceCheck } from 'react-lazyload';
import { getClientGqlSsr } from '../src/apollo'
import initialApp from '../src/initialApp'
import * as snackbarActions from '../src/redux/actions/snackbar'
import { bindActionCreators } from 'redux'
import { wrapper } from '../src/redux/configureStore'
import Card from '@mui/material/Card';
import Link from 'next/link';
import * as appActions from '../src/redux/actions/app'

import UnloadUpload from '../components/app/UnloadUpload';

const StatisticCpa = React.memo((props) => {
    const {classes} = pageListStyle();
    //props
    const { data } = props;
    const { filter } = props.app;
    const { setFilter } = props.appActions;
    //настройка
    let [showStat, setShowStat] = useState(false);
    const initialRender = useRef(true);
    //получение данных
    let [list, setList] = useState(data.list);
    const getList = async ()=>{
        setList(await getStatisticCpa({
            dateStart: filter.dateStart, dateEnd: filter.dateEnd,
            ...filter.cpa?{cpa: filter.cpa._id}:{},
            ...filter.store?{store: filter.store._id}:{},
            skip: 0
        }));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
    }
    //поиск/фильтр
    useEffect(()=>{
        (async()=>{
            if(initialRender.current)
                initialRender.current = false;
            else {
                if(!filter.dateStart) {
                    filter.dateStart = pdDatePicker(new Date())
                    setFilter({...filter})
                }
                await getList()
            }
        })()
    },[filter])
    //пагинация
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = cloneObject(await getStatisticCpa({
                dateStart: filter.dateStart, dateEnd: filter.dateEnd,
                ...filter.cpa?{cpa: filter.cpa._id}:{},
                ...filter.store?{store: filter.store._id}:{},
                skip: list.length
            }))
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    //render
    return (
        <App checkPagination={checkPagination} filterShow={{cpa: true, store: true, period: true}} pageName='Статистика дизайнеров'>
            <Head>
                <title>Статистика дизайнеров</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content='Статистика дизайнеров' />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/StatisticCpa`} />
                <link rel='canonical' href={`${urlMain}/StatisticCpa`}/>
            </Head>
            <Card className={classes.page}>
                <div className={classes.table}>
                    <div className={classes.tableHead}>
                        <div className={classes.tableCell} style={{width: '100%', justifyContent: 'center'}}>
                            Дизайнер
                        </div>
                        <div className={classes.tableCell} style={{width: '100%', justifyContent: 'center'}}>
                            Бонус
                        </div>
                    </div>
                    {list.slice(1).map((element) =>
                        <div className={classes.tableRow}>
                            <div className={classes.tableCell} style={{width: '100%', justifyContent: 'center'}}>
                                {element[0]}
                            </div>
                            <div className={classes.tableCell} style={{width: '100%', justifyContent: 'center'}}>
                                {element[1]}
                            </div>
                        </div>
                    )}
                </div>
            </Card>
            <UnloadUpload unload={()=>getUnloadStatisticCpa({
                dateStart: filter.dateStart, dateEnd: filter.dateEnd,
                ...filter.cpa?{cpa: filter.cpa._id}:{},
                ...filter.store?{store: filter.store._id}:{}
            })}/>
            <div className='count' onClick={()=>setShowStat(!showStat)}>
                Всего: {list[0][0]}
                {
                    showStat?
                        <>
                        <br/>Бонус: {list[0][1]} сом
                        </>
                        :
                        null
                }
            </div>
        </App>
    )
})

StatisticCpa.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', 'управляющий'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        }
        else {
            Router.push('/')
        }
    store.getState().app.filter.dateStart = pdDatePicker(new Date())
    return {
        data: {
            list: await getStatisticCpa({
                dateStart: store.getState().app.filter.dateStart,
                skip: 0,
            },  ctx.req?await getClientGqlSsr(ctx.req):undefined)
        }
    };
})

function mapStateToProps (state) {
    return {
        app: state.app,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StatisticCpa);