import React, {useState} from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import cardStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import { addApplicationToConnect, acceptApplicationToConnect, deleteApplicationToConnect, setApplicationToConnect} from '../src/gql/connectionApplication'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import * as snackbarActions from '../src/redux/actions/snackbar'
import TextField from '@mui/material/TextField';
import Confirmation from './dialog/Confirmation';
import { pdDDMMYYHHMM } from '../src/lib'

const CardConnectionApplication = React.memo((props) => {
    const { profile } = props.user;
    const {classes} = cardStyle();
    const { element, setList, list, idx } = props;
    const { showSnackBar } = props.snackbarActions;
    const { isMobileApp } = props.app;
    //addCard
    let [name, setName] = useState(element?element.name:'');
    let handleName =  (event) => {
        setName(event.target.value)
    };
    let [phone, setPhone] = useState(element?element.phone:'');
    let handlePhone =  (event) => {
        setPhone(event.target.value)
    };
    let [comment, setComment] = useState(element?element.comment:'');
    let handleComment =  (event) => {
        setComment(event.target.value)
    };
    let [address, setAddress] = useState(element?element.address:'');
    let handleAddress =  (event) => {
        setAddress(event.target.value)
    };
    let [whereKnow, setWhereKnow] = useState(element?element.whereKnow:'');
    let handleWhereKnow =  (event) => {
        setWhereKnow(event.target.value)
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
                                    <div className={classes.nameField}>Время заявки:&nbsp;</div>
                                    <div className={classes.value}>{pdDDMMYYHHMM(element.createdAt)}</div>
                                    <div className={classes.status} style={{background: element.taken?'green':'orange'}}>{element.taken?'принят':'обработка'}</div>
                                </div>
                                <div className={classes.row}>
                                    <div className={classes.nameField}>Имя:&nbsp;</div>
                                    <div className={classes.value}>{element.name}</div>
                                </div>
                                <div className={classes.row}>
                                    <div className={classes.nameField}>Телефон:&nbsp;</div>
                                    <div className={classes.value}>{element.phone}</div>
                                </div>
                                {
                                    element.address?
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>Адрес:&nbsp;</div>
                                            <div className={classes.value}>{element.address}</div>
                                        </div>
                                        :
                                        null
                                }
                                {
                                    element.whereKnow?
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>Откуда узнали:&nbsp;</div>
                                            <div className={classes.value}>{element.whereKnow}</div>
                                        </div>
                                        :
                                        null
                                }
                                {
                                    element.who&&['admin', 'superadmin'].includes(profile.role)?
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                Принял:&nbsp;
                                            </div>
                                            <div className={classes.value}>
                                                {element.who.role} {element.who.name}
                                            </div>
                                        </div>
                                        :
                                        null
                                }
                                {
                                    ['admin', 'superadmin', 'оператор'].includes(profile.role)&&profile.add?
                                        !element.taken?
                                            <TextField variant='standard'
                                                style={{width: '100%'}}
                                                label='Комментарий'
                                                value={comment}
                                                className={classes.input}
                                                onChange={handleComment}
                                            />
                                            :
                                            comment?
                                                <div className={classes.row}>
                                                    <div className={classes.nameField}>
                                                        Комментарий:&nbsp;
                                                    </div>
                                                    <div className={classes.value}>
                                                        {comment}
                                                    </div>
                                                </div>
                                                :
                                                null
                                        :
                                        null
                                }
                            </CardContent>
                        </CardActionArea>
                        :
                        <CardActionArea>
                            <CardContent>
                                <TextField variant='standard'
                                    style={{width: '100%'}}
                                    label='Имя'
                                    value={name}
                                    error={!name}
                                    className={classes.input}
                                    onChange={handleName}
                                />
                                <br/>
                                <br/>
                                <TextField variant='standard'
                                    style={{width: '100%'}}
                                    label='Телефон'
                                    error={!phone}
                                    value={phone}
                                    className={classes.input}
                                    onChange={handlePhone}
                                />
                                <br/>
                                <br/>
                                <TextField variant='standard'
                                    style={{width: '100%'}}
                                    label='Адрес'
                                    value={address}
                                    className={classes.input}
                                    onChange={handleAddress}
                                />
                                <br/>
                                <br/>
                                <TextField variant='standard'
                                    style={{width: '100%'}}
                                    label='Откуда узнали'
                                    value={whereKnow}
                                    className={classes.input}
                                    onChange={handleWhereKnow}
                                />
                                <br/>
                            </CardContent>
                        </CardActionArea>
                }
                    {
                        element&&['admin', 'superadmin', 'оператор'].includes(profile.role)&&!element.taken&&profile.add?
                            <CardActions>
                                <Button onClick={async()=>{
                                    const action = async() => {
                                        await setApplicationToConnect({_id: element._id, comment})
                                    }
                                    setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                    showMiniDialog(true)
                                }} color='primary'>
                                    Сохранить
                                </Button>
                                <Button onClick={async()=>{
                                    const action = async() => {
                                        await acceptApplicationToConnect({_id: element._id})
                                        let _list = [...list]
                                        _list[idx].taken = true
                                        setList(_list)
                                    }
                                    setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                    showMiniDialog(true)
                                }} color='primary'>
                                    Принять
                                </Button>
                                {
                                    profile.role==='superadmin'?
                                        <Button onClick={async()=>{
                                            const action = async() => {
                                                await deleteApplicationToConnect(element._id)
                                                let _list = [...list]
                                                _list.splice(_list.indexOf(element), 1)
                                                setList(_list)
                                            }
                                            setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                            showMiniDialog(true)
                                        }} color='secondary'>
                                            Удалить
                                        </Button>
                                        :
                                        null
                                }
                            </CardActions>
                            :
                            !element&&!profile.role?
                                <CardActions>
                                    <Button onClick={async()=> {
                                    if(name.length>0&&phone.length>0) {
                                        const action = async () => {
                                            let res = await addApplicationToConnect({name, phone, address, whereKnow})
                                            if(res) {
                                                setList([res, ...list])
                                                setName('')
                                                setPhone('')
                                                setWhereKnow('')
                                                setAddress('')
                                                showSnackBar('Заявка отправлена', 'success')
                                            }
                                            else
                                                showSnackBar('Ошибка', 'error')
                                        }
                                        setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                        showMiniDialog(true)
                                    }
                                    else
                                        showSnackBar('Заполните все поля')
                                }} color='primary'>
                                        Отправить
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
        user: state.user,
        app: state.app
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardConnectionApplication)