import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Snackbar from '@mui/material/Snackbar';
import * as snackbarActions from '../../src/redux/actions/snackbar'
import { Alert } from '@mui/material';

const MyDialog =  React.memo(
    (props) =>{
        const { title, show, type } = props.snackbar;
        const { closeSnackBar } = props.snackbarActions;
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={show}
                autoHideDuration={6000}
                onClose={closeSnackBar}
            >
                <Alert variant='filled' severity={type?type:'warning'} onClose={closeSnackBar}>
                    {title?title.toUpperCase():'Ошибка'}
                </Alert>
            </Snackbar>
        );
    }
)

function mapStateToProps (state) {
    return {
        snackbar: state.snackbar
    }
}

function mapDispatchToProps(dispatch) {
    return {
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyDialog)