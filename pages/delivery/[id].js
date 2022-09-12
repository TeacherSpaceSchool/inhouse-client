import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import { getSale, setSale, getAttachment, getUnloadSales } from '../../src/gql/sale'
import { getClient } from '../../src/gql/client'
import { getDoc } from '../../src/gql/doc'
import { getInstallments } from '../../src/gql/installment'
import { getBalanceItems } from '../../src/gql/balanceItem'
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
import { pdDDMMYYHHMM, cloneObject, pdtDatePicker } from '../../src/lib'
import { getSaleDoc } from '../../src/doc/sale'
import { getVoucherDoc } from '../../src/doc/voucher'
import { getInstallmentDoc } from '../../src/doc/installment'
import AutocomplectOnline from '../../components/app/AutocomplectOnline'
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import Shipment from '../../components/dialog/Shipment'
import Menu from '@mui/material/Menu';
import dynamic from 'next/dynamic';
import DownloadIcon from '@mui/icons-material/Download';
import { getUsers } from '../../src/gql/user'
const Geo = dynamic(import('../../components/dialog/Geo'), { ssr: false });

const colors = {
    'обработка': 'orange',
    'доставлен': 'green',
    'возврат': 'red',
    'активна': 'orange',
    'оплачен': 'green',
    'перерасчет': 'red',
    'на доставку': '#00A875',
    'отгружен': 'blue',
    'отмена': 'red'
}

