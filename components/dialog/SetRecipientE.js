import React, {useState} from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import { getUsers } from '../../src/gql/user'
import { getMoneyRecipients } from '../../src/gql/moneyRecipient'
import { setMoneyFlow } from '../../src/gql/moneyFlow'
import { getClients } from '../../src/gql/client'
import { getCashboxes } from '../../src/gql/cashbox'
import { getOrders } from '../../src/gql/order'
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
import Confirmation from './Confirmation'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import { getBalanceClients } from '../../src/gql/balanceClient'

const types = ['Клиент', 'Сотрудник', 'Касса', 'Получатель денег']
const typesClientOperationPrihod = ['Продажа', 'На заказ', 'Бронь', 'Рассрочка']
const typesClientOperationRashod = ['Возврат']

const SetRecipientE =  React.memo(
    (props) =>{
        const { classes } = dialogContentStyle();
        const { list, idx, setList } = props;
        const { filter, isMobileApp } = props.app;
        const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
        const { showSnackBar } = props.snackbarActions;
        let [clientBalance, setClientBalance] = useState();
        let [type, setType] = useState();
        let [recipient, setRecipient] = useState();
        let [clientOperation, setClientOperation] = useState();
        let [typeClientOperation, setTypeClientOperation] = useState();
        let [installmentMonthes, setInstallmentMonthes] = useState();
        let [installmentMonth, setInstallmentMonth] = useState(null);
        const width = isMobileApp? (window.innerWidth-113) : 500
        return (
            <div className={classes.main} style={{width}}>
                <br/>
                <FormControl className={classes.input}>
                    <InputLabel>Тип</InputLabel>
                    <Select variant='standard' value={type} onChange={(event) => {
                        setClientBalance(null)
                        setType(event.target.value)
                        setRecipient(null)
                        setClientOperation(null)
                        setInstallmentMonth(null)
                        setInstallmentMonthes(null)
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
                                setRecipient(recipient)
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
                                setRecipient(recipient)
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
                                setRecipient(recipient)
                                setClientOperation(null)
                                setInstallmentMonth(null)
                                setInstallmentMonthes(null)
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
                                        setTypeClientOperation(event.target.value)
                                        setClientOperation(null)
                                        setInstallmentMonth(null)
                                        setInstallmentMonthes(null)
                                    }}>
                                        {(list[idx].operation==='расход'?typesClientOperationRashod:typesClientOperationPrihod).map((element)=>
                                            <MenuItem key={element} value={element}>{element}</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                                {
                                    typeClientOperation==='Продажа'?
                                        <AutocomplectOnline
                                            element={clientOperation}
                                            setElement={(clientOperation)=>{
                                                setClientOperation(clientOperation)
                                            }}
                                            defaultValue={clientOperation}
                                            getElements={async (search)=>{
                                                return await getSales({status: 'оплата', search, client: recipient._id, ...filter.store?{store: filter.store._id}:{}})
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
                                                setClientOperation(clientOperation)
                                            }}
                                            defaultValue={clientOperation}
                                            getElements={async (search)=>{
                                                return await getOrders({status: 'оплата', search, client: recipient._id, ...filter.store?{store: filter.store._id}:{}})
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
                                                setClientOperation(clientOperation)
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
                                                setClientOperation(clientOperation)
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
                                                setClientOperation(clientOperation)
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
                                                    setInstallmentMonthes(installmentMonthes)
                                                }
                                                else {
                                                    setInstallmentMonthes(null)
                                                }
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
                                                        setInstallmentMonth(event.target.value)
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
                                setRecipient(recipient)
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
                    <Button variant='contained' color='primary' onClick={async()=>{
                        setMiniDialog('Вы уверены?', <Confirmation action={async () => {
                            let res = await setMoneyFlow({
                                _id: list[idx]._id,
                                client: type==='Клиент'&&recipient?recipient._id:null,
                                employment: type==='Сотрудник'&&recipient?recipient._id:null,
                                cashboxRecipient: type==='Касса'&&recipient?recipient._id:null,
                                moneyRecipient: type==='Получатель денег'&&recipient?recipient._id:null,
                                clearRecipient: !recipient,
                                ...clientOperation&&typeClientOperation==='Продажа'?{sale: clientOperation._id}:{},
                                ...clientOperation&&typeClientOperation==='На заказ'?{order: clientOperation._id}:{},
                                ...clientOperation&&typeClientOperation==='Бронь'?{reservation: clientOperation._id}:{},
                                ...clientOperation&&typeClientOperation==='Возврат'?{refund: clientOperation._id}:{},
                                ...clientOperation&&typeClientOperation==='Рассрочка'&&installmentMonth?{
                                    installment: clientOperation._id, 
                                    installmentMonth
                                }:{},
                            })
                            if(res==='OK') {
                                showSnackBar('Успешно', 'success')

                                if(!recipient) list[idx].client = null
                                else if(type==='Клиент'&&recipient) list[idx].client = recipient
                                else if(type==='Сотрудник'&&recipient) list[idx].employment = recipient
                                else if(type==='Касса'&&recipient) list[idx].cashboxRecipient = recipient
                                else if(type==='Получатель денег'&&recipient) list[idx].moneyRecipient = recipient

                                if(clientOperation&&typeClientOperation==='Продажа') list[idx].sale = clientOperation
                                else if(clientOperation&&typeClientOperation==='На заказ') list[idx].order = clientOperation
                                else if(clientOperation&&typeClientOperation==='Бронь') list[idx].reservation = clientOperation
                                else if(clientOperation&&typeClientOperation==='Возврат') list[idx].refund = clientOperation
                                else if(clientOperation&&typeClientOperation==='Рассрочка'&&installmentMonth) {
                                    list[idx].installment = clientOperation._id
                                    list[idx].installmentMonth = installmentMonth
                                }

                                setList([...list])
                            }
                            else
                                showSnackBar('Ошибка', 'error')
                        }}/>)
                    }} className={classes.button}>
                        Сохранить
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
        app: state.app,
        user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return {
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetRecipientE)