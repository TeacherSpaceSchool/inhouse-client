import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import {getUser, setUser, addUser, deleteUser, restoreUser, onoffUser, checkLogin} from '../../src/gql/user'
import {getLegalObjects} from '../../src/gql/legalObject'
import userStyle from '../../src/styleMUI/list'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import Remove from '@mui/icons-material/Remove';
import { useRouter } from 'next/router'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Router from 'next/router'
import * as appActions from '../../src/redux/actions/app'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import TextField from '@mui/material/TextField';
import randomstring from 'randomstring';
import Confirmation from '../../components/dialog/Confirmation'
import { urlMain } from '../../src/const'
import { getClientGqlSsr } from '../../src/apollo'
import { pdDDMMYYHHMM, validPhone1, validPhones1, validMail, validMails, inputPhone} from '../../src/lib'
import AutocomplectOnline from '../../components/app/AutocomplectOnline'
import {getBranchs} from '../../src/gql/branch';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Menu from '@mui/material/Menu';
import Link from 'next/link';
import Switch from '@mui/material/Switch';
import History from '../../components/dialog/History';
import HistoryIcon from '@mui/icons-material/History';
import { wrapper } from '../../src/redux/configureStore'

const User = React.memo((props) => {
    const { profile } = props.user;
    const {classes} = userStyle();
    const { data } = props;
    const { isMobileApp } = props.app;
    const { showSnackBar } = props.snackbarActions;
    const { setCashier } = props.appActions;
    const router = useRouter()
    let [name, setName] = useState(data.object?data.object.name:'');
    let [statistic, setStatistic] = useState(data.object?data.object.statistic:false);
    let [add, setAdd] = useState(data.object?data.object.add:router.query.id==='new');
    let [credit, setCredit] = useState(data.object?data.object.credit:router.query.id==='new');
    const checkLoginTimeout = useRef(false);
    let [payment, setPayment] = useState(data.object?data.object.payment:false);
    let [login, setLogin] = useState(data.object?data.object.login:'');
    let [password, setPassword] = useState(data.object&&data.object.password?data.object.password:'');
    let [email, setEmail] = useState(data.object&&data.object.email?data.object.email:[]);
    let addEmail = ()=>{
        email = [...email, '']
        setEmail(email)
    };
    let editEmail = (event, idx)=>{
        email[idx] = event.target.value
        setEmail([...email])
    };
    let deleteEmail = (idx)=>{
        email.splice(idx, 1);
        setEmail([...email])
    };
    let [phone, setPhone] = useState(data.object&&data.object.phone?data.object.phone:[]);
    let addPhone = ()=>{
        phone = [...phone, '']
        setPhone(phone)
    };
    let editPhone = (event, idx)=>{
        phone[idx] = inputPhone(event.target.value)
        setPhone([...phone])
    };
    let deletePhone = (idx)=>{
        phone.splice(idx, 1);
        setPhone([...phone])
    };
    let [role, setRole] = useState(data.object?data.object.role:'');
    let [roles, setRoles] = useState([]);
    let handleRole = (event) => {
        setRole(event.target.value)
        if(!payment&&['admin', 'superadmin', 'оператор', 'управляющий'].includes(event.target.value))
            setPayment(true)
        if(!['superadmin', 'admin', 'оператор', 'управляющий'].includes(role)&&statistic)
            setStatistic(false)
    };
    let [legalObject, setLegalObject] = useState(data.object?data.object.legalObject:undefined);
    let [branch, setBranch] = useState(data.object?data.object.branch:undefined);
    let [status, setStatus] = useState(data.object?data.object.status:'active');
    let [errorLogin, setErrorLogin] = useState(false);
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    useEffect(()=>{
        if(router.query.id==='new') {
            if (legalObject) {
                roles = ['кассир', 'супервайзер']
                if(['admin', 'superadmin', 'оператор'].includes(profile.role)) roles.push('управляющий')
                setRoles(roles)
            }
            else if(['admin', 'superadmin'].includes(profile.role)) {
                roles = ['оператор', 'инспектор', 'агент']
                if('superadmin'===profile.role) roles.push('admin')
                setRoles(roles)
            }
            else
                setRoles([])
            setRole('')
            setBranch(undefined)
        }
    },[legalObject])
    let [hide, setHide] = useState('password');
    let handleHide =  () => {
        setHide(!hide)
    };
    const [anchorElQuick, setAnchorElQuick] = useState(null);
    const openQuick = Boolean(anchorElQuick);
    let handleMenuQuick = (event) => {
        setAnchorElQuick(event.currentTarget);
    }
    let handleCloseQuick = () => {
        setAnchorElQuick(null);
    }
    return (
        <App pageName={data.object!==null?router.query.id==='new'?'Добавить':data.object.name:'Ничего не найдено'}>
            <Head>
                <title>{data.object!==null?router.query.id==='new'?'Добавить':data.object.name:'Ничего не найдено'}</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content={data.object!==null?router.query.id==='new'?'Добавить':data.object.name:'Ничего не найдено'} />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/user/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/user/${router.query.id}`}/>
            </Head>
            <Card className={classes.page}>
                <div className={classes.status}>
                    {
                        router.query.id!=='new'&&role==='кассир'&&!['кассир', 'оператор'].includes(profile.role)?
                            <>
                            <Menu
                                key='Quick'
                                id='menu-appbar'
                                anchorEl={anchorElQuick}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                open={openQuick}
                                onClose={handleCloseQuick}
                            >
                                <Link href='/workshifts/[id]' as={`/workshifts/${legalObject._id}`}>
                                    <MenuItem onClick={()=>{setCashier({_id: router.query.id, name})}}>
                                        Смены
                                    </MenuItem>
                                </Link>
                            </Menu>
                            <Button onClick={handleMenuQuick} color='primary'>
                                Переходы
                            </Button>
                            </>
                            :
                            null
                    }
                    {
                        ['admin', 'superadmin'].includes(profile.role)&&profile.statistic&&data.object&&data.object._id?
                            <HistoryIcon onClick={async()=>{
                                setMiniDialog('История', <History where={data.object._id}/>)
                                showMiniDialog(true)
                            }} style={{ color: '#10183D', cursor: 'pointer' }}/>
                            :
                            null
                    }</div>
                <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignItems: 'flex-start'}}>
                    <br/>
                    {
                        data.object!==null?
                            ['admin', 'superadmin', 'управляющий', 'супервайзер', 'оператор'].includes(profile.role)||profile._id===router.query.id?
                                <>
                                {['admin', 'superadmin', 'оператор', 'управляющий'].includes(profile.role)?
                                    <>
                                    {
                                        router.query.id!=='new'&&!['управляющий', 'оператор'].includes(profile.role)?
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
                                            {
                                                data.object.enteredDate?
                                                    <div className={classes.row}>
                                                        <div className={classes.nameField}>
                                                            Вход:&nbsp;
                                                        </div>
                                                        <div className={classes.value} style={{color: ((new Date()-data.object.enteredDate)/1000/60/60)<24?'green':'red'}}>
                                                            {((new Date()-data.object.enteredDate)/1000/60/60)<24?'Выполнен':'Просрочен'}
                                                        </div>
                                                    </div>
                                                    :
                                                    null
                                            }
                                            </>
                                            :
                                            null
                                    }
                                    {
                                        'управляющий'!==profile.role?
                                            router.query.id==='new'?
                                                <AutocomplectOnline
                                                    setElement={setLegalObject}
                                                    getElements={async (search)=>{return await getLegalObjects({search})}}
                                                    label={'налогоплательщика'}
                                                />
                                                :
                                                data.object.legalObject?
                                                    <Link href='/legalobject/[id]' as={`/legalobject/${legalObject._id}`}>
                                                        <a>
                                                            <div className={classes.row}>
                                                                <div className={classes.nameField}>
                                                                    Налогоплательщик:&nbsp;
                                                                </div>
                                                                <div className={classes.value}>
                                                                    {data.object.legalObject.name}
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </Link>
                                                    :
                                                    null
                                            :
                                            null
                                    }
                                    {
                                            'superadmin'===profile.role
                                        ||
                                            (
                                                'admin'===profile.role
                                                ||
                                                'управляющий'===profile.role&&'управляющий'!==role
                                                ||
                                                'оператор'===profile.role&&'оператор'!==role
                                            )&&!['superadmin', 'admin'].includes(role)&&profile.add?
                                            <>
                                            {
                                                ['superadmin', 'admin', 'оператор', 'управляющий'].includes(role)?
                                                    <div className={classes.row}>
                                                        <div className={classes.nameField}>
                                                            Статистика:&nbsp;
                                                        </div>
                                                        <Switch
                                                            checked={statistic}
                                                            onChange={()=>setStatistic(!statistic)}
                                                            color='primary'
                                                        />
                                                    </div>
                                                    :
                                                    null
                                            }
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>
                                                    Добавлять/Изменять:&nbsp;
                                                </div>
                                                <Switch
                                                    checked={add}
                                                    onChange={()=>setAdd(!add)}
                                                    color='primary'
                                                />
                                            </div>
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>
                                                    Оплачивать:&nbsp;
                                                </div>
                                                <Switch
                                                    checked={payment}
                                                    onChange={()=>setPayment(!payment)}
                                                    color='primary'
                                                />
                                            </div>
                                            </>
                                            :
                                            null
                                    }
                                    </>
                                    :
                                    null
                                }
                                {
                                    role==='кассир'&&legalObject?
                                        ['admin', 'superadmin', 'супервайзер', 'управляющий', 'оператор'].includes(profile.role)&&profile.add?
                                            <>
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>
                                                    Кредит:&nbsp;
                                                </div>
                                                <Switch
                                                    checked={credit}
                                                    onChange={()=>setCredit(!credit)}
                                                    color='primary'
                                                />
                                            </div>
                                            <AutocomplectOnline
                                                defaultValue={data.object.branch}
                                                setElement={setBranch}
                                                getElements={async (search)=>{return await getBranchs({search, legalObject: legalObject._id})}}
                                                label={'объект'}
                                                minLength={0}
                                            />
                                            </>
                                            :
                                            branch?
                                                <Link href='/branch/[id]' as={`/branch/${branch._id}`}>
                                                    <a>
                                                        <div className={classes.row}>
                                                            <div className={classes.nameField}>
                                                                Oбъект:&nbsp;
                                                            </div>
                                                            <div className={classes.value}>
                                                                {data.object.branch.name}
                                                            </div>
                                                        </div>
                                                    </a>
                                                </Link>
                                                :
                                                null
                                        :
                                        null
                                }
                                {
                                    router.query.id==='new'?
                                        <FormControl className={classes.input}>
                                            <InputLabel error={!role}>Роль</InputLabel>
                                            <Select variant='standard' value={role} error={!role} onChange={handleRole}>
                                                {roles.map((element)=>
                                                    <MenuItem key={element} value={element}>{element}</MenuItem>
                                                )}
                                            </Select>
                                        </FormControl>
                                        :
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                Роль:&nbsp;
                                            </div>
                                            <div className={classes.value}>
                                                {role}
                                            </div>
                                        </div>
                                }
                                {
                                    ['admin', 'superadmin', 'оператор'].includes(profile.role)&&profile.add?
                                        <TextField variant='standard'
                                            error={!login||errorLogin&&['admin', 'superadmin', 'оператор'].includes(profile.role)}
                                            label='Логин'
                                            value={login}
                                            className={classes.input}
                                            onChange={(event)=>{
                                                login = event.target.value
                                                setLogin(event.target.value)

                                                if(checkLoginTimeout.current)
                                                    clearTimeout(checkLoginTimeout.current)
                                                if(login!==data.object.login&&login)
                                                    checkLoginTimeout.current = setTimeout(async()=>setErrorLogin(await checkLogin({login})!=='OK'), 1000)

                                            }}
                                        />
                                        :
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                Логин:&nbsp;
                                            </div>
                                            <div className={classes.value}>
                                                {login}
                                            </div>
                                        </div>
                                }
                                {
                                    ['admin', 'superadmin', 'оператор'].includes(profile.role)&&profile.add ?
                                        <>
                                        <Input
                                            error={router.query.id === 'new' && !password || password&&password.length<8}
                                            placeholder='Новый пароль'
                                            autoComplete='new-password'
                                            type='text'
                                            style={hide ? {textSecurity: 'disc', WebkitTextSecurity: 'disc'} : {}}
                                            value={password}
                                            className={classes.input}
                                            endAdornment={
                                                <InputAdornment position='end'>
                                                    <IconButton aria-label='Toggle password visibility'
                                                                onClick={handleHide}>
                                                        {hide ? <VisibilityOff/> : <Visibility/>}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                        <div className={classes.geo} onClick={()=>{
                                            setPassword(randomstring.generate(10))
                                        }}>
                                            Генерация нового пароля
                                        </div>
                                        </>
                                        :
                                        null
                                }
                                {
                                    profile.add&&profile.role!=='кассир'?
                                        <TextField variant='standard'
                                            error={!name}
                                            label='Имя'
                                            value={name}
                                            className={classes.input}
                                            onChange={(event) => {
                                                setName(event.target.value)
                                            }}
                                        />
                                        :
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                Имя:&nbsp;
                                            </div>
                                            <div className={classes.value}>
                                                {name}
                                            </div>
                                        </div>
                                }
                                {
                                    profile.add&&profile.role!=='кассир'?
                                        <>
                                        {phone?phone.map((element, idx)=>
                                            <FormControl key={`phone${idx}`} className={classes.input}>
                                                <InputLabel error={!validPhone1(element)}>Телефон</InputLabel>
                                                <Input
                                                    error={!validPhone1(element)}
                                                    placeholder='Телефон'
                                                    value={element}
                                                    className={classes.input}
                                                    onChange={(event)=>{editPhone(event, idx)}}
                                                    endAdornment={
                                                        <InputAdornment position='end'>
                                                            <IconButton
                                                                onClick={()=>{
                                                                    deletePhone(idx)
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
                                            addPhone()
                                        }} color='primary'>
                                            Добавить телефон
                                        </Button>
                                        </>
                                        :
                                        phone.length?
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>
                                                    Телефон:&nbsp;
                                                </div>
                                                <div>
                                                    {phone.map((phone, idx)=><div key={`phone${idx}`} className={classes.value}>{phone}</div>)}
                                                </div>
                                            </div>
                                            :
                                            null
                                }
                                {
                                    profile.add&&profile.role!=='кассир'?
                                        <>
                                        {email?email.map((element, idx)=>
                                            <FormControl key={`email${idx}`} className={classes.input}>
                                                <InputLabel error={!validMail(element)}>Email</InputLabel>
                                                <Input
                                                    error={!validMail(element)}
                                                    placeholder='Email'
                                                    value={element}
                                                    className={classes.input}
                                                    onChange={(event)=>{editEmail(event, idx)}}
                                                    endAdornment={
                                                        <InputAdornment position='end'>
                                                            <IconButton
                                                                onClick={()=>{
                                                                    deleteEmail(idx)
                                                                }}
                                                                aria-label='toggle password visibility'
                                                            >
                                                                <Remove/>
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                />
                                            </FormControl>
                                        ): null}
                                        <Button onClick={async()=>{
                                            addEmail()
                                        }} color='primary'>
                                            Добавить email
                                        </Button>
                                        </>
                                        :
                                        email.length?
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>
                                                    Email:&nbsp;
                                                </div>
                                                <div>
                                                    {email.map((email, idx)=><div key={`email${idx}`} className={classes.value}>{email}</div>)}
                                                </div>
                                            </div>
                                            :
                                            null
                                }
                                {
                                    profile.add&&profile.role!=='кассир'?
                                        !data.object.del?
                                            <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD}>
                                                <Button color='primary' onClick={()=>{
                                                    let checkMail = !email.length||validMails(email)
                                                    let checkPhone = !phone.length||validPhones1(phone)
                                                    if(!errorLogin&&checkMail&&checkPhone&&name.length&&login.length&&(password.length>7||router.query.id!=='new')&&role.length) {
                                                        const action = async() => {
                                                            if(router.query.id==='new') {
                                                                let res = await addUser({
                                                                    login, password, statistic, add, credit, payment, role, name, phone, email, legalObject: legalObject?legalObject._id:undefined, branch: branch?branch._id:undefined
                                                                })
                                                                Router.push(`/user/${res}`)
                                                                showSnackBar('Успешно', 'success')
                                                            }
                                                            else {
                                                                let element = {_id: router.query.id, branch: branch?branch._id:undefined}
                                                                if (JSON.stringify(phone)!==JSON.stringify(data.object.phone)) element.phone = phone
                                                                if (name!==data.object.name) element.name = name
                                                                if (login!==data.object.login) element.login = login
                                                                if (statistic!==data.object.statistic) element.statistic = statistic
                                                                if (add!==data.object.add) element.add = add
                                                                if (credit!==data.object.credit) element.credit = credit
                                                                if (payment!==data.object.payment) element.payment = payment
                                                                if (password.length>7) element.password = password
                                                                if (JSON.stringify(email)!==JSON.stringify(data.object.email)) element.email = email
                                                                await setUser(element)
                                                                Router.reload()
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
                                                    router.query.id!=='new'&&('superadmin'===profile.role||'admin'===profile.role&&role!=='admin'||'управляющий'===profile.role&&role!=='управляющий')?
                                                        <Button color={status==='active'?'primary':'secondary'} onClick={()=>{
                                                            const action = async() => {
                                                                await onoffUser(router.query.id)
                                                                setStatus(status==='active'?'deactive':'active')
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
                                                    router.query.id!=='new'&&('superadmin'===profile.role||'admin'===profile.role&&role!=='admin')?
                                                        <Button color='secondary' onClick={()=>{
                                                            const action = async() => {
                                                                await deleteUser(router.query.id)
                                                                Router.push(`/users/${legalObject?legalObject._id:'super'}`)
                                                            }
                                                            setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                                            showMiniDialog(true)
                                                        }}>
                                                            Удалить
                                                        </Button>
                                                        :
                                                        null
                                                }
                                            </div>
                                            :
                                            <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD}>
                                                <Button color='primary' onClick={()=>{
                                                    const action = async() => {
                                                        await restoreUser(router.query.id)
                                                        Router.push(`/users/${legalObject?legalObject._id:'super'}`)
                                                    }
                                                    setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                                    showMiniDialog(true)
                                                }}>
                                                    Восстановить
                                                </Button>
                                            </div>
                                        :
                                        null
                                }
                                </>
                                :
                                'Ничего не найдено'
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
    if(!['admin', 'superadmin', 'управляющий', 'кассир', 'супервайзер', 'оператор'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    return {
        data: {
            object:ctx.query.id!=='new'?await getUser({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined):
                {login: '', password: randomstring.generate(10), role: '', name: '', phone: [],
                    statistic: false, add: false, credit: false, payment: false,
                    legalObject: store.getState().user.profile.legalObject?{_id: store.getState().user.profile.legalObject}:undefined, branch: undefined}
        }
    };
});

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
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(User);