import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import {getRefunds, getRefundsCount, getUnloadRefunds} from '../src/gql/refund'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import pageListStyle from '../src/styleMUI/list'
import { urlMain } from '../src/const'
import { cloneObject, pdDDMMYYHHMM } from '../src/lib'
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

const colors = {
    'обработка': 'orange',
    'принят': 'green',
    'отмена': 'red'
}
const status = ['все', 'обработка', 'принят', 'отмена']

const Refunds = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const { search, filter, isMobileApp } = props.app;
    const initialRender = useRef(true);
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const getList = async ()=>{
        setList(cloneObject(await getRefunds({
            search, 
            skip: 0,
            ...filter.store?{store: filter.store._id}:{},
            ...filter.user?{manager: filter.user._id}:{},
            ...filter.client?{client: filter.client._id}:{},
            ...filter.status?{status: filter.status}:{},
            ...filter.dateStart&&filter.dateStart.length?{dateStart: filter.dateStart}:{},
            ...filter.dateEnd&&filter.dateEnd.length?{dateEnd: filter.dateEnd}:{},
        })));
        setCount(await getRefundsCount({
            ...filter.store?{store: filter.store._id}:{},
            ...filter.user?{manager: filter.user._id}:{},
            ...filter.client?{client: filter.client._id}:{},
            ...filter.status?{status: filter.status}:{},
            ...filter.dateStart&&filter.dateStart.length?{dateStart: filter.dateStart}:{},
            ...filter.dateEnd&&filter.dateEnd.length?{dateEnd: filter.dateEnd}:{},
            search
        }));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
    }
    let searchTimeOut = useRef(null);
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current)
                await getList()
        })()
    },[filter])
    useEffect(()=>{
        (async()=>{
            if(initialRender.current)
                initialRender.current = false;
            else {
                if(searchTimeOut.current)
                    clearTimeout(searchTimeOut.current)
                searchTimeOut.current = setTimeout(async () => await getList(), 500)
            }
        })()
    },[search])
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = cloneObject(await getRefunds({
                skip: list.length, 
                search,
                ...filter.store?{store: filter.store._id}:{},
                ...filter.user?{manager: filter.user._id}:{},
                ...filter.client?{client: filter.client._id}:{},
                ...filter.status?{status: filter.status}:{},
                ...filter.dateStart&&filter.dateStart.length?{dateStart: filter.dateStart}:{},
                ...filter.dateEnd&&filter.dateEnd.length?{dateEnd: filter.dateEnd}:{},
            }))
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    return (
        <App filterShow={{status, user: true, userRole: 'менеджер', client: true, store: true, period: true}} checkPagination={checkPagination} searchShow={true} pageName='Возврат'>
            <Head>
                <title>Возврат</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content='Возврат' />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/refunds`} />
                <link rel='canonical' href={`${urlMain}/refunds`}/>
            </Head>
            <Card className={classes.page} style={isMobileApp?{width: 'fit-content'}:{}}>
                <div className={classes.table}>
                    <div className={classes.tableHead} >
                        <div className={classes.tableCell} style={{width: 100, justifyContent: 'center'}}>
                            Статус
                        </div>
                        <div className={classes.tableCell} style={{width: 100, justifyContent: 'center'}}>
                            Номер
                        </div>
                        <div className={classes.tableCell} style={{width: 130, justifyContent: 'center'}}>
                            Дата
                        </div>
                        <div className={classes.tableCell} style={{...isMobileApp?{width: 200}:{width: 'calc((100% - 330px) / 2)'}, justifyContent: 'center'}}>
                            Клиент
                        </div>
                        <div className={classes.tableCell} style={{...isMobileApp?{width: 200}:{width: 'calc((100% - 330px) / 2)'}, justifyContent: 'center'}}>
                            Менеджер
                        </div>
                    </div>
                    {list.map((element) =>
                        <Link href='/refund/[id]' as={`/refund/${element._id}`} key={element._id}>
                            <div className={classes.tableRow}  onClick={()=>{
                                let appBody = (document.getElementsByClassName('App-body'))[0]
                                sessionStorage.scrollPositionStore = appBody.scrollTop
                                sessionStorage.scrollPositionName = 'refund'
                                sessionStorage.scrollPositionLimit = list.length
                            }}>
                                <div className={classes.tableCell} style={{width: 100, justifyContent: 'center', fontWeight: 'bold', color: colors[element.status]}}>
                                    {element.status}
                                </div>
                                <div className={classes.tableCell} style={{width: 100, justifyContent: 'center'}}>
                                    {element.number}
                                </div>
                                <div className={classes.tableCell} style={{width: 130, justifyContent: 'center'}}>
                                    {pdDDMMYYHHMM(element.createdAt)}
                                </div>
                                <div className={classes.tableCell} style={{...isMobileApp?{width: 200}:{width: 'calc((100% - 330px) / 2)'}, justifyContent: 'center'}}>
                                    <Link href='/client/[id]' as={`/client/${element.client._id}`}>
                                    {element.client.name}
                                    </Link>
                                </div>
                                <div className={classes.tableCell} style={{...isMobileApp?{width: 200}:{width: 'calc((100% - 330px) / 2)'}, justifyContent: 'center'}}>
                                    {element.manager.name}
                                </div>
                            </div>
                        </Link>
                    )}
                </div>
            </Card>
            <UnloadUpload unload={()=>getUnloadRefunds({
                ...filter.store?{store: filter.store._id}:{},
                ...filter.user?{manager: filter.user._id}:{},
                ...filter.client?{client: filter.client._id}:{},
                ...filter.status?{status: filter.status}:{},
                ...filter.dateStart&&filter.dateStart.length?{dateStart: filter.dateStart}:{},
                ...filter.dateEnd&&filter.dateEnd.length?{dateEnd: filter.dateEnd}:{},
                search
            })}/>
            <div className='count'>
                {`Всего: ${count}`}
            </div>
        </App>
    )
})

Refunds.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', 'управляющий', 'менеджер', 'менеджер/завсклад', 'завсклад'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        }
        else {
            Router.push('/')
        }
    store.getState().app.filterType = '/refund'
    return {
        data: {
            list: cloneObject(await getRefunds({
                skip: 0,
                ...store.getState().app.search?{search: store.getState().app.search}:{},
                ...store.getState().app.filter.dateStart&&store.getState().app.filter.dateStart.length?{dateStart: store.getState().app.filter.dateStart}:{},
                ...store.getState().app.filter.dateEnd&&store.getState().app.filter.dateEnd.length?{dateEnd: store.getState().app.filter.dateEnd}:{},
                ...store.getState().app.filter.status?{status: store.getState().app.filter.status}:{},
                ...store.getState().app.filter.manager?{manager: store.getState().app.filter.manager._id}:{},
                ...store.getState().app.filter.client?{client: store.getState().app.filter.client._id}:{},
                ...store.getState().app.filter.store?{store: store.getState().app.filter.store._id}:{},
                ...process.browser&&sessionStorage.scrollPositionLimit?{limit: parseInt(sessionStorage.scrollPositionLimit)}:{}
            },  ctx.req?await getClientGqlSsr(ctx.req):undefined)),
            count: await getRefundsCount({
                ...store.getState().app.search?{search: store.getState().app.search}:{},
                ...store.getState().app.filter.dateStart&&store.getState().app.filter.dateStart.length?{dateStart: store.getState().app.filter.dateStart}:{},
                ...store.getState().app.filter.dateEnd&&store.getState().app.filter.dateEnd.length?{dateEnd: store.getState().app.filter.dateEnd}:{},
                ...store.getState().app.filter.status?{status: store.getState().app.filter.status}:{},
                ...store.getState().app.filter.manager?{manager: store.getState().app.filter.manager._id}:{},
                ...store.getState().app.filter.client?{client: store.getState().app.filter.client._id}:{},
                ...store.getState().app.filter.store?{store: store.getState().app.filter.store._id}:{},
            }, ctx.req?await getClientGqlSsr(ctx.req):undefined),
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Refunds);