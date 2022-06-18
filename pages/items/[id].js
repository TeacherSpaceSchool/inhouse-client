import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import { getItems, getItemsCount } from '../../src/gql/item'
import pageListStyle from '../../src/styleMUI/list'
import CardItem from '../../components/CardItem'
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import { urlMain } from '../../src/const'
import LazyLoad from 'react-lazyload';
import { forceCheck } from 'react-lazyload';
import CardItemPlaceholder from '../../components/CardPlaceholder'
import { getClientGqlSsr } from '../../src/apollo'
import initialApp from '../../src/initialApp'
import Router from 'next/router'
import { useRouter } from 'next/router'
import * as appActions from '../../src/redux/actions/app'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { bindActionCreators } from 'redux'
import ControlCamera from '../../icons/barcode-scanner.svg';
import { openScanner } from '../../src/lib';
import { wrapper } from '../../src/redux/configureStore'
const filters = [
    {
        name: 'Все',
        value: ''
    },
    {
        name: 'Товары',
        value: 'товары'
    },
    {
        name: 'Услуги',
        value: 'услуги'
    }
]
const height = 50

const Items = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const { showLoad } = props.appActions;
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const router = useRouter()
    const { profile } = props.user;
    const { search, filter, isMobileApp } = props.app;
    let [history, setHistory] = useState([]);
    let searchTimeOut = useRef(null);
    const initialRender = useRef(true);
    const getList = async ()=>{
        setList(await getItems({legalObject: router.query.id, skip: 0, search, category: history.length?history[history.length-1]._id:null, type: filter}))
        setCount(await getItemsCount({legalObject: router.query.id, search, category: history.length?history[history.length-1]._id:null, type: filter}));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
    }
    const toCategory = async (i)=>{
        showLoad(true)
        if(history.length>1)
            history.splice(history.length-i)
        else
            history = []
        await getList()
        sessionStorage.history = JSON.stringify([...history])
        setHistory([...history])
        showLoad(false)
    }
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current) {
                await getList()
            }
        })()
    },[filter])
    useEffect(()=>{
        (async()=>{
            if(initialRender.current) {
                if(data.history)
                    setHistory(data.history)
                initialRender.current = false;
            }
            else {
                if(searchTimeOut.current)
                    clearTimeout(searchTimeOut.current)
                searchTimeOut.current = setTimeout(async()=>{
                    await getList()
                }, 500)

            }
        })()
    },[ search])
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = await getItems({skip: list.length, search, legalObject: router.query.id, category: history.length?history[history.length-1]._id:null, type: filter})
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    return (
        <App checkPagination={checkPagination} searchShow={true} filters={filters} pageName='Товары'>
            <Head>
                <title>Товары</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content='Товары' />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/items/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/items/${router.query.id}`}/>
            </Head>
            {
                !search.length?
                    <Breadcrumbs style={{margin: 20}} aria-label='breadcrumb'>
                        <div style={{cursor: 'pointer', fontWeight: 500, color: !history.length?'#10183D':'#A0A0A0'}} onClick={()=>{
                            if(history.length) {
                                toCategory(2)
                            }
                        }}>
                            {history.length<3 ?
                                'Категории'
                                :
                                history[history.length-3].name
                            }
                        </div>
                        {
                            history.length?
                                <div style={{cursor: 'pointer', fontWeight: 500, color: history.length===1?'#10183D':'#A0A0A0'}} onClick={async()=>{
                                    if(history.length>1) {
                                        toCategory(1)
                                    }
                                }}>
                                    {history.length===1 ?
                                        history[0].name
                                        :
                                        history[history.length-2].name
                                    }
                                </div>
                                :
                                null
                        }
                        {
                            history.length>1?
                                <div style={{fontWeight: 500, color: '#10183D'}} onClick={()=>{}}>
                                    {history[history.length-1].name}
                                </div>
                                :
                                null
                        }
                    </Breadcrumbs>
                    :
                    null
            }
            <div className='count'>
                {`Товаров: ${count}`}
            </div>
            <div className={classes.page}>
                {list?list.map((element, idx)=> {
                        if(idx<=data.limit)
                            return <CardItem limit={list.length} path={router.asPath} key={element._id} setList={setList} element={element} idx={idx} history={history} setHistory={setHistory} setCount={setCount} legalObject={router.query.id}/>
                        else return <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardItemPlaceholder height={height}/>}>
                                    <CardItem limit={list.length} path={router.asPath} key={element._id} setList={setList} element={element} idx={idx} history={history} setHistory={setHistory} setCount={setCount} legalObject={router.query.id}/>
                                </LazyLoad>
                }):null}
            </div>
            {
                isMobileApp?
                    <>
                    <div style={{height: 90}}/>
                    <Fab color='primary' aria-label='add' className={classes.fab2} onClick={()=>{
                        openScanner({_idx: 0, path: `items/${router.query.id}`})
                    }}>
                        <ControlCamera/>
                    </Fab>
                    </>
                    :
                    null
            }
            {
                ['admin', 'superadmin', 'управляющий', 'кассир', 'супервайзер'].includes(profile.role)&&profile.add?
                    <Link href='/item/[id]' as={`/item/new`}>
                        <Fab color='primary' aria-label='add' className={classes.fab}>
                            <AddIcon />
                        </Fab>
                    </Link>
                    :
                    null
            }
        </App>
    )
})

Items.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', 'superadmin', 'управляющий', 'кассир', 'супервайзер'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')


    if(ctx.query.barcode){
        let scanItems = await getItems({search: ctx.query.barcode}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
        if (scanItems.length){
            if(ctx.res) {
                ctx.res.writeHead(302, {
                    Location: `/item/${scanItems[0]._id}`
                })
                ctx.res.end()
            } else
                Router.push(`/item/${scanItems[0]._id}`)
        }
        else if(store.getState().user.profile.add) {if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: `/item/new?barcode=${ctx.query.barcode}`
            })
            ctx.res.end()
        } else
            Router.push(`/item/new?barcode=${ctx.query.barcode}`)
        }
    }

    store.getState().app.legalObject = {_id: ctx.query.id}
    let history
    if(!ctx.req&&sessionStorage.history)
        history = JSON.parse(sessionStorage.history)
    let limit
    if(process.browser&&sessionStorage.scrollPostionLimit)
        limit = parseInt(sessionStorage.scrollPostionLimit)
    return {
        data: {
            limit,
            history: history,
            list: await getItems({
                limit,
                category: history?history[history.length-1]._id:undefined,
                skip: 0,
                legalObject: ctx.query.id
            }, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            count: await getItemsCount({category: history?history[history.length-1]._id:undefined, legalObject: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
        }
    };
});

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Items);