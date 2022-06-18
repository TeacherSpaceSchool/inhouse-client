import React, {useState} from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import cardStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import { addTariff} from '../src/gql/tariff'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import TextField from '@mui/material/TextField';
import Confirmation from './dialog/Confirmation';
import { pdDDMMYYHHMM, inputInt, checkInt } from '../src/lib'

const CardTariff = React.memo((props) => {
    const {classes} = cardStyle();
    const { element, setList, list } = props;
    const { isMobileApp } = props.app;
    //addCard
    let [pkkm, setPkkm] = useState(element?element.pkkm:'');
    let handlePkkm =  (event) => {
        setPkkm(inputInt(event.target.value))
    };
    let [ofd, setOfd] = useState(element?element.ofd:'');
    let handleOfd =  (event) => {
        setOfd(inputInt(event.target.value))
    };
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    return (
        <div>
            <Card className={isMobileApp?classes.cardM:classes.cardD}>
                {
                    element?
                        <CardActionArea>
                            <CardContent>
                                <div className={classes.row}>
                                    <div className={classes.nameField}>Дата:&nbsp;</div>
                                    <div className={classes.value}>{pdDDMMYYHHMM(element.createdAt)}</div>
                                </div>
                                <div className={classes.row}>
                                    <div className={classes.nameField}>Кто:&nbsp;</div>
                                    <div className={classes.value}>{!element.user?'неизвестно':element.user.name?element.user.name:'superadmin'}</div>
                                </div>
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        ККМ:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {pkkm} сом
                                    </div>
                                </div>
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        ОФД:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {ofd} сом
                                    </div>
                                </div>
                            </CardContent>
                        </CardActionArea>
                        :
                        <CardActionArea>
                            <CardContent>
                                <TextField variant='standard'
                                    label='ККМ'
                                    value={pkkm}
                                    className={classes.input}
                                    onChange={handlePkkm}
                                />
                                <TextField variant='standard'
                                    label='ОФД'
                                    value={ofd}
                                    className={classes.input}
                                    onChange={handleOfd}
                                />
                            </CardContent>
                        </CardActionArea>
                }
                    {
                        !element?
                            <CardActions>
                                <Button onClick={async()=> {
                                    setOfd('')
                                    setPkkm('')
                                    const action = async () => {
                                        setList([(await addTariff({
                                            pkkm: checkInt(pkkm),
                                            ofd: checkInt(ofd)
                                        })), ...list])
                                    }
                                    setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                    showMiniDialog(true)
                                }} color='primary'>
                                    Добавить
                                </Button>
                            </CardActions>
                            :
                            null
                    }
                    </Card>
        </div>
    );
})

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

export default connect(mapStateToProps, mapDispatchToProps)(CardTariff)