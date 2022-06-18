import React, {useState} from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import cardStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import { addReview, acceptReview, deleteReview} from '../src/gql/review'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Confirmation from './dialog/Confirmation';
import { pdDDMMYYHHMM } from '../src/lib'
import Link from 'next/link';

const CardReview = React.memo((props) => {
    const { profile } = props.user;
    const {classes} = cardStyle();
    const { element, setList, list, idx } = props;
    const { isMobileApp } = props.app;
    //addCard
    let [text, setText] = useState(element?element.text:'');
    let handleText =  (event) => {
        setText(event.target.value)
    };
    const types = ['прочее'];
    let [type, setType] = useState(element?element.type:'прочее');
    let handleType =  (event) => {
        setType(event.target.value)
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
                                    <div className={classes.nameField}>Время отзыва:&nbsp;</div>
                                    <div className={classes.value}>{pdDDMMYYHHMM(element.createdAt)}</div>
                                    <div className={classes.status} style={{background: element.taken?'green':'orange'}}>{element.taken?'принят':'обработка'}</div>
                                </div>
                                {
                                    ['admin', 'superadmin'].includes(profile.role)?
                                        <Link href='/legalobject/[id]' as={`/legalobject/${element.legalObject._id}`}>
                                            <a>
                                                <div className={classes.row}>
                                                    <div className={classes.nameField}>
                                                        Налогоплательщик:&nbsp;
                                                    </div>
                                                    <div className={classes.value}>
                                                        {element.legalObject.name}
                                                    </div>
                                                </div>
                                            </a>
                                        </Link>
                                        :
                                        null
                                }
                                <div className={classes.row}>
                                    <div className={classes.nameField}>Тип:&nbsp;</div>
                                    <div className={classes.value}>{element.type}</div>
                                </div>
                                <div className={classes.row}>
                                    <div className={classes.nameField}>Отзыв:&nbsp;</div>
                                    <div className={classes.value}>{element.text}</div>
                                </div>
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
                            </CardContent>
                        </CardActionArea>
                        :
                        <CardActionArea>
                            <CardContent>
                                <FormControl className={classes.input}>
                                    <InputLabel>Тип</InputLabel>
                                    <Select variant='standard'
                                        value={type}
                                        onChange={handleType}
                                    >
                                        {types?types.map((element)=>
                                            <MenuItem key={element} value={element}>{element}</MenuItem>
                                        ):null}
                                    </Select>
                                </FormControl>
                                <br/>
                                <TextField variant='standard'
                                    multiline={true}
                                    style={{width: '100%'}}
                                    label='Отзыв'
                                    value={text}
                                    className={classes.input}
                                    onChange={handleText}
                                />
                            </CardContent>
                        </CardActionArea>
                }
                    {
                        element&&['admin', 'superadmin'].includes(profile.role)&&!element.taken&&profile.add?
                            <CardActions>
                                <Button onClick={async()=>{
                                    const action = async() => {
                                        await acceptReview({_id: element._id})
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
                                                await deleteReview(element._id)
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
                            !element&&profile.legalObject?
                                <CardActions>
                                    <Button onClick={async()=> {
                                    if(text.length>0) {
                                        const action = async () => {
                                            let element = {text: text, type: type}
                                            let res = await addReview(element)
                                            if (res)
                                                setList([res, ...list])
                                        }
                                        setType('прочее')
                                        setText('')
                                        setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                        showMiniDialog(true)
                                    }
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
        user: state.user,
        app: state.app
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardReview)