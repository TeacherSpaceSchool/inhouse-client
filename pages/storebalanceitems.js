import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import {getStoreBalanceItems, getStoreBalanceItemsCount} from '../src/gql/storeBalanceItem'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import pageListStyle from '../src/styleMUI/list'
import { urlMain } from '../src/const'
import { cloneObject } from '../src/lib'
import Router from 'next/router'
import { forceCheck } from 'react-lazyload';
import { getClientGqlSsr } from '../src/apollo'
import initialApp from '../src/initialApp'
import * as snackbarActions from '../src/redux/actions/snackbar'
import { bindActionCreators } from 'redux'
import { wrapper } from '../src/redux/configureStore'
import Card from '@mui/material/Card';

const sorts = [
    {
        name: 'Остаток',
        field: 'amount'
    }
]

const StoreBalanceItems = React.memo((props) => {
    const {classes} = pageListStyle();
    //props
    const { data } = props;
    const { isMobileApp, filter, sort } = props.app;
    //настройка
    const initialRender = useRef(true);
    //получение данных
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const getList = async ()=>{
        setList(cloneObject(await getStoreBalanceItems({sort, skip: 0, ...filter.item?{item: filter.item._id}:{}, ...filter.store?{store: filter.store._id}:{}})));
        setCount(await getStoreBalanceItemsCount({...filter.item?{item: filter.item._id}:{}, ...filter.store?{store: filter.store._id}:{}}));
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
    },[filter, sort])
    //пагинация
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = cloneObject(await getStoreBalanceItems({skip: list.length, sort, ...filter.item?{item: filter.item._id}:{}, ...filter.store?{store: filter.store._id}:{}}))
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    //render
    return (
        <App checkPagination={checkPagination} filterShow={{item: true, store: true}} sorts={sorts} pageName='Баланс моделей'>
            <Head>
                <title>Баланс моделей</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content='Баланс моделей' />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/storebalanceitems`} />
                <link rel='canonical' href={`${urlMain}/storebalanceitems`}/>
            </Head>
            <Card className={classes.page}>
                <div className={classes.table}>
                    <div className={classes.tableHead} style={isMobileApp?{width: 'fit-content'}:{}}>
                        <div className={classes.tableCell} style={{...isMobileApp?{minWidth: 200}:{}, width: `calc((100% - 200px) / 2)`, justifyContent: 'center'}}>
                            Модель
                        </div>
                        <div className={classes.tableCell} style={{...isMobileApp?{minWidth: 200}:{}, width: `calc((100% - 200px) / 2)`, justifyContent: 'center'}}>
                            Магазин
                        </div>
                        <div className={classes.tableCell} style={{width: 200, justifyContent: 'center'}}>
                            Баланс
                        </div>
                    </div>
                    {list.map((element) =>
                        <div className={classes.tableRow} style={isMobileApp?{width: 'fit-content'}:{}}>
                            <div className={classes.tableCell} style={{...isMobileApp?{minWidth: 200}:{}, width: `calc((100% - 200px) / 2)`, justifyContent: 'center'}}>
                                {element.item.name}
                            </div>
                            <div className={classes.tableCell} style={{...isMobileApp?{minWidth: 200}:{}, width: `calc((100% - 200px) / 2)`, justifyContent: 'center'}}>
                                {element.store.name}
                            </div>
                            <div className={classes.tableCell} style={{flexDirection: 'column', width: 200, justifyContent: 'center'}}>
                                <div className={classes.row}>
                                    <div className={classes.value}>
                                        Остаток:&nbsp;
                                    </div>
                                    <div>
                                        {element.amount}
                                    </div>
                                </div>
                                <div className={classes.row}>
                                    <div className={classes.value}>
                                        Доступно:&nbsp;
                                    </div>
                                    <div>
                                        {element.free}
                                    </div>
                                </div>
                                <div className={classes.row}>
                                    <div className={classes.value}>
                                        Бронь:&nbsp;
                                    </div>
                                    <div>
                                        {element.reservation}
                                    </div>
                                </div>
                                <div className={classes.row}>
                                    <div className={classes.value}>
                                        Продажа:&nbsp;
                                    </div>
                                    <div>
                                        {element.sale}
                                    </div>
                                </div>
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

StoreBalanceItems.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
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
    store.getState().app.sort = 'amount'
    if(ctx.query.item)
        store.getState().app.filter.item = ctx.query.item
    return {
        data: {
            list: cloneObject(await getStoreBalanceItems({
                skip: 0,
                ...store.getState().app.filter.store?{store: store.getState().app.filter.store}:{},
                ...store.getState().app.filter.item?{item: store.getState().app.filter.item}:{}
            },  ctx.req?await getClientGqlSsr(ctx.req):undefined)),
            count: await getStoreBalanceItemsCount({
                ...store.getState().app.filter.store?{store: store.getState().app.filter.store}:{},
                ...store.getState().app.filter.item?{item: store.getState().app.filter.item}:{}}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
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

export default connect(mapStateToProps, mapDispatchToProps)(StoreBalanceItems);