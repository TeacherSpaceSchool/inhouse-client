import React, { useState } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import * as appActions from '../../src/redux/actions/app'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import { pdDatePicker, pdDatePickerMonth } from '../../src/lib'

const SetDate =  React.memo(
    (props) =>{
        const { classes } = dialogContentStyle();
        const { date, setDate, month } = props;
        const { isMobileApp } = props.app;
        let [_date, _setDate] = useState(month?pdDatePickerMonth(date):pdDatePicker(date));
        const { showMiniDialog } = props.mini_dialogActions;
        const width = isMobileApp? (window.innerWidth-113) : 500
        return (
            <div className={classes.main}>
                <TextField
                    variant='standard'
                    id='date'
                    style={{width}}
                    className={classes.textField}
                    label='Дата'
                    type={month?'month':'date'}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={_date}
                    onKeyPress={async event => {
                        if (event.key === 'Enter'){
                            await setDate(_date)
                            showMiniDialog(false);
                        }
                    }}
                    onChange={ event => _setDate(event.target.value) }
                />
                <br/>
                <div>
                    <Button variant="contained" color="primary" onClick={async()=>{
                       setDate(_date)
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