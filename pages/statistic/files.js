import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../../layouts/App';
import CardFile from '../../components/CardFile';
import CardFilePlaceholder from '../../components/CardPlaceholder';
import { connect } from 'react-redux'
import pageListStyle from '../../src/styleMUI/list'
import Router from 'next/router'
import { urlMain } from '../../src/const'
import initialApp from '../../src/initialApp'
import { getFiles, clearAllDeactiveFiles } from '../../src/gql/files'
import { getClientGqlSsr } from '../../src/apollo'
import * as appActions from '../../src/redux/actions/app'
import { bindActionCreators } from 'redux'
import LazyLoad from 'react-lazyload';
import Fab from '@mui/material/Fab';
import RemoveIcon from '@mui/icons-material/Clear';
import Confirmation from '../../components/dialog/Confirmation'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import {checkFloat} from '../../src/lib'
import { wrapper } from '../../src/redux/configureStore'
const height = 210

const Files = React.memo((props) => {
    const { data } = props;
    const {classes} = pageListStyle();
    const { filter } = props.app;
    const { showLoad } = props.appActions;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const initialRender = useRef(true);
    let [list, setList] = useState(data.files);
    let [size, setSize] = useState(0);
    let [pagination, setPagination] = useState(100);
    useEffect(()=>{
        (async()=>{
            if(initialRender.current) {
                initialRender.current = false;
                size = 0
                for (let i = 0; i < list.length; i++) {
                    size += list[i].size
                }
                setSize(size)
            } else {
                await showLoad(true)
                list = (await getFiles(filter)).files
                setList([...list])
                size = 0
                for (let i = 0; i < list.length; i++) {
                    size += list[i].size
                }
                setSize(size)
                await showLoad(false)
            }
        })()
    },[filter])
    const checkPagination = ()=>{
        if(pagination<list.length){
            setPagination(pagination+100)
        }
    }
    return (
        <App checkPagination={checkPagination} pageName='Файловое хранилище' filters={data.filterFile}>
            <Head>
                <title>Файловое хранилище</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content='Файловое хранилище' />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/statistic/files`} />
                <link rel='canonical' href={`${urlMain}/statistic/files`}/>
            </Head>
            <div className={classes.page}>
                {list?list.map((element, idx)=> {
                    if(idx<pagination)
                        return(
                            <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardFilePlaceholder height={height}/>}>
                                <CardFile key={element._id} element={element}/>
                            </LazyLoad>
                        )}
                ):null}
            </div>
            <Fab onClick={async()=>{
                const action = async() => {
                    await clearAllDeactiveFiles()
                }
                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                showMiniDialog(true)
            }} color='primary' aria-label='add' className={classes.fab}>
                <RemoveIcon />
            </Fab>
            <div className='count' >
                {
                    `Размер: ${size>1024?`${checkFloat(size/1024)} GB`:`${checkFloat(size)} MB`}`
                }
            </div>
        </App>
    )
})

Files.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', 'superadmin'].includes(store.getState().user.profile.role)||!store.getState().user.profile.statistic)
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    return {
        data: {
            ...await getFiles('', ctx.req?await getClientGqlSsr(ctx.req):undefined),
        }
    };
});

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Files);