import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React, { useState } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import {getClient, setClient, addClient, deleteClient} from '../../src/gql/client'
import clientStyle from '../../src/styleMUI/list'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useRouter } from 'next/router'
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Router from 'next/router'
import * as appActions from '../../src/redux/actions/app'
import { bindActionCreators } from 'redux'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import TextField from '@mui/material/TextField';
import Confirmation from '../../components/dialog/Confirmation'
import { urlMain } from '../../src/const'
import { getClientGqlSsr } from '../../src/apollo'
import { pdDDMMYYHHMM, validPhone1, validMail, inputPhone } from '../../src/lib'
import Remove from '@mui/icons-material/Remove';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import AutocomplectOnline from '../../components/app/AutocomplectOnline'
import {getLegalObjects} from '../../src/gql/legalObject'
import { wrapper } from '../../src/redux/configureStore'

const Client = React.memo((props) => {
    const { profile } = props.user;
    const {classes} = clientStyle();
    const { data } = props;
    const { isMobileApp } = props.app;
    const { showSnackBar } = props.snackbarActions;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    let [name, setName] = useState(data.object?data.object.name:'');
    let [legalObject, setLegalObject] = useState(data.object?data.object.legalObject:undefined);
    let [info, setInfo] = useState(data.object?data.object.info:'');
    let [inn, setInn] = useState(data.object?data.object.inn:'');
    let [address, setAddress] = useState(data.object?data.object.address:'');
    let [phone, setPhone] = useState(data.object?data.object.phone:[]);
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
    let [email, setEmail] = useState(data.object?data.object.email:[]);
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
    const router = useRouter()
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
                <meta property='og:url' content={`${urlMain}/client/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/client/${router.query.id}`}/>
            </Head>
            <Card className={classes.page}>
                {
                    router.query.id!=='new'?
                        <div className={classes.status}>
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
                                <Link href='/sales/[id]' as={`/sales/${data.object.legalObject._id}`}>
                                    <MenuItem onClick={()=>{props.appActions.setClient({_id: router.query.id, name})}}>
                                        Операции
                                    </MenuItem>
                                </Link>
                            </Menu>
                            <Button onClick={handleMenuQuick} color='primary'>
                                Переходы
                            </Button>
                        </div>
                        :
                        null
                }
                <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignItems: 'flex-start'}}>
                    <br/>
                    {
                        data.object!==null?
                            !profile.add?
                                <>
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Регистрация:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {pdDDMMYYHHMM(data.object.createdAt)}
                                    </div>
                                </div>
                                {
                                    ['admin', 'superadmin'].includes(profile.role)?
                                        <Link href='/legalobject/[id]' as={`/legalobject/${data.object.legalObject._id}`}>
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
                                }
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Имя:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {name}
                                    </div>
                                </div>
                                {
                                    inn.length?
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                ИНН:&nbsp;
                                            </div>
                                            <div className={classes.value}>
                                                {inn}
                                            </div>
                                        </div>
                                        :
                                        null
                                }
                                {
                                    address.length?
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                Адрес:&nbsp;
                                            </div>
                                            <div className={classes.value}>
                                                {address}
                                            </div>
                                        </div>
                                        :
                                        null
                                }
                                {
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
                                    email.length?
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                Email:&nbsp;
                                            </div>
                                            <div>
                                                {email.map((email, idx)=>
                                                    idx<4?
                                                        <div key={`email${idx}`} className={classes.value}>
                                                            {email}
                                                        </div>
                                                        :
                                                        idx===4?
                                                            '...'
                                                            :
                                                            null
                                                )}
                                            </div>
                                        </div>
                                        :
                                        null
                                }
                                {
                                    info.length?
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                Информация:&nbsp;
                                            </div>
                                            <div className={classes.value}>
                                                {info}
                                            </div>
                                        </div>
                                        :
                                        null
                                }
                                <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD}>
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
                                        <Link href='/sales/[id]' as={`/sales/${data.object.legalObject._id}`}>
                                            <MenuItem onClick={()=>{props.appActions.setClient({_id: router.query.id, name})}}>
                                                Операции
                                            </MenuItem>
                                        </Link>
                                    </Menu>
                                    <Button onClick={handleMenuQuick} color='primary'>
                                        Переходы
                                    </Button>
                                </div>
                                </>
                                :
                                <>
                                {
                                    router.query.id!=='new'?
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                Регистрация:&nbsp;
                                            </div>
                                            <div className={classes.value}>
                                                {pdDDMMYYHHMM(data.object.createdAt)}
                                            </div>
                                        </div>
                                        :
                                        null
                                }
                                {
                                    ['admin', 'superadmin'].includes(profile.role)?router.query.id==='new'?
                                        <AutocomplectOnline
                                            error={!legalObject||!legalObject._id}
                                            setElement={setLegalObject}
                                            getElements={async (search)=>{return await getLegalObjects({search})}}
                                            label={'налогоплательщика'}
                                        />
                                        :
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
                                }
                                <TextField variant='standard'
                                    className={classes.input}
                                    label='Имя'
                                    margin='normal'
                                    value={name}
                                    onChange={(event)=>{setName(event.target.value)}}
                                />
                                <TextField variant='standard'
                                    className={classes.input}
                                    label='ИНН'
                                    margin='normal'
                                    value={inn}
                                    onChange={(event)=>{setInn(event.target.value)}}
                                />
                                <TextField variant='standard'
                                    label='Адрес'
                                    className={classes.input}
                                    margin='normal'
                                    value={address}
                                    onChange={(event)=>{setAddress(event.target.value)}}
                                />
                                {phone?phone.map((element, idx)=>
                                    <FormControl key={`phone${idx}`} className={classes.input}>
                                        <InputLabel error={!validPhone1(element)}>Телефон. Формат: +996556899871</InputLabel>
                                        <Input
                                            startAdornment={<InputAdornment position='start'>+996</InputAdornment>}
                                            error={!validPhone1(element)}
                                            placeholder='Телефон. Формат: +996556899871'
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
                                        />
                                    </FormControl>
                                ): null}
                                <Button onClick={async()=>{
                                    addPhone()
                                }} color='primary'>
                                    Добавить телефон
                                </Button>
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
                                <TextField variant='standard'
                                    multiline={true}
                                    label='Информация'
                                    value={info}
                                    className={classes.input}
                                    onChange={(event)=>{setInfo(event.target.value)}}
                                />
                                <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD}>
                                    <Button color='primary' onClick={()=>{
                                        if (name.length&&legalObject) {
                                            const action = async() => {
                                                if(router.query.id==='new') {
                                                    let res = await addClient({legalObject: legalObject._id, phone, name, inn, email, address, info})
                                                    Router.push(`/client/${res._id}`)
                                                    showSnackBar('Успешно', 'success')
                                                }
                                                else {
                                                    let element = {_id: router.query.id, }
                                                    if (name!==data.object.name) element.name = name
                                                    if (inn!==data.object.inn) element.inn = inn
                                                    if (address!==data.object.address) element.address = address
                                                    if (info!==data.object.info) element.info = info
                                                    if (JSON.stringify(phone)!==JSON.stringify(data.object.phone)) element.phone = phone
                                                    if (JSON.stringify(email)!==JSON.stringify(data.object.email)) element.email = email
                                                    await setClient(element)
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
                                        router.query.id!=='new'?
                                            <Button color='secondary' onClick={()=>{
                                                const action = async() => {
                                                    await deleteClient(router.query.id)
                                                    Router.push(`/clients/${data.object.legalObject._id}`)
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
                                </>
                            :
                            'Ничего не найдено'
                    }
                </CardContent>
            </Card>
        </App>
    )
})

Client.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', 'superadmin', 'управляющий', 'кассир', 'супервайзер'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    return {
        data: {
            object: ctx.query.id!=='new'?await getClient({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined):{
                legalObject: store.getState().user.profile.legalObject?{_id: store.getState().user.profile.legalObject}:null,
                name: '',
                phone: [],
                address: '',
                email: [],
                info: '',
                inn: ''
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
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Client);