import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import {getConsultations, getConsultationsCount, getUnloadConsultations} from '../src/gql/consultation'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import pageListStyle from '../src/styleMUI/list'
import { urlMain } from '../src/const'
import { cloneObject, pdDDMMYYHHMM, distanceHour, checkFloat } from '../src/lib'
import Router from 'next/router'
import { forceCheck } from 'react-lazyload';
import { getClientGqlSsr } from '../src/apollo'
import initialApp from '../src/initialApp'
import * as snackbarActions from '../src/redux/actions/snackbar'
import { bindActionCreators } from 'redux'
import { wrapper } from '../src/redux/configureStore'
import Card from '@mui/material/Card';
import Link from 'next/link';
import UnloadUpload from '../components/app/UnloadUpload';

const Consultations = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const { filter } = props.app;
    const initialRender = useRef(true);
    let [today, setToday] = useState();
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const getList = async ()=>{
        setList(cloneObject(await getConsultations({
            ...filter.statusClient?{statusClient: filter.statusClient}:{},
            ...filter.store?{store: filter.store._id}:{},
            ...filter.user?{manager: filter.user._id}:{},
            ...filter.dateStart&&filter.dateStart.length?{dateStart: filter.dateStart}:{},
            ...filter.dateEnd&&filter.dateEnd.length?{dateEnd: filter.dateEnd}:{},
            skip: 0
        })));
        setCount(await getConsultationsCount({
            ...filter.statusClient?{statusClient: filter.statusClient}:{},
            ...filter.store?{store: filter.store._id}:{},
            ...filter.user?{manager: filter.user._id}:{},
            ...filter.dateStart&&filter.dateStart.length?{dateStart: filter.dateStart}:{},
            ...filter.dateEnd&&filter.dateEnd.length?{dateEnd: filter.dateEnd}:{},
        }));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
    }
    useEffect(()=>{
        (async()=>{
            if(initialRender.current) {
                today = new Date()
                setToday(today)
                initialRender.current = false;
            }
            else
                await getList()
        })()
    },[filter])
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = await getConsultations({
                ...filter.statusClient?{statusClient: filter.statusClient}:{},
                skip: list.length,
                ...filter.store?{store: filter.store._id}:{},
                ...filter.user?{manager: filter.user._id}:{},
                ...filter.dateStart&&filter.dateStart.length?{dateStart: filter.dateStart}:{},
                ...filter.dateEnd&&filter.dateEnd.length?{dateEnd: filter.dateEnd}:{},
            })
            if(addedList&&addedList.length>0){list = [...list, ...addedList]; setList(list);}
            else
                paginationWork.current = false
        }
    }
    return (
        <App filterShow={{statusClient: true, user: true, userRole: 'менеджер', store: true, period: true}} list={list} checkPagination={checkPagination} pageName='Консультации'>
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
            <div className={classes.tableHead} style={{width: 'fit-content'}}>
                <div className={classes.tableCell} style={{width: 200, justifyContent: 'start'}}>
                    Менеджер
                </div>
                <div className={classes.tableCell} style={{width: 150, justifyContent: 'start'}}>
                    Магазин
                </div>
                <div className={classes.tableCell} style={{width: 130, justifyContent: 'start'}}>
                    Начало
                </div>
                <div className={classes.tableCell} style={{width: 130, justifyContent: 'start'}}>
                    Конец
                </div>
                <div className={classes.tableCell} style={{width: 130, justifyContent: 'start'}}>
                    Минут
                </div>
                <div className={classes.tableCell} style={{width: 100, justifyContent: 'start'}}>
                    Операция
                </div>
                <div className={classes.tableCell} style={{width: 200, justifyContent: 'start'}}>
                    Клиент
                </div>
                <div className={classes.tableCell} style={{width: 250, justifyContent: 'start'}}>
                    Комментарий
                </div>
            </div>
            <Card className={classes.page} style={{width: 'fit-content'}}>
                <div className={classes.table}>
                    {list&&list.map((element) =>
                        <div className={classes.tableRow}>
                            <div className={classes.tableCell} style={{width: 200, overflow: 'auto'}}>
                                <Link href='/user/[id]' as={`/user/${element.manager._id}`}>
                                    <a>
                                        {element.manager.name}
                                    </a>
                                </Link>
                            </div>
                            <div className={classes.tableCell} style={{width: 150, overflow: 'auto'}}>
                                {element.store.name}
                            </div>
                            <div className={classes.tableCell} style={{width: 130, overflow: 'auto', color: !element.end?distanceHour(element.createdAt)>1?'#f00':'#01C801':'#000'}}>
                                {pdDDMMYYHHMM(element.createdAt)}
                            </div>
                            <div className={classes.tableCell} style={{width: 130, overflow: 'auto'}}>
                                {element.end?pdDDMMYYHHMM(element.end):null}
                            </div>
                            <div className={classes.tableCell} style={{width: 130, overflow: 'auto'}}>
                                {checkFloat(((element.end?element.end:today)-element.createdAt)/1000/60)}
                            </div>
                            <div className={classes.tableCell} style={{width: 100, justifyContent: 'start'}}>
                                {element.operation}
                            </div>
                            <div className={classes.tableCell} style={{width: 200, overflow: 'auto', display: 'flex', flexDirection: 'column'}}>
                                {
                                    element.client?
                                        <Link href='/client/[id]' as={`/client/${element.client._id}`}>
                                            <div>{element.client.name}</div>
                                        </Link>
                                        :
                                        null
                                }
                                {
                                    element.statusClient?
                                        <div>{element.statusClient}</div>
                                        :
                                        null
                                }
                            </div>
                            <div className={classes.tableCell} style={{width: 250, overflow: 'auto', maxHeight: 100}}>
                                {element.info}
                            </div>
                        </div>
                    )}
                </div>
            </Card>
            <UnloadUpload unload={()=>getUnloadConsultations({
                ...filter.store?{store: filter.store._id}:{},
                ...filter.user?{manager: filter.user._id}:{},
                ...filter.dateStart&&filter.dateStart.length?{dateStart: filter.dateStart}:{},
                ...filter.dateEnd&&filter.dateEnd.length?{dateEnd: filter.dateEnd}:{},
            })}/>
            <div className='count'>
                {`Всего: ${count}`}
            </div>
        </App>
    )
})

Consultations.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin',  'управляющий'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        }
        else {
            Router.push('/')
        }
    return {
        data: {
            list: cloneObject(await getConsultations({
                skip: 0,
                date: store.getState().app.filter.date,
                ...store.getState().app.filter.store?{store: store.getState().app.filter.store._id}:{}
            },  ctx.req?await getClientGqlSsr(ctx.req):undefined)),
            count: await getConsultationsCount({
                ...store.getState().app.filter.store?{store: store.getState().app.filter.store._id}:{}
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