import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import * as appActions from '../../src/redux/actions/app'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import Button from '@mui/material/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import { checkFloat, inputFloat, inputInt } from '../../src/lib';
import { getCpas } from '../../src/gql/cpa';
import { addOrder } from '../../src/gql/order';
import { addReservation } from '../../src/gql/reservation';
import { addInstallment } from '../../src/gql/installment';
import { addSale } from '../../src/gql/sale';
import { addRefund } from '../../src/gql/refund';
import TextField from '@mui/material/TextField';
import Router from 'next/router'
import AutocomplectOnline from '../../components/app/AutocomplectOnline'
import dynamic from 'next/dynamic'
import {endConsultation} from '../../src/gql/consultation'
const Geo = dynamic(import('./Geo'), { ssr: false });

const currencies = ['сом', 'доллар', 'рубль', 'тенге', 'юань']

const BuyBasket =  React.memo(
    (props) =>{
        const { amountStart, type, items, client, orders, reservations, prepaid, installmentsDebt, _currency, sale, _discount } = props;
        const { profile } = props.user;
        const { isMobileApp } = props.app;
        const { classes } = dialogContentStyle();
        const { showMiniDialog, showFullDialog, setFullDialog } = props.mini_dialogActions;
        const { showLoad } = props.appActions;
        const { showSnackBar } = props.snackbarActions;
        const width = isMobileApp? (window.innerWidth-113) : 500
        let [currency, setCurrency] = useState(_currency?_currency:'сом');
        let [typePayment, setTypePayment] = useState('Наличными');
        let [renew, setRenew] = useState(false);
        let [paid, setPaid] = useState(prepaid?amountStart-prepaid:amountStart);
        let [date, setDate] = useState();
        let [geo, setGeo] = useState(client.geo);
        let [cpa, setCpa] = useState();
        let [monthInstallment, setMonthInstallment] = useState('');
        let [paidInstallment, setPaidInstallment] = useState('');
        let [percentCpa, setPercentCpa] = useState(0);
        let [address, setAddress] = useState(client.address);
        let [addressInfo, setAddressInfo] = useState('');
        let [comment, setComment] = useState('');
        let [commentShow, setCommentShow] = useState(false);
        let [discount, setDiscount] = useState(_discount?_discount:'');
        let [discountType, setDiscountType] = useState(_discount?'%':'сом');
        let [amountEnd, setAmountEnd] = useState(amountStart);
        useEffect(() => {
            amountEnd = checkFloat(amountStart - (discountType==='%'?amountStart/100*discount:discount))
            if(amountEnd<0)
                amountEnd = 0
            setAmountEnd(amountEnd)
            setPaid(prepaid?amountEnd-prepaid:amountEnd)
        }, [typePayment, discount, discountType]);
        useEffect(() => {
            monthInstallment = checkFloat(monthInstallment)
            if(monthInstallment)
                paidInstallment = checkFloat((amountEnd+(renew?installmentsDebt:0)-checkFloat(paid)-checkFloat(prepaid)) / monthInstallment)
            else
                paidInstallment = 0
            setPaidInstallment(paidInstallment)
        }, [paid, amountEnd, monthInstallment, renew]);
        return (
            <div className={classes.main} style={{width}}>
                {
                    ['sale', 'refund'].includes(type)?
                        <div className={classes.row}>
                            <div className={classes.nameField} style={{fontSize: '1.0625rem'}}>{type==='sale'?'Скидка':'Уценка'}:&nbsp;&nbsp;&nbsp;&nbsp;</div>
                            <div className={classes.counter}>
                                <div className={classes.counterbtn} onClick={() => {
                                    if(discount>0) {
                                        discount = checkFloat(discount - 1)
                                        setDiscount(discount)
                                    }
                                }}>–</div>
                                <input
                                    type={isMobileApp?'number':'text'}
                                    className={classes.counternmbr}
                                    value={discount}
                                    onChange={(event) => {
                                        discount = inputFloat(event.target.value)
                                        setDiscount(discount)
                                    }}
                                    onFocus={()=>{
                                        discount = inputFloat('')
                                        setDiscount(discount)
                                    }}
                                />
                                <div className={classes.counterbtn} onClick={() => {
                                    discount = checkFloat(checkFloat(discount) + 1)
                                    setDiscount(discount)
                                }}>+
                                </div>
                            </div>
                            <div className={classes.typeShow} onClick={()=>{
                                discountType = discountType==='%'?'сом':'%'
                                setDiscountType(discountType)
                            }}>
                                {discountType}
                            </div>
                        </div>
                        :
                        null
                }
                <div className={classes.row}>
                    <div className={classes.nameField} style={{fontSize: '1.0625rem'}}>Итого:&nbsp;</div>
                    <div className={classes.value} style={{fontSize: '1.0625rem'}}>{`${amountEnd} сом`}</div>
                </div>
                {
                    prepaid?
                        <>
                        <div className={classes.row}>
                            <div className={classes.nameField} style={{fontSize: '1.0625rem'}}>Предоплата:&nbsp;</div>
                            <div className={classes.value} style={{fontSize: '1.0625rem'}}>{`${prepaid} сом`}</div>
                        </div>
                        <div className={classes.row}>
                            <div className={classes.nameField} style={{fontSize: '1.0625rem'}}>К оплате:&nbsp;</div>
                            <div className={classes.value} style={{fontSize: '1.0625rem'}}>{`${checkFloat(amountEnd-prepaid)} сом`}</div>
                        </div>
                        </>
                        :
                        null
                }
                {
                    type!=='refund'?
                        <>
                        <div className={classes.row}>
                            <center className={classes.input}>
                                <Button size='small' onClick={() => {setTypePayment('Наличными')}} style={{color: typePayment!=='Наличными'?'#A0A0A0':'#10183D'}}>
                                    Наличными
                                </Button>
                            </center>
                            <center className={classes.input}>
                                <Button size='small' onClick={() => {setTypePayment('Безналичный')}} style={{color: typePayment!=='Безналичный'?'#A0A0A0':'#10183D'}}>
                                    Безналичный
                                </Button>
                            </center>
                        </div>
                        <div className={classes.row}>
                            <div className={classes.nameField} style={{fontSize: '1.0625rem'}}>Оплата:&nbsp;</div>
                            <div className={classes.counter} style={{fontSize: '1.0625rem'}}>
                                <div className={classes.counterbtn} onClick={() => {
                                    paid = checkFloat(paid - 5)
                                    if(paid>0)
                                        setPaid(paid)
                                    else
                                        setPaid(0)
                                }}>–</div>
                                <input
                                    type={isMobileApp?'number':'text'}
                                    className={classes.counternmbr}
                                    value={paid}
                                    onChange={(event) => {
                                        paid = inputFloat(event.target.value)
                                        if(paid>amountEnd)
                                            paid = amountEnd
                                        setPaid(paid)
                                    }}
                                    onFocus={()=>{
                                        paid = inputFloat('')
                                        setPaid(paid)
                                    }}
                                />
                                <div className={classes.counterbtn} onClick={() => {
                                    paid = checkFloat(checkFloat(paid) + 5)
                                    if(paid>amountEnd)
                                        paid = amountEnd
                                    setPaid(paid)
                                }}>+
                                </div>
                            </div>
                            <div className={classes.typeShow}>
                                сом
                            </div>
                        </div>
                        </>
                        :
                        null
                }
                {
                    type==='sale'&&(checkFloat(paid)+prepaid)<amountEnd?
                        <>
                        <div className={classes.row}>
                            <center className={classes.input}>
                                <Button size='small' onClick={() => {setRenew(false)}} style={{color: !renew?'#10183D':'#A0A0A0'}}>
                                    Новая рассрочка
                                </Button>
                            </center>
                            {
                                installmentsDebt?
                                    <center className={classes.input}>
                                        <Button size='small' onClick={() => {setRenew(true)}} style={{color: renew?'#10183D':'#A0A0A0'}}>
                                            Объединить рассрочки<br/>({installmentsDebt} сом)
                                        </Button>
                                    </center>
                                    :
                                    null
                            }
                        </div>
                        <div className={classes.row}>
                            <TextField
                                id='monthInstallment'
                                error={!monthInstallment}
                                variant='standard'
                                type={isMobileApp?'number':'text'}
                                label='Месяцы'
                                value={monthInstallment}
                                onChange={(event) => setMonthInstallment(inputInt(event.target.value))}
                                className={classes.input}
                                style={{marginRight: 10}}
                            />
                            <TextField
                                id='paidInstallment'
                                error={!paidInstallment}
                                variant='standard'
                                label='Месячный платеж'
                                value={paidInstallment}
                                className={classes.input}
                                inputProps={{
                                    'aria-placeholder': 'description',
                                    readOnly: true,
                                }}
                            />
                        </div>
                        </>
                        :
                        null
                }
                {
                    ['reservation', 'sale'].includes(type)?
                        <TextField
                            id='date'
                            error={!date}
                            type='date'
                            variant='standard'
                            label={type==='sale'?'Доставка':'Срок'}
                            value={date}
                            onChange={(event) => setDate(event.target.value)}
                            className={classes.input}
                        />
                        :
                        null
                }
                {
                    type==='sale'?
                        <>
                        <TextField
                            id='address'
                            error={!address}
                            variant='standard'
                            label='Адрес'
                            value={address}
                            onChange={(event) => setAddress(event.target.value)}
                            className={classes.input}
                        />
                        <div className={classes.geo} style={{color: geo?'#183B37':'red'}} onClick={()=>{
                            setFullDialog('Геолокация', <Geo geo={geo} setAddressGeo={setGeo}/>)
                            showFullDialog(true)
                        }}>
                            {
                                geo?
                                    'Изменить геолокацию'
                                    :
                                    'Задайте геолокацию'
                            }
                        </div>
                        <TextField
                            id='addressInfo'
                            variant='standard'
                            label='Этаж, квартира, лифт, код к подъезду'
                            value={addressInfo}
                            onChange={(event) => setAddressInfo(event.target.value)}
                            className={classes.input}
                        />
                        <AutocomplectOnline
                            element={cpa}
                            setElement={async (cpa)=>{
                                if(cpa)
                                    setPercentCpa(cpa.percent)
                                else
                                    setPercentCpa(0)
                                setCpa(cpa)
                            }}
                            getElements={async (search)=>{
                                return await getCpas({search})
                            }}
                            minLength={0}
                            label={'Партнер'}
                        />
                        <TextField
                            id='percentCpa'
                            variant='standard'
                            label='Процент партнера'
                            value={percentCpa}
                            onChange={(event) => setPercentCpa(inputFloat(event.target.value))}
                            className={classes.input}
                        />
                        </>
                        :
                        null
                }
                {
                    commentShow?
                        <TextField
                            id='comment'
                            variant='standard'
                            label='Комментарий (не обязательно)'
                            className={classes.input}
                            margin='normal'
                            value={comment}
                            onChange={(event)=>{setComment(event.target.value)}}
                        />
                        :
                        <center>
                            <Button color='primary' onClick={()=>{setCommentShow(true);}} className={classes.button}>
                                Добавить комментарий
                            </Button>
                        </center>
                }
                <br/>
                <div>
                    <Button variant='contained' color='primary' onClick={async()=>{
                        if(paid>=0) {
                            if (!['reservation', 'sale'].includes(type) || date) {
                                showLoad(true)
                                let res
                                if (type === 'order')
                                    res = await addOrder({
                                        client: client._id,
                                        itemsOrder: items,
                                        amount: checkFloat(amountEnd),
                                        paid: checkFloat(paid),
                                        typePayment,
                                        comment,
                                        currency
                                    })
                                else if (type === 'reservation')
                                    res = await addReservation({
                                        client: client._id,
                                        term: date,
                                        itemsReservation: items,
                                        amount: checkFloat(amountEnd),
                                        paid: checkFloat(paid),
                                        typePayment,
                                        comment,
                                        currency
                                    })
                                else if (type === 'refund')
                                    res = await addRefund({
                                        client: client._id,
                                        discount: checkFloat(amountStart - amountEnd),
                                        itemsRefund: items,
                                        amount: checkFloat(amountEnd),
                                        comment,
                                        currency,
                                        sale
                                    })
                                else if (type === 'sale') {
                                    paidInstallment = checkFloat(paidInstallment)
                                    monthInstallment = checkFloat(monthInstallment)
                                    paid = checkFloat(paid)
                                    amountEnd = checkFloat(amountEnd)
                                    if ((paid + prepaid) >= amountEnd || (paidInstallment && monthInstallment)) {
                                        res = await addSale({
                                            geo,
                                            client: client._id,
                                            itemsSale: items,
                                            discount: checkFloat(amountStart - amountEnd),
                                            cpa: cpa ? cpa._id : null,
                                            percentCpa: checkFloat(percentCpa),
                                            amountStart: checkFloat(amountStart),
                                            amountEnd,
                                            typePayment,
                                            address,
                                            addressInfo,
                                            comment,
                                            currency,
                                            paid: checkFloat(paid),
                                            prepaid,
                                            delivery: date,
                                            orders: orders,
                                            reservations: reservations
                                        })
                                        if ((paid + prepaid) < amountEnd && res && res !== 'ERROR') {
                                            const grid = []
                                            let month = new Date()
                                            grid.push({
                                                month: new Date(month),
                                                amount: paid,
                                                paid: 0,
                                                datePaid: month
                                            })
                                            month.setMonth(month.getMonth() + 1)
                                            for (let i = 0; i < monthInstallment; i++) {
                                                grid.push({
                                                    month: new Date(month),
                                                    paid: 0,
                                                    amount: paidInstallment
                                                })
                                                month.setMonth(month.getMonth() + 1)
                                            }

                                            let _res = await addInstallment({
                                                renew,
                                                grid,
                                                debt: checkFloat(amountEnd + (renew ? installmentsDebt : 0) - checkFloat(prepaid)),
                                                client: client._id,
                                                amount: amountEnd + (renew ? installmentsDebt : 0) - checkFloat(prepaid),
                                                paid: 0,
                                                sale: res,
                                                datePaid: grid[1].month,
                                                store: profile.store,
                                                currency
                                            })
                                            if (!_res || _res._id === 'ERROR')
                                                showSnackBar('Ошибка', 'error')
                                        }
                                    }
                                    else
                                        showSnackBar('Укажите рассрочку')
                                }
                                if (res && res !== 'ERROR') {
                                    localStorage.basket = JSON.stringify({})
                                    await endConsultation({})
                                    showSnackBar('Успешно', 'success')
                                    Router.push(`/${type}/${res}`)
                                }
                                else
                                    showSnackBar('Ошибка', 'error')
                                showLoad(false)
                            }
                            else
                                showSnackBar('Укажите дату')
                        }
                        else
                            showSnackBar('Укажите оплату')
                    }} className={classes.button}>
                        Оформить
                    </Button>
                    <Button variant='contained' color='secondary' onClick={()=>{
                        showMiniDialog(false);
                    }} className={classes.button}>
                        Закрыть
                    </Button>
                </div>
            </div>
        );
    }
)

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
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BuyBasket)