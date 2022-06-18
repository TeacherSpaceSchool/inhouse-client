import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React, { useState } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import {getCashbox, _setCashbox, addCashbox, deleteCashbox, restoreCashbox, clearCashbox} from '../../src/gql/cashbox'
import {generateReportX} from '../../src/gql/report'
import {getLegalObjects} from '../../src/gql/legalObject'
import cashboxStyle from '../../src/styleMUI/list'
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
import { pdDDMMYYHHMM } from '../../src/lib'
import AutocomplectOnline from '../../components/app/AutocomplectOnline'
import {getBranchs} from '../../src/gql/branch';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import History from '../../components/dialog/History';
import HistoryIcon from '@mui/icons-material/History';
import SyncOn from '@mui/icons-material/Sync';
import SyncOff from '@mui/icons-material/SyncDisabled';
import ViewText from '../../components/dialog/ViewText';
import { wrapper } from '../../src/redux/configureStore'

const Cashbox = React.memo((props) => {
    const {classes} = cashboxStyle();
    const { data } = props;
    const { isMobileApp } = props.app;
    const { profile } = props.user;
    const { showSnackBar } = props.snackbarActions;
    const { setCashbox } = props.appActions;
    let [name, setName] = useState(data.object?data.object.name:'');
    let [legalObject, setLegalObject] = useState(data.object?data.object.legalObject:undefined);
    let [branch, setBranch] = useState(data.object?data.object.branch:undefined);
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
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
                <meta property='og:url' content={`${urlMain}/cashbox/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/cashbox/${router.query.id}`}/>
            </Head>
            <Card className={classes.page}>
                {
                    data.object&&data.object._id?
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
                                        <Link href='/workshifts/[id]' as={`/workshifts/${legalObject._id}`}>
                                            <MenuItem onClick={()=>{setCashbox({_id: router.query.id, name})}}>
                                                Смены
                                            </MenuItem>
                                        </Link>
                                        <Link href='/sales/[id]' as={`/sales/${legalObject._id}`}>
                                            <MenuItem onClick={()=>{setCashbox({_id: router.query.id, name})}}>
                                                Операции
                                            </MenuItem>
                                        </Link>
                                        <Link href='/deposithistorys/[id]' as={`/deposithistorys/${legalObject._id}`}>
                                            <MenuItem onClick={()=>{setCashbox({_id: router.query.id, name})}}>
                                                Внесения
                                            </MenuItem>
                                        </Link>
                                        <Link href='/withdrawhistorys/[id]' as={`/withdrawhistorys/${legalObject._id}`}>
                                            <MenuItem onClick={()=>{setCashbox({_id: router.query.id, name})}}>
                                                Изъятия
                                            </MenuItem>
                                        </Link>
                                        <Link href={{pathname: '/reports/[id]', query: {type: 'X'}}} as={`/reports/${legalObject._id}?type=X`}>
                                            <MenuItem onClick={()=>{setCashbox({_id: router.query.id, name})}}>
                                                X-Отчет
                                            </MenuItem>
                                        </Link>
                                        <Link href={{pathname: '/reports/[id]', query: {type: 'Z'}}} as={`/reports/${legalObject._id}?type=Z`}>
                                            <MenuItem onClick={()=>{setCashbox({_id: router.query.id, name})}}>
                                                Z-Отчет
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
                                data.object.presentCashier?
                                    <div className={classes.status} style={{background: 'green', position: 'initial'}}>Работает</div>
                                    :
                                    null
                            }
                            {
                                ['admin', 'superadmin', 'оператор'].includes(profile.role)?
                                    data.object.sync?
                                        <SyncOn color='primary' onClick={async()=>{
                                            if(profile.statistic) {
                                                setMiniDialog('Синхронизация', <ViewText text={data.object.syncMsg}/>)
                                                showMiniDialog(true)
                                            }
                                        }} className={classes.sync}/>
                                        :
                                        <SyncOff color='secondary' onClick={async()=>{
                                            if(profile.statistic) {
                                                setMiniDialog('Синхронизация', <ViewText text={data.object.syncMsg}/>)
                                                showMiniDialog(true)
                                            }
                                        }} className={classes.sync}/>
                                    :
                                    null
                            }
                            {
                                ['admin', 'superadmin'].includes(profile.role)&&profile.statistic?
                                    <HistoryIcon onClick={async()=>{
                                        setMiniDialog('История', <History where={data.object._id}/>)
                                        showMiniDialog(true)
                                    }} style={{ color: '#10183D'}}/>
                                    :
                                    null
                            }
                        </div>
                        :
                        null
                }
                <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignItems: 'flex-start'}}>
                    <br/>
                {
                    data.object!==null?
                        <>
                        {['admin', 'superadmin', 'оператор'].includes(profile.role)?
                            <>
                            {
                                data.object.createdAt&&'оператор'!==profile.role?
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
                                router.query.id==='new'?
                                    <AutocomplectOnline
                                        error={!legalObject}
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
                            }
                            </>
                            :
                            null
                        }
                        {
                            router.query.id!=='new'?
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        РНМ:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {data.object.rnmNumber}
                                    </div>
                                </div>
                                :
                                null
                        }
                        {
                            router.query.id!=='new'?
                                ['admin', 'superadmin', 'оператор'].includes(profile.role)&&profile.add?
                                    <Link href='/payment/[id]' as={'/payment/new'}>
                                        <a>
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>
                                                    Оплачен до:&nbsp;
                                                </div>
                                                <div className={classes.value} style={{color: data.object.endPayment&&data.object.endPayment>=new Date()?'green':'red'}}>
                                                    {data.object.endPayment?pdDDMMYYHHMM(data.object.endPayment):'не оплачен'}
                                                </div>
                                            </div>
                                        </a>
                                    </Link>
                                    :
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Оплачен до:&nbsp;
                                        </div>
                                        <div className={classes.value} style={{color: data.object.endPayment&&data.object.endPayment>=new Date()?'green':'red'}}>
                                            {data.object.endPayment?pdDDMMYYHHMM(data.object.endPayment):'не оплачен'}
                                        </div>
                                    </div>
                                :
                                null
                        }
                        {
                            legalObject&&legalObject._id?
                                profile.add?
                                    <AutocomplectOnline
                                        error={!branch}
                                        defaultValue={data.object.branch}
                                        setElement={setBranch}
                                        getElements={async (search)=>{return await getBranchs({search, legalObject: legalObject._id})}}
                                        label={'объект'}
                                        minLength={0}
                                    />
                                    :
                                    branch?
                                        <Link href='/branch/[id]' as={`/branch/${branch._id}`}>
                                            <a>
                                                <div className={classes.row}>
                                                    <div className={classes.nameField}>
                                                        Объект:&nbsp;
                                                    </div>
                                                    <div className={classes.value}>
                                                        {branch.name}
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
                            profile.add?
                                <TextField variant='standard'
                                    label='Название'
                                    error={!name}
                                    value={name}
                                    className={classes.input}
                                    onChange={(event)=>{setName(event.target.value)}}
                                />
                                :
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Название:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {name}
                                    </div>
                                </div>
                        }
                        {
                            router.query.id!=='new'?
                                <>
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Наличными:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {data.object.cash} сом
                                    </div>
                                </div>
                                {
                                    data.object.presentCashier?
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                Кассир:&nbsp;
                                            </div>
                                            <Link key={data.object.presentCashier._id} href='/user/[id]' as={`/user/${data.object.presentCashier._id}`}>
                                                <a>
                                                    <div className={classes.value}>
                                                        {data.object.presentCashier.name}
                                                    </div>
                                                </a>
                                            </Link>
                                        </div>
                                        :
                                        null
                                }
                                </>
                                :
                                null
                        }
                        <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD}>
                            {
                                !data.object.del?
                                    <>
                                    {
                                        router.query.id!=='new'&&data.object.presentCashier&&(['управляющий', 'супервайзер'].includes(profile.role)||['admin', 'superadmin'].includes(profile.role)&&profile.add)?
                                            <Button color='primary' onClick={async()=>{
                                                let report = await generateReportX({cashbox: router.query.id})
                                                if(report)
                                                    Router.push(`/report/${report}?type=X`)
                                                else
                                                    showSnackBar('Смена просрочена', 'error')
                                                /*const action = async() => {
                                                }
                                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                                showMiniDialog(true)*/
                                            }}>
                                                Х-Отчет
                                            </Button>
                                            :
                                            null
                                    }
                                    {
                                        router.query.id!=='new'&&'superadmin'===profile.role&&!data.object.presentCashier?
                                            <Button color='primary' onClick={()=>{
                                                const action = async() => {
                                                    await clearCashbox(router.query.id)
                                                }
                                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                                showMiniDialog(true)
                                            }}>
                                                Обнулить
                                            </Button>
                                            :
                                            null
                                    }
                                    {
                                        profile.add?
                                            <Button color='primary' onClick={()=>{
                                                if(name.length&&legalObject&&branch) {
                                                    const action = async() => {
                                                        if(router.query.id==='new') {
                                                            let res = await addCashbox({name, legalObject: legalObject._id, branch: branch._id})
                                                            Router.push(`/cashbox/${res}`)
                                                            showSnackBar('Успешно', 'success')
                                                        }
                                                        else {
                                                            let element = {_id: router.query.id}
                                                            if (name!==data.object.name) element.name = name
                                                            if (branch._id!==data.object.branch._id) element.branch = branch._id
                                                            await _setCashbox(element)
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
                                            :
                                            null
                                    }
                                    {
                                        ['admin', 'superadmin'].includes(profile.role)&&router.query.id!=='new'&&!data.object.presentCashier&&profile.add?
                                            <Button color='secondary' onClick={()=>{
                                                const action = async() => {
                                                    await deleteCashbox(router.query.id)
                                                    Router.push(`/cashboxes/${legalObject._id}`)
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
                                            await restoreCashbox(router.query.id)
                                            Router.push(`/cashboxes/${legalObject?legalObject._id:'super'}`)
                                        }
                                        setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                        showMiniDialog(true)
                                    }}>
                                        Восстановить
                                    </Button>
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

Cashbox.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
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
            object:ctx.query.id!=='new'?await getCashbox({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined):
                {name: '', legalObject: undefined, branch: undefined}
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
        appActions: bindActionCreators(appActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cashbox);