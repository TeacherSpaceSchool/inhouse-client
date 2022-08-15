import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React, { useState, useRef, useEffect } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import { getUser, setUser, addUser, deleteUser, checkLogin, getDepartments, getPositions } from '../../src/gql/user'
import { getStores } from '../../src/gql/store'
import pageListStyle from '../../src/styleMUI/list'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useRouter } from 'next/router'
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Router from 'next/router'
import * as userActions from '../../src/redux/actions/user'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import * as appActions from '../../src/redux/actions/app'
import TextField from '@mui/material/TextField';
import Confirmation from '../../components/dialog/Confirmation'
import { urlMain } from '../../src/const'
import { getClientGqlSsr } from '../../src/apollo'
import { validPhones1, validPhone1, cloneObject, inputPhone , pdDDMMYYHHMM, pdDDMMYYYY, pdDatePicker} from '../../src/lib'
import History from '../../components/dialog/History';
import HistoryIcon from '@mui/icons-material/History';
import { wrapper } from '../../src/redux/configureStore'
import AutocomplectOnline from '../../components/app/AutocomplectOnline'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Remove from '@mui/icons-material/Remove';
import Checkbox from '@mui/material/Checkbox';

const roles = ['менеджер', 'завсклад', 'кассир', 'доставщик', 'менеджер/завсклад', 'управляющий', 'юрист', 'сотрудник']

