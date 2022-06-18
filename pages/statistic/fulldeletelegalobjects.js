import Head from 'next/head';
import React, { useState, useRef } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import { getFullDeleteLegalObjects} from '../../src/gql/legalObject'
import pageListStyle from '../../src/styleMUI/list'
import CardFullDeleteLegalObject from '../../components/CardFullDeleteLegalObject'
import Fab from '@mui/material/Fab';
import DeleteIcon from '@mui/icons-material/Delete';
import Link from 'next/link';
import { urlMain } from '../../src/const'
import LazyLoad from 'react-lazyload';
import CardFullDeleteLegalObjectPlaceholder from '../../components/CardPlaceholder'
import { getClientGqlSsr } from '../../src/apollo'
import initialApp from '../../src/initialApp'
import Router from 'next/router'
import { wrapper } from '../../src/redux/configureStore'
const height = 92

const FullDeleteLegalObjects = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    let [list, setList] = useState(data.list);
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = await getFullDeleteLegalObjects({skip: list.length, search, })
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    return (
        <App checkPagination={checkPagination} pageName='Полное удаление налогоплательщика'>
            <Head>
                <title>Полное удаление налогоплательщика</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content='Полное удаление налогоплательщика' />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/statistic/fulldeletelegalobjects`} />
                <link rel='canonical' href={`${urlMain}/statistic/fulldeletelegalobjects`}/>
            </Head>
            <div className={classes.page}>
                {list?list.map((element)=> {
                    return <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height}
                                     offset={[height, 0]} debounce={0} once={true}
                                     placeholder={<CardFullDeleteLegalObjectPlaceholder height={height}/>}>
                        <CardFullDeleteLegalObject element={element}/>
                    </LazyLoad>
                }):null}
            </div>
            <Link href='/statistic/fulldeletelegalobject'>
                <Fab color='primary' aria-label='add' className={classes.fab}>
                    <DeleteIcon/>
                </Fab>
            </Link>
        </App>
    )
})

FullDeleteLegalObjects.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if('superadmin'!==store.getState().user.profile.role)
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    return {
        data: {
            list: await getFullDeleteLegalObjects({skip: 0}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
        }
    };
});

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app,
    }
}

export default connect(mapStateToProps)(FullDeleteLegalObjects);