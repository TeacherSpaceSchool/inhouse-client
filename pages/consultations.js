import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import {getConsultations, getConsultationsCount} from '../src/gql/consultation'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import pageListStyle from '../src/styleMUI/list'
import { urlMain } from '../src/const'
import { cloneObject, pdDDMMYYHHMM, distanceHour } from '../src/lib'
import Router from 'next/router'
import { forceCheck } from 'react-lazyload';
import { getClientGqlSsr } from '../src/apollo'
import initialApp from '../src/initialApp'
import * as snackbarActions from '../src/redux/actions/snackbar'
import { bindActionCreators } from 'redux'
import { wrapper } from '../src/redux/configureStore'
import Card from '@mui/material/Card';
import {pdDatePicker} from '../src/lib'

const Consultations = React.memo((props) => {
    const {classes} = pageListStyle();
    //props
    const { data } = props;
    const { filter } = props.app;
    //настройка
    const initialRender = useRef(true);
    //получение данных
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const getList = async ()=>{
        setList(cloneObject(await getConsultations({
            ...filter.store?{store: filter.store._id}:{},
            ...filter.user?{manager: filter.user._id}:{},
            ...filter.date?{date: filter.date}:{},
            skip: 0
        })));
        setCount(await getConsultationsCount({
            ...filter.store?{store: filter.store._id}:{},
            ...filter.user?{manager: filter.user._id}:{},
            ...filter.date?{date: filter.date}:{},
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
            else
                await getList()
        })()
    },[filter])
    //пагинация
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = cloneObject(await getConsultations({
                skip: list.length,
                ...filter.store?{store: filter.store._id}:{},
                ...filter.user?{manager: filter.user._id}:{},
                ...filter.date?{date: filter.date}:{},
            }))
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    //render
    return (
        <App filterShow={{user: true, userRole: 'менеджер', store: true, date: true}} checkPagination={checkPagination} pageName='Консультации'>
            <Head>
                <title>Консультации</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content='Консультации' />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/consultations`} />
                <link rel='canonical' href={`${urlMain}/consultations`}/>
            </Head>
            <Card className={classes.page}>
                <div className={classes.table}>
                    <div className={classes.tableHead}>
                        <div className={classes.tableCell} style={{width: '100%', justifyContent: 'start'}}>
                            Менеджер
                        </div>
                        <div className={classes.tableCell} style={{width: '100%', justifyContent: 'start'}}>
                            Магазин
                        </div>
                        <div className={classes.tableCell} style={{width: '100%', justifyContent: 'start'}}>
                            Начало
                        </div>
                        <div className={classes.tableCell} style={{width: '100%', justifyContent: 'start'}}>
                            Конец
                        </div>
                    </div>
                    {list.map((element) =>
                        <div className={classes.tableRow}>
                            <div className={classes.tableCell} style={{width: '100%', overflow: 'auto'}}>
                                {element.manager.name}
                            </div>
                            <div className={classes.tableCell} style={{width: '100%', overflow: 'auto'}}>
                                {element.store.name}
                            </div>
                            <div className={classes.tableCell} style={{width: '100%', overflow: 'auto', color: !element.end?distanceHour(element.createdAt)>1?'#f00':'#01C801':'#000'}}>
                                {pdDDMMYYHHMM(element.createdAt)}
                            </div>
                            <div className={classes.tableCell} style={{width: '100%', overflow: 'auto'}}>
                                {element.end?pdDDMMYYHHMM(element.end):null}
                            </div>
                        </div>
                    )}
                </div>
            </Card>
            <div className='count'>
                {`Всего: ${count}`}
            </div>
        </App>
    )
})

Consultations.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        }
        else {
            Router.push('/')
        }
    store.getState().app.filter.date = pdDatePicker(new Date())
    return {
        data: {
            list: cloneObject(await getConsultations({
                skip: 0,
                date: store.getState().app.filter.date,
                ...store.getState().app.filter.store?{store: store.getState().app.filter.store}:{}
            },  ctx.req?await getClientGqlSsr(ctx.req):undefined)),
            count: await getConsultationsCount({
                ...store.getState().app.filter.store?{store: store.getState().app.filter.store}:{}
            }, ctx.req?await getClientGqlSsr(ctx.req):undefined),
        }
    };
})

function mapStateToProps (state) {
    return {
        app: state.app,
    }
}

function mapDisonsultationtchToProps(disonsultationtch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, disonsultationtch),
        snackbarActions: bindActionCreators(snackbarActions, disonsultationtch),
    }
}

export default connect(mapStateToProps, mapDisonsultationtchToProps)(Consultations);