const User = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const { isMobileApp } = props.app;
    const { showSnackBar } = props.snackbarActions;
    const unsaved = useRef();
    let [add, setAdd] = useState(true);
    let [edit, setEdit] = useState(true);
    let [deleted, setdeleted] = useState(true);
    let [hide, setHide] = useState(true);
    let [login, setLogin] = useState(data.object?data.object.login:'');
    let [loginError, setLoginError] = useState(false);
    const checkLoginTimeout = useRef(false);
    let [password, setPassword] = useState('');
    let [name, setName] = useState(data.object?data.object.name:'');
    let [role, setRole] = useState(data.object?data.object.role:'');
    let handleRole = (event) => {
        setRole(event.target.value)
    };
    let [department, setDepartment] = useState(data.object?data.object.department:'');
    let [position, setPosition] = useState(data.object?data.object.position:'');
    let [startWork, setStartWork] = useState(data.object?pdDatePicker(data.object.startWork):pdDatePicker(new Date()));
    let [status, setStatus] = useState(data.object?data.object.status:'active');
    let [phones, setPhones] = useState(data.object&&data.object.phones?cloneObject(data.object.phones):[]);
    let addPhones = ()=>{
        phones = [...phones, '']
        setPhones(phones)
    };
    let editPhones = (event, idx)=>{
        phones[idx] = inputPhone(event.target.value)
        setPhones([...phones])
    };
    let deletePhones = (idx)=>{
        phones.splice(idx, 1);
        setPhones([...phones])
    };
    let [store, setStore] = useState(data.object?data.object.store:null);
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const router = useRouter()
    useEffect(()=>{
        if(!unsaved.current)
            unsaved.current = {}
        else
            unsaved.current[router.query.id] = true
    },[add, edit, deleted, name, role, department, position, startWork, phones, store])
    return (
        <App unsaved={unsaved} pageName={data.object!==null?router.query.id==='new'?'Добавить':data.object.name:'Ничего не найдено'}>
            <Head>
                <title>{data.object!==null?router.query.id==='new'?'Добавить':data.object.name:'Ничего не найдено'}</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content={data.object!==null?router.query.id==='new'?'Добавить':data.object.name:'Ничего не найдено'} />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website'/>
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/user/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/user/${router.query.id}`}/>
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
                <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignUsers: 'flex-start'}}>
                    {
                        data.object?
                            <>
                            {
                                data.edit||data.add?
                                    <>
                                    {
                                        router.query.id!=='new'?
                                            <>
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>
                                                    Регистрация:&nbsp;
                                                </div>
                                                <div className={classes.value}>
                                                    {pdDDMMYYHHMM(data.object.createdAt)}
                                                </div>
                                            </div>
                                            {data.object.updatedAt?
                                                <div className={classes.row}>
                                                    <div className={classes.nameField}>
                                                        Изменен:&nbsp;
                                                    </div>
                                                    <div className={classes.value}>
                                                        {pdDDMMYYHHMM(data.object.updatedAt)}
                                                    </div>
                                                </div>
                                                :
                                                null
                                            }
                                            {
                                                data.object.lastActive?
                                                    <div className={classes.row}>
                                                        <div className={classes.nameField}>
                                                            Активность:&nbsp;
                                                        </div>
                                                        <div className={classes.value}>
                                                            {pdDDMMYYHHMM(data.object.lastActive)}
                                                        </div>
                                                    </div>
                                                    :
                                                    null
                                            }
                                            {
                                                data.object.device?
                                                    <div className={classes.row}>
                                                        <div className={classes.nameField}>
                                                            Девайс:&nbsp;
                                                        </div>
                                                        <div className={classes.value}>
                                                            {data.object.device}
                                                        </div>
                                                    </div>
                                                    :
                                                    null
                                            }
                                            {
                                                data.object.IP?
                                                    <div className={classes.row}>
                                                        <div className={classes.nameField}>
                                                            IP:&nbsp;
                                                        </div>
                                                        <div className={classes.value}>
                                                            {data.object.IP}
                                                        </div>
                                                    </div>
                                                    :
                                                    null
                                            }
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>
                                                    Роль:&nbsp;
                                                </div>
                                                <div className={classes.value}>
                                                    {role}
                                                </div>
                                            </div>
                                            </>
                                            :
                                            null
                                    }
                                    <div className={isMobileApp?classes.column:classes.row}>
                                        <div className={classes.row} style={{alignItems: 'flex-end'}}>
                                            <div className={classes.nameField}>Добавлять:&nbsp;</div>
                                            <Checkbox
                                                checked={add}
                                                onChange={()=>{setAdd(!add)}}
                                                color='primary'
                                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                            />
                                        </div>
                                        <div className={classes.row} style={{alignItems: 'flex-end'}}>
                                            <div className={classes.nameField}>Изменять:&nbsp;</div>
                                            <Checkbox
                                                checked={edit}
                                                onChange={()=>{setEdit(!edit)}}
                                                color='primary'
                                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                            />
                                        </div>
                                        <div className={classes.row} style={{alignItems: 'flex-end'}}>
                                            <div className={classes.nameField}>Удалять:&nbsp;</div>
                                            <Checkbox
                                                checked={deleted}
                                                onChange={()=>{setdeleted(!deleted)}}
                                                color='primary'
                                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                            />
                                        </div>
                                    </div>
                                    <TextField
                                        id='login'
                                        variant='standard'
                                        error={!login.length||loginError}
                                        label='Логин'
                                        value={login}
                                        onChange={async (event) => {
                                            login = event.target.value
                                            setLogin(login)

                                            if(checkLoginTimeout.current)
                                                clearTimeout(checkLoginTimeout.current)
                                            if(login!==data.object.login&&login)
                                                checkLoginTimeout.current = setTimeout(async()=>setLoginError(await checkLogin({login})!=='OK'), 1000)

                                        }}
                                        className={classes.input}
                                    />
                                    <Input
                                        error={router.query.id === 'new' && !password || password&&password.length<8}
                                        placeholder='Новый пароль'
                                        type={hide?'password':'text'}
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        className={classes.input}
                                        endAdornment={
                                            <InputAdornment position='end'>
                                                <IconButton aria-label='Toggle password visibility'
                                                            onClick={()=>setHide(!hide)}>
                                                    {hide ? <VisibilityOff/> : <Visibility/>}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                    <TextField
                                        id='name'
                                        variant='standard'
                                        error={!name.length}
                                        label='ФИО'
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        className={classes.input}
                                    />
                                    {
                                        router.query.id==='new'?
                                            <FormControl className={classes.input}>
                                                <InputLabel error={!role}>Роль</InputLabel>
                                                <Select variant='standard' value={role} onChange={handleRole} error={!role}>
                                                    {roles.map((element)=>
                                                        <MenuItem key={element} value={element}>{element}</MenuItem>
                                                    )}
                                                </Select>
                                            </FormControl>
                                            :
                                            null
                                    }
                                    <AutocomplectOnline
                                        element={store}
                                        error={!store&&role!=='управляющий'}
                                        setElement={(store)=>{
                                            setStore(store)
                                        }}
                                        defaultValue={store}
                                        getElements={async (search)=>{
                                            return await getStores({search})
                                        }}
                                        minLength={0}
                                        label={'Магазин'}
                                    />
                                    <AutocomplectOnline
                                        element={department}
                                        error={!department}
                                        freeSolo
                                        setElement={(department)=>{
                                            if(department)
                                                setDepartment(department.name)
                                            else
                                                setDepartment('')
                                        }}
                                        defaultValue={{name: department}}
                                        getElements={async (search)=>{
                                            return await getDepartments({search})
                                        }}
                                        minLength={0}
                                        label={'Отдел'}
                                    />
                                    <AutocomplectOnline
                                        element={position}
                                        error={!position}
                                        freeSolo
                                        setElement={(position)=>{
                                            if(position)
                                                setPosition(position.name)
                                            else
                                                setPosition('')
                                        }}
                                        defaultValue={{name: position}}
                                        getElements={async (search)=>{
                                            return await getPositions({search})
                                        }}
                                        minLength={0}
                                        label={'Должность'}
                                    />
                                    <TextField
                                        id='startWork'
                                        error={!startWork}
                                        type='date'
                                        variant='standard'
                                        label='Начало работы'
                                        value={startWork}
                                        onChange={(event) => setStartWork(event.target.value)}
                                        className={classes.input}
                                    />
                                    {phones?phones.map((element, idx)=>
                                        <FormControl key={`phones${idx}`} className={classes.input}>
                                            <InputLabel error={!validPhone1(element)}>Телефон</InputLabel>
                                            <Input
                                                error={!validPhone1(element)}
                                                placeholder='Телефон'
                                                type={isMobileApp?'number':'text'}
                                                value={element}
                                                className={classes.input}
                                                onChange={(event)=>{editPhones(event, idx)}}
                                                endAdornment={
                                                    <InputAdornment position='end'>
                                                        <IconButton
                                                            onClick={()=>{
                                                                deletePhones(idx)
                                                            }}
                                                            aria-label='toggle password visibility'
                                                        >
                                                            <Remove/>
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                startAdornment={<InputAdornment position='start'>+996</InputAdornment>}
                                            />
                                        </FormControl>
                                    ): null}
                                    <Button onClick={async()=>{
                                        addPhones()
                                    }} size='small' color='primary'>
                                        Добавить телефон
                                    </Button>
                                    </>
                                    :
                                    <>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Логин:&nbsp;
                                        </div>
                                        <div className={classes.value}>
                                            {login}
                                        </div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            ФИО:&nbsp;
                                        </div>
                                        <div className={classes.value}>
                                            {name}
                                        </div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Роль:&nbsp;
                                        </div>
                                        <div className={classes.value}>
                                            {role}
                                        </div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Магазин:&nbsp;
                                        </div>
                                        <div className={classes.value}>
                                            {store.name}
                                        </div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Отдел:&nbsp;
                                        </div>
                                        <div className={classes.value}>
                                            {department}
                                        </div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Должность:&nbsp;
                                        </div>
                                        <div className={classes.value}>
                                            {position}
                                        </div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Начало работы:&nbsp;
                                        </div>
                                        <div className={classes.value}>
                                            {pdDDMMYYYY(startWork)}
                                        </div>
                                    </div>
                                    {phones.length?
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>
                                                    Телефон:&nbsp;
                                                </div>
                                                <div className={classes.value}>
                                                    {phones.map((element, idx)=><div className={classes.value} key={`Телефон${idx}`}>+996{element}</div>)}
                                                </div>
                                            </div>
                                        :
                                        null
                                    }
                                    </>
                            }
                            <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD}>
                                {
                                    data.edit||data.add?
                                        <>
                                        <Button color='primary' onClick={()=>{
                                            let res
                                            let checkPhones = !phones.length||validPhones1(phones)
                                            if (name&&name!=='admin'&&(store||role==='управляющий')&&checkPhones&&!loginError&&role&&(router.query.id!=='new'||password.length>7)&&department&&position&&startWork) {
                                                const action = async() => {
                                                    if(router.query.id==='new') {
                                                        res = await addUser({
                                                            add, edit, deleted, login, password, role, name, phones, store: store?store._id:null, department, position, startWork
                                                        })
                                                        if(res!=='ERROR'&&res) {
                                                            unsaved.current = {}
                                                            showSnackBar('Успешно', 'success')
                                                            Router.push(`/user/${res}`)
                                                        }
                                                        else
                                                            showSnackBar('Ошибка', 'error')
                                                    }
                                                    else {
                                                        let element = {_id: router.query.id, store: store?store._id:null}
                                                        if (add!==data.object.add) element.add = add
                                                        if (edit!==data.object.edit) element.edit = edit
                                                        if (deleted!==data.object.deleted) element.deleted = deleted
                                                        if (name!==data.object.name) element.name = name
                                                        if (department!==data.object.department) element.department = department
                                                        if (position!==data.object.position) element.position = position
                                                        if (startWork!==data.object.startWork) element.startWork = startWork
                                                        if (login!==data.object.login) element.login = login
                                                        if (password&&password.length>7) element.password = password
                                                        if (JSON.stringify(phones)!==JSON.stringify(data.object.phones)) element.phones = phones
                                                        res = await setUser(element)
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
                                                <>
                                                {
                                                    data.edit?
                                                        <Button color={status==='active'?'primary':'secondary'} onClick={()=>{
                                                            const action = async() => {
                                                                let res = await setUser({_id: router.query.id, status})
                                                                if(res==='OK') {
                                                                    showSnackBar('Успешно', 'success')
                                                                    status = status==='active'?'deactive':'active'
                                                                    setStatus(status)
                                                                }
                                                                else
                                                                    showSnackBar('Ошибка', 'error')
                                                            }
                                                            setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                                            showMiniDialog(true)
                                                        }}>
                                                            {status==='active'?'Отключить':'Включить'}
                                                        </Button>
                                                        :
                                                        null
                                                }
                                                {
                                                    data.deleted?
                                                        <Button color='secondary' onClick={()=>{
                                                            const action = async() => {
                                                                let res = await deleteUser(router.query.id)
                                                                if(res==='OK') {
                                                                    showSnackBar('Успешно', 'success')
                                                                    Router.push(`/users`)
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

User.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', 'управляющий'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    return {
        data: {
            edit: store.getState().user.profile.edit&&['admin'].includes(store.getState().user.profile.role),
            add: store.getState().user.profile.add&&['admin'].includes(store.getState().user.profile.role),
            deleted: store.getState().user.profile.deleted&&['admin'].includes(store.getState().user.profile.role),
            object:ctx.query.id!=='new'?
                await getUser({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
                :
                {
                    login: '',
                    name: '',
                    role: '',
                    status: 'active',
                    phones: [],
                    position: null,
                    department: null,
                    startWork: pdDatePicker(new Date()),
                    store: null
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(User);