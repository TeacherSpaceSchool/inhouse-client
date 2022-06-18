import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React, { useState } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import {getBranch, _setBranch, addBranch, deleteBranch, restoreBranch} from '../../src/gql/branch'
import {getLegalObjects} from '../../src/gql/legalObject'
import branchStyle from '../../src/styleMUI/list'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import { useRouter } from 'next/router'
import MenuItem from '@mui/material/MenuItem';
import Router from 'next/router'
import * as userActions from '../../src/redux/actions/user'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import * as appActions from '../../src/redux/actions/app'
import TextField from '@mui/material/TextField';
import Confirmation from '../../components/dialog/Confirmation'
import dynamic from 'next/dynamic'
const Geo = dynamic(import('../../components/dialog/Geo'), { ssr: false });
import { urlMain } from '../../src/const'
import { getClientGqlSsr } from '../../src/apollo'
import { ugnsTypes, bTypes, pTypes } from '../../src/const'
import { pdDDMMYYHHMM, cloneObject } from '../../src/lib'
import AutocomplectOnline from '../../components/app/AutocomplectOnline'
import Menu from '@mui/material/Menu';
import Link from 'next/link';
import History from '../../components/dialog/History';
import HistoryIcon from '@mui/icons-material/History';
import SyncOn from '@mui/icons-material/Sync';
import SyncOff from '@mui/icons-material/SyncDisabled';
import ViewText from '../../components/dialog/ViewText';
import Autocomplete from '@mui/material/Autocomplete';
import { wrapper } from '../../src/redux/configureStore'

