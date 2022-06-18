import React, { useState } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import {getSale} from '../../src/gql/sale'

const GetSale =  React.memo(
    (props) =>{
        const { classes } = dialogContentStyle();
        const { type, setSale } = props;
        let [rnmNumber, setRnmNumber] = useState('');
        let [number, setNumber] = useState('');
        const { isMobileApp } = props.app;
        const { showMiniDialog } = props.mini_dialogActions;
        const width = isMobileApp? (window.innerWidth-112) : 500
        const { showSnackBar } = props.snackbarActions;
        return (
            <div className={classes.main}>
                <TextField variant='standard'
                    style={{width}}
                    label='РНМ'
                    className={classes.textField}
                    margin='normal'
                    value={rnmNumber}
                    error={!rnmNumber}
                    onChange={(event)=>setRnmNumber(event.target.value)}
                />
                <TextField variant='standard'
                    style={{width}}
                    label='Номер чека'
                    className={classes.textField}
                    margin='normal'
                    value={number}
                    error={!number}
                    onChange={(event)=>setNumber(event.target.value)}
                />
                <br/>
                <div>
                    <Button variant='contained' color='primary' onClick={async()=>{
                        if(rnmNumber&&number) {
                            let sale = await getSale({_id: 'newSale', type, rnmNumber, number})
                            if(sale) {
                                setSale(sale)
                                showMiniDialog(false)
                                showSnackBar('Чек найден', 'success')
                            }
                            else
                                showSnackBar('Чек не найден', 'error')
                        }
                        else
                            showSnackBar('Заполните все поля')
                    }} className={classes.button}>
                        Найти
                    </Button>
                    <Button variant='contained' color='secondary' onClick={()=>{showMiniDialog(false);}} className={classes.button}>
                        Закрыть
                    </Button>
                </div>
            </div>
        );
    }
)

function mapStateToProps (state) {
    return {
        app: state.app
    }
}

function mapDispatchToProps(dispatch) {
    return {
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GetSale)