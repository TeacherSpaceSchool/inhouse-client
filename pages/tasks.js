import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import {getTasks, getTasksCount, getUnloadTasks} from '../src/gql/task'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import pageListStyle from '../src/styleMUI/list'
import { urlMain } from '../src/const'
import {cloneObject, pdDDMMYYYY} from '../src/lib'
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

const colors = {
    'обработка': 'orange',
    'отложен': 'orange',
    'принят': 'blue',
    'выполнен': 'green',
    'проверен': 'green',
    'отмена': 'red'
}
const status = ['все', 'отложен', 'обработка', 'принят', 'выполнен', 'проверен']

const Tasks = React.memo((props) => {
    const {classes} = pageListStyle();
    //props
    const { data } = props;
    const { search, isMobileApp, filter } = props.app;
    //настройка
    const initialRender = useRef(true);
    let [today, setToday] = useState();
    //получение данных
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const getList = async ()=>{
        setList(cloneObject(await getTasks({
            search,
            skip: 0,
            ...filter.status?{status: filter.status}:{},
            ...filter.user?{employment: filter.user._id}:{}
        })));
        setCount(await getTasksCount({
            search,
            ...filter.status?{status: filter.status}:{},
            ...filter.user?{employment: filter.user._id}:{}
        }));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
    }
    //поиск/фильтр
    let searchTimeOut = useRef(null);
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current)
                await getList()
        })()
    },[filter])
    useEffect(()=>{
        (async()=>{
            if(initialRender.current) {
                initialRender.current = false;
                today = new Date()
                today.setHours(0, 0, 0, 0)
                setToday(today)
            }
            else {
                if(searchTimeOut.current)
                    clearTimeout(searchTimeOut.current)
                searchTimeOut.current = setTimeout(async () => await getList(), 500)
            }
        })()
    },[search])
    //пагинация
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = cloneObject(await getTasks({
                skip: list.length,
                search,
                ...filter.status?{status: filter.status}:{},
                ...filter.user?{employment: filter.user._id}:{}
            }))
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    //render
    return (
        <App filterShow={{status, user: true}} checkPagination={checkPagination} searchShow={true} pageName='Задачи'>
            <Head>
                <title>Задачи</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content='Задачи' />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/tasks`} />
                <link rel='canonical' href={`${urlMain}/tasks`}/>
            </Head>
            <Card className={classes.page} style={isMobileApp?{width: 'fit-content'}:{}}>
                <div className={classes.table}>
                    <div className={classes.tableHead} style={isMobileApp?{width: 'fit-content'}:{}}>
                        <div className={classes.tableCell} style={{width: 100, justifyContent: 'start'}}>
                            Статус
                        </div>
                        <div className={classes.tableCell} style={{width: 100, justifyContent: 'start'}}>
                            Срок
                        </div>
                        <div className={classes.tableCell} style={{width: 150, justifyContent: 'start'}}>
                            От кого
                        </div>
                        {
                            !isMobileApp?
                                <>
                                <div className={classes.tableCell} style={{width: 150, justifyContent: 'start'}}>
                                    Исполнитель
                                </div>
                                <div className={classes.tableCell} style={{width: 'calc(100% - 500px)', justifyContent: 'start'}}>
                                    Комментарий
                                </div>
                                </>
                                :
                                null
                        }
                    </div>
                    {list.map((element) =>
                        <Link href='/task/[id]' as={`/task/${element._id}`} key={element._id}>
                            <div className={classes.tableRow} style={isMobileApp?{width: 'fit-content'}:{}} onClick={()=>{
                                let appBody = (document.getElementsByClassName('App-body'))[0]
                                sessionStorage.scrollPositionStore = appBody.scrollTop
                                sessionStorage.scrollPositionName = 'task'
                                sessionStorage.scrollPositionLimit = list.length
                            }}>
                                <div className={classes.tableCell} style={{width: 100, fontWeight: 'bold', color: colors[element.status]}}>
                                    {element.status}
                                </div>
                                <div className={classes.tableCell} style={{width: 100, color: !['выполнен', 'проверен'].includes(element.status)&&new Date(element.date)<today?'red':'black'}}>
                                    {pdDDMMYYYY(element.date)}
                                </div>
                                <div className={classes.tableCell} style={{width: 150}}>
                                    {element.who.name}
                                </div>
                                {
                                    !isMobileApp?
                                        <>
                                        <div className={classes.tableCell} style={{width: 150}}>
                                            {element.whom.name}
                                        </div>
                                        <div className={classes.tableCell} style={{width: 'calc(100% - 500px)', maxHeight: 100, overflow: 'auto'}}>
                                            {element.info}
                                        </div>
                                        </>
                                        :
                                        null
                                }
                            </div>
                        </Link>
                    )}
                </div>
            </Card>
            <Link href='/task/[id]' as={`/task/new`}>
                <Fab color='primary' aria-label='add' className={classes.fab}>
                    <AddIcon />
                </Fab>
            </Link>
            <div className='count'>
                {`Всего: ${count}`}
            </div>
            <UnloadUpload position={2} unload={()=>getUnloadTasks({search, ...filter.status?{status: filter.status}:{}})}/>
        </App>
    )
})

Tasks.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!store.getState().user.authenticated)
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        }
        else {
            Router.push('/')
        }
    store.getState().app.filterType = '/task'
    return {
        data: {
            list: cloneObject(await getTasks({
                skip: 0,
                ...store.getState().app.search?{search: store.getState().app.search}:{},
                ...store.getState().app.filter.status?{status: store.getState().app.filter.status}:{},
                ...store.getState().app.filter.user?{employment: store.getState().app.filter.user._id}:{},
                ...process.browser&&sessionStorage.scrollPositionLimit?{limit: parseInt(sessionStorage.scrollPositionLimit)}:{}
            },  ctx.req?await getClientGqlSsr(ctx.req):undefined)),
            count: await getTasksCount({
                ...store.getState().app.search?{search: store.getState().app.search}:{},
                ...store.getState().app.filter.status?{status: store.getState().app.filter.status}:{},
                ...store.getState().app.filter.user?{employment: store.getState().app.filter.user._id}:{},
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

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);