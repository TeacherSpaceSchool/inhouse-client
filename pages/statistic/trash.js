import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../../layouts/App';
import pageListStyle from '../../src/styleMUI/list'
import CardPlaceholder from '../../components/CardPlaceholder'
import {getUsersTrash} from '../../src/gql/user'
import CardUser from '../../components/CardUser'
import {getCashboxesTrash} from '../../src/gql/cashbox'
import CardCashbox from '../../components/CardCashbox'
import {getLegalObjectsTrash} from '../../src/gql/legalObject'
import CardLegalObject from '../../components/CardLegalObject'
import {getBranchsTrash} from '../../src/gql/branch'
import CardBranch from '../../components/CardBranch'
import { wrapper } from '../../src/redux/configureStore'
import { connect } from 'react-redux'
import Router from 'next/router'
import { urlMain } from '../../src/const'
import { forceCheck } from 'react-lazyload';
import { getClientGqlSsr } from '../../src/apollo'
import initialApp from '../../src/initialApp'
import LazyLoad from 'react-lazyload';
const height = 140;
const filters = [
    {name: 'Пользователи', value: 'Пользователи'},
    {name: 'Налогоплательщики', value: 'Налогоплательщики'},
    {name: 'Объекты', value: 'Объекты'},
    {name: 'Кассы', value: 'Кассы'}
]

const Trash = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const { search, filter } = props.app;
    const initialRender = useRef(true);
    let searchTimeOut = useRef(null);
    let [list, setList] = useState(data.clientsTrash);
    let [type, setType] = useState('Пользователи');
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList
            if(filter==='Пользователи')
                addedList = await getUsersTrash({search: search, skip: list.length})
            else if(filter==='Налогоплательщики')
                addedList = await getLegalObjectsTrash({search: search, skip: list.length})
            else if(filter==='Объекты')
                addedList = await getBranchsTrash({search: search, skip: list.length})
            else if(filter==='Кассы')
                addedList = await getCashboxesTrash({search: search, skip: list.length})
            if(addedList.length>0){
                setList([...list, ...addedList])
            }
            else
                paginationWork.current = false
        }
    }
    useEffect(()=>{
        (async()=>{
            if(initialRender.current) {
                initialRender.current = false;
            } else {
                if (searchTimeOut.current)
                    clearTimeout(searchTimeOut.current)
                searchTimeOut.current = setTimeout(async () => {
                    if (filter === 'Пользователи')
                        setList(await getUsersTrash({search: search, skip: 0}))
                    else if (filter === 'Налогоплательщики')
                        setList(await getLegalObjectsTrash({search: search, skip: 0}))
                    else if (filter === 'Объекты')
                        setList(await getBranchsTrash({search: search, skip: 0}))
                    else if (filter === 'Кассы')
                        setList(await getCashboxesTrash({search: search, skip: 0}))
                    forceCheck()
                    setType(filter)
                    paginationWork.current = true;
                    (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant'});
                }, 500)

            }
        })()
    },[filter, search])
    return (
        <App checkPagination={checkPagination} searchShow={true} filters={filters} pageName='Корзина'>
            <Head>
                <title>Корзина</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content='Корзина' />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/statistic/trash`} />
                <link rel='canonical' href={`${urlMain}/statistic/trash`}/>
            </Head>
            <div className={classes.page}>
                {list?list.map((element, idx)=> {
                    return(
                        <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]}
                                  debounce={0} once={true} placeholder={<CardPlaceholder height={height}/>}>
                            {
                                type===filter?
                                    type==='Пользователи'?
                                        <CardUser list={list} idx={idx} key={element._id} setList={setList} element={element}/>
                                        :
                                    type==='Налогоплательщики'?
                                        <CardLegalObject selected={[]} list={list} idx={idx} setList={setList} key={element._id} element={element}/>
                                        :
                                    type==='Объекты'&&element.items?
                                        <CardBranch selected={[]} list={list} idx={idx} setList={setList} key={element._id} element={element}/>
                                        :
                                    type==='Кассы'?
                                        <CardCashbox setList={setList} key={element._id} element={element} list={list}/>
                                        :
                                        null
                                :
                                    null
                            }
                        </LazyLoad>
                    )}
                ):null}
            </div>
        </App>
    )
})

Trash.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    store.getState().app.filter = 'Пользователи'
    if(!['admin', 'superadmin'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    return {
        data: {
            ...(await getUsersTrash({search: '', skip: 0}, ctx.req?await getClientGqlSsr(ctx.req):undefined)),
        }
    };
});

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

export default connect(mapStateToProps)(Trash);