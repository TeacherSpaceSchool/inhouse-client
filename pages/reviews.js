import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import { getReviews, getReviewsCount } from '../src/gql/review'
import pageListStyle from '../src/styleMUI/list'
import CardReviews from '../components/CardReview'
import { urlMain } from '../src/const'
import LazyLoad from 'react-lazyload';
import { forceCheck } from 'react-lazyload';
import CardReviewsPlaceholder from '../components/CardPlaceholder'
import { getClientGqlSsr } from '../src/apollo'
import initialApp from '../src/initialApp'
import Router from 'next/router'
import { wrapper } from '../src/redux/configureStore'
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
const height = 113

const Reviews = React.memo((props) => {
    const {classes} = pageListStyle();
    const { profile } = props.user;
    const { data } = props;
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const { filter } = props.app;
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = await getReviews({filter: filter, skip: list.length})
            if(addedList.length>0){
                setList([...list, ...addedList])
            }
            else
                paginationWork.current = false
        }
    }
    const getList = async()=>{
        setList(await getReviews({filter: filter, skip: 0}))
        setCount(await getReviewsCount({filter: filter,}));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck()
        paginationWork.current = true
    }
    useEffect(()=>{
        (async () => {
            await getList()
        })()
    },[filter])
    return (
        <App organizations checkPagination={checkPagination} setList={setList} list={list} filters={filters} pageName='Отзывы'>
            <Head>
                <title>Отзывы</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content='Отзывы' />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/reviews`} />
                <link rel='canonical' href={`${urlMain}/reviews`}/>
            </Head>
            <div className={classes.page}>
                {
                    profile.legalObject?
                        <CardReviews list={list} setList={setList}/>
                        :
                        null
                }
                {
                    list?list.map((element, idx)=> {
                            return(
                                <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardReviewsPlaceholder height={height}/>}>
                                    <CardReviews list={list} idx={idx} element={element} setList={setList}/>
                                </LazyLoad>
                            )}
                    ):null
                }
            </div>
            <div className='count'>
                {
                    `Всего: ${count}`
                }
            </div>
        </App>
    )
})

Reviews.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', 'superadmin', 'управляющий', 'кассир', 'супервайзер'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    return {
        data: {
            list: await getReviews({skip: 0, filter: ''}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            count: await getReviewsCount({filter: ''}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
        }
    };
})

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

export default connect(mapStateToProps)(Reviews);