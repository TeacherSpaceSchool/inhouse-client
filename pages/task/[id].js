import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import { getTask, setTask, addTask, deleteTask } from '../../src/gql/task'
import { getUsers } from '../../src/gql/user'
import pageListStyle from '../../src/styleMUI/list'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import { useRouter } from 'next/router'
import Router from 'next/router'
import * as userActions from '../../src/redux/actions/user'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import * as appActions from '../../src/redux/actions/app'
import TextField from '@mui/material/TextField';
import Confirmation from '../../components/dialog/Confirmation'
import { urlMain } from '../../src/const'
import { getClientGqlSsr } from '../../src/apollo'
import {pdDatePicker, pdDDMMYYYY} from '../../src/lib'
import History from '../../components/dialog/History';
import HistoryIcon from '@mui/icons-material/History';
import { wrapper } from '../../src/redux/configureStore'
import AutocomplectOnline from '../../components/app/AutocomplectOnline'

const colors = {
    'обработка': 'orange',
    'принят': 'blue',
    'выполнен': 'green',
    'проверен': 'green',
    'отмена': 'red'
}

const Task = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const { isMobileApp, filter } = props.app;
    const { showSnackBar } = props.snackbarActions;
    const { profile } = props.user;
    const unsaved = useRef();
    let [today, setToday] = useState();
    let [info, setInfo] = useState(data.object?data.object.info:'');
    let [whom, setWhom] = useState(data.object?data.object.whom:null);
    let [date, setDate] = useState(pdDatePicker(data.object?data.object.date:new Date()));
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const router = useRouter()
    useEffect(()=>{
        today = new Date()
        today.setHours(0, 0, 0, 0)
        setToday(today)
    },[])
    useEffect(()=>{
        if(!unsaved.current)
            unsaved.current = {}
        else
            unsaved.current[router.query.id] = true
    },[info, whom, date])
    return (
        <App unsaved={unsaved} pageName={data.object!==null?router.query.id==='new'?'Добавить':'Задача':'Ничего не найдено'}>
            <Head>
                <title>{data.object!==null?router.query.id==='new'?'Добавить':'Задача':'Ничего не найдено'}</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content={data.object!==null?router.query.id==='new'?'Добавить':'Задача':'Ничего не найдено'} />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website'/>
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/task/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/task/${router.query.id}`}/>
            </Head>
            <Card className={classes.page}>
                <div className={classes.status}>
                    {
                        data.edit&&data.object&&data.object._id?
                            <HistoryIcon onClick={async()=>{
                                setMiniDialog('История', <History where={data.object._id}/>)
                                showMiniDialog(true)
                            }} style={{ color: '#10183D'}}/>
                            :
                            null
                    }
                </div>
                <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignItems: 'flex-start'}}>
                    {
                        data.object?
                            <>
                            {
                                data.edit||router.query.id==='new'?
                                    <>
                                    {
                                        router.query.id!=='new'?
                                            <>
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>
                                                    Статус:
                                                </div>
                                                <div className={classes.value} style={{color: colors[data.object.status], fontWeight: 'bold'}}>
                                                    {data.object.status}
                                                </div>
                                            </div>
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>
                                                    От кого:
                                                </div>
                                                <div className={classes.value}>
                                                    {data.object.who.name}
                                                </div>
                                            </div>
                                            </>
                                            :
                                            null
                                    }
                                    {
                                        router.query.id==='new'?
                                            <AutocomplectOnline
                                                error={!whom}
                                                element={whom}
                                                setElement={(user)=>{
                                                    setWhom(user)
                                                }}
                                                defaultValue={whom}
                                                getElements={async (search)=>{
                                                    return await getUsers({
                                                        search,
                                                        ...filter.store?{store: filter.store._id}:{}
                                                    })
                                                }}
                                                minLength={0}
                                                label={'Исполнитель'}
                                            />
                                            :
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>
                                                    Исполнитель:
                                                </div>
                                                <div className={classes.value}>
                                                    {whom.name}
                                                </div>
                                            </div>
                                    }
                                    <TextField variant='standard'
                                               id='date'
                                               type='date'
                                               error={!date||new Date(date)<today}
                                               label='Срок'
                                               onChange={(event) => setDate(event.target.value)}
                                               value={date}
                                               className={classes.input}
                                    />
                                    <TextField
                                        id='info'
                                        error={!info}
                                        variant='standard'
                                        onChange={(event) => setInfo(event.target.value)}
                                        label='Информация'
                                        multiline={true}
                                        value={info}
                                        className={classes.input}
                                    />
                                    </>
                                    :
                                    <>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Статус:
                                        </div>
                                        <div className={classes.value} style={{color: colors[data.object.status]}}>
                                            {data.object.status}
                                        </div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            От кого:
                                        </div>
                                        <div className={classes.value}>
                                            {data.object.who.name}
                                        </div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Исполнитель:
                                        </div>
                                        <div className={classes.value}>
                                            {whom.name}
                                        </div>
                                    </div>
                                    <div className={classes.row} style={{color: !['выполнен', 'проверен'].includes(data.object.status)&&new Date(date)<today?'red':'black'}}>
                                        <div className={classes.nameField}>
                                            Срок:
                                        </div>
                                        <div className={classes.value}>
                                            {pdDDMMYYYY(date)}
                                        </div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Информация:&nbsp;
                                        </div>
                                        <div className={classes.value}>
                                            {info}
                                        </div>
                                    </div>
                                    </>
                            }
                            <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD}>
                                {
                                    data.object.status==='обработка'&&(profile._id===data.object.whom._id||['admin'].includes(profile.role))?
                                        <Button color='primary' onClick={()=>{
                                            const action = async() => {
                                                let res = await setTask({_id: router.query.id, status: 'принят'})
                                                if(res&&res!=='ERROR') {
                                                    showSnackBar('Успешно', 'success')
                                                    Router.reload()
                                                }
                                                else
                                                    showSnackBar('Ошибка', 'error')
                                            }
                                            setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                            showMiniDialog(true)
                                        }}>
                                            Принять
                                        </Button>
                                    :
                                    data.object.status==='принят'&&(profile._id===data.object.whom._id||['admin'].includes(profile.role))?
                                        <Button color='primary' onClick={()=>{
                                            const action = async() => {
                                                let res = await setTask({_id: router.query.id, status: 'выполнен'})
                                                if(res&&res!=='ERROR') {
                                                    showSnackBar('Успешно', 'success')
                                                    Router.reload()
                                                }
                                                else
                                                    showSnackBar('Ошибка', 'error')
                                            }
                                            setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                            showMiniDialog(true)
                                        }}>
                                            Выполнен
                                        </Button>
                                    :
                                    data.object.status==='выполнен'&&(profile._id===data.object.who._id||['admin'].includes(profile.role))?
                                        <Button color='primary' onClick={()=>{
                                            const action = async() => {
                                                let res = await setTask({_id: router.query.id, status: 'проверен'})
                                                if(res&&res!=='ERROR') {
                                                    showSnackBar('Успешно', 'success')
                                                    Router.reload()
                                                }
                                                else
                                                    showSnackBar('Ошибка', 'error')
                                            }
                                            setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                            showMiniDialog(true)
                                        }}>
                                            Проверил
                                        </Button>
                                    :
                                    null
                                }
                                {
                                    data.edit||router.query.id==='new'?
                                        <>
                                        <Button color='primary' onClick={()=>{
                                            let res
                                            if (info&&whom&&date) {
                                                const action = async() => {
                                                    if(router.query.id==='new') {
                                                        res = await addTask({whom: whom._id, date, info})
                                                        if(res!=='ERROR'&&res) {
                                                            unsaved.current = {}
                                                            showSnackBar('Успешно', 'success')
                                                            Router.push(`/task/${res}`)
                                                        }
                                                        else
                                                            showSnackBar('Ошибка', 'error')
                                                    }
                                                    else {
                                                        let element = {_id: router.query.id}
                                                        if (info!==data.object.info) element.info = info
                                                        if (date!==data.object.date) element.date = date
                                                        res = await setTask(element)
                                                        if(res&&res!=='ERROR') {
                                                            showSnackBar('Успешно', 'success')
                                                            Router.reload()
                                                        }
                                                        else
                                                            showSnackBar('Ошибка', 'error')
                                                    }
                                                }
                                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                                showMiniDialog(true)
                                            } else
                                                showSnackBar('Заполните все поля')
                                        }}>
                                            Сохранить
                                        </Button>
                                        {
                                            router.query.id!=='new'?
                                                <Button color='secondary' onClick={()=>{
                                                    const action = async() => {
                                                        let res = await deleteTask(router.query.id)
                                                        if(res==='OK') {
                                                            showSnackBar('Успешно', 'success')
                                                            Router.push(`/tasks`)
                                                        }
                                                        else if(res==='USED')
                                                            showSnackBar('Объект используется')
                                                        else
                                                            showSnackBar('Ошибка', 'error')
                                                    }
                                                    setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                                    showMiniDialog(true)
                                                }}>
                                                    Удалить
                                                </Button>
                                                :
                                                null
                                        }
                                        </>
                                        :
                                        null
                                }
                            </div>
                            </>
                            :
                            'Ничего не найдено'
                    }
                </CardContent>
            </Card>
        </App>
    )
})

Task.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    let object = ctx.query.id!=='new'?
        await getTask({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
        :
        {
            whom: null,
            date: new Date(),
            info: ''
        }
    return {
        data: {
            edit: object.status==='обработка'&&(['admin'].includes(store.getState().user.profile.role)||object.who&&object.who._id===store.getState().user.profile._id),
            object
        }
    };
})

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Task);