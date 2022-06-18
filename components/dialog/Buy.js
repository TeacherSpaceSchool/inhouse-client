import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import Button from '@mui/material/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import { checkFloat, inputFloat } from '../../src/lib';
import { addSale } from '../../src/gql/sale';
import Link from 'next/link';
import { ndsTypes, nspTypes } from '../../src/const'
import TextField from '@mui/material/TextField';

const BuyBasket =  React.memo(
    (props) =>{
        const { isMobileApp } = props.app;
        const { profile } = props.user;
        const { classes } = dialogContentStyle();
        let { client, amountStart, _setComment, cashbox, items, allNsp, allNds, ndsPrecent, nspPrecent, type, usedPrepayment, consignation, sale, setItems, setType, setClient, setSale, setAllAmount } = props;
        const { showMiniDialog } = props.mini_dialogActions;
        const { showSnackBar } = props.snackbarActions;
        const width = isMobileApp? (window.innerWidth-112) : 500
        let [typePayment, setTypePayment] = useState('Наличными');
        let [res, setRes] = useState(undefined);
        let [discount, setDiscount] = useState('');
        let [amountEnd, setAmountEnd] = useState(amountStart);
        let [paid, setPaid] = useState(0);
        let [discountType, setDiscountType] = useState('%');
        let [comment, setComment] = useState('');
        let [commentShow, setCommentShow] = useState(false);
        let [extra, setExtra] = useState('');
        let [change, setChange] = useState('');
        let [extraType, setExtraType] = useState('%');
        useEffect(() => {
            amountEnd = amountStart + (extraType==='%'?amountStart/100*extra:checkFloat(extra)) - (discountType==='%'?amountStart/100*discount:discount) - consignation
            if(typePayment==='Безналичный'&&type==='Продажа')
                amountEnd -= allNsp
            amountEnd = checkFloat(amountEnd)
            setAmountEnd(amountEnd)
            if (typePayment === 'Безналичный')
                paid = amountEnd
            else
                paid = Math.ceil(amountEnd)
            change = (checkFloat(paid)+('Продажа'===type?usedPrepayment:0)) - amountEnd
            if(change<0)
                change = Math.ceil(change*-1)*-1
            else
                change = parseInt(change)
            setChange(change)
            setPaid(paid)
        }, [typePayment, extra, discount, extraType, discountType]);
        return (
            <div className={classes.main} style={{width}}>
                {
                    !res?
                        <>
                        {
                            ['Возврат продажи', 'Продажа', 'Возврат покупки'].includes(type)?
                                <>
                                {
                                    sale&&sale.returned?
                                        <div className={classes.row} style={{color: 'red'}}>
                                            <div className={classes.value}>На операцию оформлен возврат</div>
                                        </div>
                                        :
                                        null
                                }
                                {
                                    sale&&sale.used&&sale.type==='Аванс'?
                                        <div className={classes.row} style={{color: 'red'}}>
                                            <div className={classes.value}>Аванс был использован</div>
                                        </div>
                                        :
                                        null
                                }
                                {
                                    consignation?
                                        <div className={classes.row} style={{color: 'red'}}>
                                            <div className={classes.nameField}>{'Продажа'===type?'Текущий кредит':'Кредит'}:&nbsp;</div>
                                            <div className={classes.value}>{` ${consignation} сом`}</div>
                                        </div>
                                        :
                                        null
                                }
                                <div style={{width}} className={isMobileApp?classes.column:classes.row}>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>{'Продажа'===type?'Скидка':'Уценка'}:&nbsp;&nbsp;&nbsp;&nbsp;</div>
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
                                                    if('Продажа'===type) {
                                                        discount = inputFloat(event.target.value)
                                                        setDiscount(discount)
                                                    }
                                                }}
                                                onFocus={()=>{
                                                    if('Продажа'===type) {
                                                        discount = inputFloat('')
                                                        setDiscount(discount)
                                                    }
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
                                    {
                                        'Продажа'===type?
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>Наценка:&nbsp;&nbsp;</div>
                                                <div className={classes.counter}>
                                                    <div className={classes.counterbtn} onClick={() => {
                                                        if(extra>0) {
                                                            extra = checkFloat(extra - 1)
                                                            setExtra(extra)
                                                        }
                                                    }}>–</div>
                                                    <input
                                                        type={isMobileApp?'number':'text'}
                                                        className={classes.counternmbr}
                                                        value={extra}
                                                        onChange={(event) => {
                                                            extra = inputFloat(event.target.value)
                                                            setExtra(extra)
                                                        }}
                                                        onFocus={()=>{
                                                            extra = inputFloat('')
                                                            setExtra(extra)
                                                        }}
                                                    />
                                                    <div className={classes.counterbtn} onClick={() => {
                                                        extra = checkFloat(checkFloat(extra) + 1)
                                                        setExtra(extra)
                                                    }}>+
                                                    </div>
                                                </div>
                                                <div className={classes.typeShow} onClick={()=>{
                                                    extraType = extraType==='%'?'сом':'%'
                                                    setExtraType(extraType)
                                                }}>
                                                    {extraType}
                                                </div>
                                            </div>
                                            :
                                            null
                                    }
                                </div>
                                </>
                                :
                                null
                        }
                        <div className={classes.row}>
                            <div className={classes.nameField}>Итого:&nbsp;</div>
                            <div className={classes.value}>{` ${amountEnd} сом`}</div>
                        </div>
                        <div className={classes.row}>
                            <center className={classes.input}>
                                <Button onClick={() => {setTypePayment('Наличными')}} style={{color: typePayment!=='Наличными'?'#A0A0A0':'#10183D'}}>
                                    Наличными
                                </Button>
                            </center>
                            <center className={classes.input}>
                                <Button onClick={() => {setTypePayment('Безналичный')}} style={{color: typePayment!=='Безналичный'?'#A0A0A0':'#10183D'}}>
                                    Безналичный
                                </Button>
                            </center>
                        </div>
                        <div className={classes.row}>
                            <div className={classes.nameField}>Оплачено:&nbsp;</div>
                            <div className={classes.counter}>
                                <div className={classes.counterbtn} onClick={() => {
                                    paid = checkFloat(paid - 5)
                                    if(paid<0)
                                        paid = 0
                                    change = (checkFloat(paid)+('Продажа'===type?usedPrepayment:0)) - amountEnd
                                    if(change<0)
                                        change = Math.ceil(change*-1)*-1
                                    else
                                        change = parseInt(change)
                                    setChange(change)
                                    setPaid(paid)
                                }}>–</div>
                                <input
                                    type={isMobileApp?'number':'text'}
                                    className={classes.counternmbr}
                                    value={paid}
                                    onChange={(event) => {
                                        paid = inputFloat(event.target.value)
                                        change = (checkFloat(paid)+('Продажа'===type?usedPrepayment:0)) - amountEnd
                                        if(change<0)
                                            change = Math.ceil(change*-1)*-1
                                        else
                                            change = parseInt(change)
                                        setChange(change)
                                        setPaid(paid)
                                    }}
                                    onFocus={()=>{
                                        paid = inputFloat('')
                                        change = (checkFloat(paid)+('Продажа'===type?usedPrepayment:0)) - amountEnd
                                        if(change<0)
                                            change = Math.ceil(change*-1)*-1
                                        else
                                            change = parseInt(change)
                                        setChange(change)
                                        setPaid(paid)
                                    }}
                                />
                                <div className={classes.counterbtn} onClick={() => {
                                    paid = checkFloat(checkFloat(paid) + 5)
                                    change = (checkFloat(paid)+('Продажа'===type?usedPrepayment:0)) - amountEnd
                                    if(change<0)
                                        change = Math.ceil(change*-1)*-1
                                    else
                                        change = parseInt(change)
                                    setChange(change)
                                    setPaid(paid)
                                }}>+
                                </div>
                            </div>
                            <div className={classes.typeShow}>
                                сом
                            </div>
                        </div>
                        {
                            usedPrepayment&&'Продажа'===type?
                                <div className={classes.row}>
                                    <div className={classes.nameField}>Аванс:&nbsp;</div>
                                    <div className={classes.value}>{` ${usedPrepayment} сом`}</div>
                                </div>
                                :
                                null
                        }
                        {
                            change<0?
                                <div className={classes.row}>
                                    <b style={{color: 'red'}}>{['Аванс', 'Погашение кредита', 'Покупка', 'Возврат продажи', 'Возврат покупки', 'Возврат аванса'].includes(type)||!profile.credit?'Сумма слишком мала':`Кредит: ${change*-1} сома`}</b>
                                </div>
                                :
                                <div className={classes.row}>
                                    <div className={classes.nameField}>Сдача:&nbsp;</div>
                                    <div className={classes.value}>{` ${change} сом`}</div>
                                </div>
                        }
                        {
                            commentShow?
                                <TextField variant='standard'
                                    label='Комментарий (не обязательно)'
                                    style={{width}}
                                    className={classes.textField}
                                    margin='normal'
                                    value={comment}
                                    onChange={(event)=>{setComment(event.target.value)}}
                                />
                                :
                                <Button color='primary' onClick={()=>{setCommentShow(true);}} className={classes.button}>
                                    Добавить комментарий
                                </Button>
                        }
                        <br/>
                        <div>
                            <Button variant='contained' color='primary' onClick={async()=>{
                                if(typePayment==='Наличными'&&['Покупка', 'Возврат аванса', 'Возврат продажи'].includes(type)&&paid>cashbox.cash)
                                    showSnackBar('Наличных в кассе недостаточно, внесите нужную сумму')
                                else {
                                    if(!profile.credit&&change<0) {
                                        showMiniDialog(false)
                                        showSnackBar('Кредит не разрешен')
                                    }
                                    else {
                                        if (change<0&&['Аванс', 'Погашение кредита', 'Покупка', 'Возврат продажи', 'Возврат покупки', 'Возврат аванса'].includes(type) || amountEnd<0 || paid<0)
                                            showSnackBar('Сумма слишком мала')
                                        else {
                                            let discountAll = 0, extraAll = 0;
                                            allNds = 0
                                            allNsp = 0
                                            extra = checkFloat(extra)
                                            if(extra) {
                                                if (extraType === '%')
                                                    extra = checkFloat(amountStart / 100 * extra)
                                                extra = extra / items.length
                                            }
                                            discount = checkFloat(discount)
                                            if(discount) {
                                                if (discountType === '%')
                                                    discount = checkFloat(amountStart / 100 * discount)
                                                discount = discount / items.length
                                            }
                                            for (let i = 0; i < items.length; i++) {
                                                let allPrecent = 100+ndsTypes[items[i].ndsType]+nspTypes[items[i].nspType]
                                                items[i].amountStart = checkFloat(items[i].count*items[i].price)
                                                items[i].extra = checkFloat(items[i].extraType==='%'?items[i].amountStart/100*items[i].extra:checkFloat(items[i].extra) + extra)
                                                items[i].discount = checkFloat(items[i].discountType==='%'?items[i].amountStart/100*items[i].discount:checkFloat(items[i].discount) + discount)
                                                items[i].amountEnd = checkFloat(items[i].amountStart + items[i].extra - items[i].discount)
                                                items[i].nds = checkFloat(items[i].amountEnd/allPrecent*ndsTypes[items[i].ndsType])
                                                items[i].nsp = checkFloat(items[i].amountEnd/allPrecent*nspTypes[items[i].nspType])
                                                if(typePayment==='Безналичный'&&type==='Продажа'&&nspTypes[items[i].nspType]){
                                                    items[i].amountEnd = checkFloat(items[i].amountEnd - items[i].nsp)
                                                    items[i].nsp = 0
                                                }
                                                discountAll = checkFloat(discountAll + items[i].discount)
                                                extraAll = checkFloat(extraAll + items[i].extra)
                                                allNds += items[i].nds
                                                allNsp += items[i].nsp
                                                items[i] = {
                                                    name: items[i].name,
                                                    unit: items[i].unit,
                                                    count: checkFloat(items[i].count),
                                                    price: checkFloat(items[i].price),
                                                    discount: items[i].discount,
                                                    extra: items[i].extra,
                                                    amountStart: items[i].amountStart,
                                                    amountEnd: items[i].amountEnd,
                                                    ndsType: items[i].ndsType,
                                                    nds: items[i].nds,
                                                    nspType: items[i].nspType,
                                                    nsp: items[i].nsp,
                                                    tnved: items[i].tnved,
                                                    mark: items[i].mark,
                                                }
                                            }
                                            let res = await addSale({
                                                ndsPrecent,
                                                nspPrecent,
                                                client: client?client._id:client,
                                                sale: sale?sale._id:sale,
                                                typePayment,
                                                type: change<0?'Кредит':type==='Возврат продажи'?'Возврат':type,
                                                paid: checkFloat(paid),
                                                change: change<0?0:change,
                                                extra: extraAll,
                                                discount: discountAll,
                                                items,
                                                amountEnd,
                                                usedPrepayment: 'Продажа'===type?usedPrepayment:0,
                                                comment,
                                                nds: checkFloat(allNds),
                                                nsp: typePayment === 'Безналичный' ? 0 : checkFloat(allNsp)
                                            })
                                            if(res){
                                                setRes(res)
                                                if(setItems)
                                                    setItems([])
                                                if(setType)
                                                    setType('Продажа')
                                                if(setClient)
                                                    setClient(undefined)
                                                if(setSale)
                                                    setSale(undefined)
                                                if(_setComment)
                                                    _setComment('')
                                                if(setAllAmount)
                                                    setAllAmount('')
                                            }
                                            else
                                                showSnackBar('Ошибка', 'error')
                                        }
                                    }
                                }
                            }} className={classes.button}>
                                Оплатить
                            </Button>
                            <Button variant='contained' color='secondary' onClick={()=>{showMiniDialog(false);}} className={classes.button}>
                                Закрыть
                            </Button>
                        </div>
                        </>
                        :
                        <div>
                            <Link href='/sale/[id]' as={`/sale/${res}`}>
                                <Button variant='contained' color='primary' className={classes.button}>
                                    Чек
                                </Button>
                            </Link>
                            <Button variant='contained' color='primary' onClick={()=>{showMiniDialog(false);}} className={classes.button}>
                                Касса
                            </Button>
                        </div>
                }
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BuyBasket)