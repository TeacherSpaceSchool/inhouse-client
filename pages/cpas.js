import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import {getCpas, getCpasCount, getUnloadCpas, uploadCpa} from '../src/gql/cpa'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
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
import Card from '@mui/material/Card';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import Fab from '@mui/material/Fab';

import UnloadUpload from '../components/app/UnloadUpload';
const uploadText = 'Формат xlsx:\n_id или текущее имя дизайнера (если требуется обновить);\nФИО;\nтелефоны (через запятую с пробелом. Пример: 555780963, 559997132);\nemail (через запятую с пробелом. Пример: email1@email.com, email2@email.com);\nкомментарий.'

const Cpas = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const { search } = props.app;
    const initialRender = useRef(true);
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const getList = async ()=>{
        setList(cloneObject(await getCpas({search, skip: 0})));
        setCount(await getCpasCount({search}));
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
            let addedList = await getCpas({skip: list.length, search})
            if(addedList&&addedList.length>0){list = [...list, ...addedList]; setList(list);}
            else
                paginationWork.current = false
        }
    }
    return (
        <App list={list} checkPagination={checkPagination} searchShow={true} pageName='Дизайнеры'>
            <Head>
                <title>Дизайнеры</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content='Дизайнеры' />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/cpas`} />
                <link rel='canonical' href={`${urlMain}/cpas`}/>
            </Head>
            <div className={classes.tableHead}>
                <div className={classes.tableCell} style={{width: '100%', justifyContent: 'center'}}>
                    ФИО
                </div>
            </div>
            <Card className={classes.page}>
                <div className={classes.table}>
                    {list&&list.map((element) =>
                        <Link href='/cpa/[id]' as={`/cpa/${element._id}`} key={element._id}>
                            <div className={classes.tableRow} onClick={()=>{
                                let appBody = (document.getElementsByClassName('App-body'))[0]
                                sessionStorage.scrollPositionStore = appBody.scrollTop
                                sessionStorage.scrollPositionName = 'cpa'
                                sessionStorage.scrollPositionLimit = list.length
                            }}>
                                <div className={classes.tableCell} style={{width: '100%', maxHeight: 100, overflow: 'auto'}}>
                                    {element.name}
                                </div>
                            </div>
                        </Link>
                    )}
                </div>
            </Card>
            {
                data.add?
                    <Link href='/cpa/[id]' as={`/cpa/new`}>
                        <Fab color='primary' aria-label='add' className={classes.fab}>
                            <AddIcon />
                        </Fab>
                    </Link>
                    :
                    null
            }
            {
                data.add||data.edit?
                    <UnloadUpload position={2} upload={uploadCpa} uploadText={uploadText} unload={()=>getUnloadCpas({search})}/>
                    :
                    null
            }
            <div className='count'>
                {`Всего: ${count}`}
            </div>
        </App>
    )
})

Cpas.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', 'менеджер', 'менеджер/завсклад', 'управляющий'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        }
        else {
            Router.push('/')
        }
    store.getState().app.filterType = '/cpa'
    return {
        data: {
            add: store.getState().user.profile.add&&['admin', 'менеджер', 'менеджер/завсклад'].includes(store.getState().user.profile.role),
            list: cloneObject(await getCpas({
                ...store.getState().app.search?{search: store.getState().app.search}:{},
                skip: 0,
                ...process.browser&&sessionStorage.scrollPositionLimit?{limit: parseInt(sessionStorage.scrollPositionLimit)}:{}
            },  ctx.req?await getClientGqlSsr(ctx.req):undefined)),
            count: await getCpasCount({
                ...store.getState().app.search?{search: store.getState().app.search}:{},
            }, ctx.req?await getClientGqlSsr(ctx.req):undefined),
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
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cpas);