import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import { getSale, setSale, getAttachmentSale, getUnloadSales } from '../../src/gql/sale'
import { getItems } from '../../src/gql/item'
import { getStoreBalanceItems } from '../../src/gql/storeBalanceItem'
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
import { inputFloat, checkFloat, pdDDMMYYHHMM, cloneObject, pdtDatePicker } from '../../src/lib'
import AutocomplectOnline from '../../components/app/AutocomplectOnline'
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import SetCharacteristics from '../../components/dialog/SetCharacteristics'
import Shipment from '../../components/dialog/Shipment'
import Menu from '@mui/material/Menu';
import dynamic from 'next/dynamic';
import DivideSaleOrder from '../../components/dialog/DivideSaleOrder';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { getOrderDoc } from '../../src/doc/order'
import { getVoucherDoc } from '../../src/doc/voucher'
import { getInstallmentDoc } from '../../src/doc/installment'
import { getClient } from '../../src/gql/client'
import { getDoc } from '../../src/gql/doc'
import { getInstallments } from '../../src/gql/installment'
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

const Sale = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const { isMobileApp } = props.app;
    const { showSnackBar } = props.snackbarActions;
    const { showLoad } = props.appActions;
    const { profile } = props.user;
    let [today, setToday] = useState();
    const unsaved = useRef();
    let [edit, setEdit] = useState(false);
    let [discount, setDiscount] = useState(data.object.discount);
    let [selfDelivery, setSelfDelivery] = useState(data.object.selfDelivery);
    let [paid, setPaid] = useState(data.object.paid);
    let [percentManager, setPercentManager] = useState('');
    let [percentCpa, setPercentCpa] = useState('');
    let [geo, setGeo] = useState(data.object?cloneObject(data.object.geo):null);
    let [newItem, setNewItem] = useState(null);
    let [amountStart, setAmountStart] = useState(data.object.amountStart);
    let [amountEnd, setAmountEnd] = useState(data.object.amountEnd);
    let [delivery, setDelivery] = useState(data.object.delivery?pdtDatePicker(data.object.delivery):data.object.delivery);
    let [comment, setComment] = useState(data.object.comment);
    let [address, setAddress] = useState(data.object.address);
    let [addressInfo, setAddressInfo] = useState(data.object.addressInfo);
    let [itemsSale, setItemsSale] = useState(cloneObject(data.object.itemsSale));
    const { setMiniDialog, showMiniDialog, setFullDialog, showFullDialog } = props.mini_dialogActions;
    const router = useRouter()
    useEffect(()=>{
        if(!today) {
            today = new Date()
            today.setHours(0, 0, 0, 0)
            setToday(today)
        }
        let discountPrecent = discount*100/amountStart
        amountStart = 0
        for (let i = 0; i < itemsSale.length; i++) {
            amountStart = checkFloat(amountStart + itemsSale[i].amount)
        }
        discount = checkFloat(amountStart/100*discountPrecent)
        setDiscount(discount)
        setAmountStart(amountStart)
    },[itemsSale])
    useEffect(()=>{
        amountEnd = checkFloat(amountStart - discount)
        if(amountEnd<0)
            amountEnd = 0
        setAmountEnd(amountEnd)
        if(!data.object.installment)
            setPaid(amountEnd-checkFloat(data.object.prepaid))
    },[amountStart, discount])
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
        <App unsaved={unsaved} pageName={data.object!==null?`Продажа №${data.object.number}`:'Ничего не найдено'}>
            <Head>
                <title>{data.object!==null?router.query.id==='new'?'Добавить':`Продажа №${data.object.number}`:'Ничего не найдено'}</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content={data.object!==null?router.query.id==='new'?'Добавить':`Продажа №${data.object.number}`:'Ничего не найдено'} />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website'/>
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/sale/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/sale/${router.query.id}`}/>
            </Head>
            <Card className={classes.page}>
                <div className={classes.status}>
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
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Продажа №:
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
                                data.object.promotion?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Акция:
                                        </div>
                                        <div className={classes.value}>
                                            {data.object.promotion.name}
                                        </div>
                                    </div>
                                    :
                                    null
                            }
                            {
                                data.object.refunds&&data.object.refunds.length?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Возврат:
                                        </div>
                                        <div className={classes.column}>
                                            {data.object.refunds.map((refund)=>
                                                <Link href='/refund/[id]' as={`/refund/${refund._id}`}>
                                                    <div className={classes.value}>
                                                        №{refund.number}
                                                    </div>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                    :
                                    null
                            }
                            {
                                data.object.reservations&&data.object.reservations.length?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Бронь:
                                        </div>
                                        <div className={classes.column}>
                                            {data.object.reservations.map((reservation)=>
                                                <Link href='/reservation/[id]' as={`/reservation/${reservation._id}`}>
                                                    <div className={classes.value}>
                                                        №{reservation.number}
                                                    </div>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                    :
                                    null
                            }
                            {
                                edit&&profile.role==='admin'&&data.object.status==='обработка'?
                                    <TextField
                                        id='percentManager'
                                        variant='standard'
                                        label='Новый процент менеджера'
                                        value={percentManager}
                                        onChange={(event) => {
                                            percentManager = inputFloat(event.target.value)
                                            if(percentManager>=100)
                                                percentManager = ''
                                            setPercentManager(percentManager)
                                        }}
                                        className={classes.input}
                                    />
                                    :
                                    null
                            }
                            {
                                edit?
                                    <div className={isMobileApp?classes.column:classes.row}>
                                        <TextField
                                            id='date'
                                            type='datetime-local'
                                            variant='standard'
                                            label='Доставка'
                                            value={delivery}
                                            onChange={(event) => setDelivery(event.target.value)}
                                            className={classes.input}
                                        />
                                        <FormControlLabel control={<Checkbox checked={selfDelivery} onChange={(event) => setSelfDelivery(event.target.checked)}/>} label='Самовывоз' />
                                    </div>
                                    :
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Доставка:
                                        </div>
                                        <div className={classes.value} style={{ color: !['отмена', 'доставлен'].includes(data.object.status)&&new Date(delivery)<today?'red':'black'}}>
                                            {data.object.delivery?pdDDMMYYHHMM(data.object.delivery):'Не указано'}
                                            {data.object.selfDelivery?' Самовывоз':''}
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
                            {
                                ['admin', 'управляющий'].includes(profile.role)?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Бонус менеджера:
                                        </div>
                                        <div className={classes.value}>
                                            {data.object.bonusManager}
                                        </div>
                                    </div>
                                    :
                                    null
                            }
                            {
                                data.object.cpa?
                                    <>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Дизайнер:
                                        </div>
                                        <Link href='/cpa/[id]' as={`/cpa/${data.object.cpa._id}`} >
                                            <div className={classes.value}>
                                                {data.object.cpa.name} {data.object.percentCpa}%
                                            </div>
                                        </Link>
                                    </div>
                                    {
                                        ['admin', 'управляющий'].includes(profile.role)?
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>
                                                    Бонус дизайнера:
                                                </div>
                                                <div className={classes.value}>
                                                    {data.object.bonusCpa}
                                                </div>
                                            </div>
                                            :
                                            null
                                    }
                                    {
                                        edit&&profile.role==='admin'&&data.object.status==='обработка'?
                                            <>
                                            <TextField
                                                style={{marginTop: '0px!important'}}
                                                id='percentCpa'
                                                variant='standard'
                                                label='Новый процент дизайнера'
                                                value={percentCpa}
                                                onChange={(event) => {
                                                    percentCpa = inputFloat(event.target.value)
                                                    if(percentCpa>=100)
                                                        percentCpa = ''
                                                    setPercentCpa(percentCpa)
                                                }}
                                                className={classes.input}
                                            />
                                            <br/>
                                            </>
                                            :
                                            null
                                    }
                                    </>
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
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Тип платежа:
                                </div>
                                <div className={classes.value}>
                                    {data.object.typePayment}
                                </div>
                            </div>
                            {
                                discount?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>До скидки:&nbsp;</div>
                                        <div className={classes.value}>{amountStart} сом</div>
                                    </div>
                                    :
                                    null
                            }
                            {
                                /*edit&&data.object.status==='обработка'?
                                    <FormControl className={classes.input}>
                                        <InputLabel>Скидка</InputLabel>
                                        <Input
                                            placeholder='Скидка'
                                            value={discount}
                                            onChange={(event)=>setDiscount(inputFloat(event.target.value))}
                                            endAdornment={
                                                <InputAdornment position='end'>
                                                    <IconButton >
                                                        сом
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                    :*/
                                    discount?
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>Скидка:&nbsp;</div>
                                            <div className={classes.value}>{edit?discount:data.object.discount} сом</div>
                                        </div>
                                        :
                                        null
                            }
                            <div className={classes.row}>
                                <div className={classes.nameField}>{discount?'После скидки':'Итого'}:&nbsp;</div>
                                <div className={classes.value}>{edit?amountEnd:data.object.amountEnd} сом</div>
                            </div>
                            {
                                data.object.prepaid?
                                    <>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Предоплата:&nbsp;</div>
                                        <div className={classes.value}>{`${data.object.prepaid} сом`}</div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>После предоплаты:&nbsp;</div>
                                        <div className={classes.value}>{edit?checkFloat(amountEnd-data.object.prepaid):checkFloat(data.object.amountEnd-data.object.prepaid)} сом</div>
                                    </div>
                                    </>
                                    :
                                    null
                            }
                            {
                                edit&&data.object.status==='обработка'&&data.object.installment?
                                    <TextField
                                        error={paid>amountEnd}
                                        id='paid'
                                        variant='standard'
                                        label='К оплате'
                                        className={classes.input}
                                        margin='normal'
                                        value={paid}
                                        onChange={(event)=>{setPaid(inputFloat(event.target.value))}}
                                    />
                                    :
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>К оплате:&nbsp;</div>
                                        <div className={classes.value}>{edit?paid:data.object.paid} {data.object.currency}</div>
                                    </div>
                            }
                            <div className={classes.row}>
                                <div className={classes.nameField}>Оплачено:&nbsp;</div>
                                <div className={classes.value}>{checkFloat(data.object.paymentAmount)} {data.object.currency}</div>
                            </div>
                            {
                                checkFloat(data.object.paid - checkFloat(data.object.paymentAmount))?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Остаток:&nbsp;</div>
                                        <div className={classes.value}>{checkFloat(data.object.paid - checkFloat(data.object.paymentAmount))} {data.object.currency}</div>
                                    </div>
                                    :
                                    null
                            }
                            {
                                data.object.installment?
                                    <div className={classes.row} style={{}}>
                                        <div className={classes.nameField}>Рассрочка:&nbsp;</div>
                                        <Link
                                            href={{
                                                pathname: '/installments',
                                                query: {_id: data.object.installment._id}
                                            }}
                                            as={
                                                `/installments?_id=${data.object.installment._id}`
                                            }>
                                            <div className={classes.value} style={{color: colors[data.object.installment.status], fontWeight: 'bold'}}>
                                                {data.object.installment.status}
                                            </div>
                                        </Link>
                                    </div>
                                    :
                                    null
                            }
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
                            <div className={classes.nameField}>Позиции({edit?itemsSale.length:data.object.itemsSale.length}):</div>
                            {
                                edit&&data.object.status==='обработка'?
                                    itemsSale.map((itemSale, idx)=>
                                        <div className={classes.column} key={`itemsSale${idx}`}>
                                            <div className={isMobileApp?classes.column:classes.row}>
                                                <div className={classes.row}>
                                                    <IconButton onClick={()=>{
                                                        itemsSale.splice(idx, 1)
                                                        setItemsSale([...itemsSale])
                                                    }}>
                                                        <CloseIcon style={{color: 'red'}}/>
                                                    </IconButton>
                                                    <TextField
                                                        id='count'
                                                        error={!itemSale.count||itemSale.count==0}
                                                        variant='standard'
                                                        value={itemSale.name}
                                                        className={classes.input}
                                                        label={`Позиция ${idx+1}`}/>
                                                </div>
                                                <div className={classes.row}>
                                                    <TextField
                                                        id='count'
                                                        error={!itemSale.count||itemSale.count==0||itemSale.count>data.storeBalanceItems[itemSale.item]}
                                                        variant='standard'
                                                        value={itemSale.count}
                                                        className={classes.input}
                                                        onChange={(event) => {
                                                            itemsSale[idx].count = inputFloat(event.target.value)
                                                            itemsSale[idx].amount = checkFloat(itemsSale[idx].price * itemsSale[idx].count)
                                                            setItemsSale([...itemsSale])
                                                        }}
                                                        label={`Доступно: ${data.storeBalanceItems[itemSale.item]}`}/>
                                                    <TextField
                                                        id='amount'
                                                        error={!itemSale.count||itemSale.count==0}
                                                        variant='standard'
                                                        value={itemSale.amount}
                                                        className={classes.input}
                                                        label='Итого'/>
                                                </div>
                                            </div>
                                            <Button size='small' onClick={async()=>{
                                                if(isMobileApp) {
                                                    setFullDialog('Характеристики', <SetCharacteristics
                                                        setList={setItemsSale} list={itemsSale} idx={idx}
                                                        characteristics={itemSale.characteristics}/>)
                                                    showFullDialog(true)
                                                }
                                                else {
                                                    setMiniDialog('Характеристики', <SetCharacteristics
                                                        setList={setItemsSale} list={itemsSale} idx={idx}
                                                        characteristics={itemSale.characteristics}/>)
                                                    showMiniDialog(true)
                                                }
                                            }} color='primary'>
                                                Характеристики: {itemSale.characteristics.length}
                                            </Button>
                                        </div>
                                    )
                                    :
                                    data.object.itemsSale.map((itemSale, idx)=>
                                        <div className={classes.column} key={`itemsSale${idx}`}>
                                            <Link href='/item/[id]' as={`/item/${itemSale.item}`} >
                                                <div className={classes.nameField} style={{color: 'black', marginBottom: 5}}>
                                                    {idx+1}) {itemSale.name}
                                                </div>
                                            </Link>
                                            <div className={classes.value} style={{fontWeight: 400, color: 'black', marginBottom: itemSale.characteristics.length?5:10}}>
                                                {itemSale.price} сом * {itemSale.count} {itemSale.unit} = {itemSale.amount} сом
                                            </div>
                                            {
                                                itemSale.characteristics.length?
                                                    <div className={classes.value} style={{fontWeight: 400, wordBreak: 'break-word'}}>
                                                        {itemSale.characteristics.map((characteristic)=>`${characteristic[0]}: ${characteristic[1]}; `)}
                                                    </div>
                                                    :
                                                    null
                                            }
                                        </div>
                                    )
                            }
                            {
                                edit&&data.object.status==='обработка'?
                                    <div className={classes.row}>
                                        <IconButton onClick={()=>{
                                            if(newItem) {
                                                setNewItem(null)
                                                let errorNewItem = false
                                                for(let i = 0; i <itemsSale.length; i++) {
                                                    if(itemsSale[i].item==newItem._id) {
                                                        errorNewItem = true
                                                        break;
                                                    }
                                                }
                                                if(errorNewItem)
                                                    showSnackBar('Позиция уже присутствует')
                                                else {
                                                    setItemsSale([
                                                        ...itemsSale,
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
                                                if(itemsSale.length) {
                                                    let itemsSaleCheck = true
                                                    for(let i=0; i<itemsSale.length; i++) {
                                                        if(itemsSale[i].count<1||itemsSale[i].count>data.storeBalanceItems[itemsSale[i].item]) {
                                                            itemsSaleCheck = false
                                                            break
                                                        }
                                                    }
                                                    if(itemsSaleCheck&&paid>=0&&(!data.object.installment||paid<(amountEnd-checkFloat(data.object.prepaid)))) {
                                                        if (paid <= amountEnd) {
                                                            const action = async () => {
                                                                let element = {_id: router.query.id}
                                                                if(percentCpa.length) element.percentCpa = checkFloat(percentCpa)
                                                                if(percentManager.length) element.percentManager = checkFloat(percentManager)
                                                                if (address !== data.object.address) element.address = address
                                                                if (addressInfo !== data.object.addressInfo) element.addressInfo = addressInfo
                                                                if (comment !== data.object.comment) element.comment = comment
                                                                if (paid != data.object.paid) element.paid = checkFloat(paid)
                                                                if (selfDelivery != data.object.selfDelivery) element.selfDelivery = selfDelivery
                                                                if (pdDDMMYYHHMM(delivery) !== pdDDMMYYHHMM(data.object.delivery)) element.delivery = delivery
                                                                if (discount != data.object.discount) element.discount = checkFloat(checkFloat(amountStart) - checkFloat(amountEnd))
                                                                if (amountStart != data.object.amountStart) element.amountStart = checkFloat(amountStart)
                                                                if (amountEnd != data.object.amountEnd) element.amountEnd = checkFloat(amountEnd)
                                                                if (JSON.stringify(geo) !== JSON.stringify(data.object.geo)) element.geo = geo

                                                                if (JSON.stringify(itemsSale) !== JSON.stringify(data.object.itemsSale)) {
                                                                    element.itemsSale = []
                                                                    for (let i = 0; i < itemsSale.length; i++) {
                                                                        element.itemsSale.push({
                                                                            _id: itemsSale[i]._id,
                                                                            count: checkFloat(itemsSale[i].count),
                                                                            amount: checkFloat(itemsSale[i].amount),
                                                                            characteristics: itemsSale[i].characteristics,
                                                                            name: itemsSale[i].name,
                                                                            unit: itemsSale[i].unit,
                                                                            item: itemsSale[i].item,
                                                                            price: checkFloat(itemsSale[i].price),
                                                                            status: itemsSale[i].status
                                                                        })
                                                                    }
                                                                }
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
                                                            showSnackBar('Оплата больше итого')
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
                                                ['admin', 'менеджер', 'менеджер/завсклад'].includes(profile.role)&&'обработка'===data.object.status?
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
                                                            ['admin', 'менеджер/завсклад', 'завсклад'].includes(profile.role)&&'обработка'===data.object.status?
                                                                [
                                                                    !data.object.selfDelivery?
                                                                        <Button color='primary' onClick={async()=>{
                                                                            const action = async() => {
                                                                                let element = {_id: router.query.id, status: 'на доставку'}
                                                                                let res = await setSale(element)
                                                                                if(res&&res!=='ERROR') {
                                                                                    showSnackBar('Успешно', 'success')
                                                                                    Router.push(`/delivery/${router.query.id}`)
                                                                                }
                                                                                else
                                                                                    showSnackBar('Ошибка', 'error')
                                                                            }
                                                                            setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                                                            showMiniDialog(true)
                                                                        }}>
                                                                            На доставку
                                                                        </Button>
                                                                        :
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
                                                                    , <br/>
                                                                ]
                                                                :
                                                                null
                                                        }
                                                        {
                                                            ['admin', 'менеджер/завсклад', 'завсклад'].includes(profile.role)&&'обработка'===data.object.status?
                                                                [
                                                                    <Button color='primary' onClick={async()=>{
                                                                        let currentItems = cloneObject(data.object.itemsSale)
                                                                        let newItems = []
                                                                        for(let i=0; i<currentItems.length; i++) {
                                                                            newItems[i] = {
                                                                                ...currentItems[i],
                                                                                count: '',
                                                                            }
                                                                        }
                                                                        setMiniDialog('Разделить продажу', <DivideSaleOrder
                                                                            installment={data.object.installment}
                                                                            type='sale'
                                                                            _id={router.query.id}
                                                                            currentItems={currentItems}
                                                                            _newItems={newItems}/>)
                                                                        showMiniDialog(true)
                                                                    }}>
                                                                        Разделить
                                                                    </Button>,
                                                                    <br/>
                                                                ]
                                                                :
                                                                null
                                                        }
                                                        {
                                                            data.object&&!['отмена', 'возврат'].includes(data.object.status)&&data.object._id?
                                                                [
                                                                    <Button color='primary' onClick={async()=>{
                                                                        await showLoad(true)
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
                                                                        else
                                                                            await getOrderDoc({
                                                                                sale: data.object,
                                                                                client: await getClient({_id: data.object.client._id}),
                                                                                itemsSale: data.object.itemsSale,
                                                                                doc: await getDoc()
                                                                            })
                                                                        let res = await getAttachmentSale(data.object._id)
                                                                        if(res)
                                                                            window.open(res, '_blank');
                                                                        else
                                                                            showSnackBar('Ошибка', 'error')
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
                                                            ['admin', 'менеджер/завсклад', 'завсклад'].includes(profile.role)&&'обработка'===data.object.status?
                                                                !data.object.selfDelivery?
                                                                    <Button color='primary' onClick={async()=>{
                                                                        const action = async() => {
                                                                            let element = {_id: router.query.id, status: 'на доставку'}
                                                                            let res = await setSale(element)
                                                                            if(res&&res!=='ERROR') {
                                                                                showSnackBar('Успешно', 'success')
                                                                                Router.push(`/delivery/${router.query.id}`)
                                                                            }
                                                                            else
                                                                                showSnackBar('Ошибка', 'error')
                                                                        }
                                                                        setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                                                        showMiniDialog(true)
                                                                    }}>
                                                                        На доставку
                                                                    </Button>
                                                                    :
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
                                                                null
                                                        }
                                                        {
                                                            ['admin', 'менеджер/завсклад', 'завсклад'].includes(profile.role)&&'обработка'===data.object.status?
                                                                <Button color='primary' onClick={async()=>{
                                                                    let currentItems = cloneObject(data.object.itemsSale)
                                                                    let newItems = []
                                                                    for(let i=0; i<currentItems.length; i++) {
                                                                        newItems[i] = {
                                                                            ...currentItems[i],
                                                                            count: '',
                                                                        }
                                                                    }
                                                                    setMiniDialog('Разделить заказ', <DivideSaleOrder
                                                                        installment={data.object.installment}
                                                                        type='sale'
                                                                        _id={router.query.id}
                                                                        currentItems={currentItems}
                                                                        _newItems={newItems}/>)
                                                                    showMiniDialog(true)
                                                                }}>
                                                                    Разделить
                                                                </Button>
                                                                :
                                                                null
                                                        }
                                                        {
                                                            data.object&&!['отмена', 'возврат'].includes(data.object.status)&&data.object._id?
                                                                <Button color='primary' onClick={async()=>{
                                                                    await showLoad(true)
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
                                                                    else
                                                                        await getOrderDoc({
                                                                            sale: data.object,
                                                                            client: await getClient({_id: data.object.client._id}),
                                                                            itemsSale: data.object.itemsSale,
                                                                            doc: await getDoc()
                                                                        })
                                                                    let res = await getAttachmentSale(data.object._id)
                                                                    if(res)
                                                                        window.open(res, '_blank');
                                                                    else
                                                                        showSnackBar('Ошибка', 'error')
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
                                                ['admin', 'менеджер', 'менеджер/завсклад'].includes(profile.role)&&data.object.status==='обработка'?
                                                    <Button className={classes.rightBottomButton} color='secondary' onClick={()=>{
                                                        const action = async() => {
                                                            let element = {_id: router.query.id, status: 'отмена'}
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
                            </>
                            :
                            'Ничего не найдено'
                    }
                </CardContent>
            </Card>
        </App>
    )
})

Sale.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
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
    let _storeBalanceItems = await getStoreBalanceItems({...store.getState().app.filter.store?{store: store.getState().app.filter.store._id}:{}}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
    _storeBalanceItems = _storeBalanceItems?_storeBalanceItems:[]
    let storeBalanceItems = {}
    for(let i = 0; i <_storeBalanceItems.length; i++)
        storeBalanceItems[_storeBalanceItems[i].item._id] = _storeBalanceItems[i].free

    for(let i = 0; i <object.itemsSale.length; i++)
        storeBalanceItems[object.itemsSale[i].item] = checkFloat(storeBalanceItems[object.itemsSale[i].item] + object.itemsSale[i].count)

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

export default connect(mapStateToProps, mapDispatchToProps)(Sale);