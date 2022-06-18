import Head from 'next/head';
import React, { useState, useRef } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import { getTariffs } from '../../src/gql/tariff'
import pageListStyle from '../../src/styleMUI/list'
import CardTariffs from '../../components/CardTariff'
import { urlMain } from '../../src/const'
import LazyLoad from 'react-lazyload';
import CardPlaceholder from '../../components/CardPlaceholder'
import { getClientGqlSsr } from '../../src/apollo'
import initialApp from '../../src/initialApp'
import Router from 'next/router'
import { wrapper } from '../../src/redux/configureStore'
const height = 140

const Tariffs = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const { profile } = props.user;
    let [list, setList] = useState(data.list);
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = await getTariffs({skip: list.length})
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    return (
        <App checkPagination={checkPagination} setList={setList} list={list} pageName='Тарифы'>
            <Head>
                <title>Тарифы</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content='Тарифы' />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/statistic/tariffs`} />
                <link rel='canonical' href={`${urlMain}/statistic/tariffs`}/>
            </Head>
            <div className={classes.page}>
                {
                    profile.add?
                        <CardTariffs list={list} setList={setList}/>
                        :
                        null
                }
                {
                    list?list.map((element)=> {
                            return(
                                <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardPlaceholder height={height}/>}>
                                    <CardTariffs list={list} element={element} setList={setList}/>
                                </LazyLoad>
                            )}
                    ):null
                }
            </div>
        </App>
    )
})

Tariffs.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['superadmin','admin'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    return {
        data: {
            list: await getTariffs({skip: 0}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
        }
    };
});

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

export default connect(mapStateToProps)(Tariffs);