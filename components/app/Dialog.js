import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'

const MyDialog =  React.memo(
    (props) =>{
        const { title, child, show  } = props.mini_dialog;
        const { showMiniDialog } = props.mini_dialogActions;
        return (
                <Dialog
                    open={show}
                    onClose={()=>{showMiniDialog(false)}}
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'>
                    <DialogTitle onClose={()=>{showMiniDialog(false)}}><center>{title}</center></DialogTitle>
                    <DialogContent>
                        {child}
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