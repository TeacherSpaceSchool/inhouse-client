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
    'в процессе': 'blue',
    'выполнен': 'green',
    'проверен': 'green'
}
const status = ['все', 'отложен', 'обработка', 'в процессе', 'выполнен', 'проверен']
const sorts = [
    {
        name: 'Создан',
        field: 'createdAt'
    },
    {
        name: 'Срок',
        field: 'date'
    }
]

const Tasks = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const { search, isMobileApp, filter, sort } = props.app;
    const initialRender = useRef(true);
    let [today, setToday] = useState();
    let [showStat, setShowStat] = useState(true);
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const getList = async ()=>{
        setList(cloneObject(await getTasks({
            search,
            skip: 0,
            sort,
            ...filter.status?{status: filter.status}:{},
            ...filter.user?{employment: filter.user._id}:{},
            ...filter.timeDif==='late'?{late: true}:filter.timeDif==='soon'?{soon: true}:filter.timeDif==='today'?{today: true}:{}
        })));
        setCount(await getTasksCount({
            search,
            ...filter.status?{status: filter.status}:{},
            ...filter.user?{employment: filter.user._id}:{},
            ...filter.timeDif==='late'?{late: true}:filter.timeDif==='soon'?{soon: true}:filter.timeDif==='today'?{today: true}:{}
        }));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
    }
    let searchTimeOut = useRef(null);
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current)
                await getList()
        })()
    },[filter, sort])
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
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = await getTasks({
                skip: list.length,
                search,
                sort,
                ...filter.status?{status: filter.status}:{},
                ...filter.user?{employment: filter.user._id}:{},
                ...filter.timeDif==='late'?{late: true}:filter.timeDif==='soon'?{soon: true}:filter.timeDif==='today'?{today: true}:{}
            })
            if(addedList&&addedList.length>0){list = [...list, ...addedList]; setList(list);}
            else
                paginationWork.current = false
        }
    }
    return (
        <App list={list} sorts={sorts} filterShow={{status, user: true, timeDif: true}} checkPagination={checkPagination} searchShow={true} pageName='Задачи'>
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
            <div className={classes.tableHead} style={isMobileApp?{width: 'fit-content'}:{}}>
                <div className={classes.tableCell} style={{width: 100, justifyContent: 'start'}}>
                    Создан
                </div>
                <div className={classes.tableCell} style={{width: 100, justifyContent: 'start'}}>
                    Статус
                </div>
                <div className={classes.tableCell} style={{width: 100, justifyContent: 'start'}}>
                    Срок
                </div>
                <div className={classes.tableCell} style={{width: 200, justifyContent: 'start'}}>
                    От кого
                </div>
                <div className={classes.tableCell} style={{width: 200, justifyContent: 'start'}}>
                    Исполнитель
                </div>
                <div className={classes.tableCell} style={{...isMobileApp?{minWidth: 200}:{}, width: 'calc(100% - 700px)', justifyContent: 'start'}}>
                    Комментарий
                </div>
            </div>
            <Card className={classes.page} style={isMobileApp?{width: 'fit-content'}:{}}>
                <div className={classes.table}>
                    {list&&list.map((element) =>
                        <Link href='/task/[id]' as={`/task/${element._id}`} key={element._id}>
                            <div className={classes.tableRow} onClick={()=>{
                                let appBody = (document.getElementsByClassName('App-body'))[0]
                                sessionStorage.scrollPositionStore = appBody.scrollTop
                                sessionStorage.scrollPositionName = 'task'
                                sessionStorage.scrollPositionLimit = list.length
                            }}>
                                <div className={classes.tableCell} style={{width: 100}}>
                                    {pdDDMMYYYY(element.createdAt)}
                                </div>
                                <div className={classes.tableCell} style={{width: 100, fontWeight: 'bold', color: colors[element.status]}}>
                                    {element.status}
                                </div>
                                <div className={classes.tableCell} style={{width: 100, color: !['выполнен', 'проверен'].includes(element.status)&&new Date(element.date)<today?'red':'black'}}>
                                    {pdDDMMYYYY(element.date)}
                                </div>
                                <div className={classes.tableCell} style={{width: 200}}>
                                    {element.who.name}
                                </div>
                                <div className={classes.tableCell} style={{width: 200}}>
                                    {element.whom.name}
                                </div>
                                <div className={classes.tableCell} style={{...isMobileApp?{minWidth: 200}:{}, width: 'calc(100% - 700px)', maxHeight: 100, overflow: 'auto'}}>
                                    {element.info}
                                </div>
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
            <div className='count' onClick={()=>{
                setShowStat(!showStat)
            }}>
                {`Всего: ${count[0]}`}
                {
                    showStat?
                        <>
                        <br/>{`Обработка: ${count[1]}`}
                        <br/>{`Отложен: ${count[2]}`}
                        <br/> {`В процессе: ${count[3]}`}
                        <br/> {`Выполнен: ${count[4]}`}
                        <br/> {`Проверен: ${count[5]}`}
                        </>
                        :
                        null
                }
            </div>
            <UnloadUpload position={2} unload={()=>getUnloadTasks({search, sort, ...filter.status?{status: filter.status}:{}})}/>
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
    store.getState().app.sort = '-createdAt'
    store.getState().app.filterType = '/task'
    return {
        data: {
            list: cloneObject(await getTasks({
                skip: 0,
                sort: store.getState().app.sort,
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