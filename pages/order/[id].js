import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import { getOrder, setOrder, prepareAcceptOrder, getUnloadOrders } from '../../src/gql/order'
import { getItems } from '../../src/gql/item'
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
import AcceptOrder from '../../components/dialog/AcceptOrder';
import HistoryIcon from '@mui/icons-material/History';
import { wrapper } from '../../src/redux/configureStore'
import { inputFloat, checkFloat, pdDDMMYYHHMM, cloneObject } from '../../src/lib'
import AutocomplectOnline from '../../components/app/AutocomplectOnline'
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import SetCharacteristics from '../../components/dialog/SetCharacteristics'
import UnloadUpload from '../../components/app/UnloadUpload';

const colors = {
    'продан': 'green',
    'обработка': 'orange',
    'принят': 'blue',
    'выполнен': 'green',
    'проверен': 'green',
    'отмена': 'red'
}

const Order = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const { isMobileApp } = props.app;
    const { showSnackBar } = props.snackbarActions;
    const { profile } = props.user;
    const unsaved = useRef();
    let [edit, setEdit] = useState(false);
    let [paid, setPaid] = useState(data.object.paid);
    let [newItem, setNewItem] = useState(null);
    let [amount, setAmount] = useState(data.object.amount);
    let [comment, setComment] = useState(data.object.comment);
    let [itemsOrder, setItemsOrder] = useState(cloneObject(data.object.itemsOrder));
    const { setMiniDialog, showMiniDialog, setFullDialog, showFullDialog } = props.mini_dialogActions;
    const router = useRouter()
    useEffect(()=>{
        amount = 0
        for (let i = 0; i < itemsOrder.length; i++) {
            amount = checkFloat(amount + itemsOrder[i].amount)
        }
        setAmount(amount)
    },[itemsOrder])
    useEffect(()=>{
        if(!unsaved.current)
            unsaved.current = {}
        else if(edit)
            unsaved.current[router.query.id] = true
    },[edit])
    return (
        <App unsaved={unsaved} pageName={data.object!==null?router.query.id==='new'?'Добавить':`На заказ №${data.object.number}`:'Ничего не найдено'}>
            <Head>
                <title>{data.object!==null?router.query.id==='new'?'Добавить':`На заказ №${data.object.number}`:'Ничего не найдено'}</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content={data.object!==null?router.query.id==='new'?'Добавить':`На заказ №${data.object.number}`:'Ничего не найдено'} />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website'/>
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/order/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/order/${router.query.id}`}/>
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
                                    На заказ №:
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
                                                query: {order: router.query.id}
                                            }}
                                            as={
                                                `/moneyflows?order=${router.query.id}`
                                            }>
                                            <div className={classes.value} style={{color: 'green', fontWeight: 'bold', cursor: 'pointer'}}>
                                                оплачен
                                            </div>
                                        </Link>
                                        </>
                                        :
                                        null
                                }
                            </div>
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
                                edit&&!data.object.paymentConfirmation?
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
                            <div className={classes.nameField}>Позиции({itemsOrder.length}):</div>
                            {
                                edit&&!data.object.paymentConfirmation?
                                    itemsOrder.map((itemOrder, idx)=>
                                        <div className={classes.column} key={`itemsOrder${idx}`}>
                                            <div className={isMobileApp?classes.column:classes.row}>
                                                <div className={classes.row}>
                                                    <IconButton onClick={()=>{
                                                        itemsOrder.splice(idx, 1)
                                                        setItemsOrder([...itemsOrder])
                                                    }}>
                                                        <CloseIcon style={{color: 'red'}}/>
                                                    </IconButton>
                                                    <TextField
                                                        id='name'
                                                        error={!itemOrder.count||itemOrder.count==0}
                                                        variant='standard'
                                                        value={itemOrder.name}
                                                        className={classes.input}
                                                        label={`Позиция ${idx+1}`}/>
                                                </div>
                                                <div className={classes.row}>
                                                    <TextField
                                                        id='count'
                                                        error={!itemOrder.count||itemOrder.count==0}
                                                        variant='standard'
                                                        value={itemOrder.count}
                                                        className={classes.input}
                                                        onChange={(event) => {
                                                            itemsOrder[idx].count = inputFloat(event.target.value)
                                                            itemsOrder[idx].amount = checkFloat(itemsOrder[idx].price * itemsOrder[idx].count)
                                                            setItemsOrder([...itemsOrder])
                                                        }}
                                                        label='Количество'/>
                                                    <TextField
                                                        id='amount'
                                                        error={!itemOrder.count||itemOrder.count==0}
                                                        variant='standard'
                                                        value={itemOrder.amount}
                                                        className={classes.input}
                                                        label='Итого'/>
                                                </div>
                                            </div>
                                            <Button size='small' onClick={async()=>{
                                                if(isMobileApp) {
                                                    setFullDialog('Характеристики', <SetCharacteristics
                                                        setList={setItemsOrder} list={itemsOrder} idx={idx}
                                                        characteristics={itemOrder.characteristics}/>)
                                                    showFullDialog(true)
                                                }
                                                else {
                                                    setMiniDialog('Характеристики', <SetCharacteristics
                                                        setList={setItemsOrder} list={itemsOrder} idx={idx}
                                                        characteristics={itemOrder.characteristics}/>)
                                                    showMiniDialog(true)
                                                }
                                            }} color='primary'>
                                                Характеристики: {itemOrder.characteristics.length}
                                            </Button>
                                        </div>
                                    )
                                    :
                                    data.object.itemsOrder.map((itemOrder, idx)=>
                                        <div className={classes.column} key={`itemsOrder${idx}`}>
                                            <Link href='/item/[id]' as={`/item/${itemOrder.item}`} >
                                                <div className={classes.nameField} style={{color: 'black', marginBottom: 5}}>
                                                    {idx+1}) {itemOrder.name}
                                                </div>
                                            </Link>
                                            <div className={classes.value} style={{fontWeight: 400, color: 'black', marginBottom: itemOrder.characteristics.length?5:10}}>
                                                {itemOrder.price} сом * {itemOrder.count} {itemOrder.unit} = {itemOrder.amount} сом
                                            </div>
                                            {
                                                itemOrder.characteristics.length?
                                                    <div className={classes.value} style={{fontWeight: 400, wordBreak: 'break-word'}}>
                                                        {itemOrder.characteristics.map((characteristic)=>`${characteristic[0]}: ${characteristic[1]}; `)}
                                                    </div>
                                                    :
                                                    null
                                            }
                                        </div>
                                    )
                            }
                            {
                                edit&&!data.object.paymentConfirmation?
                                    <div className={classes.row}>
                                        <IconButton onClick={()=>{
                                            if(newItem) {
                                                setNewItem(null)
                                                let errorNewItem = false
                                                for(let i = 0; i <itemsOrder.length; i++) {
                                                    if(itemsOrder[i].item==newItem._id) {
                                                        errorNewItem = true
                                                        break;
                                                    }
                                                }
                                                if(errorNewItem)
                                                    showSnackBar('Позиция уже присутствует')
                                                else {
                                                    setItemsOrder([
                                                        ...itemsOrder,
                                                        {
                                                            name: newItem.name,
                                                            item: newItem._id,
                                                            unit: newItem.unit,
                                                            count: 1,
                                                            price: newItem.priceAfterDiscountKGS,
                                                            amount: newItem.priceAfterDiscountKGS,
                                                            characteristics: newItem.characteristics,
                                                            status: 'обработка',
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
                                                return await getItems({search})
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
                                            ['admin', 'менеджер/завсклад', 'менеджер', 'завсклад'].includes(profile.role)?
                                                edit?
                                                    <>
                                                    <Button color='primary' onClick={()=>{
                                                        setEdit(false)
                                                    }}>
                                                        Просмотр
                                                    </Button>
                                                    <Button color='primary' onClick={()=>{
                                                        let itemsOrderCheck = true
                                                        for(let i=0; i<itemsOrder.length; i++) {
                                                            if(itemsOrder[i].count<1) {
                                                                itemsOrderCheck = false
                                                                break
                                                            }
                                                        }
                                                        if(itemsOrderCheck) {
                                                            const action = async () => {
                                                                if (itemsOrder.length) {
                                                                    let element = {_id: router.query.id}
                                                                    if (comment !== data.object.comment) element.comment = comment
                                                                    if (paid != data.object.paid) element.paid = checkFloat(paid)
                                                                    if (amount != data.object.amount) element.amount = checkFloat(amount)
                                                                    if (JSON.stringify(itemsOrder) !== JSON.stringify(data.object.itemsOrder)) {
                                                                        element.itemsOrder = []
                                                                        for (let i = 0; i < itemsOrder.length; i++) {
                                                                            element.itemsOrder.push({
                                                                                _id: itemsOrder[i]._id,
                                                                                count: checkFloat(itemsOrder[i].count),
                                                                                amount: checkFloat(itemsOrder[i].amount),
                                                                                characteristics: itemsOrder[i].characteristics,
                                                                                name: itemsOrder[i].name,
                                                                                unit: itemsOrder[i].unit,
                                                                                item: itemsOrder[i].item,
                                                                                price: checkFloat(itemsOrder[i].price),
                                                                                status: itemsOrder[i].status
                                                                            })
                                                                        }
                                                                    }
                                                                    let res = await setOrder(element)
                                                                    if (res && res !== 'ERROR') {
                                                                        showSnackBar('Успешно', 'success')
                                                                        Router.reload()
                                                                    }
                                                                    else
                                                                        showSnackBar('Ошибка', 'error')
                                                                }
                                                                else
                                                                    showSnackBar('Добавьте позицию')
                                                            }
                                                            setMiniDialog('Вы уверены?', <Confirmation
                                                                action={action}/>)
                                                            showMiniDialog(true)
                                                        }
                                                        else
                                                            showSnackBar('Количество не верно')
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
                                                        ['admin', 'менеджер/завсклад', 'завсклад'].includes(profile.role)?
                                                            <Button color='primary' onClick={async()=>{
                                                                const _prepareAcceptOrder = await prepareAcceptOrder({_id: router.query.id})
                                                                if(_prepareAcceptOrder) {
                                                                    unsaved.current = {}
                                                                    setMiniDialog('Распределение', <AcceptOrder
                                                                        order={data.object}
                                                                        prepareAcceptOrder={_prepareAcceptOrder}
                                                                        itemsOrder={itemsOrder}/>)
                                                                    showMiniDialog(true)
                                                                }
                                                            }}>
                                                                Принять
                                                            </Button>
                                                            :
                                                            null
                                                    }
                                                    {
                                                        ['admin', 'менеджер/завсклад', 'менеджер'].includes(profile.role)?
                                                            <Button color='secondary' onClick={()=>{
                                                                const action = async() => {
                                                                    let element = {_id: router.query.id, status: 'отмена'}
                                                                    let res = await setOrder(element)
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
                            <UnloadUpload  position={'Z'} unload={()=>getUnloadOrders({_id: router.query.id})}/>
                            </>
                            :
                            'Ничего не найдено'
                    }
                </CardContent>
            </Card>
        </App>
    )
})

Order.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', 'управляющий',  'кассир', 'менеджер', 'менеджер/завсклад', 'завсклад'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    let object = await getOrder({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
    return {
        data: {
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

export default connect(mapStateToProps, mapDispatchToProps)(Order);