const Branch = React.memo((props) => {
    const { profile } = props.user;
    const {classes} = branchStyle();
    const { data } = props;
    const { isMobileApp } = props.app;
    const { showSnackBar } = props.snackbarActions;
    const { setBranch } = props.appActions;
    let [name, setName] = useState(data.object?data.object.name:'');
    let [address, setAddress] = useState(data.object?data.object.address:'');
    let [geo, setGeo] = useState(data.object&&data.object.geo?cloneObject(data.object.geo):undefined);
    let [ugns, setUgns] = useState(data.object?data.object.ugns:'');
    let [bType, setBType] = useState(data.object?data.object.bType:'');
    let [pType, setPType] = useState(data.object?data.object.pType:'');
    let [legalObject, setLegalObject] = useState(data.object?data.object.legalObject:undefined);
    const { setMiniDialog, showMiniDialog, setFullDialog, showFullDialog } = props.mini_dialogActions;
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
                <meta property='og:url' content={`${urlMain}/branch/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/branch/${router.query.id}`}/>
            </Head>
            <Card className={classes.page}>
                <div className={classes.status}>
                    {
                        router.query.id!=='new'&&profile.role!=='оператор'?
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
                                <Link href='/users/[id]' as={`/users/${legalObject._id}`}>
                                    <MenuItem onClick={async()=>{await setBranch({_id: router.query.id, name})}}>
                                        Сотрудники
                                    </MenuItem>
                                </Link>
                                <Link href='/cashboxes/[id]' as={`/cashboxes/${legalObject._id}`}>
                                    <MenuItem onClick={()=>{setBranch({_id: router.query.id, name})}}>
                                        Кассы
                                    </MenuItem>
                                </Link>
                                <Link href='/workshifts/[id]' as={`/workshifts/${legalObject._id}`}>
                                    <MenuItem onClick={()=>{setBranch({_id: router.query.id, name})}}>
                                        Смены
                                    </MenuItem>
                                </Link>
                                <Link href='/sales/[id]' as={`/sales/${legalObject._id}`}>
                                    <MenuItem onClick={()=>{setBranch({_id: router.query.id, name})}}>
                                        Операции
                                    </MenuItem>
                                </Link>
                                <Link href='/deposithistorys/[id]' as={`/deposithistorys/${legalObject._id}`}>
                                    <MenuItem onClick={()=>{setBranch({_id: router.query.id, name})}}>
                                        Внесения
                                    </MenuItem>
                                </Link>
                                <Link href='/withdrawhistorys/[id]' as={`/withdrawhistorys/${legalObject._id}`}>
                                    <MenuItem onClick={()=>{setBranch({_id: router.query.id, name})}}>
                                        Изъятия
                                    </MenuItem>
                                </Link>
                                <Link href={{pathname: '/reports/[id]', query: {type: 'X'}}} as={`/reports/${legalObject._id}?type=X`}>
                                    <MenuItem onClick={()=>{setBranch({_id: router.query.id, name})}}>
                                        X-Отчет
                                    </MenuItem>
                                </Link>
                                <Link href={{pathname: '/reports/[id]', query: {type: 'Z'}}} as={`/reports/${legalObject._id}?type=Z`}>
                                    <MenuItem onClick={()=>{setBranch({_id: router.query.id, name})}}>
                                        Z-Отчет
                                    </MenuItem>
                                </Link>
                            </Menu>
                            <Button onClick={handleMenuQuick} color='primary'>
                                Переход
                            </Button>
                            </>
                            :
                            null
                    }
                    {
                        ['admin', 'superadmin', 'оператор'].includes(profile.role)&&profile.statistic&&data.object&&data.object._id?
                            <>
                            {
                                data.object.sync?
                                    <SyncOn color='primary' onClick={async()=>{
                                        setMiniDialog('Синхронизация', <ViewText text={data.object.syncMsg}/>)
                                        showMiniDialog(true)
                                    }} className={classes.sync}/>
                                    :
                                    <SyncOff color='secondary' onClick={async()=>{
                                        if(profile.statistic) {
                                            setMiniDialog('Синхронизация', <ViewText text={data.object.syncMsg}/>)
                                            showMiniDialog(true)
                                        }
                                    }} className={classes.sync}/>
                            }
                            {
                                ['admin', 'superadmin'].includes(profile.role)&&profile.statistic?
                                    <HistoryIcon onClick={async()=>{
                                        if(profile.statistic) {
                                            setMiniDialog('История', <History where={data.object._id}/>)
                                            showMiniDialog(true)
                                        }
                                    }} style={{ color: '#10183D'}}/>
                                    :
                                    null
                            }
                            </>
                            :
                            null
                    }
                </div>
                <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignItems: 'flex-start'}}>
                    <br/>
                    {
                    data.object!==null?
                        <>
                        {['superadmin', 'admin', 'оператор'].includes(profile.role)&&profile.add?
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
                                router.query.id!=='new'?
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
                                    <AutocomplectOnline
                                        error={!legalObject}
                                        setElement={setLegalObject}
                                        getElements={async (search)=>{return await getLegalObjects({search})}}
                                        label={'налогоплательщика'}
                                    />
                            }
                            <TextField variant='standard'
                                label='Название'
                                error={!name}
                                value={name}
                                className={classes.input}
                                onChange={(event)=>{setName(event.target.value)}}
                            />
                            <Autocomplete
                                className={classes.input}
                                options={Object.keys(ugnsTypes)}
                                value={ugns}
                                getOptionLabel={option => option}
                                noOptionsText='Ничего не найдено'
                                onChange={(event, newValue) => {
                                    setUgns(newValue)
                                }}
                                renderInput={(params) => <TextField error={!ugns} {...params} label='Налоговый орган' variant='standard' />}
                            />
                            <Autocomplete
                                className={classes.input}
                                options={pTypes}
                                value={pType}
                                getOptionLabel={option => option}
                                noOptionsText='Ничего не найдено'
                                onChange={(event, newValue) => {
                                    setPType(newValue)
                                }}
                                renderInput={(params) => <TextField error={!pType} {...params} label='Тип' variant='standard' />}
                            />
                            <Autocomplete
                                className={classes.input}
                                options={bTypes}
                                value={bType}
                                getOptionLabel={option => option}
                                noOptionsText='Ничего не найдено'
                                onChange={(event, newValue) => {
                                    setBType(newValue)
                                }}
                                renderInput={(params) => <TextField error={!bType} {...params} label='Тип бизнеса' variant='standard' />}
                            />
                            <TextField variant='standard'
                                error={!address}
                                label='Адрес'
                                value={address}
                                className={classes.input}
                                onChange={(event)=>{setAddress(event.target.value)}}
                            />
                            <div className={classes.geo} style={{color: geo?'#10183D':'red'}} onClick={()=>{
                                setFullDialog('Геолокация', <Geo change={true} geo={geo} setAddressGeo={setGeo}/>)
                                showFullDialog(true)
                            }}>
                                {
                                    geo?
                                        'Изменить геолокацию'
                                        :
                                        'Задайте геолокацию'
                                }
                            </div>
                            </>
                            :
                            ['управляющий', 'супервайзер', 'admin', 'оператор'].includes(profile.role)?
                                <>
                                {
                                    ['admin', 'оператор'].includes(profile.role)?
                                        <>
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                Регистрация:&nbsp;
                                            </div>
                                            <div className={classes.value}>
                                                {pdDDMMYYHHMM(data.object.createdAt)}
                                            </div>
                                        </div>
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
                                        </>
                                        :
                                        null
                                }
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
                                        Адрес:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {address}
                                    </div>
                                </div>
                                <div className={classes.geo} style={{color: geo?'#10183D':'red'}} onClick={()=>{
                                    setFullDialog('Геолокация', <Geo geo={geo}/>)
                                    showFullDialog(true)
                                }}>
                                    Просмотреть геолокацию
                                </div>
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Налоговый орган:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {ugns}
                                    </div>
                                </div>
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Тип регистрации:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {data.object.regType}
                                    </div>
                                </div>
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Тип:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {pType}
                                    </div>
                                </div>
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Тип бизнеса:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {bType}
                                    </div>
                                </div>
                                </>
                                :
                                'Ничего не найдено'
                        }
                        <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD}>
                            {
                                ['admin', 'superadmin', 'оператор'].includes(profile.role)&&profile.add?
                                    !data.object.del?
                                        <>
                                        <Button color='primary' onClick={()=>{
                                            if (legalObject&&name.length&&address.length&&pType.length&&bType.length&&ugns.length) {
                                                const action = async() => {
                                                    if(router.query.id==='new') {
                                                        let res = await addBranch({legalObject: legalObject._id, bType, pType, ugns, name, address, geo})
                                                        Router.push(`/branch/${res}`)
                                                        showSnackBar('Успешно', 'success')
                                                    }
                                                    else {
                                                        let element = {_id: router.query.id}
                                                        if (JSON.stringify(geo)!==JSON.stringify(data.object.geo)) element.geo = geo
                                                        if (name!==data.object.name) element.name = name
                                                        if (address!==data.object.address) element.address = address
                                                        if (ugns!==data.object.ugns) element.ugns = ugns
                                                        if (bType!==data.object.bType) element.bType = bType
                                                        if (pType!==data.object.pType) element.pType = pType
                                                        await _setBranch(element)
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
                                            profile.role!=='оператор'?
                                                <Button color='secondary' onClick={()=>{
                                                    const action = async() => {
                                                        await deleteBranch(router.query.id)
                                                        Router.push(`/branchs/${legalObject._id}`)
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
                                        <Button color='primary' onClick={()=>{
                                            const action = async() => {
                                                await restoreBranch(router.query.id)
                                                Router.push(`/branchs/${legalObject._id}`)
                                            }
                                            setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                            showMiniDialog(true)
                                        }}>
                                            Восстановить
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

Branch.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx,store)
    if(!['admin', 'superadmin', 'управляющий', 'супервайзер', 'оператор'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    return {
        data: {
            object:ctx.query.id!=='new'?await getBranch({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined):{legalObject: undefined, bType: '', pType: '', ugns: '', name: '', address: '', geo: undefined}
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
        appActions: bindActionCreators(appActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Branch);