import React, {useState} from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import Button from '@mui/material/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import TextField from '@mui/material/TextField';

const History =  React.memo(
    (props) =>{
        const { classes } = dialogContentStyle();
        const { isMobileApp } = props.app;
        const { text, setText } = props;
        const { showMiniDialog } = props.mini_dialogActions;
        const width = isMobileApp? (window.innerWidth-113) : 500
        const [_text, _setText] = useState(text)
        return (
            <div className={classes.main} style={{width}}>
                {
                    setText?
                        <TextField
                            id='text'
                            variant='standard'
                            onChange={(event) => {
                                _setText(event.target.value)
                            }}
                            label='Текст'
                            multiline={true}
                            maxRows='10'
                            value={_text}
                            className={classes.input}
                        />
                        :
                        <div className={classes.value}>
                            {text}
                        </div>
                }
                <br/>
                <div>
                    {
                        setText?
                            <Button variant='contained' color='primary' onClick={()=>{
                                setText(_text)
                                showMiniDialog(false);
                            }} className={classes.button}>
                                Сохранить
                            </Button>
                            :
                            null
                    }
                    <Button variant='contained' color='secondary' onClick={()=>{showMiniDialog(false);}} className={classes.button}>
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

export default connect(mapStateToProps, mapDispatchToProps)(History)