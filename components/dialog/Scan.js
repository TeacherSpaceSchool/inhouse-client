import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import * as appActions from '../../src/redux/actions/app'
import Button from '@mui/material/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import QrScanner from '@yudiel/react-qr-scanner';
import * as snackbarActions from '../../src/redux/actions/snackbar'

const Scan =  React.memo(
    (props) =>{
        const { classes } = dialogContentStyle();
        const { showFullDialog } = props.mini_dialogActions;
        const { setSearch, setFilter } = props.appActions;
        const { isMobileApp, filter } = props.app;
        return (
            <div className={classes.main} style={{width: '100%'}}>
                <div style={{width: isMobileApp?'calc(100vw - 48px)':'calc(100vh - 155px)', height: 'calc(100vh - 155px)'}}>
                    <QrScanner
                        constraints={{
                            facingMode: 'environment'
                        }}
                        onDecode={(res)=>{
                            showFullDialog(false);
                            setSearch(res)
                            setFilter({
                                ...filter,
                                item: null,
                                factory: null,
                                category: null
                            })
                        }}
                        scanDelay={100}
                    />
                </div>
                <div>
                    <Button variant='contained' color='secondary' onClick={()=>{
                        showFullDialog(false);
                    }} className={classes.button}>
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
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scan)