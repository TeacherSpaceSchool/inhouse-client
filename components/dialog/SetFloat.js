import React, { useState } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import Button from '@mui/material/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import {inputFloat, checkFloat} from '../../src/lib'
import TextField from '@mui/material/TextField';
import * as snackbarActions from '../../src/redux/actions/snackbar'

const SetFloat =  React.memo(
    (props) =>{
        const { classes } = dialogContentStyle();
        const { action } = props;
        const { showMiniDialog } = props.mini_dialogActions;
        const { showSnackBar } = props.snackbarActions;
        const { isMobileApp } = props.app;
        let [float, setFloat] = useState('');
        let [comment, setComment] = useState('');
        return (
            <div className={classes.main}>
                <TextField variant='standard'
                    className={classes.input}
                    label='Обоснование (не обязательно)'
                    value={comment}
                    onChange={(event)=>{setComment(event.target.value)}}
                />
                <TextField variant='standard'
                    type={isMobileApp?'number':'text'}
                    label='Сумма'
                    value={float}
                    className={classes.input}
                    onChange={(event)=>{setFloat(inputFloat(event.target.value))}}
                />
                <br/>
                <div>
                    <Button variant='contained' color='primary' onClick={async()=>{
                        if(float) {
                            float = checkFloat(float)
                            await action(float, comment)
                            showMiniDialog(false);
                        }
                        else
                            showSnackBar('Сумма слишком мала')
                    }} className={classes.button}>
                        Сохранить
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
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetFloat)