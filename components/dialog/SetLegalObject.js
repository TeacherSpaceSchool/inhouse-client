import React, { useState } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import { getLegalObjects } from '../../src/gql/legalObject'
import * as appActions from '../../src/redux/actions/app'
import Button from '@mui/material/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import AutocomplectOnline from '../app/AutocomplectOnline'

const SetLegalObjects =  React.memo(
    (props) =>{
        const { classes } = dialogContentStyle();
        const { setLegalObject } = props.appActions;
        const { showMiniDialog } = props.mini_dialogActions;
        let [legalObjectChange, setLegalObjectChange] = useState(undefined);
        return (
            <div className={classes.main}>
                <AutocomplectOnline setElement={setLegalObjectChange} getElements={async (search)=>{return await getLegalObjects({search})}} label={'налогоплательщика'}/>
                <br/>
                <div>
                    <Button variant='contained' color='primary' onClick={async()=>{
                       if(legalObjectChange)
                           await setLegalObject(legalObjectChange)
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

export default connect(mapStateToProps, mapDispatchToProps)(SetLegalObjects)