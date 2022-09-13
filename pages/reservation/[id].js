import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import { getReservation, setReservation, getUnloadReservations } from '../../src/gql/reservation'
import { getItems } from '../../src/gql/item'
import { getStoreBalanceItems } from '../../src/gql/storeBalanceItem'
import pageListStyle from '../../src/styleMUI/list'
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
import History from '../../components/dialog/History';
import HistoryIcon from '@mui/icons-material/History';
import { wrapper } from '../../src/redux/configureStore'
import { inputFloat, checkFloat, pdDDMMYYHHMM, cloneObject, pdDatePicker, pdDDMMYY } from '../../src/lib'
import AutocomplectOnline from '../../components/app/AutocomplectOnline'
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import SetCharacteristics from '../../components/dialog/SetCharacteristics'
import Menu from '@mui/material/Menu';

const colors = {
    'продан': 'green',
    'обработка': 'orange',
    'принят': 'blue',
    'выполнен': 'green',
    'проверен': 'green',
    'отмена': 'red'
}

const Reservation = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const { isMobileApp } = props.app;
    const { showSnackBar } = props.snackbarActions;
    const { profile } = props.user;
    let [today, setToday] = useState();
    const unsaved = useRef();
    let [edit, setEdit] = useState(false);
    let [paid, setPaid] = useState(data.object.paid);
    let [newItem, setNewItem] = useState(null);
    let [amount, setAmount] = useState(data.object.amount);
    let [term, setTerm] = useState(pdDatePicker(data.object.term));
    let [comment, setComment] = useState(data.object.comment);
    let [itemsReservation, setItemsReservation] = useState(cloneObject(data.object.itemsReservation));
    const { setMiniDialog, showMiniDialog, setFullDialog, showFullDialog } = props.mini_dialogActions;
    const router = useRouter()
    useEffect(()=>{
        if(!today) {
            today = new Date()
            today.setHours(0, 0, 0, 0)
            setToday(today)
        }
        amount = 0
        for (let i = 0; i < itemsReservation.length; i++) {
            amount = checkFloat(amount + itemsReservation[i].amount)
        }
        setAmount(amount)
    },[itemsReservation])
    useEffect(()=>{
        if(!unsaved.current)
            unsaved.current = {}
        else if(edit)
            unsaved.current[router.query.id] = true
    },[edit])
    const [anchorElQuick, setAnchorElQuick] = useState(null);
    const openQuick = Boolean(anchorElQuick);
    let handleMenuQuick = (event) => {
        setAnchorElQuick(event.currentTarget);
    }
    let handleCloseQuick = () => {
        setAnchorElQuick(null);
    }
    return (
        <App unsaved={unsaved} pageName={data.object!==null?`Бронь №${data.object.number}`:'Ничего не найдено'}>
            <Head>
                <title>{data.object!==null?`Бронь №${data.object.number}`:'Ничего не найдено'}</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content={data.object!==null?`Бронь №${data.object.number}`:'Ничего не найдено'} />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website'/>
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/reservation/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/reservation/${router.query.id}`}/>
            </Head>
            <Card className={classes.page}>
                <div className={classes.status}>
                    {
                        ['admin'].includes(profile.role)&&data.object&&data.object._id?
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
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Бронь №:
                                </div>
                                <div className={classes.value}>
                                    {data.object.number}
                                </div>
                            </div>
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Статус:
                                </div>
                                <div className={classes.value} style={{color: colors[data.object.status], fontWeight: 'bold'}}>
                                    {data.object.status}
                                </div>

                                {
                                    data.object.paymentConfirmation?
                                        <>
                                        &nbsp;
                                        <Link
                                            href={{
                                                pathname: '/moneyflows',
                                                query: {reservation: router.query.id}
                                            }}
                                            as={
                                                `/moneyflows?reservation=${router.query.id}`
                                            }>
                                            <div className={classes.value} style={{color: 'green', fontWeight: 'bold', cursor: 'pointer'}}>
                                                оплачен
                                            </div>
                                        </Link>
                                        </>
                                        :
                                        null
                                }   </div>
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Создан:
                                </div>
                                <div className={classes.value}>
                                    {pdDDMMYYHHMM(data.object.createdAt)}
                                </div>
                            </div>
                            {
                                data.object.sale?
                                    <Link href='/sale/[id]' as={`/sale/${data.object.sale._id}`}>
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                Продажа:
                                            </div>
                                            <div className={classes.value}>
                                                №{data.object.sale.number}
                                            </div>
                                        </div>
                                    </Link>
                                    :
                                    null
                            }
                            {
                                edit?
                                    <TextField
                                        id='date'
                                        error={!term}
                                        type='date'
                                        variant='standard'
                                        label='Срок'
                                        value={term}
                                        onChange={(event) => setTerm(event.target.value)}
                                        className={classes.input}
                                    />
                                    :
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Срок:
                                        </div>
                                        <div className={classes.value} style={{ color: ['обработка'].includes(data.object.status)&&new Date(term)<today?'red':'black'}}>
                                            {pdDDMMYY(data.object.term)}
                                        </div>
                                    </div>
                            }
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Магазин:
                                </div>
                                <div className={classes.value}>
                                    {data.object.store.name}
                                </div>
                            </div>
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Менеджер:
                                </div>
                                <div className={classes.value}>
                                    <Link href='/user/[id]' as={`/user/${data.object.manager._id}`} >
                                        {data.object.manager.name}
                                    </Link>
                                </div>
                            </div>
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Клиент:
                                </div>
                                <div className={classes.value}>
                                    <Link href='/client/[id]' as={`/client/${data.object.client._id}`}>
                                        {data.object.client.name}
                                    </Link>
                                </div>
                            </div>
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Тип платежа:
                                </div>
                                <div className={classes.value}>
                                    {data.object.typePayment}
                                </div>
                            </div>
                            <div className={classes.row}>
                                <div className={classes.nameField}>Итого:&nbsp;</div>
                                <div className={classes.value}>{`${edit?amount:data.object.amount} сом`}</div>
                            </div>
                            {
                                edit?
                                    <TextField
                                        id='paid'
                                        variant='standard'
                                        label='Оплачено'
                                        className={classes.input}
                                        margin='normal'
                                        value={paid}
                                        onChange={(event)=>{setPaid(inputFloat(event.target.value))}}
                                    />
                                    :
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Оплачено:&nbsp;</div>
                                        <div className={classes.value}>{data.object.paid} {data.object.currency}</div>
                                    </div>
                            }
                            {
                                edit?
                                    <TextField
                                        id='comment'
                                        variant='standard'
                                        label='Комментарий'
                                        className={classes.input}
                                        margin='normal'
                                        value={comment}
                                        onChange={(event)=>{setComment(event.target.value)}}
                                    />
                                    :
                                    comment?
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>Комментарий:&nbsp;</div>
                                            <div className={classes.value}>{data.object.comment}</div>
                                        </div>
                                        :
                                        null
                            }
                            <div style={{height: 10}}/>
                            <div className={classes.nameField}>Позиции({edit?itemsReservation.length:data.object.itemsReservation.length}):</div>
                            {
                                edit?
                                    itemsReservation.map((itemReservation, idx)=>
                                        <div className={classes.column} key={`itemsReservation${idx}`}>
                                            <div className={isMobileApp?classes.column:classes.row}>
                                                <div className={classes.row}>
                                                    <IconButton onClick={()=>{
                                                        itemsReservation.splice(idx, 1)
                                                        setItemsReservation([...itemsReservation])
                                                    }}>
                                                        <CloseIcon style={{color: 'red'}}/>
                                                    </IconButton>
                                                    <TextField
                                                        id='name'
                                                        error={!itemReservation.count||itemReservation.count==0}
                                                        variant='standard'
                                                        value={itemReservation.name}
                                                        className={classes.input}
                                                        label={`Позиция ${idx+1}`}/>
                                                </div>
                                                <div className={classes.row}>
                                                    <TextField
                                                        id='count'
                                                        error={!itemReservation.count||itemReservation.count==0||itemReservation.count>data.storeBalanceItems[itemReservation.item]}
                                                        variant='standard'
                                                        value={itemReservation.count}
                                                        className={classes.input}
                                                        onChange={(event) => {
                                                            itemsReservation[idx].count = inputFloat(event.target.value)
                                                            itemsReservation[idx].amount = checkFloat(itemsReservation[idx].price * itemsReservation[idx].count)
                                                            setItemsReservation([...itemsReservation])
                                                        }}
                                                        label={`Доступно: ${data.storeBalanceItems[itemReservation.item]}`}/>
                                                    <TextField
                                                        error={!itemReservation.count||itemReservation.count==0}
                                                        id='amount'
                                                        variant='standard'
                                                        value={itemReservation.amount}
                                                        className={classes.input}
                                                        label='Итого'/>
                                                </div>
                                            </div>
                                            <Button size='small' onClick={async()=>{
                                                if(isMobileApp) {
                                                    setFullDialog('Характеристики', <SetCharacteristics
                                                        setList={setItemsReservation} list={itemsReservation} idx={idx}
                                                        characteristics={itemReservation.characteristics}/>)
                                                    showFullDialog(true)
                                                }
                                                else {
                                                    setMiniDialog('Характеристики', <SetCharacteristics
                                                        setList={setItemsReservation} list={itemsReservation} idx={idx}
                                                        characteristics={itemReservation.characteristics}/>)
                                                    showMiniDialog(true)
                                                }
                                            }} color='primary'>
                                                Характеристики: {itemReservation.characteristics.length}
                                            </Button>
                                        </div>
                                    )
                                    :
                                    data.object.itemsReservation.map((itemReservation, idx)=>
                                        <div className={classes.column} key={`itemsReservation${idx}`}>
                                            <Link href='/item/[id]' as={`/item/${itemReservation.item}`} >
                                                <div className={classes.nameField} style={{color: 'black', marginBottom: 5}}>
                                                    {idx+1}) {itemReservation.name}
                                                </div>
                                            </Link>
                                            <div className={classes.value} style={{fontWeight: 400, color: 'black', marginBottom: itemReservation.characteristics.length?5:10}}>
                                                {itemReservation.price} сом * {itemReservation.count} {itemReservation.unit} = {itemReservation.amount} сом
                                            </div>
                                            {
                                                itemReservation.characteristics.length?
                                                    <div className={classes.value} style={{fontWeight: 400, wordBreak: 'break-word'}}>
                                                        {itemReservation.characteristics.map((characteristic)=>`${characteristic[0]}: ${characteristic[1]}; `)}
                                                    </div>
                                                    :
                                                    null
                                            }
                                        </div>
                                    )
                            }
                            {
                                edit?
                                    <div className={classes.row}>
                                        <IconButton onClick={()=>{
                                            if(newItem) {
                                                setNewItem(null)
                                                let errorNewItem = false
                                                for(let i = 0; i <itemsReservation.length; i++) {
                                                    if(itemsReservation[i].item==newItem._id) {
                                                        errorNewItem = true
                                                        break;
                                                    }
                                                }
                                                if(errorNewItem)
                                                    showSnackBar('Позиция уже присутствует')
                                                else {
                                                    setItemsReservation([
                                                        ...itemsReservation,
                                                        {
                                                            name: newItem.name,
                                                            item: newItem._id,
                                                            unit: newItem.unit,
                                                            count: 1,
                                                            price: newItem.priceAfterDiscountKGS,
                                                            amount: newItem.priceAfterDiscountKGS,
                                                            characteristics: newItem.characteristics,
                                                            status: 'обработка',
                                                            cost: newItem.primeCostKGS,
                                                            type: newItem.type,
                                                            category: newItem.category.name,
                                                            factory: newItem.factory.name,
                                                            size: newItem.size,
                                                        }
                                                    ])
                                                }
                                            }
                                            else
                                                showSnackBar('Выберите модель')
                                        }}>
                                            <AddIcon style={{color: '#0f0'}}/>
                                        </IconButton>
                                        <AutocomplectOnline
                                            element={newItem}
                                            setElement={(item)=>setNewItem(item)}
                                            getElements={async (search)=>{
                                                return await getItems({search, catalog: true, store: data.object.store._id})
                                            }}
                                            label={'Добавить позицию'}
                                        />
                                    </div>
                                    :
                                    null
                            }
                            {
                                data.object.status==='обработка'?
                                    <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD}>
                                        {
                                            ['admin', 'менеджер/завсклад', 'менеджер'].includes(profile.role)?
                                                edit?
                                                    <>
                                                    <Button color='primary' onClick={()=>{
                                                        setEdit(false)
                                                    }}>
                                                        Просмотр
                                                    </Button>
                                                    <Button color='primary' onClick={()=>{
                                                        if(itemsReservation.length) {
                                                            let itemsReservationCheck = true

                                                            for(let i=0; i<itemsReservation.length; i++) {
                                                                if(itemsReservation[i].count<1||itemsReservation[i].count>data.storeBalanceItems[itemsReservation[i].item]) {
                                                                    itemsReservationCheck = false
                                                                    break
                                                                }
                                                            }

                                                            if(itemsReservationCheck) {
                                                                const action = async() => {
                                                                    let element = {_id: router.query.id}
                                                                    if (comment!==data.object.comment) element.comment = comment
                                                                    if (paid!=data.object.paid) element.paid = checkFloat(paid)
                                                                    if (pdDDMMYY(term)!==pdDDMMYY(data.object.term)) element.term = term
                                                                    if (amount!=data.object.amount) element.amount = checkFloat(amount)
                                                                    if (JSON.stringify(itemsReservation)!==JSON.stringify(data.object.itemsReservation)) {
                                                                        element.itemsReservation = []
                                                                        for(let i = 0; i <itemsReservation.length; i++) {
                                                                            element.itemsReservation.push({
                                                                                _id: itemsReservation[i]._id,
                                                                                count: checkFloat(itemsReservation[i].count),
                                                                                amount: checkFloat(itemsReservation[i].amount),
                                                                                characteristics: itemsReservation[i].characteristics,
                                                                                name: itemsReservation[i].name,
                                                                                unit: itemsReservation[i].unit,
                                                                                item: itemsReservation[i].item,
                                                                                price: checkFloat(itemsReservation[i].price),
                                                                                status: itemsReservation[i].status
                                                                            })
                                                                        }
                                                                    }
                                                                    let res = await setReservation(element)
                                                                    if(res&&res!=='ERROR') {
                                                                        showSnackBar('Успешно', 'success')
                                                                        Router.reload()
                                                                    }
                                                                    else
                                                                        showSnackBar('Ошибка', 'error')
                                                                }
                                                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                                                showMiniDialog(true)
                                                            }
                                                            else
                                                                showSnackBar('Количество не верно')
                                                        }
                                                        else
                                                            showSnackBar('Добавьте позицию')
                                                    }}>
                                                        Сохранить
                                                    </Button>
                                                    </>
                                                    :
                                                    <>
                                                    {
                                                        ['admin', 'менеджер/завсклад', 'менеджер'].includes(profile.role)?
                                                            <Button color='primary' onClick={()=>{
                                                                setEdit(true)
                                                            }}>
                                                                Редактировать
                                                            </Button>
                                                            :
                                                            null
                                                    }
                                                    {
                                                        isMobileApp?
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
                                                                <Button color='primary' onClick={async ()=>{
                                                                    let res = await getUnloadReservations({_id: router.query.id})
                                                                    if(res)
                                                                        window.open(res, '_blank');
                                                                    else
                                                                        showSnackBar('Ошибка', 'error')
                                                                }}>
                                                                    Выгрузить
                                                                </Button>
                                                            </Menu>
                                                            <Button color='primary' onClick={handleMenuQuick}>
                                                                Функции
                                                            </Button>
                                                            </>
                                                            :
                                                            <div>
                                                                <Button color='primary' onClick={async ()=>{
                                                                    let res = await getUnloadReservations({_id: router.query.id})
                                                                    if(res)
                                                                        window.open(res, '_blank');
                                                                    else
                                                                        showSnackBar('Ошибка', 'error')
                                                                }}>
                                                                    Выгрузить
                                                                </Button>
                                                            </div>
                                                    }
                                                    {
                                                        ['admin', 'менеджер/завсклад', 'менеджер'].includes(profile.role)?
                                                            <Button className={classes.rightBottomButton} color='secondary' onClick={()=>{
                                                                const action = async() => {
                                                                    let element = {_id: router.query.id, status: 'отмена'}
                                                                    let res = await setReservation(element)
                                                                    if(res&&res!=='ERROR') {
                                                                        showSnackBar('Успешно', 'success')
                                                                        Router.reload()
                                                                    }
                                                                    else
                                                                        showSnackBar('Ошибка', 'error')
                                                                }
                                                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                                                showMiniDialog(true)
                                                            }}>
                                                                Отменить
                                                            </Button>
                                                            :
                                                            null
                                                    }
                                                    </>
                                                :
                                                null
                                        }
                                    </div>
                                    :
                                    null
                            }
                            </>
                            :
                            'Ничего не найдено'
                    }
                </CardContent>
            </Card>
        </App>
    )
})

Reservation.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', 'управляющий',  'кассир', 'менеджер', 'менеджер/завсклад', 'завсклад'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    let object = await getReservation({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
    let _storeBalanceItems = await getStoreBalanceItems({...store.getState().app.filter.store?{store: store.getState().app.filter.store}:{}}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
    let storeBalanceItems = {}
    for(let i = 0; i <_storeBalanceItems.length; i++)
        storeBalanceItems[_storeBalanceItems[i].item._id] = _storeBalanceItems[i].free

    for(let i = 0; i <object.itemsReservation.length; i++)
        storeBalanceItems[object.itemsReservation[i].item] = checkFloat(storeBalanceItems[object.itemsReservation[i].item] + object.itemsReservation[i].count)

    return {
        data: {
            storeBalanceItems,
            object
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

export default connect(mapStateToProps, mapDispatchToProps)(Reservation);