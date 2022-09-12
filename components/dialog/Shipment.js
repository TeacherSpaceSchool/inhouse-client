import React, { useState } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { inputFloat, checkFloat } from '../../src/lib'
import {setSale} from '../../src/gql/sale'
import {setBalanceItem} from '../../src/gql/balanceItem'
import Confirmation from './Confirmation'
import Router from 'next/router'

const Shipment =  React.memo(
    (props) =>{
        const {classes} = dialogContentStyle()
        const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
        const { isMobileApp } = props.app;
        const { showSnackBar } = props.snackbarActions;
        const { items, _shipment, _id } = props;
        const width = isMobileApp? (window.innerWidth-113) : 500
        let [shipment, setShipment] = useState(_shipment);
        return (
            <div className={classes.main} style={{width}}>
                {
                    items.map((item, idx) =>
                        <div className={classes.column} key={`Shipment${idx}`} style={{width}}>
                            <b>{item.name}: {item.count} {item.unit}</b>
                            <br/>
                            {
                                item.balance.map((balance, idx1) =>
                                    <TextField
                                        error={balance.amount<shipment[item.item][balance.warehouse._id]}
                                        id='confirm'
                                        key={`balance${idx1}`}
                                        variant='standard'
                                        label={`${balance.warehouse.name}: ${balance.amount} ${item.unit}`}
                                        value={shipment[item.item][balance.warehouse._id]}
                                        onChange={(event) => {
                                            shipment[item.item][balance.warehouse._id] = inputFloat(event.target.value)
                                            setShipment({...shipment})
                                        }}
                                        className={classes.input}
                                    />
                                )
                            }
                        </div>
                    )
                }
                    <div>
                            <Button variant='contained' color='secondary' onClick={()=>showMiniDialog(false)} className={classes.button}>
                                    Закрыть
                            </Button>
                        <Button variant='contained' color='primary' onClick={async()=>{
                            let confirmAmount = true, confirmBalance = true
                            for(let i = 0; i <items.length; i++) {
                                let amount = 0, shipmentAmount
                                const keys = Object.keys(shipment[items[i].item])
                                for(let i1 = 0; i1 <keys.length; i1++) {
                                    shipmentAmount = checkFloat(shipment[items[i].item][keys[i1]])
                                    if(confirmBalance&&shipmentAmount) {
                                        for (let i2 = 0; i2 < items[i].balance.length; i2++) {
                                            if (items[i].balance[i2].warehouse._id === keys[i1] && items[i].balance[i2].amount < shipmentAmount) {
                                                confirmBalance = false
                                                break
                                            }
                                        }
                                    }
                                    amount += shipmentAmount
                                }
                                if(amount!==items[i].count) {
                                    confirmAmount = false
                                    break
                                }
                            }
                            if(confirmAmount&&confirmBalance)
                                setMiniDialog('Вы уверены?', <Confirmation action={async ()=>{
                                    let res = await setSale({
                                        _id,
                                        status: 'отгружен'
                                    })
                                    if (res === 'OK') {
                                        let amount = 0
                                        for(let i = 0; i <items.length; i++) {
                                            const keys = Object.keys(shipment[items[i].item])
                                            for(let i1 = 0; i1 <keys.length; i1++) {
                                                amount = checkFloat(shipment[items[i].item][keys[i1]])
                                                if(amount) {
                                                    res = await setBalanceItem({
                                                        item: items[i].item,
                                                        warehouse: keys[i1],
                                                        amount,
                                                        type: '-'
                                                    })
                                                    if (!res || res === 'ERROR')
                                                        break
                                                }
                                            }
                                        }
                                        if (res==='OK') {
                                            showSnackBar('Успешно', 'success')
                                            Router.reload()
                                        }
                                        else
                                            showSnackBar('Ошибка', 'error')
                                    }
                                    else
                                        showSnackBar('Ошибка', 'error')
                                }}/>)
                            else
                                showSnackBar('Распределение не равно количеству')
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
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Shipment)