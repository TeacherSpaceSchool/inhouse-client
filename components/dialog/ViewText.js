import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import Button from '@mui/material/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'

const History =  React.memo(
    (props) =>{
        const { classes } = dialogContentStyle();
        const { text } = props;
        const { showMiniDialog } = props.mini_dialogActions;
        return (
            <div className={classes.main}>
                <div className={classes.value}>
                    {text}
                </div>
                <br/>
                <Button variant='contained' color='secondary' onClick={()=>{showMiniDialog(false);}} className={classes.button}>
                    Закрыть
                </Button>
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(History)