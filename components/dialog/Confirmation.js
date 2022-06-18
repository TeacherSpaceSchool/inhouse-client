import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as appActions from '../../src/redux/actions/app'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import Button from '@mui/material/Button';

const Confirmation =  React.memo(
    (props) =>{
        const {classes} = dialogContentStyle()
        const { showMiniDialog } = props.mini_dialogActions;
        const { showSnackBar } = props.snackbarActions;
        const { showLoad } = props.appActions;
        const { action, actionCancel } = props;
        return (
            action?
                <center className={classes.line}>
                    <Button variant='outlined' size='large' color='primary' style={{marginRight: 20}} onClick={async()=>{
                        await showMiniDialog(false)
                        await showLoad(true)
                        try {
                            await action()
                        }  catch (err) {
                            console.error(err)
                            showSnackBar('Ошибка', 'error')
                        }
                        await showLoad(false)
                    }}>
                        ДА
                    </Button>
                    <Button variant='outlined' color='secondary' size='large' onClick={async()=>{
                        showMiniDialog(false)
                        if(actionCancel){
                            await actionCancel()
                        }
                    }}>
                        НЕТ
                    </Button>
                </center>
                :
                null
        );
    }
)

function mapStateToProps () {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Confirmation)