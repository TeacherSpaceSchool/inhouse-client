import React, { useState } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import Button from '@mui/material/Button';
import {setRefund} from '../../src/gql/refund'
import Confirmation from './Confirmation'
import Router from 'next/router'
import TextField from '@mui/material/TextField';
import { checkFloat, inputFloat } from '../../src/lib';
import {setBalanceItem} from '../../src/gql/balanceItem'

const AcceptRefund =  React.memo(
    (props) =>{
        const {classes} = dialogContentStyle()
        const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
        const { isMobileApp } = props.app;
        const { showSnackBar } = props.snackbarActions;
        const { _acceptRefund, items, _id } = props;
        let [acceptRefund, setAcceptRefund] = useState(_acceptRefund);
        const width = isMobileApp? (window.innerWidth-113) : 500
        return (
            <div className={classes.main} style={{width}}>
                {
                    items.map((item, idx) =>
                        <div classname={classes.column} key={`Shipment${idx}`} style={{width}}>
                            <b>{item.name}: {item.count} {item.unit}</b>
                            <br/>
                            {
                                acceptRefund[item.item].map((warehouse, idx1) =>
                                    <TextField
                                        id='confirm'
                                        key={`warehouse${idx1}`}
                                        variant='standard'
                                        label={warehouse.name}
                                        value={warehouse.count}
                                        onChange={(event) => {
                                            acceptRefund[item.item][idx1].count = inputFloat(event.target.value)
                                            setAcceptRefund({...acceptRefund})
                                        }}
                                        className={classes.input}
                                    />
                                )
                            }
                        </div>
                    )
                }
                <div>
                    <Button variant='contained' color='primary' onClick={async()=>{
                        let confirmAcceptRefund = true, res, count
                        for(let i=0; i<items.length; i++){
                            count = 0
                            for(let i1=0; i1<acceptRefund[items[i].item].length; i1++) {
                                count = count + checkFloat(acceptRefund[items[i].item][i1].count)
                            }
                            if(!count||count>items[i].count) {
                                confirmAcceptRefund = false
                                break
                            }
                        }
                        if(confirmAcceptRefund)
                            setMiniDialog('Вы уверены?', <Confirmation action={async ()=>{
                                for(let i = 0; i <items.length; i++) {
                                    for(let i1=0; i1<acceptRefund[items[i].item].length; i1++) {
                                        count = checkFloat(acceptRefund[items[i].item][i1].count)
                                        if(count) {
                                            res = await setBalanceItem({
                                                item: items[i].item,
                                                warehouse: acceptRefund[items[i].item][i1]._id,
                                                amount: count,
                                                type: '+'
                                            })
                                            if (!res || res === 'ERROR') {
                                                showSnackBar('Ошибка', 'error')
                                                break
                                            }
                                        }
                                    }
                                }

                                res = await setRefund({_id, status: 'принят'})
                                if(res&&res!=='ERROR') {
                                    showSnackBar('Успешно', 'success')
                                    Router.reload()
                                }
                                else
                                    showSnackBar('Ошибка', 'error')

                            }}/>)
                        else
                            showSnackBar('Количество не верно')
                    }} className={classes.button}>
                        Принять
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

export default connect(mapStateToProps, mapDispatchToProps)(AcceptRefund)