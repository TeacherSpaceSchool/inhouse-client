import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import { getCategorys, getCategorysCount } from '../src/gql/category'
import pageListStyle from '../src/styleMUI/list'
import CardCategory from '../components/CardCategory'
import { urlMain } from '../src/const'
import Router from 'next/router'
import LazyLoad from 'react-lazyload';
import { forceCheck } from 'react-lazyload';
import CardCategoryPlaceholder from '../components/CardPlaceholder'
import { getClientGqlSsr } from '../src/apollo'
import initialApp from '../src/initialApp'
import * as appActions from '../src/redux/actions/app'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { bindActionCreators } from 'redux'
import { wrapper } from '../src/redux/configureStore'
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
const height = 166

const Category = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const { showLoad } = props.appActions;
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const { search, filter } = props.app;
    const { profile } = props.user;
    let searchTimeOut = useRef(null);
    let [history, setHistory] = useState([]);
    const initialRender = useRef(true);
    const getList = async ()=>{
        setList(await getCategorys({skip: 0, search, category: history.length?history[history.length-1]._id:null, type: filter}));
        setCount(await getCategorysCount({search, category: history.length?history[history.length-1]._id:null, type: filter}));
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
                initialRender.current = false;
            } else {
                if(searchTimeOut.current)
                    clearTimeout(searchTimeOut.current)
                searchTimeOut.current = setTimeout(async()=>{
                    await getList()
                }, 500)
            }
        })()
    },[search])
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = await getCategorys({skip: list.length, search, category: history.length?history[history.length-1]._id:null, type: filter})
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    return (
        <App checkPagination={checkPagination} searchShow={true} filters={filters} pageName='Категории'>
            <Head>
                <title>Категории</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content='Категории' />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}`} />
                <link rel='canonical' href={`${urlMain}`}/>
            </Head>
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
            <div className={classes.page}>
                {
                    profile.add?
                        <>
                        <div className='count'>{`Всего: ${count}`}</div>
                        <CardCategory setCount={setCount} category={history.length?history[history.length - 1]._id:undefined} list={list} setList={setList}/>
                        </>
                        :
                        null
                }
                {list?list.map((element, idx)=>
                    <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardCategoryPlaceholder height={height}/>}>
                        <CardCategory paginationWork={paginationWork} setCount={profile.add?setCount:null} history={history} setHistory={setHistory} list={list} category={history.length?history[history.length - 1]._id:undefined} idx={idx}  key={element._id} setList={setList} element={element}/>
                    </LazyLoad>
                ):null}
            </div>
        </App>
    )
})

Category.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', 'superadmin'].includes(store.getState().user.profile.role))
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
            list: await getCategorys({skip: 0}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            count: await getCategorysCount({}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
        }
    };
})

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

export default connect(mapStateToProps, mapDispatchToProps)(Category);