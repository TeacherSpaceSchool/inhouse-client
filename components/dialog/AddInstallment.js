import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import { getClients } from '../../src/gql/client'
import { addInstallment, getInstallments } from '../../src/gql/installment'
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
        const { classes } = dialogContentStyle();
        const { list, setList } = props;
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
        let [installmentsDebt, setInstallmentsDebt] = useState(0);
        const width = isMobileApp? (window.innerWidth-113) : 500
        useEffect(() => {
            monthInstallment = checkFloat(monthInstallment)
            if(monthInstallment)
                paidInstallment = checkFloat((checkFloat(amount)+(renew?installmentsDebt:0)-checkFloat(paid)) / monthInstallment)
            else
                paidInstallment = 0
            setPaidInstallment(paidInstallment)
        }, [paid, amount, monthInstallment, renew]);
        useEffect(() => {
            (async()=>{
                installmentsDebt = 0
                if(client&&store) {
                    let installments = await getInstallments({
                        client: client._id,
                        store: store._id,
                        status: 'активна'
                    })
                    for(let i = 0; i <installments.length; i++) {
                        installmentsDebt += installments[i].debt
                    }
                }
                setInstallmentsDebt(installmentsDebt)
                setRenew(false)
            })()
        }, [client, store]);
        return (
            <div className={classes.main} style={{width}}>
                <br/>
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
                        id='paidInstallment'
                        error={!paidInstallment||paidInstallment<0}
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
                <br/>
                <div>
                    <Button variant='contained' color='primary' onClick={async()=>{
                        amount = checkFloat(amount)
                        paid = checkFloat(paid)
                        monthInstallment = checkFloat(monthInstallment)
                        if(client&&store&&monthInstallment&&paid<=(amount+(renew?installmentsDebt:0))) {
                            setMiniDialog('Вы уверены?', <Confirmation action={async ()=>{
                                const grid = []
                                let month = new Date()
                                grid.push({
                                    month: new Date(month),
                                    amount: paid,
                                    paid: paid,
                                    datePaid: month
                                })
                                month.setMonth(month.getMonth()+1)
                                for(let i = 0; i < monthInstallment; i++) {
                                    grid.push({
                                        month: new Date(month),
                                        amount: paidInstallment
                                    })
                                    month.setMonth(month.getMonth()+1)
                                }

                                let res = await addInstallment({
                                    renew,
                                    grid,
                                    debt: checkFloat((amount+(renew?installmentsDebt:0))-paid),
                                    client: client._id,
                                    amount: amount+(renew?installmentsDebt:0),
                                    paid,
                                    datePaid: grid[1].month,
                                    store: store._id,
                                    currency: 'сом'
                                })
                                if(res&&res._id!=='ERROR') {
                                    if(renew)
                                        Router.reload()
                                    else
                                        setList([res, ...list])
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
                    <Button variant='contained' color='secondary' onClick={()=>showMiniDialog(false)} className={classes.button}>
                        Закрыть
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