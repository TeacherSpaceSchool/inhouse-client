import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import {getFaqs, getFaqsCount} from '../src/gql/faq'
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
import CardFaq from '../components/CardFaq';

const Faqs = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const { search } = props.app;
    const initialRender = useRef(true);
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const getList = async ()=>{
        setList(cloneObject(await getFaqs({search, skip: 0})));
        setCount(await getFaqsCount({search}));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
    }
    let searchTimeOut = useRef(null);
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
            let addedList = cloneObject(await getFaqs({skip: list.length, search}))
            if(addedList&&addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    return (
        <App checkPagination={checkPagination} searchShow={true} pageName='Инструкции'>
            <Head>
                <title>Инструкции</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content='Инструкции' />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/faqs`} />
                <link rel='canonical' href={`${urlMain}/faqs`}/>
            </Head>
            <div className={classes.page}>
                {data.add?
                    <CardFaq list={list} setList={setList}/>:null}
                {list&&list.map((element, idx)=>
                        <CardFaq edit={data.edit} deleted={data.deleted} list={list} idx={idx} setList={setList} key={element._id} element={element}/>
                )}
            </div>
            <div className='count'>
                {`Всего: ${count}`}
            </div>
        </App>
    )
})

Faqs.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!store.getState().user.profile.role)
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
            add: store.getState().user.profile.add&&['admin'].includes(store.getState().user.profile.role),
            edit: store.getState().user.profile.edit&&['admin'].includes(store.getState().user.profile.role),
            deleted: store.getState().user.profile.deleted&&['admin'].includes(store.getState().user.profile.role),
            list: cloneObject(await getFaqs({skip: 0},  ctx.req?await getClientGqlSsr(ctx.req):undefined)),
            count: await getFaqsCount({}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
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
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Faqs);