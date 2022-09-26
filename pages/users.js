import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import {getUsers, getUsersCount, getUnloadUsers, uploadUser} from '../src/gql/user'
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
const uploadText = 'Формат xlsx:\n_id или текущее имя пользователя (если требуется обновить);\nлогин;\nпароль (если требуется обновить);\nФИО;\nроль (менеджер, завсклад, кассир, доставщик, менеджер/завсклад, управляющий, юрист, сотрудник);\nотдел;\nдолжность;\nначало работы (ДД.ММ.ГГГГ);\nтелефоны (через запятую с пробелом. Пример: 555780963, 559997132);\nназвание магазина.'

const Users = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const { search, filter } = props.app;
    const initialRender = useRef(true);
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const getList = async ()=>{
        setList(cloneObject(await getUsers({
            search,
            ...filter.store?{store: filter.store._id}:{},
            ...filter.role?{role: filter.role}:{},
            ...filter.department?{department: filter.department.name}:{},
            ...filter.position?{position: filter.position.name}:{},
            skip: 0
        })));
        setCount(await getUsersCount({
            search,
            ...filter.store?{store: filter.store._id}:{},
            ...filter.role?{role: filter.role}:{},
            ...filter.department?{department: filter.department.name}:{},
            ...filter.position?{position: filter.position.name}:{}
        }));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
    }
    let searchTimeOut = useRef(null);
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current) await getList()
        })()
    },[filter])
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
            let addedList = cloneObject(await getUsers({
                skip: list.length,
                search,
                ...filter.store?{store: filter.store._id}:{},
                ...filter.role?{role: filter.role}:{},
                ...filter.department?{department: filter.department.name}:{},
                ...filter.position?{position: filter.position.name}:{}
            }))
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    return (
        <App filterShow={{store: true, role: true, department: true, position: true}} checkPagination={checkPagination} searchShow={true} pageName='Пользователи'>
            <Head>
                <title>Пользователи</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content='Пользователи' />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/users`} />
                <link rel='canonical' href={`${urlMain}/users`}/>
            </Head>
            <div className={classes.tableHead}>
                <div className={classes.tableCell} style={{width: 'calc(100% / 3)', justifyContent: 'start'}}>
                    ФИО
                </div>
                <div className={classes.tableCell} style={{width: 'calc(100% / 3)', justifyContent: 'start'}}>
                    Роль
                </div>
                <div className={classes.tableCell} style={{width: 'calc(100% / 3)', justifyContent: 'start'}}>
                    Магазин
                </div>
            </div>
            <Card className={classes.page}>
                <div className={classes.table}>
                    {list.map((element) =>
                        <Link href='/user/[id]' as={`/user/${element._id}`} key={element._id}>
                            <div className={classes.tableRow} onClick={()=>{
                                let appBody = (document.getElementsByClassName('App-body'))[0]
                                sessionStorage.scrollPositionStore = appBody.scrollTop
                                sessionStorage.scrollPositionName = 'user'
                                sessionStorage.scrollPositionLimit = list.length
                            }}>
                                <div className={classes.tableCell} style={{width: 'calc(100% / 3)'}}>
                                    {element.name}
                                </div>
                                <div className={classes.tableCell} style={{width: 'calc(100% / 3)'}}>
                                    {element.role}
                                </div>
                                <div className={classes.tableCell} style={{width: 'calc(100% / 3)'}}>
                                    {element.store?element.store.name:''}
                                </div>
                            </div>
                        </Link>
                    )}
                </div>
            </Card>
            {
                data.add?
                    <Link href='/user/[id]' as={`/user/new`}>
                        <Fab color='primary' aria-label='add' className={classes.fab}>
                            <AddIcon />
                        </Fab>
                    </Link>
                    :
                    null
            }
            {
                data.add||data.edit?
                    <UnloadUpload position={2} upload={uploadUser} uploadText={uploadText} unload={()=>getUnloadUsers({
                        search,
                        ...filter.store?{store: filter.store._id}:{},
                        ...filter.role?{role: filter.role}:{},
                        ...filter.department?{department: filter.department.name}:{},
                        ...filter.position?{position: filter.position.name}:{}
                    })}/>
                    :
                    null
            }
            <div className='count'>
                {`Всего: ${count}`}
            </div>
        </App>
    )
})

Users.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', 'управляющий'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        }
        else {
            Router.push('/')
        }
    store.getState().app.filterType = '/user'
    return {
        data: {
            add: store.getState().user.profile.add&&['admin'].includes(store.getState().user.profile.role),
            list: cloneObject(await getUsers({
                skip: 0,
                ...process.browser&&sessionStorage.scrollPositionLimit?{limit: parseInt(sessionStorage.scrollPositionLimit)}:{},
                ...store.getState().app.search?{search: store.getState().app.search}:{},
                ...store.getState().app.filter.store?{store: store.getState().app.filter.store._id}:{},
                ...store.getState().app.filter.role?{role: store.getState().app.filter.role}:{},
                ...store.getState().app.filter.department?{department: store.getState().app.filter.department.name}:{},
                ...store.getState().app.filter.position?{position: store.getState().app.filter.position.name}:{}
            },  ctx.req?await getClientGqlSsr(ctx.req):undefined)),
            count: await getUsersCount({
                ...store.getState().app.search?{search: store.getState().app.search}:{},
                ...store.getState().app.filter.store?{store: store.getState().app.filter.store._id}:{},
                ...store.getState().app.filter.role?{role: store.getState().app.filter.role}:{},
                ...store.getState().app.filter.department?{department: store.getState().app.filter.department.name}:{},
                ...store.getState().app.filter.position?{position: store.getState().app.filter.position.name}:{}
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

export default connect(mapStateToProps, mapDispatchToProps)(Users);