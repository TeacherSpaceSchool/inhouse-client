import React, { useState } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import * as userActions from '../../src/redux/actions/user'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import classNames from 'classnames';
import IconButton from '@mui/material/IconButton';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import Link from 'next/link';

const Sign =  React.memo(
    (props) =>{
        const { classes } = dialogContentStyle();
        let [loginEnter, setLoginEnter] = useState('');
        let [passEnter, setPassEnter] = useState('');
        let handlePassEnter =  (event) => {
            setPassEnter(event.target.value)
        };
        let handleLoginEnter =  (event) => {
            setLoginEnter(event.target.value)
        };
        let [hide, setHide] = useState(true);
        const { error } = props.user;
        const { isMobileApp } = props.app;
        const { showMiniDialog } = props.mini_dialogActions;
        const { signin, clearError } = props.userActions;
        const width = isMobileApp? (window.innerWidth-113) : 500
        return (
            <div className={classes.main} style={{width}}>
                <TextField
                    variant='standard'
                    label='Логин'
                    type='login'
                    className={classes.input}
                    margin='normal'
                    value={loginEnter}
                    onChange={handleLoginEnter}
                    onKeyPress={event => {
                        if (event.key === 'Enter'&&loginEnter.length>0&&passEnter.length>8)
                            signin({login: loginEnter, password: passEnter})
                    }}
                />
                <br/>
                <FormControl className={classNames(classes.margin, classes.input)}>
                    <InputLabel>Пароль</InputLabel>
                    <Input
                        type={hide?'password':'text'}
                        value={passEnter}
                        onChange={handlePassEnter}
                        onKeyPress={event => {
                            if (event.key === 'Enter'&&loginEnter.length>0&&passEnter.length>0)
                                signin({login: loginEnter, password: passEnter})
                        }}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton aria-label="Toggle password visibility" onClick={()=>setHide(!hide)}>
                                    {hide ? <VisibilityOff />:<Visibility />  }
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                {error?
                    <div className={classes.error_message}>{error}</div>
                    :
                    <br/>
                }
                <div>
                    <Button variant="contained" color="secondary" onClick={()=>{
                        clearError()
                        showMiniDialog(false);
                    }} className={classes.button}>
                        Закрыть
                    </Button>
                    <Button variant="contained" color="primary" onClick={()=>{
                        if(loginEnter.length>0&&passEnter.length>0) {
                            signin({login: loginEnter, password: passEnter})
                        }
                    }} className={classes.button}>
                        Войти
                    </Button>
                </div>
            </div>
        );
    }
)

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sign)