import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import pageListStyle from '../src/styleMUI/list'
import basketStyleFile from '../src/styleMUI/basket'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {inputFloat, checkFloat} from '../src/lib';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import * as snackbarActions from '../src/redux/actions/snackbar'
import Router from 'next/router'
import { urlMain } from '../src/const'
import { getClientGqlSsr } from '../src/apollo'
import { forceCheck } from 'react-lazyload';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import initialApp from '../src/initialApp'
import { getItems } from '../src/gql/item'
import { cloneObject } from '../src/lib'
import { wrapper } from '../src/redux/configureStore'
import SetCharacteristics from '../components/dialog/SetCharacteristics'
import * as appActions from '../src/redux/actions/app'
import Buy from '../components/dialog/Buy'
import ShowReservationOrderSale from '../components/dialog/ShowReservationOrderSale'
import {getClients} from '../src/gql/client';
import AutocomplectOnline from '../components/app/AutocomplectOnline'
import AddClient from '../components/dialog/AddClient';
import ShowItemsCatalog from '../components/dialog/ShowItemsCatalog';
import { getOrders } from '../src/gql/order';
import { getReservations } from '../src/gql/reservation';
import { getInstallments } from '../src/gql/installment';

const Catalog = React.memo((props) => {
    const {classes} = pageListStyle();
    const basketStyle = basketStyleFile();
    //props
    const { setShowLightbox, setImagesLightbox, setIndexLightbox } = props.appActions;
    const { data } = props;
    const { search, filter, isMobileApp } = props.app;
    const { profile } = props.user;
    const { setMiniDialog, showMiniDialog, setFullDialog, showFullDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    //настройка
    const initialRender = useRef(true);
    let [client, setClient] = useState(null);
    let [orders, setOrders] = useState([]);
    let [reservations, setReservations] = useState([]);
    let [itemsReservations, setItemsReservations] = useState({});
    let [installmentsDebt, setInstallmentsDebt] = useState(0);
    //корзина
    const localStorageBasket = useRef(true);
    let [basket, setBasket] = useState({});
    let [amountStart, setAmountStart] = useState(0);
    let [allCount, setAllCount] = useState(0);
    useEffect(()=>{
        if(!initialRender.current) {
            amountStart = 0
            allCount = 0
            const keys = Object.keys(basket)
            for (let i = 0; i < keys.length; i++) {
                basket[keys[i]].priceKGSCount = checkFloat(basket[keys[i]].priceKGS * checkFloat(basket[keys[i]].count))
                basket[keys[i]].priceAfterDiscountKGSCount = checkFloat(basket[keys[i]].priceAfterDiscountKGS * checkFloat(basket[keys[i]].count))
                amountStart = checkFloat(amountStart + basket[keys[i]].priceAfterDiscountKGSCount)
                allCount = checkFloat(allCount + basket[keys[i]].count)
            }
            setAllCount(allCount)
            setAmountStart(amountStart)
            localStorage.basket = JSON.stringify(basket)
        }
    },[basket])
    useEffect(()=>{
        if(process.browser&&localStorage.basket&&localStorageBasket.current) {
            setBasket(JSON.parse(localStorage.basket))
            localStorageBasket.current = false
        }
    },[process.browser])
    //получение данных
    let [list, setList] = useState(data.list);
    const getList = async ()=>{
        setList(cloneObject(await getItems({
            search,
            catalog: data.type!=='order',
            ...filter.factory?{factory: filter.factory._id}:{},
            ...filter.category?{category: filter.category._id}:{},
            skip: 0
        })));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
    }
    //поиск/фильтр
    let searchTimeOut = useRef(null);
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current) await getList()
        })()
    },[filter])
    useEffect(()=>{
        (async()=>{
            if(initialRender.current)
                initialRender.current = false;
            else {
                if(searchTimeOut.current)
                    clearTimeout(searchTimeOut.current)
                searchTimeOut.current = setTimeout(async () => await getList(), 500)
            }
        })()
    },[search])
    //пагинация
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = cloneObject(await getItems({
                catalog: data.type!=='order',
                skip: list.length,
                search,
                ...filter.factory?{factory: filter.factory._id}:{},
                ...filter.category?{category: filter.category._id}:{}
            }))
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    //render
    return (
        <App filterShow={{factory: true, category: true}} checkPagination={checkPagination} searchShow={true} pageName='Каталог'>
            <Head>
                <title>Каталог</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content='Каталог' />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/catalog`} />
                <link rel='canonical' href={`${urlMain}/catalog`}/>
                <meta name='viewport' content='maximum-scale=1, minimum-scale=1, user-scalable=no, initial-scale=1, width=device-width, shrink-to-fit=no' />
            </Head>
            <Card className={classes.page} style={{margin: 0, width: '100%'}}>
                <CardContent className={classes.column} style={{maxWidth: 600, padding: 10}}>
                    <AutocomplectOnline
                        error={!client}
                        element={client}
                        setElement={async (client)=>{
                            if(data.type==='sale') {
                                if (client) {
                                    let installments = await getInstallments({
                                        store: profile.store,
                                        client: client._id,
                                        status: 'активна'
                                    })
                                    installmentsDebt = 0
                                    for(let i = 0; i <installments.length; i++) {
                                        installmentsDebt += installments[i].debt
                                    }
                                    setInstallmentsDebt(installmentsDebt)
                                    orders = await getOrders({
                                        store: profile.store,
                                        manager: profile._id,
                                        client: client._id,
                                        status: 'принят',
                                        items: true
                                    })
                                    setOrders(orders)
                                    reservations = await getReservations({
                                        store: profile.store,
                                        manager: profile._id,
                                        client: client._id,
                                        status: 'обработка',
                                        items: true
                                    })
                                    setReservations(reservations)
                                    for (let i = 0; i < reservations.length; i++) {
                                        for (let i1 = 0; i1 < reservations[i].itemsReservation.length; i1++) {
                                            if (!itemsReservations[reservations[i].itemsReservation[i1].item])
                                                itemsReservations[reservations[i].itemsReservation[i1].item] = 0
                                            itemsReservations[reservations[i].itemsReservation[i1].item] = checkFloat(itemsReservations[reservations[i].itemsReservation[i1].item] + reservations[i].itemsReservation[i1].count)
                                        }
                                    }
                                    setItemsReservations(itemsReservations)
                                }
                                else {
                                    setOrders([])
                                    setReservations([])
                                    setItemsReservations({})
                                    setInstallmentsDebt(0)
                                }
                            }
                            setClient(client)
                        }}
                        dialogAddElement={profile.add?(setElement, setInputValue, value)=>{return <AddClient setClient={setClient} value={value}/>}:null}
                        getElements={async (search)=>{
                            return await getClients({search})
                        }}
                        minLength={0}
                        label={'Клиент'}
                    />
                    {
                        orders.length||reservations.length?
                            <div className={classes.row} style={{height: 30, position: 'relative'}}>
                                {
                                    reservations.length?
                                        <div className={basketStyle.classes.info} style={{left: 5, position: 'absolute'}} onClick={()=>{
                                            if(isMobileApp) {
                                                setFullDialog('Бронь', <ShowReservationOrderSale list={reservations} type='reservation'/>)
                                                showFullDialog(true)
                                            }
                                            else {
                                                setMiniDialog('Бронь', <ShowReservationOrderSale list={reservations} type='reservation'/>)
                                                showMiniDialog(true)
                                            }
                                        }}>
                                            Бронь: {reservations.length}
                                        </div>
                                        :
                                        null
                                }
                                {
                                    orders.length?
                                        <div className={basketStyle.classes.info} style={{right: 5, position: 'absolute'}} onClick={()=>{
                                            if(isMobileApp) {
                                                setFullDialog('На заказ', <ShowReservationOrderSale list={orders} type='order'/>)
                                                showFullDialog(true)
                                            }
                                            else {
                                                setMiniDialog('На заказ', <ShowReservationOrderSale list={orders} type='order'/>)
                                                showMiniDialog(true)
                                            }
                                        }}>
                                            На заказ: {orders.length}
                                        </div>
                                        :
                                        null
                                }
                            </div>
                            :
                            null
                    }
                    <Divider/>
                    <div className={basketStyle.classes.list}>
                        {
                            list.map((element, idx) =>
                                <div key={element._id}>
                                    <div className={classes.rowTop}>
                                        <img className={basketStyle.classes.media} src={element.images[0]} onClick={()=>{
                                            setShowLightbox(true)
                                            setImagesLightbox(element.images)
                                            setIndexLightbox(0)
                                        }}/>
                                        <div className={classes.column} style={{width: 'calc(100% - 110px)'}}>
                                            <div className={basketStyle.classes.name}>
                                                <span className={basketStyle.classes.discount}>
                                                    {element.discount!==0?`-${element.discount}${element.typeDiscount}`:''}
                                                </span>
                                                &nbsp;
                                                {element.name}
                                            </div>
                                            <div className={classes.row} style={{marginBottom: 10}}>
                                                {
                                                    element.discount?
                                                        <>
                                                        <strike className={basketStyle.classes.priceBeforeDiscount}>
                                                            {basket[element._id]&&basket[element._id].priceKGSCount?basket[element._id].priceKGSCount:element.priceKGS}
                                                        </strike>
                                                        &nbsp;
                                                        </>
                                                        :
                                                        null
                                                }
                                                <div className={basketStyle.classes.price}>
                                                    {`${basket[element._id]&&basket[element._id].priceAfterDiscountKGSCount?basket[element._id].priceAfterDiscountKGSCount:element.priceAfterDiscountKGS} сом`}
                                                </div>
                                            </div>
                                            <div className={basketStyle.classes.counter}>
                                                <div className={basketStyle.classes.counterbtn} onClick={() => {
                                                    if(basket[element._id]) {
                                                        basket[element._id].count = checkFloat(checkFloat(basket[element._id].count) - 1)
                                                        if (basket[element._id].count === 0)
                                                            delete basket[element._id]
                                                        setBasket({...basket})
                                                    }
                                                }}>–
                                                </div>
                                                <input type={isMobileApp?'number':'text'} className={basketStyle.classes.counternmbr}
                                                       value={basket[element._id]?basket[element._id].count:''} onChange={(event) => {
                                                    if(!basket[element._id])
                                                        basket[element._id] = {
                                                            ...element,
                                                            priceKGSCount: 0,
                                                            priceAfterDiscountKGSCount: 0,
                                                            count: 0
                                                        }
                                                    basket[element._id].count = inputFloat(event.target.value)
                                                    setBasket({...basket})
                                                }}/>
                                                <div className={basketStyle.classes.counterbtn} onClick={() => {
                                                    if(!basket[element._id])
                                                        basket[element._id] = {
                                                            ...element,
                                                            priceKGSCount: 0,
                                                            priceAfterDiscountKGSCount: 0,
                                                            count: 0
                                                        }
                                                    let newCount = checkFloat(checkFloat(basket[element._id].count) + 1)
                                                    if(newCount<=(element.free+(itemsReservations[element._id]?itemsReservations[element._id]:0))||data.type==='order') {
                                                        basket[element._id].count = newCount
                                                        setBasket({...basket})
                                                    }
                                                }}>+
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classes.row} style={{marginTop: 10, height: element.showCharacteristics?30:itemsReservations[element._id]?50:40, position: 'relative'}}>
                                        {
                                            data.type!=='order'?
                                                <div className={basketStyle.classes.info} style={{...basket[element._id]&&basket[element._id].count>(element.free+(itemsReservations[element._id]?itemsReservations[element._id]:0))?{color: 'red'}:{}, right: 5, position: 'absolute'}}>
                                                    {
                                                        itemsReservations[element._id]?
                                                            <>
                                                            <span style={{color: 'orange'}}>
                                                                Бронь: {itemsReservations[element._id]} {element.unit}
                                                            </span>
                                                            <br/>
                                                            </>
                                                            :
                                                            null
                                                    }
                                                    Остаток: {element.free} {element.unit}
                                                      </div>
                                                :
                                                null
                                        }
                                        <div className={basketStyle.classes.info} style={{left: 5, position: 'absolute'}} onClick={()=>{
                                            list[idx].showCharacteristics = !list[idx].showCharacteristics
                                            setList([...list])
                                        }}>
                                            {element.showCharacteristics?'🔼':'🔽'}Характеристики: {basket[element._id]?basket[element._id].characteristics.length:element.characteristics.length}
                                        </div>
                                    </div>
                                    {
                                        element.showCharacteristics?
                                            <>
                                            {
                                                (basket[element._id]?basket[element._id].characteristics:element.characteristics).map((characteristic) => <div className={classes.row}>
                                                    <div className={basketStyle.classes.characteristic}>
                                                        {characteristic[0]}:&nbsp;{characteristic[1]}
                                                    </div>
                                                </div>)
                                            }
                                            <div className={basketStyle.classes.addCharacteristic} onClick={()=>{
                                                if(basket[element._id]) {
                                                    if(isMobileApp) {
                                                        setFullDialog('Характеристики', <SetCharacteristics
                                                            _id={element._id} setBasket={setBasket} basket={basket}
                                                            characteristics={basket[element._id].characteristics}/>)
                                                        showFullDialog(true)
                                                    }
                                                    else {
                                                        setMiniDialog('Характеристики', <SetCharacteristics
                                                            _id={element._id} setBasket={setBasket} basket={basket}
                                                            characteristics={basket[element._id].characteristics}/>)
                                                        showMiniDialog(true)
                                                    }
                                                }
                                            }}>
                                                Добавить характеристику
                                            </div>
                                            </>
                                            :
                                            null
                                    }
                                    <Divider/>
                                    <br/>
                                </div>
                            )
                        }
                    </div>
                </CardContent>
            </Card>
            <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD} style={{justifyContent: 'center', alignItems: 'center'}}>
                <div className={basketStyle.classes.buyDiv}>
                    <div style={{cursor: 'pointer'}} onClick={()=>{
                        let list = Object.values(basket)
                        if(list.length) {
                            if (isMobileApp) {
                                setFullDialog('Позиции', <ShowItemsCatalog list={list}/>)
                                showFullDialog(true)
                            }
                            else {
                                setMiniDialog('Позиции', <ShowItemsCatalog list={list}/>)
                                showMiniDialog(true)
                            }
                        }
                    }}>
                        <div className={classes.value} style={{marginBottom: 0, marginLeft: 0}}>Позиции: {Object.values(basket).length}</div>
                        <div className={basketStyle.classes.allPrice}>{amountStart} сом</div>
                    </div>
                    <Button color='primary' variant='contained' className={basketStyle.classes.buy} onClick={async ()=>{
                        if(client) {
                            if(allCount>0) {
                                let items = []
                                const keys = Object.keys(basket)
                                for (let i = 0; i < keys.length; i++) {
                                    items.push({
                                        unit: basket[keys[i]].unit,
                                        item: basket[keys[i]]._id,
                                        name: basket[keys[i]].name,
                                        count: checkFloat(basket[keys[i]].count),
                                        price: checkFloat(basket[keys[i]].priceAfterDiscountKGS),
                                        amount: checkFloat(basket[keys[i]].priceAfterDiscountKGSCount),
                                        characteristics: basket[keys[i]].characteristics,
                                        status: 'обработка'
                                    })
                                }
                                let prepaid = 0, _reservations = [], _orders = []
                                for(let i = 0; i <reservations.length; i++) {
                                    prepaid = checkFloat(prepaid + reservations[i].paid)
                                    _reservations[i] = reservations[i]._id
                                }
                                for(let i = 0; i <orders.length; i++) {
                                    prepaid = checkFloat(prepaid + orders[i].paid)
                                    _orders[i] = orders[i]._id
                                }

                                setMiniDialog('Оформление', <Buy client={client} installmentsDebt={installmentsDebt} items={items} type={data.type} prepaid={prepaid}
                                                                 amountStart={amountStart} orders={_orders} reservations={_reservations}/>)
                                showMiniDialog(true)
                            }
                            else
                                showSnackBar('Добавьте товар в корзину')
                        }
                        else
                            showSnackBar('Укажите клиента')
                    }}>
                        Продолжить
                    </Button>
                </div>
            </div>
        </App>
    )
})

Catalog.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if('менеджер'!==store.getState().user.profile.role)
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    return {
        data: {
            type: ctx.query.type,
            list: cloneObject(await getItems({
                skip: 0,
                catalog: ctx.query.type!=='order'
            },  ctx.req?await getClientGqlSsr(ctx.req):undefined))
        }
    }
})

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        appActions: bindActionCreators(appActions, dispatch),
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Catalog);