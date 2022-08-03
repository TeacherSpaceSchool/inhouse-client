import React, {useState} from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import { getUsers } from '../../src/gql/user'
import { getMoneyRecipients } from '../../src/gql/moneyRecipient'
import { getClients } from '../../src/gql/client'
import { getCashboxes } from '../../src/gql/cashbox'
import { getOrders } from '../../src/gql/order'
import { getReservations } from '../../src/gql/reservation'
import { getSales } from '../../src/gql/sale'
import { getRefunds } from '../../src/gql/refund'
import Button from '@mui/material/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import AutocomplectOnline from '../app/AutocomplectOnline'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

const types = ['Клиент', 'Сотрудник', 'Касса', 'Получатель денег']
const typesClientOperation = ['Продажа', 'На заказ', 'Бронь', 'Возврат']

const SetRecipient =  React.memo(
    (props) =>{
        const { classes } = dialogContentStyle();
        const { newElement, setNewElement, unsaved } = props;
        const { filter, isMobileApp } = props.app;
        const { showMiniDialog } = props.mini_dialogActions;
        let [type, setType] = useState(newElement.typeRecipient);
        let [recipient, setRecipient] = useState(newElement.recipient);
        let [clientOperation, setClientOperation] = useState(newElement.clientOperation);
        let [typeClientOperation, setTypeClientOperation] = useState(newElement.typeClientOperation);
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
                        setRecipient(null)
                        setClientOperation(null)
                        setType(event.target.value)
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
                            setElement={(recipient)=>{
                                newElement.unsaved = true
                                unsaved.current['new'] = true
                                newElement.recipient = recipient
                                setRecipient(recipient)
                                setClientOperation(null)
                                setNewElement({...newElement})
                            }}
                            defaultValue={recipient}
                            getElements={async (search)=>{
                                return await getClients({search})
                            }}
                            minLength={0}
                            label={type}
                        />
                        {
                            recipient?
                                <>
                                <br/>
                                <FormControl className={classes.input}>
                                    <InputLabel>Тип операции</InputLabel>
                                    <Select variant='standard' value={typeClientOperation} onChange={(event) => {
                                        newElement.unsaved = true
                                        unsaved.current['new'] = true
                                        newElement.typeClientOperation = event.target.value
                                        setClientOperation(null)
                                        setTypeClientOperation(event.target.value)
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
                                                setClientOperation(clientOperation)
                                                setNewElement({...newElement})
                                            }}
                                            defaultValue={clientOperation}
                                            getElements={async (search)=>{
                                                return await getSales({search, client: recipient._id, ...filter.store?{store: filter.store._id}:{}})
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
                                                setClientOperation(clientOperation)
                                                setNewElement({...newElement})
                                            }}
                                            defaultValue={clientOperation}
                                            getElements={async (search)=>{
                                                return await getOrders({search, client: recipient._id, ...filter.store?{store: filter.store._id}:{}})
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
                                                setClientOperation(clientOperation)
                                                setNewElement({...newElement})
                                            }}
                                            defaultValue={clientOperation}
                                            getElements={async (search)=>{
                                                return await getReservations({search, client: recipient._id, ...filter.store?{store: filter.store._id}:{}})
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
                                                setClientOperation(clientOperation)
                                                setNewElement({...newElement})
                                            }}
                                            defaultValue={clientOperation}
                                            getElements={async (search)=>{
                                                return await getRefunds({search, client: recipient._id, ...filter.store?{store: filter.store._id}:{}})
                                            }}
                                            minLength={0}
                                            label={typeClientOperation}
                                        />
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