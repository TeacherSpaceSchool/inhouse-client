import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import { getItemBarCodes, getItemBarCodesCount } from '../../src/gql/itemBarCode'
import pageListStyle from '../../src/styleMUI/list'
import CardItemBarCode from '../../components/CardItemBarCode'
import { urlMain } from '../../src/const'
import Router from 'next/router'
import LazyLoad from 'react-lazyload';
import { forceCheck } from 'react-lazyload';
import CardItemBarCodePlaceholder from '../../components/CardPlaceholder'
import { getClientGqlSsr } from '../../src/apollo'
import initialApp from '../../src/initialApp'
import * as appActions from '../../src/redux/actions/app'
import { bindActionCreators } from 'redux'
import { useRouter } from 'next/router'
import { wrapper } from '../../src/redux/configureStore'
const height = 194
const filters = [
    {
        name: 'Все',
        value: ''
    },
    {
        name: 'Обработка',
        value: 'обработка'
    }
]

const ItemBarCode = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    let [newBarCode, setNewBarCode] = useState('');
    const { search, filter } = props.app;
    const { profile } = props.user;
    let searchTimeOut = useRef(null);
    const initialRender = useRef(true);
    const getList = async ()=>{
        setList(await getItemBarCodes({skip: 0, search, filter}));
        setCount(await getItemBarCodesCount({search, filter}));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
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
            let addedList = await getItemBarCodes({skip: list.length, search, filter})
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    const router = useRouter()
    useEffect(() => {
        if(process.browser)
            (async()=>{
                if(router.query.barcode&&localStorage.scancode!==router.query.scancode) {
                    setNewBarCode(router.query.barcode)
                    localStorage.scancode = router.query.scancode
                }
            })()
    }, [process.browser]);
    return (
        <App checkPagination={checkPagination} searchShow={true} filters={filters} pageName='Штрих-коды'>
            <Head>
                <title>Штрих-коды</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content='Штрих-коды' />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/itembarcodes`} />
                <link rel='canonical' href={`${urlMain}/itembarcodes`}/>
            </Head>
            <div className={classes.page}>
                <div className='count'>
                    {`Всего: ${count}`}
                </div>
                {
                    profile.add?
                        <CardItemBarCode list={list} setList={setList} newBarCode={newBarCode}/>
                        :
                        null
                }
                {list?list.map((element, idx)=>
                    <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardItemBarCodePlaceholder height={height}/>}>
                        <CardItemBarCode list={list} idx={idx}  setList={setList} element={element}/>
                    </LazyLoad>
                ):null}
            </div>
        </App>
    )
})

ItemBarCode.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
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
            list: await getItemBarCodes({skip: 0}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            count: await getItemBarCodesCount({}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
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

export default connect(mapStateToProps, mapDispatchToProps)(ItemBarCode);