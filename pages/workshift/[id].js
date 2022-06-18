import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import {getWorkShift, _setWorkShift, endWorkShift} from '../../src/gql/workShift'
import workShiftStyle from '../../src/styleMUI/list'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import * as appActions from '../../src/redux/actions/app'
import { useRouter } from 'next/router'
import Router from 'next/router'
import * as userActions from '../../src/redux/actions/user'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import Confirmation from '../../components/dialog/Confirmation'
import SetFloat from '../../components/dialog/SetFloat'
import { urlMain } from '../../src/const'
import { getClientGqlSsr } from '../../src/apollo'
import { pdDDMMYYHHMM, checkFloat } from '../../src/lib'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import {generateReportX} from '../../src/gql/report'
import SyncOn from '@mui/icons-material/Sync';
import SyncOff from '@mui/icons-material/SyncDisabled';
import ViewText from '../../components/dialog/ViewText';
import { wrapper } from '../../src/redux/configureStore'

const WorkShift = React.memo((props) => {
    const { profile } = props.user;
    const {classes} = workShiftStyle();
    const { data} = props;
    const { isMobileApp } = props.app;
    let [deposit, setDeposit] = useState(data.object?data.object.deposit:0);
    let [withdraw, setWithdraw] = useState(data.object?data.object.withdraw:0);
    let [cashEnd, setCashEnd] = useState(data.object?data.object.cashEnd:0);
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { setWorkShift } = props.appActions;
    const { showSnackBar } = props.snackbarActions;
    const router = useRouter()
    const [anchorElQuick, setAnchorElQuick] = useState(null);
    const openQuick = Boolean(anchorElQuick);
    let handleMenuQuick = (event) => {
        setAnchorElQuick(event.currentTarget);
    }
    let handleCloseQuick = () => {
        setAnchorElQuick(null);
    }
    let [expired, setExpired] = useState(false);
    useEffect(()=>{
        if(!data.object.end){
            setExpired(((new Date()-data.object.start)/1000/60/60)>24)
        }
    }, []);
    return (
        <App pageName={data.object?router.query.id==='new'?'Добавить':`Смена №${data.object.number}`:'Ничего не найдено'}>
            <Head>
                <title>{data.object?router.query.id==='new'?'Добавить':`Смена №${data.object.number}`:'Ничего не найдено'}</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content={data.object?router.query.id==='new'?'Добавить':`Смена №${data.object.number}`:'Ничего не найдено'} />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/workshift/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/workshift/${router.query.id}`}/>
            </Head>
            <Card className={classes.page}>
                <div className={classes.status}>
                    {
                        'оператор'!==profile.role?
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
                                <Link href='/sales/[id]' as={`/sales/${data.object.legalObject._id}`}>
                                    <MenuItem onClick={()=>{setWorkShift({_id: router.query.id, number: data.object.number})}}>
                                        Операции
                                    </MenuItem>
                                </Link>
                                <Link href='/deposithistorys/[id]' as={`/deposithistorys/${data.object.legalObject._id}`}>
                                    <MenuItem onClick={()=>{setWorkShift({_id: router.query.id, number: data.object.number})}}>
                                        Внесения
                                    </MenuItem>
                                </Link>
                                <Link href='/withdrawhistorys/[id]' as={`/withdrawhistorys/${data.object.legalObject._id}`}>
                                    <MenuItem onClick={()=>{setWorkShift({_id: router.query.id, number: data.object.number})}}>
                                        Изъятия
                                    </MenuItem>
                                </Link>
                                <Link href={{pathname: '/reports/[id]', query: {type: 'X'}}} as={`/reports/${data.object.legalObject._id}?type=X`}>
                                    <MenuItem onClick={()=>{setWorkShift({_id: router.query.id, number: data.object.number})}}>
                                        X-Отчет
                                    </MenuItem>
                                </Link>
                                <Link href={{pathname: '/reports/[id]', query: {type: 'Z'}}} as={`/reports/${data.object.legalObject._id}?type=Z`}>
                                    <MenuItem onClick={()=>{setWorkShift({_id: router.query.id, number: data.object.number})}}>
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
                        ['admin', 'superadmin', 'оператор'].includes(profile.role)&&data.object&&data.object._id?
                            data.object.sync?
                                <SyncOn color={data.object.syncMsg==='Фискальный режим отключен'?'secondary':'primary'} onClick={async()=>{
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
                </div>
                <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignWorkShifts: 'flex-start'}}>
                    <br/>
                    {
                    data.object!==null?
                       <>
                       {
                           !data.object.end?
                               <div className={classes.nameField} style={{color: expired?'red':'green'}}>{expired?'Cмена просрочена':'Работает'}</div>
                               :
                               null
                       }
                       <div className={classes.row}>
                           <div className={classes.nameField}>
                               Номер:&nbsp;
                           </div>
                           <div className={classes.value}>
                               {data.object.number}
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
                       <Link href='/branch/[id]' as={`/branch/${data.object.branch._id}`}>
                           <a>
                               <div className={classes.row}>
                                   <div className={classes.nameField}>
                                       Объект:&nbsp;
                                   </div>
                                   <div className={classes.value}>
                                       {data.object.branch.name}
                                   </div>
                               </div>
                           </a>
                       </Link>
                       <Link href='/cashbox/[id]' as={`/cashbox/${data.object.cashbox._id}`}>
                           <a>
                               <div className={classes.row}>
                                   <div className={classes.nameField}>
                                       Касса:&nbsp;
                                   </div>
                                   <div className={classes.value}>
                                       {data.object.cashbox.name}
                                   </div>
                               </div>
                           </a>
                       </Link>
                       <Link href='/user/[id]' as={`/user/${data.object.cashier._id}`}>
                           <a>
                               <div className={classes.row}>
                                   <div className={classes.nameField}>
                                       Кассир:&nbsp;
                                   </div>
                                   <div className={classes.value}>
                                       {data.object.cashier.name}
                                   </div>
                               </div>
                           </a>
                       </Link>
                       <div className={classes.row}>
                           <div className={classes.nameField}>
                               Начало:&nbsp;
                           </div>
                           <div className={classes.value}>
                               {pdDDMMYYHHMM(data.object.start)}
                           </div>
                       </div>
                       {
                           data.object.end?
                               <div className={classes.row}>
                                   <div className={classes.nameField}>
                                       Конец:&nbsp;
                                   </div>
                                   <div className={classes.value}>
                                       {pdDDMMYYHHMM(data.object.end)}
                                   </div>
                               </div>
                               :
                               null
                       }
                       <div className={classes.row}>
                           <div className={classes.nameField}>
                               Наличных на начало:&nbsp;
                           </div>
                           <div className={classes.value}>
                               {data.object.cashStart} сом
                           </div>
                       </div>
                       {
                           cashEnd!=undefined?
                               <div className={classes.row}>
                                   <div className={classes.nameField}>
                                       Наличных на конец:&nbsp;
                                   </div>
                                   <div className={classes.value}>
                                       {cashEnd} сом
                                   </div>
                               </div>
                               :
                               null
                       }
                       {
                           deposit?
                               <div className={classes.row}>
                                   <div className={classes.nameField}>
                                       Внесено:&nbsp;
                                   </div>
                                   <div className={classes.value}>
                                       {deposit} сом
                                   </div>
                               </div>
                               :
                               null
                       }
                       {
                           withdraw?
                               <div className={classes.row}>
                                   <div className={classes.nameField}>
                                       Изъято:&nbsp;
                                   </div>
                                   <div className={classes.value}>
                                       {withdraw} сом
                                   </div>
                               </div>
                               :
                               null
                       }
                       {
                           data.object.cash?
                               <div className={classes.row}>
                                   <div className={classes.nameField}>
                                       Наличными:&nbsp;
                                   </div>
                                   <div className={classes.value}>
                                       {data.object.cash} сом
                                   </div>
                               </div>
                               :
                               null
                       }
                       {
                           data.object.cashless ?
                               <div className={classes.row}>
                                   <div className={classes.nameField}>
                                       Безналичными:&nbsp;
                                   </div>
                                   <div className={classes.value}>
                                       {data.object.cashless} сом
                                   </div>
                               </div>
                               :
                               null
                       }
                       {
                           data.object.discount ?
                               <div className={classes.row}>
                                   <div className={classes.nameField}>
                                       Скидки:&nbsp;
                                   </div>
                                   <div className={classes.value}>
                                       {data.object.discount} сом
                                   </div>
                               </div>
                               :
                               null
                       }
                       {
                           data.object.extra ?
                               <div className={classes.row}>
                                   <div className={classes.nameField}>
                                       Наценки:&nbsp;
                                   </div>
                                   <div className={classes.value}>
                                       {data.object.extra} сом
                                   </div>
                               </div>
                               :
                               null
                       }
                       {
                           data.object.sale||data.object.saleCount ?
                               <div className={classes.row}>
                                   <div className={classes.nameField}>
                                       Продаж:&nbsp;
                                   </div>
                                   <div className={classes.value}>
                                       {data.object.sale} сом | {data.object.saleCount} шт
                                   </div>
                               </div>
                               :
                               null
                       }
                       {
                           data.object.returnedCount||data.object.returned ?
                               <div className={classes.row}>
                                   <div className={classes.nameField}>
                                       Возврат:&nbsp;
                                   </div>
                                   <div className={classes.value}>
                                       {data.object.returned} сом | {data.object.returnedCount} шт
                                   </div>
                               </div>
                               :
                               null
                       }
                       {
                           data.object.consignationCount||data.object.consignation?
                               <div className={classes.row}>
                                   <div className={classes.nameField}>
                                       Кредит:&nbsp;
                                   </div>
                                   <div className={classes.value}>
                                       {data.object.consignation} сом | {data.object.consignationCount} шт
                                   </div>
                               </div>
                               :
                               null
                       }
                       {
                           data.object.paidConsignationCount||data.object.paidConsignation?
                               <div className={classes.row}>
                                   <div className={classes.nameField}>
                                       Погашение кредита:&nbsp;
                                   </div>
                                   <div className={classes.value}>
                                       {data.object.paidConsignation} сом | {data.object.paidConsignationCount} шт
                                   </div>
                               </div>
                               :
                               null
                       }
                       {
                           data.object.prepaymentCount||data.object.prepayment ?
                               <div className={classes.row}>
                                   <div className={classes.nameField}>
                                       Аванс:&nbsp;
                                   </div>
                                   <div className={classes.value}>
                                       {data.object.prepayment} сом | {data.object.prepaymentCount} шт
                                   </div>
                               </div>
                               :
                               null
                       }
                       {
                           data.object.buy||data.object.buyCount ?
                               <div className={classes.row}>
                                   <div className={classes.nameField}>
                                       Покупка:&nbsp;
                                   </div>
                                   <div className={classes.value}>
                                       {data.object.buy} сом | {data.object.buyCount} шт
                                   </div>
                               </div>
                               :
                               null
                       }
                       {
                           data.object.returnedBuy||data.object.returnedBuyCount ?
                               <div className={classes.row}>
                                   <div className={classes.nameField}>
                                       Возврат покупки:&nbsp;
                                   </div>
                                   <div className={classes.value}>
                                       {data.object.returnedBuy} сом | {data.object.returnedBuyCount} шт
                                   </div>
                               </div>
                               :
                               null
                       }
                       <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD}>
                           {
                               !data.object.end?
                                   <>
                                   {
                                       !expired?
                                           <>
                                           {
                                               'кассир'===profile.role?
                                                   <>
                                                   <Button color='primary' onClick={()=>{
                                                       setMiniDialog('Внести', <SetFloat action={async (float, comment)=>{
                                                           if(float>0) {
                                                               let res = await _setWorkShift({deposit: checkFloat(float), withdraw: 0, comment})
                                                               if(res==='OK') {
                                                                   setDeposit(deposit + float)
                                                                   setCashEnd(cashEnd + float)
                                                               }
                                                           }
                                                           else
                                                               showSnackBar('Сумма слишком мала')
                                                       }}/>)
                                                       showMiniDialog(true)
                                                   }}>
                                                       Внести
                                                   </Button>
                                                   {
                                                       cashEnd>0?
                                                           <Button color='primary' onClick={()=>{
                                                               setMiniDialog('Изъять', <SetFloat action={async (float, comment)=>{
                                                                   if(float<=cashEnd&&float>0) {
                                                                       let res = await _setWorkShift({deposit: 0, withdraw: checkFloat(float), comment})
                                                                       if(res==='OK') {
                                                                           setWithdraw(withdraw + float)
                                                                           setCashEnd(cashEnd - float)
                                                                       }
                                                                   }
                                                                   else if(float<1)
                                                                       showSnackBar('Сумма слишком мала')
                                                                   else
                                                                       showSnackBar('Сумма слишком велика')
                                                               }}/>)
                                                               showMiniDialog(true)
                                                           }}>
                                                               Изъять
                                                           </Button>
                                                           :
                                                           null
                                                   }
                                                   </>
                                                   :
                                                   null
                                           }

                                           {
                                               profile.role!=='admin'||profile.add?
                                                   <Button color='primary' onClick={async()=>{
                                                       Router.push(`/report/${await generateReportX({cashbox: data.object.cashbox._id})}?type=X`)
                                                       /*const action = async() => {
                                                       }
                                                       setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                                       showMiniDialog(true)*/
                                                   }}>
                                                       X-Отчет
                                                   </Button>
                                                   :
                                                   null
                                           }
                                           </>
                                           :
                                           null
                                   }
                                   {
                                       profile.role!=='admin'||profile.add||expired?
                                           <Button color='secondary' onClick={()=>{
                                               const action = async() => {
                                                   let report = await endWorkShift(...['управляющий', 'супервайзер', 'admin', 'superadmin'].includes(profile.role)?[router.query.id]:[])
                                                   Router.push(`/report/${report}?type=Z`)
                                               }
                                               setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                               showMiniDialog(true)
                                           }}>
                                               Закрыть смену
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

WorkShift.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
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
            object: await getWorkShift({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
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

export default connect(mapStateToProps, mapDispatchToProps)(WorkShift);