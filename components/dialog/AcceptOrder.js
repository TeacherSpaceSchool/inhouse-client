import React, { useState } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import Button from '@mui/material/Button';
import {setSale} from '../../src/gql/sale'
import {addWayItem, getWayItem, setWayItem} from '../../src/gql/wayItem'
import Confirmation from './Confirmation'
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Router from 'next/router'
import TextField from '@mui/material/TextField';

const typesS = ['вручную', 'автоматически']
const types = ['вручную']
const typesAllS = ['вручную', 'автоматически', 'имеющийся']
const typesAll = ['вручную', 'имеющийся']

const AcceptOrder =  React.memo(
    (props) =>{
        const {classes} = dialogContentStyle()
        const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
        const { profile } = props.user;
        const { isMobileApp } = props.app;
        const { showSnackBar } = props.snackbarActions;
        const { prepareAcceptOrder, itemsOrder, order } = props;
        let [acceptOrder, setAcceptOrder] = useState([]);
        let [arrivalDates, setArrivalDates] = useState([]);
        const width = isMobileApp? (window.innerWidth-113) : 500
        return (
            <div className={classes.main} style={{width}}>
                {
                    itemsOrder.map((itemOrder, idx) =>
                        <div className={classes.column} key={`itemOrder${idx}`} style={{width}}>
                            <FormControl className={classes.input} style={{marginTop: 10}}>
                                <InputLabel error={!acceptOrder[idx]}>{itemOrder.name}</InputLabel>
                                <Select error={!acceptOrder[idx]} variant='standard' value={acceptOrder[idx]} onChange={(event) => {
                                    acceptOrder[idx] = event.target.value
                                    setAcceptOrder([...acceptOrder])
                                }}>
                                    {(prepareAcceptOrder[idx]?profile.store?typesAllS:typesAll:profile.store?typesS:types).map((element)=>
                                        <MenuItem key={element} value={element}>{element}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                            {
                                acceptOrder[idx]==='автоматически'?
                                    <TextField
                                        type='date'
                                        id='arrivalDates'
                                        label='Прибытие'
                                        variant='standard'
                                        className={classes.input}
                                        value={arrivalDates[idx]}
                                        onChange={(event) => {
                                            arrivalDates[idx] = event.target.value
                                            setArrivalDates([...arrivalDates])
                                        }}
                                    />
                                    :
                                    null
                            }
                        </div>
                    )
                }
                <div>
                    <Button variant='contained' color='secondary' onClick={()=>showMiniDialog(false)} className={classes.button}>
                        Закрыть
                    </Button>
                    <Button variant='contained' color='primary' onClick={async()=>{
                        let confirmAcceptOrder = acceptOrder.length
                        for(let i=0; i<acceptOrder.length; i++){
                            if(!acceptOrder[i]) {
                                confirmAcceptOrder = false
                                break
                            }
                        }
                        if(confirmAcceptOrder)
                            setMiniDialog('Вы уверены?', <Confirmation action={async ()=>{
                                for(let i=0; i<acceptOrder.length; i++){
                                    if(acceptOrder[i]==='автоматически') {
                                        let res = await addWayItem({
                                            item: itemsOrder[i].item,
                                            store: order.store._id,
                                            bookings: [{
                                                manager: order.manager._id,
                                                nameManager: order.manager.name,
                                                client: order.client._id,
                                                nameClient: order.client.name,
                                                amount: itemsOrder[i].count
                                            }],
                                            amount: itemsOrder[i].count,
                                            arrivalDate: arrivalDates[i]
                                        })
                                        if(!res||res._id==='ERROR')
                                            showSnackBar('Ошибка', 'error')
                                    }
                                    else if(acceptOrder[i]==='имеющийся') {
                                        let wayItem = await getWayItem({_id: prepareAcceptOrder[i]})
                                        let bookings = []
                                        for(let i=0; i<wayItem.bookings.length; i++) {
                                            bookings.push({
                                                manager: wayItem.bookings[i].manager._id,
                                                nameManager: wayItem.bookings[i].manager.name,
                                                client: wayItem.bookings[i].client?wayItem.bookings[i].client._id:null,
                                                nameClient: wayItem.bookings[i].client?wayItem.bookings[i].client.name:null,
                                                amount: wayItem.bookings[i].amount
                                            })
                                        }
                                        bookings.push({
                                            manager: order.manager._id,
                                            nameManager: order.manager.name,
                                            client: order.client._id,
                                            nameClient: order.client.name,
                                            amount: itemsOrder[i].count
                                        })
                                        res = await setWayItem({bookings, _id: prepareAcceptOrder[i]})
                                        if (res !== 'OK')
                                            showSnackBar('Ошибка', 'error')
                                    }
                                }

                                let element = {_id: order._id, status: 'заказан'}
                                let res = await setSale(element)
                                if(res&&res!=='ERROR') {
                                    showSnackBar('Успешно', 'success')
                                    Router.reload()
                                }
                                else
                                    showSnackBar('Ошибка', 'error')

                            }}/>)
                        else
                            showSnackBar('Заполните все поля')
                    }} className={classes.button}>
                        Принять
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

export default connect(mapStateToProps, mapDispatchToProps)(AcceptOrder)