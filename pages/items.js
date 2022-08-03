import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import {getItems, getItemsCount} from '../src/gql/item'
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
import AddIcon from '@mui/icons-material/Add';
import Calculate from '@mui/icons-material/Calculate';
import Link from 'next/link';
import Fab from '@mui/material/Fab';
import UsdToKgs from '../components/dialog/UsdToKgs'

const Items = React.memo((props) => {
    const {classes} = pageListStyle();
    //props
    const { data } = props;
    const { search, filter, isMobileApp } = props.app;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    //настройка
    const initialRender = useRef(true);
    //получение данных
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const getList = async ()=>{
        setList(cloneObject(await getItems({search, ...filter.factory?{factory: filter.factory._id}:{}, ...filter.category?{category: filter.category._id}:{}, skip: 0})));
        setCount(await getItemsCount({search, ...filter.factory?{factory: filter.factory._id}:{}, ...filter.category?{category: filter.category._id}:{}}));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
    }
    //поиск/фильтр
    let searchTimeOut = useRef(null);
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current) await getList()
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
    //пагинация
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = cloneObject(await getItems({skip: list.length, search, ...filter.factory?{factory: filter.factory._id}:{}, ...filter.category?{category: filter.category._id}:{}}))
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    //render
    return (
        <App filterShow={{factory: true, category: true}} checkPagination={checkPagination} searchShow={true} pageName='Модели'>
            <Head>
                <title>Модели</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content='Модели' />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/items`} />
                <link rel='canonical' href={`${urlMain}/items`}/>
            </Head>
            <Card className={classes.page} style={isMobileApp?{width: 'fit-content'}:{}}>
                <div className={classes.table}>
                    <div className={classes.tableHead} style={isMobileApp?{width: 'fit-content'}:{}}>
                        <div className={classes.tableCell} style={{width: isMobileApp?200:'calc(100% / 3)', justifyContent: 'start'}}>
                            Название
                        </div>
                        <div className={classes.tableCell} style={{width: isMobileApp?100:'calc(100% / 3)', justifyContent: 'start'}}>
                            Цена(сом)
                        </div>
                        <div className={classes.tableCell} style={{width: isMobileApp?150:'calc(100% / 3)', justifyContent: 'start'}}>
                            Категория
                        </div>
                    </div>
                    {list.map((element) =>
                        <Link href='/item/[id]' as={`/item/${element._id}`} key={element._id}>
                            <div className={classes.tableRow} style={isMobileApp?{width: 'fit-content'}:{}} onClick={()=>{
                                let appBody = (document.getElementsByClassName('App-body'))[0]
                                sessionStorage.scrollPositionStore = appBody.scrollTop
                                sessionStorage.scrollPositionName = 'item'
                                sessionStorage.scrollPositionLimit = list.length
                            }}>
                                <div className={classes.tableCell} style={{width: isMobileApp?200:'calc(100% / 3)'}}>
                                    {element.name}
                                </div>
                                <div className={classes.tableCell} style={{width: isMobileApp?100:'calc(100% / 3)'}}>
                                    {element.priceAfterDiscountKGS}
                                </div>
                                <div className={classes.tableCell} style={{maxHeight: 100, overflow: 'auto', width: isMobileApp?150:'calc(100% / 3)'}}>
                                    {element.category.name}
                                </div>
                            </div>
                        </Link>
                    )}
                </div>
            </Card>
            {
                data.edit?
                    <Fab color='primary' aria-label='add' className={classes.fab2} onClick={()=>{
                        setMiniDialog('Рассчитать по курсу', <UsdToKgs getList={getList}/>)
                        showMiniDialog(true)
                    }}>
                        <Calculate/>
                    </Fab>
                    :
                    null
            }
            {
                data.add?
                    <Link href='/item/[id]' as={`/item/new`}>
                        <Fab color='primary' aria-label='add' className={classes.fab}>
                            <AddIcon />
                        </Fab>
                    </Link>
                    :
                    null
            }
            <div className='count'>
                {`Всего: ${count}`}
            </div>
        </App>
    )
})

Items.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
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
    store.getState().app.filterType = '/item'
    return {
        data: {
            edit: store.getState().user.profile.edit&&['admin'].includes(store.getState().user.profile.role),
            add: store.getState().user.profile.add&&['admin'].includes(store.getState().user.profile.role),
            list: cloneObject(await getItems({
                skip: 0,
                ...store.getState().app.search?{search: store.getState().app.search}:{},
                ...store.getState().app.filter.factory?{factory: store.getState().app.filter.factory._id}:{},
                ...store.getState().app.filter.category?{category: store.getState().app.filter.category._id}:{},
                ...process.browser&&sessionStorage.scrollPositionLimit?{limit: parseInt(sessionStorage.scrollPositionLimit)}:{}
            },  ctx.req?await getClientGqlSsr(ctx.req):undefined)),
            count: await getItemsCount({
                ...store.getState().app.search?{search: store.getState().app.search}:{},
                ...store.getState().app.filter.factory?{factory: store.getState().app.filter.factory._id}:{},
                ...store.getState().app.filter.category?{category: store.getState().app.filter.category._id}:{},
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

export default connect(mapStateToProps, mapDispatchToProps)(Items);