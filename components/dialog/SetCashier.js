import React, { useState } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import { getUsers } from '../../src/gql/user'
import * as appActions from '../../src/redux/actions/app'
import Button from '@mui/material/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import AutocomplectOnline from '../app/AutocomplectOnline'

const SetCashier =  React.memo(
    (props) =>{
        const { classes } = dialogContentStyle();
        const { setCashier } = props.appActions;
        const { legalObject, branch } = props.app;
        const { showMiniDialog } = props.mini_dialogActions;
        let [cashierChange, setCashierChange] = useState(undefined);
        return (
            <div className={classes.main}>
                <AutocomplectOnline setElement={setCashierChange} getElements={async (search)=>{return await getUsers({search, legalObject: legalObject._id, ...branch?{branch: branch._id}:{}})}} label={'кассира'}/>
                <br/>
                <div>
                    <Button variant='contained' color='primary' onClick={async()=>{
                       if(cashierChange)
                           await setCashier(cashierChange)
                       showMiniDialog(false);
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
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetCashier)