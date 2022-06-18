import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import {getPayment, addPayment, refundPayment, deletePayment} from '../../src/gql/payment'
import {getTariffs} from '../../src/gql/tariff'
import {getLegalObjects} from '../../src/gql/legalObject'
import {getCashboxes} from '../../src/gql/cashbox'
import paymentStyle from '../../src/styleMUI/list'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import { useRouter } from 'next/router'
import Router from 'next/router'
import * as userActions from '../../src/redux/actions/user'
import * as appActions from '../../src/redux/actions/app'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import TextField from '@mui/material/TextField';
import Confirmation from '../../components/dialog/Confirmation'
import { urlMain } from '../../src/const'
import { getClientGqlSsr } from '../../src/apollo'
import { pdDDMMYYHHMM, inputInt, checkInt } from '../../src/lib'
import AutocomplectOnline from '../../components/app/AutocomplectOnline'
import CardCashbox from '../../components/CardCashbox'
import LazyLoad from 'react-lazyload';
import CardBranchPlaceholder from '../../components/CardPlaceholder'
import Checkbox from '@mui/material/Checkbox';
import Link from 'next/link';
import { wrapper } from '../../src/redux/configureStore'
const height = 186

const Payment = React.memo((props) => {
    const { profile } = props.user;
    const {classes} = paymentStyle();
    const { data } = props;
    const { isMobileApp, search, branch } = props.app;
    const { showSnackBar } = props.snackbarActions;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { setBranch, showLoad } = props.appActions;
    const router = useRouter()
    let [legalObject, setLegalObject] = useState(profile.legalObject?{_id: profile.legalObject}:data.object?data.object.legalObject:undefined);
    let [amount, setAmount] = useState(data.object?data.object.amount:0);
    let [months, setMonths] = useState(data.object?data.object.months:1);
    let [days, setDays] = useState(data.object?data.object.days:'');
    let [paid, setPaid] = useState(data.object?data.object.paid:'');
    let [change, setChange] = useState(data.object?data.object.change:0);
    let [cashboxes, setCashboxes] = useState(data.object?data.object.cashboxes:[]);
    let [allCashboxes, setAllCashboxes] = useState(data.allCashboxes?data.allCashboxes:data.object?data.object.cashboxes:[]);
    let [filtredCashboxes, setFiltredCashboxes] = useState([]);
    let [pagination, setPagination] = useState(100);
    let [selectType, setSelectType] = useState('Все');
    const checkPagination = ()=>{
        if(pagination<filtredCashboxes.length){
            setPagination(pagination+100)
        }
    }
    useEffect(() => {
        (async()=>{
            if(router.query.id==='new') {
                props.appActions.setLegalObject(legalObject)
                setBranch(undefined)
                setCashboxes([])
                if (legalObject)
                    setAllCashboxes(await getCashboxes({legalObject: legalObject._id, all: true}));
                else
                    setAllCashboxes([])
            }
        })()
    }, [legalObject]);
    useEffect(()=>{
        (async()=>{
            if(data.object) {
                setPagination(100)
                let filtredCashboxes= []
                if (selectType === 'Все')
                    filtredCashboxes=[...allCashboxes]
                else if (selectType === 'Свободные')
                    filtredCashboxes=[...allCashboxes.filter(cashbox=>!cashboxes.includes(cashbox))]
                else if (selectType === 'Выбраные')
                    filtredCashboxes=[...cashboxes]
                if(search.length>0||branch)
                    filtredCashboxes = filtredCashboxes.filter(element=>
                        element.name.toLowerCase().includes(search.toLowerCase())&&(!branch||element.branch&&element.branch._id===branch._id)
                    )
                setFiltredCashboxes([...filtredCashboxes])
            }
        })()
    },[selectType, search, cashboxes, allCashboxes, branch])
    useEffect(()=>{
        (async()=>{
            if(data.tariff[0]&&cashboxes.length&&(checkInt(months)||checkInt(days))) {
                amount = (data.tariff[0].ofd+data.tariff[0].pkkm*cashboxes.length)*checkInt(months)
                if(days){
                    amount += checkInt(data.tariff[0].ofd+data.tariff[0].pkkm/30*cashboxes.length*checkInt(days))
                }
                setAmount(amount)
                setChange(checkInt(paid)-amount)
            }
            else {
                setAmount(0)
                setChange(0)
            }
        })()
    },[months, days, cashboxes, paid])
    return (
        <App checkPagination={checkPagination} filterShow={{branch: true}} searchShow={true} pageName={data.object!==null?router.query.id==='new'?'Добавить':data.object.number:'Ничего не найдено'}>
            <Head>
                <title>{data.object!==null?router.query.id==='new'?'Добавить':data.object.number:'Ничего не найдено'}</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content={data.object!==null?router.query.id==='new'?'Добавить':data.object.number:'Ничего не найдено'} />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/payment/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/payment/${router.query.id}`}/>
            </Head>
             {
                    data.object&&data.tariff[0]?
                        <>
                        <Card className={classes.page}>
                            <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignItems: 'flex-start'}}>
                                {
                                    router.query.id!=='new'?
                                        <>
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                Статус:&nbsp;
                                            </div>
                                            <div className={classes.value} style={{color: data.object.refund?'red':data.object.status==='Оплачен'?'green':'orange'}}>
                                                {data.object.refund?'Возврат':data.object.status}
                                            </div>
                                        </div>
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                Платежная система:&nbsp;
                                            </div>
                                            <div className={classes.value}>
                                                {data.object.paymentSystem}
                                            </div>
                                        </div>
                                        {data.object.who?
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>
                                                    Оператор:&nbsp;
                                                </div>
                                                <div className={classes.value}>
                                                    {data.object.who.role} {data.object.who.name}
                                                </div>
                                            </div>
                                            :
                                            null
                                        }
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                Дата:&nbsp;
                                            </div>
                                            <div className={classes.value}>
                                                {pdDDMMYYHHMM(data.object.createdAt)}
                                            </div>
                                        </div>
                                        {
                                            ['admin', 'superadmin', 'оператор'].includes(profile.role)?
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
                                                Сумма:&nbsp;
                                            </div>
                                            <div className={classes.value}>
                                                {data.object.amount} сом
                                            </div>
                                        </div>
                                        {
                                            data.object.months?
                                                <div className={classes.row}>
                                                    <div className={classes.nameField}>
                                                        Месяцы:&nbsp;
                                                    </div>
                                                    <div className={classes.value}>
                                                        {data.object.months}
                                                    </div>
                                                </div>
                                                :
                                                null
                                        }
                                        {
                                            data.object.days?
                                                <div className={classes.row}>
                                                    <div className={classes.nameField}>
                                                        Дни:&nbsp;
                                                    </div>
                                                    <div className={classes.value}>
                                                        {data.object.days}
                                                    </div>
                                                </div>
                                                :
                                                null
                                        }
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                Оплачено:&nbsp;
                                            </div>
                                            <div className={classes.value}>
                                                {data.object.paid} сом
                                            </div>
                                        </div>
                                        {
                                            data.object.change?
                                                <div className={classes.row}>
                                                    <div className={classes.nameField}>
                                                        Сдача:&nbsp;
                                                    </div>
                                                    <div className={classes.value}>
                                                        {data.object.change} сом
                                                    </div>
                                                </div>
                                                :
                                                null
                                        }
                                        {
                                            ['admin', 'superadmin'].includes(profile.role)&&data.object.data?
                                                <>
                                                <div className={classes.row}>
                                                    <div className={classes.nameField}>
                                                        Информация:&nbsp;
                                                    </div>
                                                    <div className={classes.value}>
                                                        {data.object.data}
                                                    </div>
                                                </div>
                                                </>
                                                :
                                                null
                                        }
                                        </>
                                        :
                                        <>
                                        {
                                            ['admin', 'superadmin', 'оператор'].includes(profile.role)?
                                                <AutocomplectOnline
                                                    setElement={setLegalObject}
                                                    getElements={async (search)=>{return await getLegalObjects({search})}}
                                                    label={'налогоплательщика'}
                                                />
                                                :
                                                null
                                        }
                                        <TextField variant='standard'
                                            label='Месяцы'
                                            value={months}
                                            className={classes.input}
                                            onChange={(event)=>{setMonths(inputInt(event.target.value))}}
                                        />
                                        <TextField variant='standard'
                                            label='Дни'
                                            value={days}
                                            className={classes.input}
                                            onChange={(event)=>{setDays(inputInt(event.target.value))}}
                                        />
                                        <TextField variant='standard'
                                            label='Сумма'
                                            value={amount}
                                            className={classes.input}
                                        />
                                        {
                                            ['admin', 'superadmin', 'оператор'].includes(profile.role)?
                                                <TextField variant='standard'
                                                    label='Оплачено'
                                                    value={paid}
                                                    className={classes.input}
                                                    onChange={(event)=>{
                                                        setPaid(inputInt(event.target.value))
                                                        setChange(checkInt(paid)-amount)
                                                    }}
                                                />
                                                :
                                                null
                                        }
                                        {
                                            change>0?
                                                <TextField variant='standard'
                                                    label='Сдача'
                                                    value={change}
                                                    className={classes.input}
                                                />
                                                :
                                                null
                                        }
                                        </>
                                }
                                <div style={{ justifyContent: 'center' }} className={classes.row}>
                                    {
                                        router.query.id==='new'?
                                            <>
                                            <div style={{background: selectType==='Все'?'#10183D':'#ffffff', color: selectType==='Все'?'white':'black'}} onClick={()=>{setSelectType('Все')}} className={classes.selectType}>
                                                Все
                                            </div>
                                            <div style={{background: selectType==='Свободные'?'#10183D':'#ffffff', color: selectType==='Свободные'?'white':'black'}} onClick={()=>{setSelectType('Свободные')}} className={classes.selectType}>
                                                {`Своб. ${allCashboxes.filter(cashbox=>!cashboxes.includes(cashbox)).length}`}
                                            </div>
                                            </>
                                            :
                                            null
                                    }
                                    <div style={{background: selectType==='Выбраные'?'#10183D':'#ffffff', color: selectType==='Выбраные'?'white':'black'}} onClick={()=>{setSelectType('Выбраные')}} className={classes.selectType}>
                                        {`Выбр. ${cashboxes.length}`}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <div className={classes.list}>
                            {filtredCashboxes?filtredCashboxes.map((element, idx)=> {
                                if (idx <= pagination)
                                    return (
                                        <div key={element._id} style={isMobileApp ? {alignItems: 'baseline', width: 'auto'} : {width: 'auto'}}
                                             className={isMobileApp ? classes.column : classes.row}>
                                            {
                                                router.query.id==='new'?
                                                    <>
                                                    <Checkbox checked={cashboxes.includes(element)}
                                                              onChange={() => {
                                                                  if (!cashboxes.includes(element)) {
                                                                      cashboxes.push(element)
                                                                  } else {
                                                                      cashboxes.splice(cashboxes.indexOf(element), 1)
                                                                  }
                                                                  setCashboxes([...cashboxes])
                                                              }}
                                                    />
                                                    </>
                                                    :
                                                    null
                                            }
                                            <LazyLoad scrollContainer={'.App-body'} key={element._id}
                                                      height={height} offset={[height, 0]} debounce={0}
                                                      once={true}
                                                      placeholder={<CardBranchPlaceholder height={height}/>}>
                                                <CardCashbox onlyShow element={element}/>
                                            </LazyLoad>
                                        </div>
                                    )
                                else return null
                            }):null}
                        </div>
                        <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD}>
                            {
                                router.query.id!=='new'&&data.object.status==='Оплачен'&&!data.object.refund?
                                    <Link href='/payment/receipt/[id]' as={`/payment/receipt/${router.query.id}`}>
                                        <a>
                                            <Button color='primary'>
                                                Чек
                                            </Button>
                                        </a>
                                    </Link>
                                    :
                                    null
                            }
                            {
                                router.query.id==='new'?
                                    <Button color='primary' onClick={async ()=>{
                                        if (
                                            legalObject
                                            &&
                                            cashboxes.length
                                            &&
                                            !('оператор'===profile.role&&change<0)
                                            &&
                                            amount>0
                                        ) {
                                            if(['admin', 'superadmin', 'оператор'].includes(profile.role)){
                                                const action = async() => {
                                                    let res = await addPayment({
                                                        legalObject: legalObject._id,
                                                        months: checkInt(months),
                                                        days: checkInt(days),
                                                        paid: checkInt(paid),
                                                        cashboxes: cashboxes.map(elem=>elem._id)
                                                    })
                                                    if(res==='Ошибка')
                                                        showSnackBar('Ошибка платежа', 'error')
                                                    else
                                                        Router.push(`/payment/receipt/${res}`)
                                                }
                                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                                showMiniDialog(true)
                                            }
                                            else {
                                                showLoad(true)
                                                paid = checkInt(paid)
                                                let res = await addPayment({
                                                    legalObject: legalObject._id,
                                                    months: checkInt(months),
                                                    days: checkInt(days),
                                                    cashboxes: cashboxes.map(elem=>elem._id)
                                                })
                                                showLoad(false)
                                                if(res==='Ошибка')
                                                    showSnackBar('Ошибка платежа', 'error')
                                                else
                                                    window.open(res, '_blank')
                                            }
                                        } else
                                            showSnackBar('Заполните все поля')
                                    }}>
                                        Оплатить
                                    </Button>
                                    :
                                    null
                            }
                            {
                                router.query.id!=='new'&&data.object.status==='Оплачен'&&!data.object.refund&&profile.payment&&['admin', 'superadmin', 'оператор'].includes(profile.role)?
                                    <Button color='primary' onClick={()=>{
                                        const action = async() => {
                                            await refundPayment(router.query.id);
                                            Router.push(`/payments`)
                                        }
                                        setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                        showMiniDialog(true)
                                    }}>
                                        Возврат
                                    </Button>
                                    :
                                    null
                            }
                            {
                                router.query.id!=='new'&&data.object.status==='Обработка'&&profile.payment?
                                    <Button color='primary' onClick={()=>{
                                        const action = async() => {
                                            let res = await deletePayment(router.query.id);
                                            if(res==='OK')
                                                Router.push(`/payments`)
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
                        </div>
                        </>
                        :
                        <Card className={classes.page}>
                            <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignItems: 'flex-start'}}>
                                Ничего не найдено
                            </CardContent>
                        </Card>
                }
        </App>
    )
})

Payment.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!(
            ctx.query.id==='new'&&['admin', 'superadmin', 'оператор', 'управляющий'].includes(store.getState().user.profile.role)&&store.getState().user.profile.payment
            ||
            ctx.query.id!=='new'&&['admin', 'superadmin', 'оператор', 'управляющий'].includes(store.getState().user.profile.role)
            ||
            ['кассир', 'супервайзер'].includes(store.getState().user.profile.role)&&store.getState().user.profile.payment
    ))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    return {
        data: {
            object: ctx.query.id!=='new'?
                await getPayment({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined):{
                    amount: 0,
                    months: 1,
                    days: '',
                    paid: '',
                    change: 0,
                    cashboxes: []
                },
            tariff: await getTariffs({last: true}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            ...store.getState().user.profile.legalObject?{
                allCashboxes: await getCashboxes({legalObject: store.getState().user.legalObject, all: true}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
            }:{}
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

export default connect(mapStateToProps, mapDispatchToProps)(Payment);