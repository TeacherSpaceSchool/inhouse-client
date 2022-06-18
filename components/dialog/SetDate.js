import React, { useState } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import * as appActions from '../../src/redux/actions/app'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import { pdDatePicker } from '../../src/lib'

const SetDate =  React.memo(
    (props) =>{
        const { classes } = dialogContentStyle();
        let [dateChange, setDateChange] = useState(pdDatePicker(new Date()));
        const { isMobileApp } = props.app;
        const { showMiniDialog } = props.mini_dialogActions;
        const { setDate } = props.appActions;
        const width = isMobileApp? (window.innerWidth-112) : 500
        return (
            <div className={classes.main}>
                <TextField variant='standard'
                    style={{width: width}}
                    className={classes.textField}
                    label='Дата'
                    type='date'
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={dateChange}
                    onKeyPress={async event => {
                        if (event.key === 'Enter'){
                            await setDate(new Date(dateChange))
                            showMiniDialog(false);
                        }
                    }}
                    onChange={ event => setDateChange(event.target.value) }
                />
                <br/>
                <div>
                    <Button variant="contained" color="primary" onClick={async()=>{
                       await setDate(new Date(dateChange))
                       showMiniDialog(false);
                    }} className={classes.button}>
                        Сохранить
                    </Button>
                    <Button variant="contained" color="secondary" onClick={()=>{showMiniDialog(false);}} className={classes.button}>
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
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetDate)