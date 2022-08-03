import React, { useState } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { inputFloat, checkFloat } from '../../src/lib'
import {setWayItem} from '../../src/gql/wayItem'
import {setBalanceItem} from '../../src/gql/balanceItem'
import Confirmation from './Confirmation'

const ConfirmWayItem =  React.memo(
    (props) =>{
        const {classes} = dialogContentStyle()
        const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
        const { isMobileApp } = props.app;
        const { showSnackBar } = props.snackbarActions;
        const { warehouses, element, setList, list, idx, unsaved } = props;
        let [confirm, setConfirm] = useState({});
        const width = isMobileApp? (window.innerWidth-113) : 500
        return (
            <div className={classes.main} style={{width}}>
                {
                    warehouses.map((warehouse, idx) =>
                        <TextField
                            id='confirm'
                            key={`ConfirmWayItem${idx}`}
                            variant='standard'
                            label={`Склад: ${warehouse.name}`}
                            value={confirm[warehouse._id]}
                            onChange={(event) => {
                                confirm[warehouse._id] = inputFloat(event.target.value)
                                setConfirm({...confirm})
                            }}
                            className={classes.input}
                        />
                    )
                }
                <div>
                    <Button variant='contained' color='primary' onClick={async()=>{
                        let confirmAmount = 0
                        const keys = Object.keys(confirm)
                        for(let i=0; i<keys.length; i++){
                            confirm[keys[i]] = checkFloat(confirm[keys[i]])
                            confirmAmount = checkFloat(confirmAmount + confirm[keys[i]])
                        }
                        if(element.amount===confirmAmount)
                            setMiniDialog('Вы уверены?', <Confirmation action={async ()=>{
                                let res = await setWayItem({
                                    _id: element._id,
                                    status: 'прибыл'
                                })
                                if (res === 'OK') {
                                    showSnackBar('Успешно', 'success')
                                    list[idx].unsaved = false
                                    list[idx].status = 'прибыл'
                                    setList([...list])
                                    delete unsaved.current[element._id]
                                    for(let i=0; i<keys.length; i++){
                                        if(confirm[keys[i]]) {
                                            res = await setBalanceItem({item: element.item._id, warehouse: keys[i], amount: confirm[keys[i]], type: '+'})
                                            if (!res||res==='ERROR')
                                                showSnackBar('Ошибка', 'error')
                                        }
                                    }

                                }
                                else
                                    showSnackBar('Ошибка', 'error')
                            }}/>)
                        else
                            showSnackBar('Распределение не равно количеству')
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
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmWayItem)