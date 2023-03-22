import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import {getItems, getItemsCount, getUnloadItems, uploadItem} from '../src/gql/item'
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

import UnloadUpload from '../components/app/UnloadUpload';
const uploadText = 'Формат xlsx:\n_id или текущее название модели (если требуется обновить);\nназвание;\nартикул;\nID;\nтип товара;\nназвание категории;\nназвание фабрики;\nцена в долларах;\nцена в сомах;\nсебестоимость в долларах;\nсебестоимость в сомах;\nскидка в сомах;\nединица измерения;\nразмер;\nхарактеристики (через запятую с пробелом. Пример: тип характеристики1: характеристика1, тип характеристики2: характеристика2);\nкомментарий.'

const Items = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const { search, filter, isMobileApp } = props.app;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const initialRender = useRef(true);
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const getList = async ()=>{
        setList(cloneObject(await getItems({
            search,
            ...filter.factory?{factory: filter.factory._id}:{},
            ...filter.category?{category: filter.category._id}:{},
            skip: 0,
            ...filter.typeItem?{type: filter.typeItem.name}:{}
        })));
        setCount(await getItemsCount({
            search,
            ...filter.factory?{factory: filter.factory._id}:{},
            ...filter.category?{category: filter.category._id}:{},
            ...filter.typeItem?{type: filter.typeItem.name}:{}
        }));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
    }
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
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = await getItems({
                skip: list.length,
                search,
                ...filter.factory?{factory: filter.factory._id}:{},
                ...filter.category?{category: filter.category._id}:{},
                ...filter.typeItem?{type: filter.typeItem.name}:{}
            })
            if(addedList&&addedList.length) {list = [...list, ...addedList];setList(list);}
            else
                paginationWork.current = false
        }
    }
    return (
        <App filterShow={{factory: true, category: true, typeItem: true}} qrScannerShow={true} list={list} checkPagination={checkPagination} searchShow={true} pageName='Модели'>
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
            <div className={classes.tableHead} style={isMobileApp?{width: 'fit-content'}:{}}>
                <div className={classes.tableCell} style={{width: isMobileApp?200:'calc(100% / 4)', justifyContent: 'start'}}>
                    Название
                </div>
                <div className={classes.tableCell} style={{width: isMobileApp?100:'calc(100% / 4)', justifyContent: 'start'}}>
                    Цена(сом)
                </div>
                <div className={classes.tableCell} style={{width: isMobileApp?150:'calc(100% / 4)', justifyContent: 'start'}}>
                    Категория
                </div>
                <div className={classes.tableCell} style={{width: isMobileApp?150:'calc(100% / 4)', justifyContent: 'start'}}>
                    Фабрика
                </div>
            </div>
            <Card className={classes.page} style={isMobileApp?{width: 'fit-content'}:{}}>
                <div className={classes.table}>
                    {list&&list.map((element) =>
                        <Link href='/item/[id]' as={`/item/${element._id}`} key={element._id}>
                            <div className={classes.tableRow} onClick={()=>{
                                let appBody = (document.getElementsByClassName('App-body'))[0]
                                sessionStorage.scrollPositionStore = appBody.scrollTop
                                sessionStorage.scrollPositionName = 'item'
                                sessionStorage.scrollPositionLimit = list.length
                            }}>
                                <div className={classes.tableCell} style={{width: isMobileApp?200:'calc(100% / 4)'}}>
                                    {element.name}
                                </div>
                                <div className={classes.tableCell} style={{width: isMobileApp?100:'calc(100% / 4)'}}>
                                    {element.priceAfterDiscountKGS}
                                </div>
                                <div className={classes.tableCell} style={{maxHeight: 100, overflow: 'auto', width: isMobileApp?150:'calc(100% / 4)'}}>
                                    {element.category.name}
                                </div>
                                <div className={classes.tableCell} style={{maxHeight: 100, overflow: 'auto', width: isMobileApp?150:'calc(100% / 4)'}}>
                                    {element.factory.name}
                                </div>
                            </div>
                        </Link>
                    )}
                </div>
            </Card>
            {
                data.add||data.edit?
                    <UnloadUpload position={3} upload={uploadItem} uploadText={uploadText} unload={()=>getUnloadItems({search, ...filter.factory?{factory: filter.factory._id}:{}, ...filter.category?{category: filter.category._id}:{}})}/>
                    :
                    null
            }
            {
                data.edit?
                    <Fab color='primary' aria-label='add' className={classes.fab2} onClick={()=>{
                        setMiniDialog('Рассчитать USD->KGS', <UsdToKgs getList={getList}/>)
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
    if(!['admin', 'завсклад', 'менеджер/завсклад', 'управляющий', 'менеджер'].includes(store.getState().user.profile.role))
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
            edit: store.getState().user.profile.edit&&['admin', 'завсклад', 'менеджер/завсклад'].includes(store.getState().user.profile.role),
            add: store.getState().user.profile.add&&['admin', 'завсклад', 'менеджер/завсклад'].includes(store.getState().user.profile.role),
            list: cloneObject(await getItems({
                skip: 0,
                ...store.getState().app.search?{search: store.getState().app.search}:{},
                ...store.getState().app.filter.factory?{factory: store.getState().app.filter.factory._id}:{},
                ...store.getState().app.filter.category?{category: store.getState().app.filter.category._id}:{},
                ...process.browser&&sessionStorage.scrollPositionLimit?{limit: parseInt(sessionStorage.scrollPositionLimit)}:{},
                ...store.getState().app.filter.typeItem?{type: store.getState().app.filter.typeItem}:{}
            },  ctx.req?await getClientGqlSsr(ctx.req):undefined)),
            count: await getItemsCount({
                ...store.getState().app.search?{search: store.getState().app.search}:{},
                ...store.getState().app.filter.factory?{factory: store.getState().app.filter.factory._id}:{},
                ...store.getState().app.filter.category?{category: store.getState().app.filter.category._id}:{},
                ...store.getState().app.filter.typeItem?{type: store.getState().app.filter.typeItem}:{},
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