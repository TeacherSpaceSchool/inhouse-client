import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import { getClients } from '../../src/gql/client'
import { addInstallment, getInstallments, setInstallment } from '../../src/gql/installment'
import {getStores} from '../../src/gql/store';
import Button from '@mui/material/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import AutocomplectOnline from '../app/AutocomplectOnline'
import Router from 'next/router'
import { inputFloat, checkFloat, inputInt } from '../../src/lib'
import TextField from '@mui/material/TextField';
import * as snackbarActions from '../../src/redux/actions/snackbar'
import Confirmation from './Confirmation'

const AddInstallment =  React.memo(
    (props) =>{
        const initialRender = useRef(true);
        const { classes } = dialogContentStyle();
        const { list, setList, idx } = props;
        const { isMobileApp } = props.app;
        const { showSnackBar } = props.snackbarActions;
        const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
        const { profile } = props.user;
        let [renew, setRenew] = useState(false);
        let [client, setClient] = useState(null);
        let [amount, setAmount] = useState('');
        let [paid, setPaid] = useState('');
        let [store, setStore] = useState(profile.store?{_id: profile.store}:null);
        let [monthInstallment, setMonthInstallment] = useState('');
        let [paidInstallment, setPaidInstallment] = useState(0);
        let [remainder, setRemainder] = useState(0);
        let [installmentsDebt, setInstallmentsDebt] = useState(0);
        const width = isMobileApp? (window.innerWidth-113) : 500
        useEffect(() => {
            if(!initialRender.current) {
                monthInstallment = checkFloat(monthInstallment)
                remainder = 0
                if (monthInstallment) {
                    let allAmount = checkFloat(amount) + (renew ? installmentsDebt : 0) - checkFloat(paid)
                    paidInstallment = checkFloat(allAmount / monthInstallment)
                    remainder = paidInstallment % (paidInstallment >= 100 ? 100 : 1)
                    remainder = Math.round(remainder * monthInstallment)
                    if (remainder) {
                        allAmount -= remainder
                        paidInstallment = checkFloat(allAmount / monthInstallment)
                    }
                }
                else
                    paidInstallment = 0
                setPaidInstallment(paidInstallment)
                setRemainder(remainder)
            }
        }, [paid, amount, monthInstallment, renew]);
        useEffect(() => {
            if(!initialRender.current&&idx===undefined)
                (async () => {
                    installmentsDebt = 0
                    if (client && store) {
                        let installments = [
                            ...await getInstallments({
                                client: client._id,
                                store: store._id,
                                status: 'безнадежна'
                            }),
                            ...await getInstallments({
                                client: client._id,
                                store: store._id,
                                status: 'активна'
                            }),
                        ]
                        for (let i = 0; i < installments.length; i++) {
                            installmentsDebt += installments[i].debt
                        }
                    }
                    setInstallmentsDebt(installmentsDebt)
                    setRenew(false)
                })()
        }, [client, store]);
        useEffect(() => {
            if(initialRender.current) {
                initialRender.current = false
                if(idx!==undefined) {
                    setAmount(list[idx].debt)
                    setClient(list[idx].client)
                    setStore(list[idx].store)
                }
            }
        }, []);
        return (
            <div className={classes.main} style={{width}}>
                <br/>
                {
                    idx===undefined?
                        <>
                        {
                            !profile.store?
                                <AutocomplectOnline
                                    error={!store}
                                    element={store}
                                    setElement={store=>setStore(store)}
                                    getElements={async (search)=>{
                                        return await getStores({search})
                                    }}
                                    minLength={0}
                                    label={'Магазин'}
                                />
                                :
                                null
                        }
                        <AutocomplectOnline
                            error={!client}
                            element={client}
                            setElement={client => setClient(client)}
                            getElements={async (search)=>{
                                return await getClients({search})
                            }}
                            minLength={0}
                            label={'Клиент'}
                        />
                        <div className={classes.row} style={{marginTop: 10}}>
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
                        </>
                        :
                        null
                }
                <div className={classes.row}>
                    <TextField
                        id='amount'
                        error={!amount}
                        variant='standard'
                        type={isMobileApp?'number':'text'}
                        label='Сумма'
                        value={amount}
                        onChange={(event) => setAmount(inputFloat(event.target.value))}
                        className={classes.input}
                        style={{marginRight: 10}}
                    />
                    <TextField
                        id='paid'
                        error={!paid||checkFloat(paid)>(checkFloat(amount)+(renew?installmentsDebt:0))}
                        variant='standard'
                        label='Оплачено'
                        value={paid}
                        className={classes.input}
                        onChange={(event) => setPaid(inputFloat(event.target.value))}
                    />
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
                        error={!paidInstallment||paidInstallment<0}
                        variant='standard'
                        label='Месячный платеж'
                        value={paidInstallment}
                        className={classes.input}
                        inputProps={{
                            'aria-placeholder': 'description',
                            readOnly: true,
                        }}
                        style={{marginRight: 10}}
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
                <br/>
                <div>
                    <Button variant='contained' color='secondary' onClick={()=>showMiniDialog(false)} className={classes.button}>
                        Закрыть
                    </Button>
                    <Button variant='contained' color='primary' onClick={async()=>{
                        amount = checkFloat(amount)
                        paid = checkFloat(paid)
                        monthInstallment = checkFloat(monthInstallment)
                        if(client&&store&&monthInstallment&&paid<=(amount+(renew?installmentsDebt:0))) {
                            setMiniDialog('Вы уверены?', <Confirmation action={async ()=>{
                                const grid = []
                                let month = new Date()
                                month.setHours(0, 0, 0, 0)
                                grid.push({
                                    month: new Date(month),
                                    amount: paid,
                                    paid: 0,
                                    datePaid: month
                                })
                                month.setMonth(month.getMonth()+1)
                                for(let i = 0; i < monthInstallment; i++) {
                                    grid.push({
                                        month: new Date(month),
                                        paid: 0,
                                        amount: paidInstallment
                                    })
                                    month.setMonth(month.getMonth()+1)
                                }
                                grid[grid.length-1].amount += remainder
                                let res = await addInstallment({
                                    renew,
                                    grid,
                                    debt: checkFloat(amount+(renew?installmentsDebt:0)),
                                    client: client._id,
                                    amount: amount+(renew?installmentsDebt:0),
                                    paid: 0,
                                    datePaid: grid[0].month,
                                    store: store._id,
                                    currency: 'сом'
                                })
                                if(res&&res._id!=='ERROR') {
                                    if(idx!==undefined)
                                        res = await setInstallment({
                                            _id: list[idx]._id,
                                            status: 'перерасчет'
                                        })
                                    if(res!=='ERROR') {
                                        if (renew || idx !== undefined)
                                            Router.reload()
                                        else
                                            setList([res, ...list])
                                    }
                                    else
                                        showSnackBar('Ошибка', 'error')
                                    showMiniDialog(false)
                                }
                                else
                                    showSnackBar('Ошибка', 'error')
                            }}/>)
                        }
                        else
                            showSnackBar('Заполните все поля')
                    }} className={classes.button}>
                        Сохранить
                    </Button>
                </div>
            </div>
        );
    }
)

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddInstallment)