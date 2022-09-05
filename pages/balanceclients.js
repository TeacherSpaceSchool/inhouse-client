import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import {getBalanceClients, getBalanceClientsCount, getUnloadBalanceClients} from '../src/gql/balanceClient'
import pageListStyle from '../src/styleMUI/list'
import { urlMain } from '../src/const'
import { cloneObject } from '../src/lib'
import Router from 'next/router'
import { forceCheck } from 'react-lazyload';
import { getClientGqlSsr } from '../src/apollo'
import initialApp from '../src/initialApp'
import { wrapper } from '../src/redux/configureStore'
import Card from '@mui/material/Card';
import Link from 'next/link';
import UnloadUpload from '../components/app/UnloadUpload';

const BalanceClients = React.memo((props) => {
    const {classes} = pageListStyle();
    //props
    const { data } = props;
    const { search, isMobileApp, filter } = props.app;
    //настройка
    const initialRender = useRef(true);
    //получение данных
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const getList = async ()=>{
        setList(cloneObject(await getBalanceClients({search, ...data.client?{client: data.client}:{}, skip: 0, debtor: filter.debtor})));
        setCount(await getBalanceClientsCount({search, ...data.client?{client: data.client}:{}, debtor: filter.debtor}));
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
            let addedList = cloneObject(await getBalanceClients({skip: list.length, ...data.client?{client: data.client}:{}, search, debtor: filter.debtor}))
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    //render
    return (
        <App filterShow={{debtor: true}} checkPagination={checkPagination} searchShow={true} pageName='Баланс клиентов'>
            <Head>
                <title>Баланс клиентов</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content='Баланс клиентов' />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/balanceclients`} />
                <link rel='canonical' href={`${urlMain}/balanceclients`}/>
            </Head>
            <Card className={classes.page} style={isMobileApp?{width: 'fit-content'}:{}}>
                <div className={classes.table}>
                    <div className={classes.tableHead} style={isMobileApp?{width: 'fit-content'}:{}}>
                        <div className={classes.tableCell} style={{...isMobileApp?{minWidth: 200}:{}, width: 'calc(100% / 2)', justifyContent: 'start'}}>
                            Клиент
                        </div>
                        <div className={classes.tableCell} style={{...isMobileApp?{width: 150}:{width: 'calc(100% / 2)'}, justifyContent: 'start'}}>
                            Баланс
                        </div>
                    </div>
                    {list.map((element) =>
                        <div className={classes.tableRow} key={element._id} style={isMobileApp?{width: 'fit-content'}:{}}>
                            <div className={classes.tableCell} style={{...isMobileApp?{minWidth: 200}:{}, width: 'calc(100% / 2)', maxHeight: 100, overflow: 'auto'}}>
                                <Link href='/client/[id]' as={`/client/${element.client._id}`}>
                                    <a>
                                        {element.client.name}
                                    </a>
                                </Link>
                            </div>
                            <div className={classes.tableCell} style={{flexDirection: 'column', ...isMobileApp?{width: 150}:{width: 'calc(100% / 2)'}}}>
                                <div className={classes.row}>
                                    <div className={classes.value}>
                                        сом:&nbsp;
                                    </div>
                                    <div>
                                        {element.balance}
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
            <UnloadUpload unload={()=>getUnloadBalanceClients({search, ...data.client?{client: data.client}:{}, debtor: filter.debtor})}/>
        </App>
    )
})

BalanceClients.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', 'кассир', 'менеджер', 'менеджер/завсклад', 'управляющий'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        }
        else {
            Router.push('/')
        }
    if(ctx.query.client)
        store.getState().app.filter.client = ctx.query.client
    return {
        data: {
            client: ctx.query.client,
            list: cloneObject(await getBalanceClients({skip: 0, ...store.getState().app.filter.client?{client: store.getState().app.filter.client}:{}},  ctx.req?await getClientGqlSsr(ctx.req):undefined)),
            count: await getBalanceClientsCount({...store.getState().app.filter.client?{client: store.getState().app.filter.client}:{}}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
        }
    };
})

function mapStateToProps (state) {
    return {
        app: state.app,
    }
}

export default connect(mapStateToProps)(BalanceClients);