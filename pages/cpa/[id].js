import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React, { useState, useRef, useEffect } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import { getCpa, setCpa, addCpa, deleteCpa } from '../../src/gql/cpa'
import pageListStyle from '../../src/styleMUI/list'
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
import { validPhones1, validPhone1, validMail, validMails, cloneObject, inputPhone, inputFloat, checkFloat } from '../../src/lib'
import History from '../../components/dialog/History';
import HistoryIcon from '@mui/icons-material/History';
import { wrapper } from '../../src/redux/configureStore'

const Cpa = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const { isMobileApp } = props.app;
    const { showSnackBar } = props.snackbarActions;
    const unsaved = useRef();
    let [name, setName] = useState(data.object?data.object.name:'');
    let [info, setInfo] = useState(data.object?data.object.info:'');
    let [percent, setPercent] = useState(data.object?data.object.percent:'');
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
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const router = useRouter()
    useEffect(()=>{
        if(!unsaved.current)
            unsaved.current = {}
        else
            unsaved.current[router.query.id] = true
    },[name,  info, percent, emails, phones])
    return (
        <App unsaved={unsaved} pageName={data.object!==null?router.query.id==='new'?'Добавить':data.object.name:'Ничего не найдено'}>
            <Head>
                <title>{data.object!==null?router.query.id==='new'?'Добавить':data.object.name:'Ничего не найдено'}</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content={data.object!==null?router.query.id==='new'?'Добавить':data.object.name:'Ничего не найдено'} />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website'/>
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/cpa/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/cpa/${router.query.id}`}/>
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
                                    <TextField variant='standard'
                                               error={!name.length}
                                               id='name'
                                               label='Название'
                                               value={name}
                                               onChange={(event) => setName(event.target.value)}
                                               className={classes.input}
                                    />
                                    <TextField variant='standard'
                                               id='percent'
                                               type={isMobileApp?'number':'text'}
                                               label='Процент'
                                               error={percent>100}
                                               onChange={(event) => setPercent(inputFloat(event.target.value))}
                                               value={percent}
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
                                    }} size='small'>
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
                                        label='Информация'
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
                                            Название:&nbsp;
                                        </div>
                                        <div className={classes.value}>
                                            {name}
                                        </div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Процент:&nbsp;
                                        </div>
                                        <div className={classes.value}>
                                            {percent}
                                        </div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Телефон:&nbsp;
                                        </div>
                                        <div className={classes.value}>
                                            {phones.map((element, idx)=><div className={classes.value} key={`Телефон${idx}`}>+996{element}</div>)}
                                        </div>
                                    </div>
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
                                    data.edit||data.add?
                                        <>
                                        <Button color='primary' onClick={()=>{
                                            let checkPhones = !phones.length||validPhones1(phones)
                                            let checkMail = !emails.length||validMails(emails)
                                            let res
                                            if (name.length&&checkPhones&&checkMail&&percent<101) {
                                                const action = async() => {
                                                    if(router.query.id==='new') {
                                                        res = await addCpa({name, emails, phones, info, percent: checkFloat(percent)})
                                                        if(res&&res!=='ERROR') {
                                                            unsaved.current = {}
                                                            showSnackBar('Успешно', 'success')
                                                            Router.push(`/cpa/${res}`)
                                                        }
                                                        else
                                                            showSnackBar('Ошибка', 'error')
                                                    }
                                                    else {
                                                        let element = {_id: router.query.id}
                                                        if (name!==data.object.name) element.name = name
                                                        if (percent!=data.object.percent) element.percent = checkFloat(percent)
                                                        if (info!==data.object.info) element.info = info
                                                        if (JSON.stringify(phones)!==JSON.stringify(data.object.phones)) element.phones = phones
                                                        if (JSON.stringify(emails)!==JSON.stringify(data.object.emails)) element.emails = emails
                                                        res = await setCpa(element)
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
                                                        let res = await deleteCpa(router.query.id)
                                                        if(res==='OK') {
                                                            showSnackBar('Успешно', 'success')
                                                            Router.push(`/cpas`)
                                                        }
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

Cpa.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin'].includes(store.getState().user.profile.role))
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
            deleted: store.getState().user.profile.deleted&&['admin'].includes(store.getState().user.profile.role),
            add: store.getState().user.profile.add&&['admin'].includes(store.getState().user.profile.role),
            object:ctx.query.id!=='new'?
                await getCpa({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
                :
                {
                    name: '',
                    emails: [],
                    phones: [],
                    percent: '',
                    info: ''
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

export default connect(mapStateToProps, mapDispatchToProps)(Cpa);