const Delivery = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const { isMobileApp, filter } = props.app;
    const { showSnackBar } = props.snackbarActions;
    const { showLoad } = props.appActions;
    const { profile } = props.user;
    let [today, setToday] = useState();
    const unsaved = useRef();
    let [edit, setEdit] = useState(false);
    let [deliverymans, setDeliverymans] = useState(data.object.deliverymans?cloneObject(data.object.deliverymans):[]);
    let [geo, setGeo] = useState(data.object?cloneObject(data.object.geo):null);
    let [address, setAddress] = useState(data.object.address);
    let [addressInfo, setAddressInfo] = useState(data.object.addressInfo);
    let [delivery, setDelivery] = useState(data.object.delivery?pdtDatePicker(data.object.delivery):data.object.delivery);
    let [comment, setComment] = useState(data.object.comment);
    const { setMiniDialog, showMiniDialog, setFullDialog, showFullDialog } = props.mini_dialogActions;
    const router = useRouter()
    useEffect(()=>{
        if(!today) {
            today = new Date()
            today.setHours(0, 0, 0, 0)
            setToday(today)
        }
    },[])
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
        <App unsaved={unsaved} pageName={data.object!==null?`${data.object.order?'На заказ':'Продажа'} №${data.object.number}`:'Ничего не найдено'}>
            <Head>
                <title>{data.object!==null?`${data.object.order?'На заказ':'Продажа'} №${data.object.number}`:'Ничего не найдено'}</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content={data.object!==null?`${data.object.order?'На заказ':'Продажа'} №${data.object.number}`:'Ничего не найдено'} />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website'/>
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/delivery/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/delivery/${router.query.id}`}/>
            </Head>
            <Card className={classes.page}>
                <div className={classes.status}>
                    {
                        data.object&&!['отмена', 'возврат'].includes(data.object.status)&&data.object._id?
                            <DownloadIcon onClick={async()=>{
                                await showLoad(true)
                                await getSaleDoc({
                                    sale: data.object,
                                    client: await getClient({_id: data.object.client._id}),
                                    itemsSale: data.object.itemsSale,
                                    doc: await getDoc()
                                })
                                let res = await getAttachment(data.object._id)
                                if(res)
                                    window.open(res, '_blank');
                                else
                                    showSnackBar('Ошибка', 'error')
                                if(data.object.installment) {
                                    await getInstallmentDoc({
                                        installment: (await getInstallments({_id: data.object.installment._id}))[0],
                                        sale: data.object,
                                        client: await getClient({_id: data.object.client._id}),
                                        itemsSale: data.object.itemsSale,
                                        doc: await getDoc()
                                    })
                                    await getVoucherDoc({
                                        installment: (await getInstallments({_id: data.object.installment._id}))[0],
                                        client: await getClient({_id: data.object.client._id}),
                                        doc: await getDoc()
                                    })

                                }

                                await showLoad(false)
                            }} style={{ color: '#183B37'}}/>
                            :
                            null
                    }
                    {
                        ['admin'].includes(profile.role)&&data.object&&data.object._id?
                            <HistoryIcon onClick={async()=>{
                                setMiniDialog('История', <History where={data.object._id}/>)
                                showMiniDialog(true)
                            }} style={{ color: '#183B37'}}/>
                            :
                            null
                    }
                </div>
                <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignItems: 'flex-start'}}>
                    {
                        data.object?
                            <>
                            <Link href={`/${data.object.order?'order':'sale'}/[id]`} as={`/${data.object.order?'order':'sale'}/${data.object._id}`}>
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        {data.object.order?'На заказ':'Продажа'} №:
                                    </div>
                                    <div className={classes.value}>
                                        {data.object.number}
                                    </div>
                                </div>
                            </Link>
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
                                                query: {sale: router.query.id}
                                            }}
                                            as={
                                                `/moneyflows?sale=${router.query.id}`
                                            }>
                                            <div className={classes.value} style={{color: 'green', fontWeight: 'bold', cursor: 'pointer'}}>
                                                оплачен
                                            </div>
                                        </Link>
                                        </>
                                        :
                                        null
                                }
                                {
                                    data.object.divide?
                                        <>
                                        &nbsp;
                                        <div className={classes.value} style={{color: 'brown', fontWeight: 'bold', cursor: 'pointer'}}>
                                            разделен
                                        </div>
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
                                edit?
                                    <TextField
                                        id='date'
                                        type='datetime-local'
                                        variant='standard'
                                        label='Доставка'
                                        value={delivery}
                                        onChange={(event) => setDelivery(event.target.value)}
                                        className={classes.input}
                                    />
                                    :
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Доставка:
                                        </div>
                                        <div className={classes.value} style={{ color: data.object.delivery&&['обработка'].includes(data.object.status)&&new Date(delivery)<today?'red':'black'}}>
                                            {data.object.delivery?pdDDMMYYHHMM(data.object.delivery):'Самовывоз'}
                                        </div>
                                    </div>
                            }
                            {
                                data.object.deliveryFact?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Доставлен:
                                        </div>
                                        <div className={classes.value}>
                                            {pdDDMMYYHHMM(data.object.deliveryFact)}
                                        </div>
                                    </div>
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
                            {
                                edit?
                                    <>
                                    {deliverymans.map((deliveryman, idx)=>
                                        <div className={classes.row} key={`deliveryman${idx}`}>
                                            <IconButton onClick={()=>{
                                                deliverymans.splice(idx, 1)
                                                setDeliverymans([...deliverymans])
                                            }}>
                                                <CloseIcon style={{color: 'red'}}/>
                                            </IconButton>
                                            <AutocomplectOnline
                                                error={!deliveryman}
                                                setElement={(deliveryman)=>{
                                                    deliverymans[idx] = deliveryman
                                                    setDeliverymans([...deliverymans])
                                                }}
                                                element={deliveryman}
                                                getElements={async (search)=>{
                                                    return await getUsers({
                                                        search,
                                                        ...filter.store?{store: filter.store._id}:{},
                                                        ...filter.department?{department: filter.department.name}:{},
                                                        ...filter.position?{position: filter.position.name}:{},
                                                        role: 'доставщик'
                                                    })
                                                }}
                                                label={`Доставщик ${idx+1}`}
                                                minLength={0}
                                            />
                                        </div>
                                    )}
                                    <center style={{width: '100%'}}>
                                        <Button size='small' onClick={async()=>{
                                            setDeliverymans([...deliverymans, null])
                                        }} color='primary'>
                                            Добавить доставщика
                                        </Button>
                                    </center>
                                    <br/>
                                    </>
                                    :
                                    data.object.deliverymans&&data.object.deliverymans.length?
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                Доставщики:
                                            </div>
                                            <div>
                                                {data.object.deliverymans.map((deliveryman)=>
                                                    <div className={classes.value}>
                                                        {deliveryman.name}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        :
                                        null
                            }
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
                            {
                                edit?
                                    <>
                                    <TextField
                                        id='comment'
                                        variant='standard'
                                        label='Комментарий'
                                        className={classes.input}
                                        margin='normal'
                                        value={comment}
                                        onChange={(event)=>{setComment(event.target.value)}}
                                    />
                                    <TextField
                                        id='address'
                                        variant='standard'
                                        label='Адрес'
                                        className={classes.input}
                                        margin='normal'
                                        value={address}
                                        onChange={(event)=>{setAddress(event.target.value)}}
                                    />
                                    <div className={classes.geo} style={{color: geo&&geo.length?'#183B37':'red'}} onClick={()=>{
                                        setFullDialog('Геолокация', <Geo geo={geo} setAddressGeo={setGeo}/>)
                                        showFullDialog(true)
                                    }}>
                                        {
                                            geo&&geo.length?
                                                'Изменить геолокацию'
                                                :
                                                'Задайте геолокацию'
                                        }
                                    </div>
                                    <TextField
                                        id='addressInfo'
                                        variant='standard'
                                        label='Этаж, квартира, лифт, код к подъезду'
                                        className={classes.input}
                                        margin='normal'
                                        value={addressInfo}
                                        onChange={(event)=>{setAddressInfo(event.target.value)}}
                                    />
                                    </>
                                    :
                                    <>
                                    {
                                        data.object.comment?
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>Комментарий:&nbsp;</div>
                                                <div className={classes.value}>{data.object.comment}</div>
                                            </div>
                                            :
                                            null
                                    }
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Адрес:&nbsp;</div>
                                        <div className={classes.value}>{data.object.address}</div>
                                    </div>
                                    {
                                        data.object.geo&&data.object.geo.length?
                                            <div className={classes.geo} onClick={()=>{
                                                setFullDialog('Геолокация', <Geo geo={data.object.geo}/>)
                                                showFullDialog(true)
                                            }}>
                                                Посмотреть геолокацию
                                            </div>
                                            :
                                            null
                                    }
                                    {
                                        data.object.addressInfo?
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>Этаж, квартира, лифт, код к подъезду:&nbsp;</div>
                                                <div className={classes.value}>{data.object.addressInfo}</div>
                                            </div>
                                            :
                                            null
                                    }
                                    </>
                            }
                            <div style={{height: 10}}/>
                            <div className={classes.nameField}>Позиции({data.object.itemsSale.length}):</div>
                            {
                                data.object.itemsSale.map((itemSale, idx)=>
                                    <div className={classes.column} key={`itemsSale${idx}`}>
                                        <Link href='/item/[id]' as={`/item/${itemSale.item}`} >
                                            <div className={classes.value}>
                                                {idx+1}) {itemSale.name}: {itemSale.count} {itemSale.unit}
                                            </div>
                                        </Link>
                                    </div>
                                )
                            }
                            <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD}>
                                {
                                    ['admin', 'менеджер', 'менеджер/завсклад', 'завсклад'].includes(profile.role)?
                                        edit?
                                            <>
                                            <Button color='primary' onClick={()=>{
                                                setEdit(false)
                                            }}>
                                                Просмотр
                                            </Button>
                                            <Button color='primary' onClick={()=>{
                                                let checkDelivermans = true, _deliverymans = []
                                                for(let i = 0; i <deliverymans.length; i++) {
                                                    if(!deliverymans[i]||_deliverymans.includes(deliverymans[i]._id)) {
                                                        checkDelivermans = false
                                                        break
                                                    }
                                                    else {
                                                        _deliverymans.push(deliverymans[i]._id)
                                                    }
                                                }
                                                if(checkDelivermans) {
                                                    if(delivery) {
                                                        const action = async () => {
                                                            let element = {_id: router.query.id}
                                                            if (address !== data.object.address) element.address = address
                                                            if (addressInfo !== data.object.addressInfo) element.addressInfo = addressInfo
                                                            if (comment !== data.object.comment) element.comment = comment
                                                            if (pdDDMMYYHHMM(delivery) !== pdDDMMYYHHMM(data.object.delivery)) element.delivery = delivery
                                                            if (JSON.stringify(deliverymans) !== JSON.stringify(data.object.deliverymans)) element.deliverymans = _deliverymans
                                                            if (JSON.stringify(geo) !== JSON.stringify(data.object.geo)) element.geo = geo
                                                            let res = await setSale(element)
                                                            if (res && res !== 'ERROR') {
                                                                showSnackBar('Успешно', 'success')
                                                                Router.reload()
                                                            }
                                                            else
                                                                showSnackBar('Ошибка', 'error')
                                                        }
                                                        setMiniDialog('Вы уверены?', <Confirmation
                                                            action={action}/>)
                                                        showMiniDialog(true)
                                                    }
                                                    else
                                                        showSnackBar('Укажите дату доставки')
                                                }
                                                else
                                                    showSnackBar('Исправьте доставщиков')
                                            }}>
                                                Сохранить
                                            </Button>
                                            </>
                                            :
                                            <>
                                            {
                                                ['admin', 'менеджер', 'менеджер/завсклад'].includes(profile.role)&&['на доставку', 'отгружен'].includes(data.object.status)?
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
                                                        {
                                                            ['admin', 'завсклад', 'менеджер/завсклад'].includes(profile.role)&&data.object.status==='на доставку'?
                                                                [
                                                                    <Button color='primary' onClick={async()=>{
                                                                        let items = cloneObject(data.object.itemsSale), shipment = {}
                                                                        for(let i = 0; i <items.length; i++) {
                                                                            items[i].balance = await getBalanceItems({item: items[i].item, store: data.object.store._id})
                                                                            shipment[items[i].item] = {}
                                                                        }
                                                                        unsaved.current = {}
                                                                        setMiniDialog('Отгрузить', <Shipment _id={data.object._id} items={items} _shipment={shipment}/>)
                                                                        showMiniDialog(true)
                                                                    }}>
                                                                        Отгрузить
                                                                    </Button>,
                                                                    <br/>
                                                                ]
                                                                :
                                                                data.object.status==='отгружен'?
                                                                    <Button color='primary' onClick={async()=>{
                                                                        const action = async() => {
                                                                            let element = {_id: router.query.id, status: 'доставлен'}
                                                                            let res = await setSale(element)
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
                                                                        Доставлен
                                                                    </Button>
                                                                    :
                                                                    null
                                                        }
                                                        {
                                                            data.object&&!['отмена', 'возврат'].includes(data.object.status)&&data.object._id?
                                                                [
                                                                    <Button color='primary' onClick={async()=>{
                                                                    await showLoad(true)
                                                                    await getSaleDoc({
                                                                        sale: data.object,
                                                                        client: await getClient({_id: data.object.client._id}),
                                                                        itemsSale: data.object.itemsSale,
                                                                        doc: await getDoc()
                                                                    })
                                                                    let res = await getAttachment(data.object._id)
                                                                    if(res)
                                                                        window.open(res, '_blank');
                                                                    else
                                                                        showSnackBar('Ошибка', 'error')
                                                                    if(data.object.installment) {
                                                                        await getInstallmentDoc({
                                                                            installment: (await getInstallments({_id: data.object.installment._id}))[0],
                                                                            sale: data.object,
                                                                            client: await getClient({_id: data.object.client._id}),
                                                                            itemsSale: data.object.itemsSale,
                                                                            doc: await getDoc()
                                                                        })
                                                                        await getVoucherDoc({
                                                                            installment: (await getInstallments({_id: data.object.installment._id}))[0],
                                                                            client: await getClient({_id: data.object.client._id}),
                                                                            doc: await getDoc()
                                                                        })

                                                                    }

                                                                    await showLoad(false)
                                                                }}>
                                                                        Документы
                                                                    </Button>,
                                                                    <br/>
                                                                ]
                                                                :
                                                                null
                                                        }
                                                        <Button color='primary' onClick={async ()=>{
                                                            let res = await getUnloadSales({_id: router.query.id})
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
                                                        {
                                                            ['admin', 'завсклад', 'менеджер/завсклад'].includes(profile.role)&&data.object.status==='на доставку'?
                                                                <Button color='primary' onClick={async()=>{
                                                                    let items = cloneObject(data.object.itemsSale), shipment = {}
                                                                    for(let i = 0; i <items.length; i++) {
                                                                        items[i].balance = await getBalanceItems({item: items[i].item, store: data.object.store._id})
                                                                        shipment[items[i].item] = {}
                                                                    }
                                                                    unsaved.current = {}
                                                                    setMiniDialog('Отгрузить', <Shipment _id={data.object._id} items={items} _shipment={shipment}/>)
                                                                    showMiniDialog(true)
                                                                }}>
                                                                    Отгрузить
                                                                </Button>
                                                                :
                                                                data.object.status==='отгружен'?
                                                                    <Button color='primary' onClick={async()=>{
                                                                        const action = async() => {
                                                                            let element = {_id: router.query.id, status: 'доставлен'}
                                                                            let res = await setSale(element)
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
                                                                        Доставлен
                                                                    </Button>
                                                                    :
                                                                    null
                                                        }
                                                        {
                                                            data.object&&!['отмена', 'возврат'].includes(data.object.status)&&data.object._id?
                                                                <Button color='primary' onClick={async()=>{
                                                                    await showLoad(true)
                                                                    await getSaleDoc({
                                                                        sale: data.object,
                                                                        client: await getClient({_id: data.object.client._id}),
                                                                        itemsSale: data.object.itemsSale,
                                                                        doc: await getDoc()
                                                                    })
                                                                    let res = await getAttachment(data.object._id)
                                                                    if(res)
                                                                        window.open(res, '_blank');
                                                                    else
                                                                        showSnackBar('Ошибка', 'error')
                                                                    if(data.object.installment) {
                                                                        await getInstallmentDoc({
                                                                            installment: (await getInstallments({_id: data.object.installment._id}))[0],
                                                                            sale: data.object,
                                                                            client: await getClient({_id: data.object.client._id}),
                                                                            itemsSale: data.object.itemsSale,
                                                                            doc: await getDoc()
                                                                        })
                                                                        await getVoucherDoc({
                                                                            installment: (await getInstallments({_id: data.object.installment._id}))[0],
                                                                            client: await getClient({_id: data.object.client._id}),
                                                                            doc: await getDoc()
                                                                        })

                                                                    }

                                                                    await showLoad(false)
                                                                }}>
                                                                    Документы
                                                                </Button>
                                                                :
                                                                null
                                                        }
                                                        <Button color='primary' onClick={async ()=>{
                                                            let res = await getUnloadSales({_id: router.query.id})
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
                                                ['admin', 'менеджер', 'менеджер/завсклад'].includes(profile.role)&&data.object.status==='на доставку'?
                                                    <Button className={classes.rightBottomButton} color='secondary' onClick={()=>{
                                                        const action = async() => {
                                                            let element = {_id: router.query.id, status: data.object.order?'заказан':'обработка'}
                                                            let res = await setSale(element)
                                                            if(res&&res!=='ERROR') {
                                                                showSnackBar('Успешно', 'success')
                                                                Router.push(`/${data.object.order?'order':'sale'}/${router.query.id}`)
                                                            }
                                                            else
                                                                showSnackBar('Ошибка', 'error')
                                                        }
                                                        setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                                        showMiniDialog(true)
                                                    }}>
                                                        Отменить доставку
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

Delivery.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', 'управляющий',  'кассир', 'менеджер', 'менеджер/завсклад', 'доставщик', 'завсклад', 'юрист'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    let object = await getSale({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
    return {
        data: {
            edit: ['admin', 'менеджер', 'менеджер/завсклад', 'завсклад'].includes(store.getState().user.profile.role)&&['на доставку', 'отгружен'].includes(object.status),
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

export default connect(mapStateToProps, mapDispatchToProps)(Delivery);