import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import pageListStyle from '../../src/styleMUI/list'
import basketStyleFile from '../../src/styleMUI/basket'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {inputFloat, checkFloat} from '../../src/lib';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import Router from 'next/router'
import { urlMain } from '../../src/const'
import { getClientGqlSsr } from '../../src/apollo'
import { forceCheck } from 'react-lazyload';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import initialApp from '../../src/initialApp'
import { getItems } from '../../src/gql/item'
import { cloneObject } from '../../src/lib'
import { wrapper } from '../../src/redux/configureStore'
import SetCharacteristics from '../../components/dialog/SetCharacteristics'
import * as appActions from '../../src/redux/actions/app'
import Buy from '../../components/dialog/Buy'
import ShowReservationOrderSale from '../../components/dialog/ShowReservationOrderSale'
import {getClients} from '../../src/gql/client';
import AutocomplectOnline from '../../components/app/AutocomplectOnline'
import AddClient from '../../components/dialog/AddClient';
import ShowItemsCatalog from '../../components/dialog/ShowItemsCatalog';
import { getSales } from '../../src/gql/sale';
import { getReservations } from '../../src/gql/reservation';
import { getInstallments } from '../../src/gql/installment';

const Catalog = React.memo((props) => {
    const {classes} = pageListStyle();
    const basketStyle = basketStyleFile();
    //props
    const { setShowLightbox, setImagesLightbox, setIndexLightbox } = props.appActions;
    const { data } = props;
    const {  profile } = props.user;
    const {  isMobileApp } = props.app;
    const { setMiniDialog, showMiniDialog, setFullDialog, showFullDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    //настройка
    const initialRender = useRef(true);
    let [client, setClient] = useState(null);
    let [sale, setSale] = useState(null);
    let [currency, setCurrency] = useState('сом');
    //корзина
    let [basket, setBasket] = useState({});
    let [amountStart, setAmountStart] = useState(0);
    let [allCount, setAllCount] = useState(0);
    useEffect(()=>{
        if(!initialRender.current) {
            amountStart = 0
            allCount = 0
            const keys = Object.keys(basket)
            for (let i = 0; i < keys.length; i++) {
                basket[keys[i]].amount = checkFloat(basket[keys[i]].price * checkFloat(basket[keys[i]].count))
                amountStart = checkFloat(amountStart + basket[keys[i]].amount)
                allCount = checkFloat(allCount + basket[keys[i]].count)
            }
            setAllCount(allCount)
            setAmountStart(amountStart)
        }
        else
            initialRender.current = false
    },[basket])
    //render
    return (
        <App pageName='Каталог'>
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
                        setElement={client=>{
                            setClient(client)
                            setSale(null)
                            setBasket({})
                        }}
                        getElements={async (search)=>{
                            return await getClients({search})
                        }}
                        minLength={0}
                        label={'Клиент'}
                    />
                    {
                        client?
                            <AutocomplectOnline
                                error={!sale}
                                element={sale}
                                setElement={sale=>{
                                    setSale(sale)
                                    setBasket({})
                                    setCurrency(sale?sale.currency:'сом')
                                }}
                                getElements={async (search)=>{
                                    return await getSales({
                                        store: profile.store,
                                        items: true,
                                        search,
                                        client: client._id,
                                        status: 'доставлен'
                                    })
                                }}
                                minLength={0}
                                label={'Продажа'}
                            />
                            :
                            null
                    }
                    <Divider/>
                    <div className={basketStyle.classes.list} style={{height: 'calc(100vh - 220px)'}}>
                        {
                            sale?sale.itemsSale.map((element) =>
                                <div key={element.item}>
                                    <div className={classes.rowTop}>
                                        <img className={basketStyle.classes.media} src={element.images[0]} onClick={()=>{
                                            setShowLightbox(true)
                                            setImagesLightbox(element.images)
                                            setIndexLightbox(0)
                                        }}/>
                                        <div className={classes.column} style={{width: 'calc(100% - 110px)'}}>
                                            <div className={basketStyle.classes.name}>
                                                {element.name}
                                            </div>
                                            <div className={classes.row} style={{marginBottom: 10}}>
                                                <div className={basketStyle.classes.price}>
                                                    {`${basket[element.item]&&basket[element.item].amount?basket[element.item].amount:element.price} сом`}
                                                </div>
                                            </div>
                                            <div className={basketStyle.classes.counter}>
                                                <div className={basketStyle.classes.counterbtn} onClick={() => {
                                                    if(basket[element.item]) {
                                                        basket[element.item].count = checkFloat(checkFloat(basket[element.item].count) - 1)
                                                        if (basket[element.item].count === 0)
                                                            delete basket[element.item]
                                                        setBasket({...basket})
                                                    }
                                                }}>–
                                                </div>
                                                <input type={isMobileApp?'number':'text'} className={basketStyle.classes.counternmbr}
                                                       value={basket[element.item]?basket[element.item].count:''} onChange={(event) => {
                                                    if(!basket[element.item])
                                                        basket[element.item] = {
                                                            ...element,
                                                            amount: 0,
                                                            count: 0
                                                        }
                                                    basket[element.item].count = inputFloat(event.target.value)
                                                    setBasket({...basket})
                                                }}/>
                                                <div className={basketStyle.classes.counterbtn} onClick={() => {
                                                    if(!basket[element.item])
                                                        basket[element.item] = {
                                                            ...element,
                                                            amount: 0,
                                                            count: 0
                                                        }
                                                    let newCount = checkFloat(checkFloat(basket[element.item].count) + 1)
                                                    if(newCount<=element.count) {
                                                        basket[element.item].count = newCount
                                                        setBasket({...basket})
                                                    }
                                                }}>+
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classes.row} style={{marginTop: 10, height: 40, position: 'relative'}}>
                                        <div className={basketStyle.classes.info} style={{...basket[element.item]&&basket[element.item].count>element.count?{color: 'red'}:{}, right: 5, position: 'absolute'}}>
                                            Доступно: {element.count} {element.unit}
                                        </div>
                                    </div>
                                    <Divider/>
                                    <br/>
                                </div>
                            ):null
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
                                        item: basket[keys[i]].item,
                                        name: basket[keys[i]].name,
                                        count: checkFloat(basket[keys[i]].count),
                                        price: basket[keys[i]].price,
                                        amount: basket[keys[i]].amount,
                                        characteristics: basket[keys[i]].characteristics,
                                        status: 'обработка'
                                    })
                                }

                                setMiniDialog('Оформление', <Buy _discount={sale.discount} client={client} sale={sale._id} _currency={currency} items={items} type={'refund'}
                                                                 amountStart={amountStart}/>)
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
        data: {}
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