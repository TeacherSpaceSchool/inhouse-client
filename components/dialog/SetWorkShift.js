import React, { useState } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import { getWorkShifts } from '../../src/gql/workShift'
import * as appActions from '../../src/redux/actions/app'
import Button from '@mui/material/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import AutocomplectOnline from '../app/AutocomplectOnline'

const SetWorkShift =  React.memo(
    (props) =>{
        const { classes } = dialogContentStyle();
        const { setWorkShift } = props.appActions;
        const { legalObject, branch, cashier } = props.app;
        const { showMiniDialog } = props.mini_dialogActions;
        let [workShiftChange, setWorkShiftChange] = useState(undefined);
        return (
            <div className={classes.main}>
                <AutocomplectOnline setElement={setWorkShiftChange} getElements={async (search)=>{
                    return await getWorkShifts({search, legalObject: legalObject._id, ...branch?{branch: branch._id}:{}, ...cashier?{cashier: cashier._id}:{}})
                }} label={'смену'}/>
                <br/>
                <div>
                    <Button variant='contained' color='primary' onClick={async()=>{
                        if(workShiftChange)
                           await setWorkShift(workShiftChange)
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

export default connect(mapStateToProps, mapDispatchToProps)(SetWorkShift);