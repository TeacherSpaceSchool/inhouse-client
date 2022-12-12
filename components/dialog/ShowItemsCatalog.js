import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import Button from '@mui/material/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'

const ShowitemsCatalog =  React.memo(
    (props) =>{
        const { classes } = dialogContentStyle();
        const { list } = props;
        const { isMobileApp } = props.app;
        const { showMiniDialog, showFullDialog } = props.mini_dialogActions;
        const width = isMobileApp? (window.innerWidth-113) : 500
        return (
            <div className={classes.main} style={{width}}>
                <div className={isMobileApp?classes.fullDialogBody:classes.miniDialogBody}>
                    {
                        list&&list.map((element)=> <div key={element.item}>
                            <div className={classes.row}>
                                <div className={classes.value} style={{marginBottom: 5}}>
                                    {element.name}: {element.count} {element.unit}
                                </div>
                            </div>
                        </div>)
                    }
                </div>
                <div>
                    <Button variant='contained' color='secondary' onClick={()=>{
                        showMiniDialog(false);
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
        app: state.app,
        user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowitemsCatalog)