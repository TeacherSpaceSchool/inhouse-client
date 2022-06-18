import React, {useState} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import cardAdsStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import { addNotificationStatistic } from '../src/gql/notificationStatistic'
import TextField from '@mui/material/TextField';
import { bindActionCreators } from 'redux'
import * as snackbarActions from '../src/redux/actions/snackbar'
import {pdDDMMYYHHMM} from '../src/lib'
import Confirmation from './dialog/Confirmation'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'


const NotificationStatistic = React.memo((props) => {
    const {classes} = cardAdsStyle();
    const { element, setList, list } = props;
    const { isMobileApp } = props.app;
    //addCard
    let [preview, setPreview] = useState('/add.png');
    let [icon, setIcon] = useState(undefined);
    let handleChangeIcon = ((event) => {
        if(event.target.files[0]&&event.target.files[0].size/1024/1024<50){
            setIcon(event.target.files[0])
            setPreview(URL.createObjectURL(event.target.files[0]))
        } else {
            showSnackBar('Файл слишком большой')
        }
    })
    let [title, setTitle] = useState(element?element.title:'');
    let handleTitle =  (event) => {
        setTitle(event.target.value)
    };
    let [text, setText] = useState(element?element.text:'');
    let handleText =  (event) => {
        setText(event.target.value)
    };
    let [tag, setTag] = useState(element?element.tag:'');
    let handleTag =  (event) => {
        setTag(event.target.value)
    };
    let [url, setUrl] = useState(element?element.url:'');
    let handleUrl =  (event) => {
        setUrl(event.target.value)
    };
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    return (
          <> {
                !element ?
                    <Card className={isMobileApp?classes.cardM:classes.cardD}>
                        <label htmlFor={element?element._id:'add'}>
                            <img
                                className={isMobileApp?classes.mediaM:classes.mediaD}
                                src={preview}
                                alt={'Изменить'}
                            />
                        </label>
                        <CardContent>
                                <TextField variant='standard'
                                    label='Заголовок'
                                    value={title}
                                    className={classes.input}
                                    onChange={handleTitle}
                                />
                            <br/>
                            <br/>
                            <TextField variant='standard'
                                label='Текст'
                                value={text}
                                className={classes.input}
                                onChange={handleText}
                            />
                            <br/>
                            <br/>
                            <TextField variant='standard'
                                label='Тэг(не обязательно)'
                                value={tag}
                                className={classes.input}
                                onChange={handleTag}
                            />
                            <br/>
                            <br/>
                            <TextField variant='standard'
                                label='URL(не обязательно)'
                                value={url}
                                className={classes.input}
                                onChange={handleUrl}
                            />
                            </CardContent>
                        <CardActions>
                            <Button onClick={async()=> {
                                if (text.length > 0 && title.length > 0) {
                                    setTitle('')
                                    setText('')
                                    setTag('')
                                    setUrl('')
                                    setPreview('/add.png')
                                    const action = async() => {
                                        let res = await addNotificationStatistic({text: text, title: title, url: url, tag: tag, icon: icon})
                                        setList([res, ...list])
                                    }
                                    setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                    showMiniDialog(true)
                                } else {
                                    showSnackBar('Заполните все поля')
                                }
                            }
                            } color='primary'>
                                Отправить
                            </Button>
                        </CardActions>
                        <input
                            accept='image/*'
                            style={{ display: 'none' }}
                            id={element?element._id:'add'}
                            type='file'
                            onChange={handleChangeIcon}
                        />
                    </Card>
                    :
                    <Card className={isMobileApp?classes.cardM:classes.cardD}>
                        <CardContent>
                            <CardActionArea>
                                <div className={classes.row}>
                                    <div className={classes.nameField}>Создан:&nbsp;</div>
                                    <div className={classes.value}>{pdDDMMYYHHMM(element.createdAt)}</div>
                                </div>
                                <div className={classes.row}>
                                    <div className={classes.nameField}>Заголовок:&nbsp;</div>
                                    <div className={classes.value}>{element.title}</div>
                                </div>
                                <div className={classes.row}>
                                    <div className={classes.nameField}>Текст:&nbsp;</div>
                                    <div className={classes.value}>{element.text}</div>
                                </div>
                                {
                                    element.tag?
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>Тэг:&nbsp;</div>
                                            <div className={classes.value}>{element.tag}</div>
                                        </div>
                                        :
                                        null
                                }
                                {
                                    element.url?
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>URL:&nbsp;</div>
                                            <div className={classes.value}>{element.url}</div>
                                        </div>
                                        :
                                        null
                                }
                                <div className={classes.row}>
                                    <div className={classes.nameField}>Доставлено:&nbsp;</div>
                                    <div className={classes.value}>{element.delivered}</div>
                                </div>
                                {
                                    element.click!=undefined?
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>Кликов:&nbsp;</div>
                                            <div className={classes.value}>{element.click}</div>
                                        </div>
                                        :null
                                }
                                <div className={classes.row}>
                                    <div className={classes.nameField}>Провалено:&nbsp;</div>
                                    <div className={classes.value}>{element.failed}</div>
                                </div>
                            </CardActionArea>
                        </CardContent>
                    </Card>
            }</>
    );
})

function mapStateToProps (state) {
    return {
        app: state.app
    }
}

function mapDispatchToProps(dispatch) {
    return {
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationStatistic)