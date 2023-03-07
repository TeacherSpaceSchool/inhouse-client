import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import {getClients, getClientsCount, getUnloadClients, uploadClient} from '../src/gql/client'
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
import Link from 'next/link';
import Fab from '@mui/material/Fab';

import UnloadUpload from '../components/app/UnloadUpload';
const uploadText = 'Формат xlsx:\n_id или текущее имя клиента (если требуется обновить);\nуровень (Бронза, Серебро, Золото, Платина);\nФИО;\nИНН;\nпаспорт;\nработа;\nадрес проживания;\nадрес прописки;\nдень рождения (ДД.ММ.ГГГГ);\nтелефоны (через запятую с пробелом. Пример: 555780963, 559997132);\nemail (через запятую с пробелом. Пример: email1@email.com, email2@email.com);\nкомментарий.'

const Clients = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const { search, filter, isMobileApp } = props.app;
    const initialRender = useRef(true);
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const getList = async ()=>{
        setList(cloneObject(await getClients({search, skip: 0, ...filter.level?{level: filter.level}:{}})));
        setCount(await getClientsCount({search, ...filter.level?{level: filter.level}:{}}));
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
            let addedList = await getClients({skip: list.length, ...filter.level?{level: filter.level}:{}, search})
            if(addedList&&addedList.length>0){list = [...list, ...addedList]; setList(list);}
            else
                paginationWork.current = false
        }
    }
    return (
        <App filterShow={{level: true}} list={list} checkPagination={checkPagination} searchShow={true} pageName='Клиенты'>
            <Head>
                <title>Клиенты</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content='Клиенты' />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/clients`} />
                <link rel='canonical' href={`${urlMain}/clients`}/>
            </Head>
            <div className={classes.tableHead} style={isMobileApp?{width: 'fit-content'}:{}}>
                {data.edit?<div style={{width: 40, padding: 0}}/>:null}
                <div className={classes.tableCell} style={{...isMobileApp?{minWidth:300}:{}, width: 'calc(100% / 3)', justifyContent: 'start'}}>
                    ФИО
                </div>
                <div className={classes.tableCell} style={{...isMobileApp?{minWidth:150}:{}, width: 'calc(100% / 3)', justifyContent: 'start'}}>
                    Уровень
                </div>
                <div className={classes.tableCell} style={{...isMobileApp?{minWidth:300}:{}, width: 'calc(100% / 3)', justifyContent: 'start'}}>
                    Менеджер
                </div>
            </div>
            <Card className={classes.page} style={isMobileApp?{width: 'fit-content'}:{}}>
                <div className={classes.table}>
                    {list&&list.map((element) =>
                        <Link href='/client/[id]' as={`/client/${element._id}`} key={element._id}>
                            <div className={classes.tableRow} key={element._id} onClick={()=>{
                                let appBody = (document.getElementsByClassName('App-body'))[0]
                                sessionStorage.scrollPositionStore = appBody.scrollTop
                                sessionStorage.scrollPositionName = 'client'
                                sessionStorage.scrollPositionLimit = list.length
                            }}>
                                <div className={classes.tableCell} style={{...isMobileApp?{minWidth:300}:{}, width: 'calc(100% / 3)', maxHeight: 100, overflow: 'auto'}}>
                                    {element.name}
                                </div>
                                <div className={classes.tableCell} style={{...isMobileApp?{minWidth:150}:{}, width: 'calc(100% / 3)', maxHeight: 100, overflow: 'auto'}}>
                                    {element.level}
                                </div>
                                <div className={classes.tableCell} style={{...isMobileApp?{minWidth:300}:{}, width: 'calc(100% / 3)', maxHeight: 100, overflow: 'auto'}}>
                                    {element.user?element.user.name:null}
                                </div>
                            </div>
                        </Link>
                    )}
                </div>
            </Card>
            {
                data.add?
                    <Link href='/client/[id]' as={`/client/new`}>
                        <Fab color='primary' aria-label='add' className={classes.fab}>
                            <AddIcon />
                        </Fab>
                    </Link>
                    :
                    null
            }
            {
                data.add||data.edit?
                    <UnloadUpload position={2} upload={uploadClient} uploadText={uploadText} unload={()=>getUnloadClients({search, ...filter.level?{level: filter.level}:{}})}/>
                    :
                    null
            }
            <div className='count'>
                {`Всего: ${count}`}
            </div>
        </App>
    )
})

Clients.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', 'менеджер', 'завсклад', 'кассир', 'доставщик', 'менеджер/завсклад', 'управляющий', 'юрист'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        }
        else {
            Router.push('/')
        }
    store.getState().app.filterType = '/client'
    return {
        data: {
            add: store.getState().user.profile.add&&['admin', 'менеджер', 'менеджер/завсклад', 'кассир'].includes(store.getState().user.profile.role),
            list: cloneObject(await getClients({
                skip: 0,
                ...store.getState().app.filter.level?{level: store.getState().app.filter.level}:{},
                ...store.getState().app.search?{search: store.getState().app.search}:{},
                ...process.browser&&sessionStorage.scrollPositionLimit?{limit: parseInt(sessionStorage.scrollPositionLimit)}:{}
            },  ctx.req?await getClientGqlSsr(ctx.req):undefined)),
            count: await getClientsCount({
                ...store.getState().app.filter.level?{level: store.getState().app.filter.level}:{},
                ...store.getState().app.search?{search: store.getState().app.search}:{},
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

export default connect(mapStateToProps, mapDispatchToProps)(Clients);