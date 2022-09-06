import React, { useState } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import {clearDB} from '../../src/gql/error'
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
import * as snackbarActions from '../../src/redux/actions/snackbar'
import Router from 'next/router'
import Confirmation from './Confirmation'

const ClearDB =  React.memo(
    (props) =>{
        const { classes } = dialogContentStyle();
        const { showSnackBar } = props.snackbarActions;
        let [password, setPassword] = useState('');
        let handlePassword =  (event) => {
            setPassword(event.target.value)
        };
        let [hide, setHide] = useState(true);
        let handleHide =  () => {
            setHide(!hide)
        };
        const { isMobileApp } = props.app;
        const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
        const width = isMobileApp? (window.innerWidth-113) : 500
        return (
            <div className={classes.main} style={{width}}>
                <br/>
                <FormControl className={classNames(classes.margin, classes.input)}>
                    <InputLabel>Пароль</InputLabel>
                    <Input
                        type='text'
                        style={hide?{textSecurity: 'disc', WebkitTextSecurity: 'disc'}:{}}
                        value={password}
                        onChange={handlePassword}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton aria-label="Toggle password visibility" onClick={handleHide}>
                                    {hide ? <VisibilityOff />:<Visibility />  }
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <div>
                    <Button variant="contained" color="secondary" onClick={()=>showMiniDialog(false)} className={classes.button}>
                        Закрыть
                    </Button>
                    <Button variant="contained" color="primary" onClick={async()=>{
                        if(password.length) {
                            const action = async () => {
                                let res = await clearDB(password)
                                if (res === 'ERROR')
                                    showSnackBar('Ошибка', 'error')
                                else
                                    Router.reload()
                            }
                            setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                        }
                        else
                            showSnackBar('Ошибка', 'error')
                    }} className={classes.button}>
                        Очистить
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
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClearDB)