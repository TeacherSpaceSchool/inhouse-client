import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'

const MyDialog =  React.memo(
    (props) =>{
        const { titleFull, childFull, showFull } = props.mini_dialog;
        const { showFullDialog } = props.mini_dialogActions;
        return (
                <Dialog
                    fullScreen={true}
                    open={showFull}
                    onClose={()=>{showFullDialog(false)}}
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'>
                    <DialogTitle onClose={()=>{showFullDialog(false)}}>{titleFull}</DialogTitle>
                    <DialogContent>
                        {childFull}
                    </DialogContent>
                </Dialog>
        );
    }
)

function mapStateToProps (state) {
    return {
        mini_dialog: state.mini_dialog
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyDialog);