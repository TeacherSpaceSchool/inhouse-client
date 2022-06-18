import Head from 'next/head';
import React, { useState } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import { getContact, setContact } from '../src/gql/contact'
import contactStyle from '../src/styleMUI/contact'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import * as snackbarActions from '../src/redux/actions/snackbar'
import IconButton from '@mui/material/IconButton';
import Remove from '@mui/icons-material/Remove';
import WhatsApp from '@mui/icons-material/WhatsApp';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Confirmation from '../components/dialog/Confirmation'
import AddSocial from '../components/dialog/AddSocial'
import { urlMain } from '../src/const'
import { getClientGqlSsr } from '../src/apollo'
import initialApp from '../src/initialApp'
import { validPhone1, validMail, inputPhone } from '../src/lib'
import Router from 'next/router'
import dynamic from 'next/dynamic'
import { wrapper } from '../src/redux/configureStore'
const Geo = dynamic(import('../components/dialog/Geo'), { ssr: false });
import History from '../components/dialog/History'
import HistoryIcon from '@mui/icons-material/History';
import Link from 'next/link';

const Contact = React.memo((props) => {
    const {classes} = contactStyle();
    const { data } = props;
    const { isMobileApp } = props.app;
    const { showSnackBar } = props.snackbarActions;
    let [name, setName] = useState(data.contact.name);
    let [addresses, setAddresses] = useState(data.contact.addresses?data.contact.addresses.map(e=>{return {address: e.address, geo: e.geo}}):[]);
    let addAddress = ()=>{
        addresses = [...addresses, {address: '', geo: [42.8700000, 74.5900000]}]
        setAddresses(addresses)
    };
    let editAddress = (event, idx)=>{
        addresses[idx].address = event.target.value
        setAddresses([...addresses])
    };
    let deleteAddress = (idx)=>{
        addresses.splice(idx, 1);
        setAddresses([...addresses])
    };
    let [email, setEmail] = useState([...data.contact.email]);
    let [whatsapp, setWhatsapp] = useState(data.contact.whatsapp?[...data.contact.whatsapp]:[]);
    let [newEmail, setNewEmail] = useState('');
    let addEmail = ()=>{
        email = [...email, newEmail]
        setEmail(email)
        setNewEmail('')
    };
    let editEmail = (event, idx)=>{
        email[idx] = event.target.value
        setEmail([...email])
    };
    let deleteEmail = (idx)=>{
        email.splice(idx, 1);
        setEmail([...email])
    };
    let [phone, setPhone] = useState([...data.contact.phone]);
    let [newPhone, setNewPhone] = useState('');
    let addPhone = ()=>{
        phone = [...phone, newPhone]
        setPhone(phone)
        setNewPhone('')
    };
    let editPhone = (event, idx)=>{
        phone[idx] = inputPhone(event.target.value)
        setPhone([...phone])
    };
    let deletePhone = (idx)=>{
        phone.splice(idx, 1);
        setPhone([...phone])
    };
    let [social, setSocial] = useState([...data.contact.social]);
    let addSocial = (value, idx)=>{
        social[idx] = value
        setSocial([...social])
    };
    let [info, setInfo] = useState(data.contact.info);
    const { profile } = props.user;
    const { setMiniDialog, showMiniDialog, setFullDialog, showFullDialog } = props.mini_dialogActions;
    return (
        <App pageName='Контакты'>
            <Head>
                <title>Контакты</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content='Контакты' />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/contact`} />
                <link rel='canonical' href={`${urlMain}/contact`}/>
            </Head>
            <Card className={classes.page}>
                <CardContent className={isMobileApp?classes.column:classes.row}>
                    {
                        ['superadmin', 'admin'].includes(profile.role)&&profile.add?
                            <>
                            <div className={classes.column}>
                                <label htmlFor='contained-button-file'>
                                    <img
                                        className={isMobileApp?classes.mediaM:classes.mediaD}
                                        src={`${urlMain}/512x512.png`}
                                        alt={'Добавить'}
                                    />
                                </label>
                                <br/>
                                Наши страницы
                                <div className={classes.row}>
                                    <img src='/instagram.svg' onClick={()=>{
                                        setMiniDialog('Instagram', <AddSocial social={social[0]} action={addSocial} idx={0}/>)
                                        showMiniDialog(true)
                                    }} className={classes.mediaSocial}/>
                                    <img src='/facebook.svg' onClick={()=>{
                                        setMiniDialog('Facebook', <AddSocial social={social[1]} action={addSocial} idx={1}/>)
                                        showMiniDialog(true)
                                    }} className={classes.mediaSocial}/>
                                    <img src='/twitter.svg' onClick={()=>{
                                        setMiniDialog('Twitter', <AddSocial social={social[2]} action={addSocial} idx={2}/>)
                                        showMiniDialog(true)
                                    }} className={classes.mediaSocial}/>
                                    <img src='/telegram.svg' onClick={()=>{
                                        setMiniDialog('Telegram', <AddSocial social={social[3]} action={addSocial} idx={3}/>)
                                        showMiniDialog(true)
                                    }} className={classes.mediaSocial}/>
                                </div>
                            </div>
                            <div>
                                <TextField variant='standard'
                                    label='Название'
                                    value={name}
                                    className={classes.input}
                                    onChange={(event)=>{setName(event.target.value)}}
                                />
                                {addresses.map((element, idx)=>
                                    <div key={`address${idx}`} className={classes.column}>
                                        <FormControl className={classes.input}>
                                            <InputLabel>Адрес {idx+1}</InputLabel>
                                            <Input
                                                placeholder={`Адрес ${idx+1}`}
                                                value={element.address}
                                                onChange={(event)=>{editAddress(event, idx)}}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={()=>{
                                                                deleteAddress(idx)
                                                            }}
                                                            aria-label='toggle password visibility'
                                                        >
                                                            <Remove/>
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                        </FormControl>
                                        <div className={classes.geo} style={element.geo[0]===42.8700000&&element.geo[1]===74.5900000?{color: 'red'}:{}} onClick={()=>{
                                            setFullDialog('Геолокация', <Geo change={true} geo={element.geo} setAddressGeo={newGeo=>{
                                                addresses[idx].geo = newGeo
                                                setAddresses([...addresses])
                                            }}/>)
                                            showFullDialog(true)
                                        }}>
                                            {
                                                element.geo[0]===42.8700000&&element.geo[1]===74.5900000?
                                                    'Задайте геолокацию'
                                                    :
                                                    'Изменить геолокацию'
                                            }
                                        </div>
                                    </div>
                                )}
                                <Button onClick={async()=>{
                                    addAddress()
                                }} color='primary'>
                                    Добавить адрес
                                </Button>
                                <br/>
                                <br/>
                                {email.map((element, idx)=>
                                    <FormControl  key={`email${idx}`} className={classes.input}>
                                        <InputLabel error={!validMail(element)}>Email</InputLabel>
                                        <Input
                                            error={!validMail(element)}
                                            value={element}
                                            onChange={(event)=>{editEmail(event, idx)}}
                                            endAdornment={
                                                <InputAdornment position="end">
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
                                )}
                                <Button onClick={async()=>{
                                    addEmail()
                                }} color='primary'>
                                    Добавить email
                                </Button>
                                <br/>
                                <br/>
                                {phone.map((element, idx)=>
                                    <div className={classes.row}>
                                    <FormControl key={`phone${idx}`} className={classes.input}>
                                            <InputLabel error={!validPhone1(element)}>Телефон. Формат: +996559871952</InputLabel>
                                            <Input
                                                startAdornment={<InputAdornment position='start'>+996</InputAdornment>}
                                                error={!validPhone1(element)}
                                                value={element}
                                                onChange={(event)=>{editPhone(event, idx)}}
                                                endAdornment={
                                                    <InputAdornment position="end">
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
                                        <IconButton
                                            onClick={()=>{
                                                whatsapp[idx] = !whatsapp[idx]
                                                setWhatsapp([...whatsapp])
                                            }}
                                        >
                                            <WhatsApp style={{color: whatsapp[idx]?'green':'gray'}}/>
                                        </IconButton>
                                    </div>
                                )}
                                <Button onClick={async()=>{
                                    addPhone()
                                }} color='primary'>
                                    Добавить телефон
                                </Button>
                                <br/>
                                <br/>
                                <TextField variant='standard'
                                    multiline={true}
                                    label='Информация'
                                    value={info}
                                    className={classes.input}
                                    onChange={(event)=>{setInfo(event.target.value)}}
                                />
                                <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD}>
                                    <Button onClick={async()=>{
                                        let checkPhone = true
                                        if(phone.length)
                                            for(let i=0; i<phone.length; i++)
                                                checkPhone = validPhone1(phone[i])
                                        let checkEmail = true
                                        if(email.length)
                                            for(let i=0; i<email.length; i++)
                                                checkEmail = validMail(email[i])
                                        if (name&&checkPhone&&checkEmail) {
                                            let editElement = {
                                                name,
                                                addresses,
                                                email,
                                                phone,
                                                social,
                                                info,
                                                whatsapp
                                            }
                                            const action = async() => {
                                                await setContact(editElement)
                                                Router.reload()
                                            }
                                            setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                            showMiniDialog(true)
                                        } else {
                                            showSnackBar('Заполните все поля')
                                        }
                                    }} color='primary'>
                                        Сохранить
                                    </Button>
                                </div>
                            </div>
                            </>
                            :
                            <>
                            <div className={classes.column}>
                                <img
                                    className={isMobileApp?classes.mediaM:classes.mediaD}
                                    src={`${urlMain}/512x512.png`}
                                    alt={name}
                                />
                                {
                                    social[0].length>0||social[1].length>0||social[2].length>0||social[3].length>0?
                                        <>
                                        Наши страницы
                                        <div className={classes.row}>
                                            {
                                                social[0].length>0?
                                                    <a href={social[0]}>
                                                        <img src='/instagram.svg' className={classes.mediaSocial}/>
                                                    </a>
                                                    :
                                                    null
                                            }
                                            {
                                                social[1].length>0?
                                                    <a href={social[1]}>
                                                        <img src='/facebook.svg' className={classes.mediaSocial}/>
                                                    </a>
                                                    :
                                                    null
                                            }
                                            {
                                                social[2].length>0?
                                                    <a href={social[2]}>
                                                        <img src='/twitter.svg' className={classes.mediaSocial}/>
                                                    </a>
                                                    :
                                                    null
                                            }
                                            {
                                                social[3].length>0?
                                                    <a href={social[3]}>
                                                        <img src='/telegram.svg' className={classes.mediaSocial}/>
                                                    </a>
                                                    :
                                                    null

                                            }
                                        </div>
                                        </>
                                        :
                                        null
                                }
                            </div>
                            <div>
                                {
                                    name?
                                        <div className={classes.name}>
                                            {name}
                                        </div>
                                        :
                                        null
                                }
                                {
                                    addresses.length?

                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                Адрес:&nbsp;
                                            </div>
                                            <div className={classes.column}>
                                                {addresses.map((element, idx)=>
                                                    <div key={`address${idx}`} className={classes.column}>
                                                        <div className={classes.value} style={element.geo[0]!==42.8700000&&element.geo[1]!==74.5900000?{marginBottom: 0}:{}}>
                                                            {element.address}
                                                        </div>
                                                        {
                                                            element.geo[0]!==42.8700000&&element.geo[1]!==74.5900000?
                                                                <div className={classes.geo} onClick={()=>{
                                                                    setFullDialog('Геолокация', <Geo geo={element.geo}/>)
                                                                    showFullDialog(true)
                                                                }}>
                                                                    Просмотреть геолокацию
                                                                </div>
                                                                :
                                                                null
                                                        }
                                                    </div>
                                                )}
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
                                            <div className={classes.column}>
                                                {phone.map((element, idx)=>
                                                    <div className={classes.row} key={`phone${idx}`}>
                                                        <a href={`tel:+996${element}`} className={classes.value}>
                                                            +996{element}
                                                        </a>
                                                        {
                                                            isMobileApp&&whatsapp[idx]?
                                                                <>
                                                                &nbsp;
                                                                <a href={`https://wa.me/+996${element.substring(1)}`} className={classes.value} style={{color: '#128C7E'}}>
                                                                    (WhatsApp)
                                                                </a>
                                                                </>
                                                                :
                                                                null
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        :
                                        null
                                }
                                {
                                    email.length?
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                E-mail:&nbsp;
                                            </div>
                                            <div className={classes.column}>
                                                {email.map((element, idx)=>
                                                    <a href={`mailto:${element}`} key={`email${idx}`} className={classes.value}>
                                                        {element}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        :
                                        null
                                }
                                <div className={classes.row}>
                                    <div className={classes.nameField} style={{width: 100}}>
                                        Документы:&nbsp;
                                    </div>
                                    <div className={classes.column}>
                                        <Link href='/privacy'>
                                            <a>
                                                <div className={classes.value}>
                                                    Политика конфиденциальности
                                                </div>
                                            </a>
                                        </Link>
                                            <Link href='/ofert'>
                                            <a>
                                                <div className={classes.value}>
                                                    Публичная оферта
                                                </div>
                                            </a>
                                        </Link>
                                    </div>
                                </div>
                                <br/>
                                <div className={classes.info}>
                                    {info}
                                </div>
                            </div>
                            </>
                    }
                </CardContent>
                {
                    ['admin', 'superadmin'].includes(profile.role)&&profile.statistic&&data.contact&&data.contact._id?
                        <div className={classes.status} onClick={async()=>{
                            setMiniDialog('История', <History where={data.contact._id}/>)
                            showMiniDialog(true)
                        }}><HistoryIcon/></div>
                        :
                        null
                }
            </Card>
        </App>
    )
})

Contact.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    return {
        data: {
            contact: await getContact(ctx.req?await getClientGqlSsr(ctx.req):undefined)
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Contact);