import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import {getSales, getSalesCount, getUnloadSales} from '../src/gql/sale'
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
    'заказан': 'indigo',
    'доставлен': 'green',
    'на доставку': '#00A875',
    'отгружен': 'blue',
    'возврат': 'red',
    'отмена': 'red'
}
const status = ['все', 'обработка', 'доставлен', 'заказан', 'на доставку', 'отгружен', 'возврат', 'отмена']

const Orders = React.memo((props) => {
    const {classes} = pageListStyle();
    //props
    const { data } = props;
    const { search, filter, isMobileApp } = props.app;
    //настройка
    let [today, setToday] = useState();
    const initialRender = useRef(true);
    //получение данных
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const getList = async ()=>{
        setList(cloneObject(await getSales({
            search,
            skip: 0,
            order: true,
            ...filter.store?{store: filter.store._id}:{},
            ...filter.user?{manager: filter.user._id}:{},
            ...filter.client?{client: filter.client._id}:{},
            ...filter.status?{status: filter.status}:{},
            ...filter.dateStart?{dateStart: filter.dateStart, dateEnd: filter.dateEnd}:{},
            ...filter.cpa?{cpa: filter.cpa._id}:{},
            ...filter.delivery?{delivery: filter.delivery}:{},
            ...filter.promotion?{promotion: filter.promotion}:{},
        })));
        setCount(await getSalesCount({
            order: true,
            ...filter.store?{store: filter.store._id}:{},
            ...filter.user?{manager: filter.user._id}:{},
            ...filter.client?{client: filter.client._id}:{},
            ...filter.status?{status: filter.status}:{},
            ...filter.dateStart?{dateStart: filter.dateStart, dateEnd: filter.dateEnd}:{},
            ...filter.cpa?{cpa: filter.cpa._id}:{},
            ...filter.delivery?{delivery: filter.delivery}:{},
            ...filter.promotion?{promotion: filter.promotion}:{},
            search
        }));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
    }
    //поиск/фильтр
    let searchTimeOut = useRef(null);
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current)
                await getList()
        })()
    },[filter])
    useEffect(()=>{
        (async()=>{
            if(initialRender.current) {
                today = new Date()
                today.setHours(0, 0, 0, 0)
                setToday(today)
                initialRender.current = false;
            }
            else {
                if(searchTimeOut.current)
                    clearTimeout(searchTimeOut.current)
                searchTimeOut.current = setTimeout(async () => await getList(), 500)
            }
        })()
    },[search])
    //пагинация
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = cloneObject(await getSales({
                order: true,
                skip: list.length,
                search,
                ...filter.store?{store: filter.store._id}:{},
                ...filter.user?{manager: filter.user._id}:{},
                ...filter.client?{client: filter.client._id}:{},
                ...filter.status?{status: filter.status}:{},
                ...filter.dateStart?{dateStart: filter.dateStart, dateEnd: filter.dateEnd}:{},
                ...filter.cpa?{cpa: filter.cpa._id}:{},
                ...filter.delivery?{delivery: filter.delivery}:{},
                ...filter.promotion?{promotion: filter.promotion}:{},
            }))
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    //render
    return (
        <App filterShow={{status, user: true, client: true, userRole: 'менеджер', cpa: true, period: true, delivery: true, store: true}} checkPagination={checkPagination} searchShow={true} pageName='На заказ'>
            <Head>
                <title>На заказ</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content='На заказ' />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/orders`} />
                <link rel='canonical' href={`${urlMain}/orders`}/>
            </Head>
            <Card className={classes.page} style={isMobileApp?{width: 'fit-content'}:{}}>
                <div className={classes.table}>
                    <div className={classes.tableHead}>
                        <div className={classes.tableCell} style={{width: 110, justifyContent: 'center'}}>
                            Статус
                        </div>
                        <div className={classes.tableCell} style={{width: 100, justifyContent: 'center'}}>
                            Номер
                        </div>
                        <div className={classes.tableCell} style={{width: 130, justifyContent: 'center'}}>
                              Дата
                        </div>
                        <div className={classes.tableCell} style={{width: 130, justifyContent: 'center'}}>
                            Доставка
                        </div>
                        <div className={classes.tableCell} style={{...isMobileApp?{width: 200}:{width: 'calc((100% - 470px) / 2)'}, justifyContent: 'center'}}>
                            Клиент
                        </div>
                        <div className={classes.tableCell} style={{...isMobileApp?{width: 200}:{width: 'calc((100% - 470px) / 2)'}, justifyContent: 'center'}}>
                            Менеджер
                        </div>
                    </div>
                    {list.map((element) =>
                        <Link href='/order/[id]' as={`/order/${element._id}`} key={element._id}>
                            <div className={classes.tableRow} onClick={()=>{
                                let appBody = (document.getElementsByClassName('App-body'))[0]
                                sessionStorage.scrollPositionStore = appBody.scrollTop
                                sessionStorage.scrollPositionName = 'order'
                                sessionStorage.scrollPositionLimit = list.length
                            }}>
                                <div className={classes.tableCell} style={{width: 110, justifyContent: 'center', fontWeight: 'bold', color: colors[element.status]}}>
                                    {element.status}
                                </div>
                                <div className={classes.tableCell} style={{width: 100, justifyContent: 'center'}}>
                                    {element.number}
                                </div>
                                <div className={classes.tableCell} style={{width: 130, justifyContent: 'center'}}>
                                    {pdDDMMYYHHMM(element.createdAt)}
                                </div>
                                <div className={classes.tableCell} style={{width: 130, justifyContent: 'center', color: !['отмена', 'доставлен'].includes(element.status)&&new Date(element.delivery)<today?'red':'black'}}>
                                    {element.delivery?pdDDMMYYHHMM(element.delivery):'Не указано'}
                                    {element.selfDelivery?'\nСамовывоз':''}
                                </div>
                                <div className={classes.tableCell} style={{...isMobileApp?{width: 200}:{width: 'calc((100% - 470px) / 2)'}, justifyContent: 'center'}}>
                                    {element.client.name}
                                </div>
                                <div className={classes.tableCell} style={{...isMobileApp?{width: 200}:{width: 'calc((100% - 470px) / 2)'}, justifyContent: 'center'}}>
                                    {element.manager.name}
                                </div>
                            </div>
                        </Link>
                    )}
                </div>
            </Card>
            <UnloadUpload unload={()=>getUnloadSales({
                order: true,
                ...filter.store?{store: filter.store._id}:{},
                ...filter.user?{manager: filter.user._id}:{},
                ...filter.client?{client: filter.client._id}:{},
                ...filter.status?{status: filter.status}:{},
                ...filter.dateStart?{dateStart: filter.dateStart, dateEnd: filter.dateEnd}:{},
                ...filter.cpa?{cpa: filter.cpa._id}:{},
                ...filter.delivery?{delivery: filter.delivery}:{},
                search
            })}/>
            <div className='count'>
                {`Всего: ${count}`}
            </div>
        </App>
    )
})

Orders.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
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
    store.getState().app.filterType = '/order'
    return {
        data: {
            list: cloneObject(await getSales({
                skip: 0,
                order: true,
                ...store.getState().app.search?{search: store.getState().app.search}:{},
                ...store.getState().app.filter.store?{store: store.getState().app.filter.store._id}:{},
                ...store.getState().app.filter.user?{manager: store.getState().app.filter.user._id}:{},
                ...store.getState().app.filter.client?{client: store.getState().app.filter.client._id}:{},
                ...store.getState().app.filter.status?{status: store.getState().app.filter.status}:{},
                ...store.getState().app.filter.dateStart?{dateStart: store.getState().app.filter.dateStart, dateEnd: store.getState().app.filter.dateEnd}:{},
                ...store.getState().app.filter.cpa?{cpa: store.getState().app.filter.cpa._id}:{},
                ...store.getState().app.filter.delivery?{delivery: store.getState().app.filter.delivery}:{},
                ...store.getState().app.filter.promotion?{promotion: store.getState().app.filter.promotion}:{},
                ...process.browser&&sessionStorage.scrollPositionLimit?{limit: parseInt(sessionStorage.scrollPositionLimit)}:{}
            },  ctx.req?await getClientGqlSsr(ctx.req):undefined)),
            count: await getSalesCount({
                order: true,
                ...store.getState().app.search?{search: store.getState().app.search}:{},
                ...store.getState().app.filter.store?{store: store.getState().app.filter.store._id}:{},
                ...store.getState().app.filter.user?{manager: store.getState().app.filter.user._id}:{},
                ...store.getState().app.filter.client?{client: store.getState().app.filter.client._id}:{},
                ...store.getState().app.filter.status?{status: store.getState().app.filter.status}:{},
                ...store.getState().app.filter.dateStart?{dateStart: store.getState().app.filter.dateStart, dateEnd: store.getState().app.filter.dateEnd}:{},
                ...store.getState().app.filter.cpa?{cpa: store.getState().app.filter.cpa._id}:{},
                ...store.getState().app.filter.delivery?{delivery: store.getState().app.filter.delivery}:{},
                ...store.getState().app.filter.promotion?{promotion: store.getState().app.filter.promotion}:{},
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

export default connect(mapStateToProps, mapDispatchToProps)(Orders);