import React  from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import Button from '@mui/material/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import QRCode from 'react-qr-code';

const QR =  React.memo(
    (props) =>{
        const { classes } = dialogContentStyle();
        const { value } = props;
        const { showMiniDialog } = props.mini_dialogActions;
        return (
            <div className={classes.main}>
                <QRCode value={value}/>
                <br/>
                <div>
                    <Button variant='contained' color='secondary' onClick={()=>{showMiniDialog(false);}} className={classes.button}>
                        Закрыть
                    </Button>
                </div>
            </div>
        );
    }
)

function mapStateToProps () {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QR)