import React, { useState } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'

const AddSocial =  React.memo(
    (props) =>{
        const { classes } = dialogContentStyle();
        const { action, idx, social } = props;
        let [url, setUrl] = useState(social?social:'');
        const { isMobileApp } = props.app;
        const { showMiniDialog } = props.mini_dialogActions;
        const width = isMobileApp? (window.innerWidth-112) : 500
        return (
            <div className={classes.main}>
            <TextField variant='standard'
                style={{width: width}}
                label='URL'
                className={classes.textField}
                margin='normal'
                onKeyPress={async event => {
                    if (event.key === 'Enter') {
                        await action(url, idx);
                        showMiniDialog(false);
                    }
                }}
                value={url}
                onChange={(event)=>{setUrl(event.target.value)}}
            />
                <br/>
                <div>
                    <Button variant="contained" color="primary" onClick={async()=>{
                       await action(url, idx);
                       showMiniDialog(false);
                    }} className={classes.button}>
                        Сохранить
                    </Button>
                    <Button variant="contained" color="secondary" onClick={()=>{showMiniDialog(false);}} className={classes.button}>
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddSocial)