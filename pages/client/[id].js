import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React, { useState, useRef, useEffect } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import { getClient, setClient, addClient, deleteClient } from '../../src/gql/client'
import pageListStyle from '../../src/styleMUI/list'
import { pdDDMMYYYY } from '../../src/lib'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Remove from '@mui/icons-material/Remove';
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
import { validPhones1, validPhone1, validMail, validMails, cloneObject, inputPhone, pdDatePicker } from '../../src/lib'
import History from '../../components/dialog/History';
import HistoryIcon from '@mui/icons-material/History';
import { wrapper } from '../../src/redux/configureStore'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Link from 'next/link';
import dynamic from 'next/dynamic'
const Geo = dynamic(import('../../components/dialog/Geo'), { ssr: false });

const levels = ['Бронза', 'Серебро', 'Золото', 'Платина']

const Client = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const { isMobileApp } = props.app;
    const { showSnackBar } = props.snackbarActions;
    const unsaved = useRef();
    let [name, setName] = useState(data.object?data.object.name:'');
    let [work, setWork] = useState(data.object?data.object.work:'');
    let [geo, setGeo] = useState(data.object?cloneObject(data.object.geo):null);
    let [passport, setPassport] = useState(data.object?data.object.passport:'');
    let [inn, setInn] = useState(data.object?data.object.inn:'');
    let [level, setLevel] = useState(data.object?data.object.level:'');
    let handleLevel = (event) => {
        setLevel(event.target.value)
    };
    let [birthday, setBirthday] = useState(data.object&&data.object.birthday?pdDatePicker(data.object.birthday):'');
    let [info, setInfo] = useState(data.object?data.object.info:'');
    let [address, setAddress] = useState(data.object?data.object.address:'');
    let [address1, setAddress1] = useState(data.object?data.object.address1:'');
    let [emails, setEmails] = useState(data.object&&data.object.emails?cloneObject(data.object.emails):[]);
    let addEmails = ()=>{
        emails = [...emails, '']
        setEmails(emails)
    };
    let editEmails = (event, idx)=>{
        emails[idx] = event.target.value
        setEmails([...emails])
    };
    let deleteEmails = (idx)=>{
        emails.splice(idx, 1);
        setEmails([...emails])
    };
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
    const { setMiniDialog, showMiniDialog, setFullDialog, showFullDialog } = props.mini_dialogActions;
    const router = useRouter()
    useEffect(()=>{
        if(!unsaved.current)
            unsaved.current = {}
        else
            unsaved.current[router.query.id] = true
    },[name, work, geo, passport, inn, level, birthday, info, address, address1, emails, phones])

    return (
        <App unsaved={unsaved} pageName={data.object!==null?router.query.id==='new'?'Добавить':data.object.name:'Ничего не найдено'}>
            <Head>
                <title>{data.object!==null?router.query.id==='new'?'Добавить':data.object.name:'Ничего не найдено'}</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content={data.object!==null?router.query.id==='new'?'Добавить':data.object.name:'Ничего не найдено'} />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website'/>
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/client/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/client/${router.query.id}`}/>
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
                                data.edit||data.add?
                                    <>
                                    <FormControl className={classes.input}>
                                        <InputLabel error={!level}>Уровень</InputLabel>
                                        <Select variant='standard' value={level} onChange={handleLevel} error={!level}>
                                            {levels.map((element)=>
                                                <MenuItem key={element} value={element}>{element}</MenuItem>
                                            )}
                                        </Select>
                                    </FormControl>
                                    <TextField variant='standard'
                                               id='name'
                                               error={!name}
                                               label='ФИО'
                                               value={name}
                                               onChange={(event) => setName(event.target.value)}
                                               className={classes.input}
                                    />
                                    <TextField variant='standard'
                                               id='inn'
                                               error={!inn}
                                               label='ИНН'
                                               value={inn}
                                               onChange={(event) => setInn(event.target.value)}
                                               className={classes.input}
                                    />
                                    <TextField variant='standard'
                                               id='passport'
                                               error={!passport}
                                               label='Паспорт'
                                               value={passport}
                                               onChange={(event) => setPassport(event.target.value)}
                                               className={classes.input}
                                    />
                                    <TextField variant='standard'
                                               id='work'
                                               error={!work}
                                               label='Работа'
                                               value={work}
                                               onChange={(event) => setWork(event.target.value)}
                                               className={classes.input}
                                    />
                                    <TextField variant='standard'
                                               id='address'
                                               error={!address}
                                               label='Адрес проживания'
                                               onChange={(event) => setAddress(event.target.value)}
                                               value={address}
                                               className={classes.input}
                                    />
                                    <div className={classes.geo} style={{color: geo?'#183B37':'red'}} onClick={()=>{
                                        setFullDialog('Геолокация', <Geo geo={geo} setAddressGeo={setGeo}/>)
                                        showFullDialog(true)
                                    }}>
                                        {
                                            geo?
                                                'Изменить геолокацию'
                                                :
                                                'Задайте геолокацию'
                                        }
                                    </div>
                                    <TextField variant='standard'
                                               id='address'
                                               error={!address1}
                                               label='Адрес прописки'
                                               onChange={(event) => setAddress1(event.target.value)}
                                               value={address1}
                                               className={classes.input}
                                    />
                                    <TextField variant='standard'
                                               id='date'
                                               type='date'
                                               error={!birthday}
                                               label='День рождения'
                                               onChange={(event) => setBirthday(event.target.value)}
                                               value={birthday}
                                               className={classes.input}
                                    />
                                    <br/>
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
                                    }} size='small'  color={phones.length?'primary':'secondary'}>
                                        Добавить телефон
                                    </Button>
                                    <br/>
                                    {emails?emails.map((element, idx)=>
                                        <FormControl key={`emails${idx}`} className={classes.input}>
                                            <InputLabel error={!validMail(element)}>Emails</InputLabel>
                                            <Input
                                                error={!validMail(element)}
                                                placeholder='Emails'
                                                value={element}
                                                className={classes.input}
                                                onChange={(event)=>{editEmails(event, idx)}}
                                                endAdornment={
                                                    <InputAdornment position='end'>
                                                        <IconButton
                                                            onClick={()=>{
                                                                deleteEmails(idx)
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
                                    <Button size='small' onClick={async()=>{
                                        addEmails()
                                    }} color='primary'>
                                        Добавить email
                                    </Button>
                                    <TextField
                                        id='info'
                                        variant='standard'
                                        onChange={(event) => setInfo(event.target.value)}
                                        label='Комментарий'
                                        multiline={true}
                                        maxRows='5'
                                        value={info}
                                        className={classes.input}
                                    />
                                    </>
                                    :
                                    <>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Уровень:&nbsp;
                                        </div>
                                        <div className={classes.value}>
                                            {level}
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
                                            ИНН:&nbsp;
                                        </div>
                                        <div className={classes.value}>
                                            {inn}
                                        </div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Паспорт:&nbsp;
                                        </div>
                                        <div className={classes.value}>
                                            {passport}
                                        </div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Работа:&nbsp;
                                        </div>
                                        <div className={classes.value}>
                                            {work}
                                        </div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            День рождения:&nbsp;
                                        </div>
                                        <div className={classes.value}>
                                            {pdDDMMYYYY(birthday)}
                                        </div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Адрес проживания:&nbsp;
                                        </div>
                                        <div className={classes.value}>
                                            {address}
                                        </div>
                                    </div>
                                    {
                                        geo?
                                            <div className={classes.geo} onClick={()=>{
                                                setFullDialog('Геолокация', <Geo geo={geo}/>)
                                                showFullDialog(true)
                                            }}>
                                                Посмотреть геолокацию
                                            </div>
                                            :
                                            null
                                    }
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Адрес прописки:&nbsp;
                                        </div>
                                        <div className={classes.value}>
                                            {address1}
                                        </div>
                                    </div>
                                    {
                                        phones.length?
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
                                    {
                                        emails.length?
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>
                                                    Emails:&nbsp;
                                                </div>
                                                <div>
                                                    {emails.map((element, idx)=><div className={classes.value} key={`Emails${idx}`}>{element}</div>)}
                                                </div>
                                            </div>
                                            :
                                            null
                                    }
                                    {
                                        info?
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>
                                                    Комментарий:&nbsp;
                                                </div>
                                                <div className={classes.value}>
                                                    {info}
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
                                        {
                                            router.query.id!=='new'?
                                                <Link
                                                    href={{
                                                        pathname: '/balanceclients',
                                                        query: {client: router.query.id}
                                                    }}
                                                    as={
                                                        `/balanceclients?client=${router.query.id}`
                                                    }>
                                                    <Button color='primary'>
                                                        Баланс
                                                    </Button>
                                                </Link>
                                                :
                                                null
                                        }
                                        <Button color='primary' onClick={()=>{
                                            let checkPhones = phones.length&&validPhones1(phones)
                                            let checkMail = !emails.length||validMails(emails)
                                            let res
                                            if (name&&checkPhones&&checkMail&&address&&work&&passport&&inn&&level&&birthday) {
                                                const action = async() => {
                                                    if(router.query.id==='new') {
                                                        res = await addClient({name, geo, emails, phones, address, address1, info, work, passport, inn, level, birthday})
                                                        if(res!=='ERROR'&&res) {
                                                            unsaved.current = {}
                                                            showSnackBar('Успешно', 'success')
                                                            Router.push(`/client/${res}`)
                                                        }
                                                        else
                                                            showSnackBar('Ошибка', 'error')
                                                    }
                                                    else {
                                                        let element = {_id: router.query.id}
                                                        if (name!==data.object.name) element.name = name
                                                        if (address!==data.object.address) element.address = address
                                                        if (address1!==data.object.address1) element.address1 = address1
                                                        if (info!==data.object.info) element.info = info
                                                        if (work!==data.object.work) element.work = work
                                                        if (passport!==data.object.passport) element.passport = passport
                                                        if (inn!==data.object.inn) element.inn = inn
                                                        if (level!==data.object.level) element.level = level
                                                        if (birthday!==pdDatePicker(data.object.birthday)) element.birthday = birthday
                                                        if (JSON.stringify(geo)!==JSON.stringify(data.object.geo)) element.geo = geo
                                                        if (JSON.stringify(phones)!==JSON.stringify(data.object.phones)) element.phones = phones
                                                        if (JSON.stringify(emails)!==JSON.stringify(data.object.emails)) element.emails = emails
                                                        res = await setClient(element)
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
                                            router.query.id!=='new'&&data.deleted?
                                                <Button color='secondary' onClick={()=>{
                                                    const action = async() => {
                                                        let res = await deleteClient(router.query.id)
                                                        if(res==='OK') {
                                                            showSnackBar('Успешно', 'success')
                                                            Router.push(`/clients`)
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

Client.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', 'менеджер', 'завсклад', 'кассир', 'доставщик', 'менеджер/завсклад', 'управляющий', 'юрист'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    return {
        data: {
            edit: store.getState().user.profile.edit&&['admin', 'менеджер', 'менеджер/завсклад', 'кассир'].includes(store.getState().user.profile.role),
            add: store.getState().user.profile.add&&['admin', 'менеджер', 'менеджер/завсклад', 'кассир'].includes(store.getState().user.profile.role),
            deleted: store.getState().user.profile.deleted&&['admin'].includes(store.getState().user.profile.role),
            object:ctx.query.id!=='new'?
                await getClient({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
                :
                {
                    name: '',
                    emails: [],
                    phones: [],
                    address: '',
                    address1: '',
                    info: '',
                    work: '',
                    passport: '',
                    inn: '',
                    level: '',
                    birthday: '',
                    geo: null
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

export default connect(mapStateToProps, mapDispatchToProps)(Client);