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
import { getPromotions } from '../../src/gql/promotion';
import { addReservation } from '../../src/gql/reservation';
import { addInstallment } from '../../src/gql/installment';
import { addSale } from '../../src/gql/sale';
import { addRefund } from '../../src/gql/refund';
import TextField from '@mui/material/TextField';
import Router from 'next/router'
import AutocomplectOnline from '../../components/app/AutocomplectOnline'
import dynamic from 'next/dynamic'
import {endConsultation} from '../../src/gql/consultation'
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
const Geo = dynamic(import('./Geo'), { ssr: false });
import {setConsultation} from '../../src/gql/consultation'

const currencies = ['сом', 'доллар', 'рубль', 'тенге', 'юань']

const BuyBasket =  React.memo(
    (props) =>{
        const { amountStart, type, items, client, reservations, prepaid, installmentsDebt, _currency, sale, _discount } = props;
        const { profile } = props.user;
        const { isMobileApp, consultation } = props.app;
        const { classes } = dialogContentStyle();
        const { showMiniDialog, showFullDialog, setFullDialog } = props.mini_dialogActions;
        const { showLoad } = props.appActions;
        const { showSnackBar } = props.snackbarActions;
        const width = isMobileApp? (window.innerWidth-113) : 500
        let [currency, setCurrency] = useState(_currency?_currency:'сом');
        let [typePayment, setTypePayment] = useState('Наличными');
        let [renew, setRenew] = useState(false);
        let [paid, setPaid] = useState(type==='reservation'?0:prepaid?amountStart-prepaid:amountStart);
        let [date, setDate] = useState();
        let [geo, setGeo] = useState(client.geo);
        let [cpa, setCpa] = useState();
        let [selfDelivery, setSelfDelivery] = useState(false);
        let [promotion, setPromotion] = useState();
        let [remainder, setRemainder] = useState(0);
        let [monthInstallment, setMonthInstallment] = useState('');
        let [paidInstallment, setPaidInstallment] = useState('');
        let [address, setAddress] = useState(client.address);
        let [addressInfo, setAddressInfo] = useState('');
        let [comment, setComment] = useState('');
        let [commentShow, setCommentShow] = useState(false);
        let [discount, setDiscount] = useState(_discount?_discount:'');
        let [discountType, setDiscountType] = useState('%');
        let [amountEnd, setAmountEnd] = useState(amountStart);
        useEffect(() => {
            amountEnd = checkFloat(amountStart - (discountType==='%'?amountStart/100*discount:discount))
            if(amountEnd<0)
                amountEnd = 0
            setAmountEnd(amountEnd)
            if(type!=='reservation') {
                paid = amountEnd - checkFloat(prepaid)
                setPaid(paid)
            }
        }, [typePayment, discount, discountType]);
        useEffect(() => {
            monthInstallment = checkFloat(monthInstallment)
            remainder = 0
            if(monthInstallment) {
                let allAmount = amountEnd+(renew?installmentsDebt:0)-checkFloat(paid)-checkFloat(prepaid)
                paidInstallment = checkFloat(allAmount / monthInstallment)
                remainder = paidInstallment % (paidInstallment>=100?100:1)
                remainder = Math.round(remainder * monthInstallment)
                if (remainder) {
                    allAmount -= remainder
                    paidInstallment = checkFloat(allAmount / monthInstallment)
                }
            }
            else
                paidInstallment = 0
            setRemainder(remainder)
            setPaidInstallment(paidInstallment)
        }, [paid, amountEnd, monthInstallment, renew]);
        return (
            <div className={classes.main} style={{width}}>
                {
                    ['sale', 'refund', 'order'].includes(type)?
                        <div className={classes.row}>
                            <div className={classes.nameField} style={{fontSize: '1.0625rem'}}>{type==='refund'?'Уценка':'Скидка'}:&nbsp;&nbsp;&nbsp;&nbsp;</div>
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
                                        if(discountType==='%'&&discount>100)
                                            discount = 100
                                        else if(discountType!=='%'&&discount>amountStart)
                                            discount = amountStart
                                        setDiscount(discount)
                                    }}
                                    onFocus={()=>{
                                        discount = inputFloat('')
                                        setDiscount(discount)
                                    }}
                                />
                                <div className={classes.counterbtn} onClick={() => {
                                    discount = checkFloat(checkFloat(discount) + 1)
                                    if(discountType==='%'&&discount>100)
                                        discount = 100
                                    else if(discountType!=='%'&&discount>amountStart)
                                        discount = amountStart
                                    setDiscount(discount)
                                }}>+
                                </div>
                            </div>
                            <div className={classes.typeShow} onClick={()=>{
                                if(discountType==='%')
                                    discount = checkFloat(discount*amountStart/100)
                                else
                                    discount = checkFloat(discount*100/amountStart)
                                setDiscount(discount)
                                setDiscountType(discountType==='%'?'сом':'%')
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
                            <div className={classes.value} style={{fontSize: '1.0625rem'}}>{`${(amountEnd-prepaid)<0?0:checkFloat(amountEnd-prepaid)} сом`}</div>
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
                                        if(paid>(amountEnd-prepaid)) {
                                            paid = amountEnd-prepaid
                                        }
                                        setPaid(paid)
                                    }}
                                    onFocus={()=>{
                                        paid = inputFloat('')
                                        setPaid(paid)
                                    }}
                                />
                                <div className={classes.counterbtn} onClick={() => {
                                    paid = checkFloat(checkFloat(paid) + 5)
                                    if(paid>(amountEnd-prepaid)) {
                                        paid = amountEnd-prepaid
                                    }
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
                    ['order', 'sale'].includes(type)&&(checkFloat(paid)+prepaid)<amountEnd?
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
                                style={{marginRight: remainder?10:0}}
                                inputProps={{
                                    'aria-placeholder': 'description',
                                    readOnly: true,
                                }}
                            />
                            {
                                remainder?
                                    <TextField
                                        variant='standard'
                                        label='Последний платеж'
                                        value={paidInstallment+remainder}
                                        className={classes.input}
                                        inputProps={{
                                            'aria-placeholder': 'description',
                                            readOnly: true,
                                        }}
                                    />
                                    :
                                    null
                            }
                        </div>
                        </>
                        :
                        null
                }
                {
                    ['order', 'reservation', 'sale'].includes(type)?
                        <div className={isMobileApp?classes.column:classes.row}>
                            <TextField
                                id='date'
                                error={!date&&type==='reservation'}
                                type={type==='reservation'?'date':'datetime-local'}
                                variant='standard'
                                label={type==='reservation'?'Срок':'Доставка'}
                                value={date}
                                style={{marginRight: type==='reservation'?0:20}}
                                onChange={(event) => setDate(event.target.value)}
                                className={classes.input}
                            />
                            {
                                ['order', 'sale'].includes(type)?
                                    <FormControlLabel control={<Checkbox checked={selfDelivery} onChange={(event) => setSelfDelivery(event.target.checked)}/>} label='Самовывоз' />
                                    :
                                    null
                            }
                        </div>
                        :
                        null
                }
                {
                    ['order', 'sale'].includes(type)?
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
                            value={addressInfo}
                            onChange={(event) => setAddressInfo(event.target.value)}
                            className={classes.input}
                        />
                        {
                            type==='sale'?
                                <AutocomplectOnline
                                    element={promotion}
                                    setElement={async (promotion)=>{
                                        setPromotion(promotion)
                                    }}
                                    getElements={async (search)=>{
                                        return await getPromotions({search})
                                    }}
                                    minLength={0}
                                    label={'Акция'}
                                />
                                :
                                null
                        }
                        <AutocomplectOnline
                            element={cpa}
                            setElement={async (cpa)=>{
                                setCpa(cpa)
                            }}
                            getElements={async (search)=>{
                                return await getCpas({search})
                            }}
                            minLength={0}
                            label={'Дизайнер'}
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
                    <Button variant='contained' color='secondary' onClick={()=>{
                        showMiniDialog(false);
                    }} className={classes.button}>
                        Закрыть
                    </Button>
                    <Button variant='contained' color='primary' onClick={async()=>{
                        if((address||['reservation', 'refund'].includes(type))&&(date||['sale', 'order', 'refund'].includes(type))) {
                            if (paid >= 0) {
                                showLoad(true)
                                let res
                                if (type === 'reservation') {
                                    setConsultation({
                                        info: consultation.info,
                                        statusClient: consultation.statusClient,
                                        client: client._id,
                                        operation: 'бронь'
                                    })
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
                                }
                                else if (type === 'refund') {
                                    setConsultation({
                                        info: consultation.info,
                                        statusClient: consultation.statusClient,
                                        client: client._id,
                                        operation: 'возврат'
                                    })
                                    res = await addRefund({
                                        client: client._id,
                                        discount: checkFloat(amountStart - amountEnd),
                                        itemsRefund: items,
                                        amount: checkFloat(amountEnd),
                                        comment,
                                        currency,
                                        sale
                                    })
                                }
                                else if (['sale', 'order'].includes(type)) {
                                    paidInstallment = checkFloat(paidInstallment)
                                    monthInstallment = checkFloat(monthInstallment)
                                    paid = checkFloat(paid)
                                    amountEnd = checkFloat(amountEnd)
                                    if ((paid + prepaid) === amountEnd || (paidInstallment && monthInstallment)) {
                                        setConsultation({
                                            info: consultation.info,
                                            statusClient: consultation.statusClient,
                                            client: client._id,
                                            operation: `${type==='order'?'на заказ':'продажа'}${(paid + prepaid) < amountEnd?'-рассрочка':''}`
                                        })
                                        res = await addSale({
                                            geo,
                                            client: client._id,
                                            itemsSale: items,
                                            discount: checkFloat(amountStart - amountEnd),
                                            cpa: cpa ? cpa._id : null,
                                            promotion: promotion ? promotion._id : null,
                                            amountStart: checkFloat(amountStart),
                                            amountEnd,
                                            typePayment,
                                            address,
                                            addressInfo,
                                            comment,
                                            currency,
                                            paid: checkFloat(paid),
                                            prepaid,
                                            selfDelivery,
                                            installment: !!(paidInstallment&&monthInstallment),
                                            delivery: date,
                                            reservations: reservations,
                                            ...type==='order'?{order: true}:{}
                                        })
                                        if (paidInstallment && monthInstallment && res && res !== 'ERROR') {
                                            const grid = []
                                            let month = new Date()
                                            month.setHours(0, 0, 0, 0)
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
                                            grid[grid.length - 1].amount += remainder
                                            let _res = await addInstallment({
                                                renew,
                                                grid,
                                                debt: checkFloat(amountEnd + (renew ? installmentsDebt : 0) - checkFloat(prepaid)),
                                                client: client._id,
                                                amount: amountEnd + (renew ? installmentsDebt : 0) - checkFloat(prepaid),
                                                paid: 0,
                                                sale: res,
                                                datePaid: grid[0].month,
                                                store: profile.store,
                                                currency
                                            })
                                            if (!_res || _res._id === 'ERROR')
                                                showSnackBar('Ошибка', 'error')
                                        }
                                    }
                                    else {
                                        showSnackBar('Укажите рассрочку')
                                        showLoad(false)
                                        return
                                    }
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
                                showSnackBar('Укажите оплату')
                        }
                        else
                            showSnackBar('Заполните все поля')
                    }} className={classes.button}>
                        Оформить
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