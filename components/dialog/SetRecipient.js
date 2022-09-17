import React, {useState} from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import { getUsers } from '../../src/gql/user'
import { getMoneyRecipients } from '../../src/gql/moneyRecipient'
import { getBalanceClients } from '../../src/gql/balanceClient'
import { getClients } from '../../src/gql/client'
import { getCashboxes } from '../../src/gql/cashbox'
import { getReservations } from '../../src/gql/reservation'
import { getSales } from '../../src/gql/sale'
import { getRefunds } from '../../src/gql/refund'
import { getInstallments } from '../../src/gql/installment'
import Button from '@mui/material/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import AutocomplectOnline from '../app/AutocomplectOnline'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import {pdDDMMYY, checkFloat} from '../../src/lib';
import AddClient from './AddClient';

const types = ['Клиент', 'Сотрудник', 'Касса', 'Получатель денег']
const typesClientOperation = ['Продажа', 'На заказ', 'Бронь', 'Возврат', 'Рассрочка']

const SetRecipient =  React.memo(
    (props) =>{
        const { classes } = dialogContentStyle();
        const { newElement, setNewElement, unsaved, defaultMoneyArticle } = props;
        const { filter, isMobileApp } = props.app;
        const { showMiniDialog } = props.mini_dialogActions;
        const { profile } = props.user;
        let [type, setType] = useState(newElement.typeRecipient);
        let [recipient, setRecipient] = useState(newElement.recipient);
        let [clientOperation, setClientOperation] = useState(newElement.clientOperation);
        let [clientBalance, setClientBalance] = useState();
        let [typeClientOperation, setTypeClientOperation] = useState(newElement.typeClientOperation);
        let [installmentMonthes, setInstallmentMonthes] = useState(newElement.installmentMonthes);
        let [installmentMonth, setInstallmentMonth] = useState(null);
        const width = isMobileApp? (window.innerWidth-113) : 500
        return (
            <div className={classes.main} style={{width}}>
                <br/>
                <FormControl className={classes.input}>
                    <InputLabel>Тип</InputLabel>
                    <Select variant='standard' value={type} onChange={(event) => {
                        newElement.unsaved = true
                        unsaved.current['new'] = true
                        newElement.typeRecipient = event.target.value
                        setType(event.target.value)
                        newElement.recipient = null
                        setRecipient(null)
                        setClientBalance(null)
                        newElement.installment = null
                        newElement.clientOperation = null
                        setClientOperation(null)
                        newElement.installmentMonth = null
                        setInstallmentMonth(null)
                        newElement.installmentMonthes = null
                        setInstallmentMonthes(null)

                        if(event.target.value==='Сотрудник')
                            newElement.moneyArticle = defaultMoneyArticle['Зарплата']
                        else
                            newElement.moneyArticle = defaultMoneyArticle['Не указано']

                        setNewElement({...newElement})
                    }}>
                        {types.map((element)=>
                            <MenuItem key={element} value={element}>{element}</MenuItem>
                        )}
                    </Select>
                </FormControl>
                {
                    type==='Получатель денег'?
                        <AutocomplectOnline
                            error={!recipient}
                            element={recipient}
                            setElement={(recipient)=>{
                                newElement.unsaved = true
                                unsaved.current['new'] = true
                                newElement.recipient = recipient
                                setRecipient(recipient)
                                setNewElement({...newElement})
                            }}
                            defaultValue={recipient}
                            getElements={async (search)=>{
                                return await getMoneyRecipients({search})
                            }}
                            minLength={0}
                            label={type}
                        />
                        :
                        null
                }
                {
                    type==='Сотрудник'?
                        <AutocomplectOnline
                            error={!recipient}
                            element={recipient}
                            setElement={(recipient)=>{
                                newElement.unsaved = true
                                unsaved.current['new'] = true
                                newElement.recipient = recipient
                                setRecipient(recipient)
                                setNewElement({...newElement})
                            }}
                            defaultValue={recipient}
                            getElements={async (search)=>{
                                return await getUsers({search, ...filter.store?{store: filter.store._id}:{}})
                            }}
                            minLength={0}
                            label={type}
                        />
                        :
                        null
                }
                {
                    type==='Клиент'?
                        <>
                        <AutocomplectOnline
                            error={!recipient}
                            element={recipient}
                            setElement={async (recipient)=>{
                                newElement.unsaved = true
                                unsaved.current['new'] = true
                                newElement.recipient = recipient
                                setRecipient(recipient)
                                newElement.installment = null
                                newElement.clientOperation = null
                                setClientOperation(null)
                                newElement.installmentMonth = null
                                setInstallmentMonth(null)
                                newElement.installmentMonthes = null
                                setInstallmentMonthes(null)
                                setNewElement({...newElement})
                                if(recipient) {
                                    clientBalance = await getBalanceClients({client: recipient._id})
                                    setClientBalance(clientBalance?clientBalance[0]:null)
                                }
                                else
                                    setClientBalance(null)
                            }}
                            defaultValue={recipient}
                            getElements={async (search)=>{
                                return await getClients({search})
                            }}
                            minLength={0}
                            label={type}
                            dialogAddElement={profile.add?(setElement, setInputValue, value)=>{return <AddClient setClient={(recipient)=>{
                                newElement.unsaved = true
                                unsaved.current['new'] = true
                                newElement.recipient = recipient
                                setRecipient(recipient)
                                newElement.installment = null
                                newElement.clientOperation = null
                                setClientOperation(null)
                                newElement.installmentMonth = null
                                setInstallmentMonth(null)
                                newElement.installmentMonthes = null
                                setInstallmentMonthes(null)
                                setNewElement({...newElement})
                            }} value={value}/>}:null}
                        />
                        {
                            clientBalance!=undefined?
                                <div className={classes.row} style={{margin: 10}}>
                                    <div className={classes.nameField}>
                                        Баланс:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {clientBalance.balance} сом
                                    </div>
                                </div>
                                :
                                <br/>
                        }
                        {
                            recipient?
                                <>
                                <FormControl className={classes.input}>
                                    <InputLabel>Тип операции</InputLabel>
                                    <Select variant='standard' value={typeClientOperation} onChange={(event) => {
                                        newElement.unsaved = true
                                        unsaved.current['new'] = true
                                        newElement.typeClientOperation = event.target.value
                                        setTypeClientOperation(event.target.value)
                                        newElement.installment = null
                                        newElement.clientOperation = null
                                        setClientOperation(null)
                                        newElement.installmentMonth = null
                                        setInstallmentMonth(null)
                                        newElement.installmentMonthes = null
                                        setInstallmentMonthes(null)
                                        setNewElement({...newElement})
                                    }}>
                                        {typesClientOperation.map((element)=>
                                            <MenuItem key={element} value={element}>{element}</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                                {
                                    typeClientOperation==='Продажа'?
                                        <AutocomplectOnline
                                            element={clientOperation}
                                            setElement={(clientOperation)=>{
                                                newElement.unsaved = true
                                                unsaved.current['new'] = true
                                                newElement.clientOperation = clientOperation
                                                newElement.operation = 'приход'
                                                if(clientOperation) {
                                                    newElement.amount = clientOperation.paid
                                                    newElement.installment = clientOperation.installment
                                                } else {
                                                    newElement.amount = ''
                                                    newElement.installment = null
                                                }
                                                setClientOperation(clientOperation)
                                                setNewElement({...newElement})
                                            }}
                                            defaultValue={clientOperation}
                                            getElements={async (search)=>{
                                                return await getSales({status: 'оплата', order: false, search, client: recipient._id, ...filter.store?{store: filter.store._id}:{}})
                                            }}
                                            minLength={0}
                                            label={typeClientOperation}
                                        />
                                        :
                                        null
                                }
                                {
                                    typeClientOperation==='На заказ'?
                                        <AutocomplectOnline
                                            element={clientOperation}
                                            setElement={(clientOperation)=>{
                                                newElement.unsaved = true
                                                unsaved.current['new'] = true
                                                newElement.clientOperation = clientOperation
                                                newElement.operation = 'приход'
                                                if(clientOperation)
                                                    newElement.amount = clientOperation.paid
                                                else
                                                    newElement.amount = ''
                                                setClientOperation(clientOperation)
                                                setNewElement({...newElement})
                                            }}
                                            defaultValue={clientOperation}
                                            getElements={async (search)=>{
                                                return await getSales({status: 'оплата', order: true, search, client: recipient._id, ...filter.store?{store: filter.store._id}:{}})
                                            }}
                                            minLength={0}
                                            label={typeClientOperation}
                                        />
                                        :
                                        null
                                }
                                {
                                    typeClientOperation==='Бронь'?
                                        <AutocomplectOnline
                                            element={clientOperation}
                                            setElement={(clientOperation)=>{
                                                newElement.unsaved = true
                                                unsaved.current['new'] = true
                                                newElement.clientOperation = clientOperation
                                                newElement.operation = 'приход'
                                                if(clientOperation)
                                                    newElement.amount = clientOperation.paid
                                                else
                                                    newElement.amount = ''
                                                setClientOperation(clientOperation)
                                                setNewElement({...newElement})
                                            }}
                                            defaultValue={clientOperation}
                                            getElements={async (search)=>{
                                                return await getReservations({status: 'оплата', search, client: recipient._id, ...filter.store?{store: filter.store._id}:{}})
                                            }}
                                            minLength={0}
                                            label={typeClientOperation}
                                        />
                                        :
                                        null
                                }
                                {
                                    typeClientOperation==='Возврат'?
                                        <AutocomplectOnline
                                            element={clientOperation}
                                            setElement={(clientOperation)=>{
                                                newElement.unsaved = true
                                                unsaved.current['new'] = true
                                                newElement.clientOperation = clientOperation
                                                newElement.operation = 'расход'
                                                if(clientOperation)
                                                    newElement.amount = clientOperation.amount
                                                else
                                                    newElement.amount = ''
                                                setClientOperation(clientOperation)
                                                setNewElement({...newElement})
                                            }}
                                            defaultValue={clientOperation}
                                            getElements={async (search)=>{
                                                return await getRefunds({status: 'оплата', search, client: recipient._id, ...filter.store?{store: filter.store._id}:{}})
                                            }}
                                            minLength={0}
                                            label={typeClientOperation}
                                        />
                                        :
                                        null
                                }
                                {
                                    typeClientOperation==='Рассрочка'?
                                        <>
                                        <AutocomplectOnline
                                            element={clientOperation}
                                            setElement={(clientOperation)=>{
                                                newElement.unsaved = true
                                                unsaved.current['new'] = true
                                                newElement.clientOperation = clientOperation
                                                newElement.operation = 'приход'
                                                setClientOperation(clientOperation)
                                                newElement.installmentMonth = null
                                                setInstallmentMonth(null)
                                                if(clientOperation) {
                                                    if(clientOperation.sale)
                                                        clientOperation.grid = clientOperation.grid.slice(1)
                                                    let installmentMonthes = []
                                                    for(let i = 0; i <clientOperation.grid.length; i++) {
                                                        if(clientOperation.grid[i].paid<clientOperation.grid[i].amount) {
                                                            installmentMonthes.push(clientOperation.grid[i]);
                                                        }
                                                    }
                                                    newElement.installmentMonthes = installmentMonthes
                                                    setInstallmentMonthes(installmentMonthes)
                                                }
                                                else {
                                                    newElement.installmentMonthes = null
                                                    setInstallmentMonthes(null)
                                                }
                                                setNewElement({...newElement})
                                            }}
                                            defaultValue={clientOperation}
                                            getElements={async (search)=>{
                                                return [
                                                    ...await getInstallments({search, client: recipient._id, status: 'безнадежна', ...filter.store?{store: filter.store._id}:{}}),
                                                    ...await getInstallments({search, client: recipient._id, status: 'активна', ...filter.store?{store: filter.store._id}:{}}),
                                                ]
                                            }}
                                            minLength={0}
                                            label={typeClientOperation}
                                        />
                                        {
                                            installmentMonthes?
                                                <FormControl className={classes.input}>
                                                    <InputLabel>Месяц</InputLabel>
                                                    <Select error={!installmentMonth} variant='standard' value={installmentMonth} onChange={(event) => {
                                                        newElement.unsaved = true
                                                        unsaved.current['new'] = true
                                                        newElement.installmentMonth = event.target.value.month
                                                        newElement.amount = event.target.value.amount
                                                        setInstallmentMonth(event.target.value)
                                                        setNewElement({...newElement})
                                                    }}>
                                                        {installmentMonthes.map((element)=>
                                                            <MenuItem key={element.month} value={element}>{pdDDMMYY(element.month)}({checkFloat(element.paid)}/{element.amount})</MenuItem>
                                                        )}
                                                    </Select>
                                                </FormControl>
                                                :
                                                null
                                        }
                                        </>
                                        :
                                        null
                                }
                                </>
                                :
                                null
                        }
                        </>
                        :
                        null
                }
                {
                    type==='Касса'?
                        <AutocomplectOnline
                            error={!recipient}
                            element={recipient}
                            setElement={(recipient)=>{
                                newElement.unsaved = true
                                unsaved.current['new'] = true
                                newElement.recipient = recipient
                                setRecipient(recipient)
                                setNewElement({...newElement})
                            }}
                            defaultValue={recipient}
                            getElements={async (search)=>{
                                return await getCashboxes({search, ...filter.store?{store: filter.store._id}:{}})
                            }}
                            minLength={0}
                            label={type}
                        />
                        :
                        null
                }
                <br/>
                <div>
                    <Button variant='contained' color='primary' onClick={async()=>showMiniDialog(false)} className={classes.button}>
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetRecipient)