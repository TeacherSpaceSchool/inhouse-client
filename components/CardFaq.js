import React, {useState, useRef} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import cardFaqStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import { deleteFaq, addFaq, setFaq } from '../src/gql/faq'
import TextField from '@mui/material/TextField';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import * as snackbarActions from '../src/redux/actions/snackbar'
import Confirmation from './dialog/Confirmation'
import PdfViewer from '../components/dialog/PdfViewer'
import VideoViewer from '../components/dialog/VideoViewer'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Input from '@mui/material/Input';

const CardFaq = React.memo((props) => {
    const {classes} = cardFaqStyle();
    const { element, setList, list, idx } = props;
    const { profile } = props.user;
    const { isMobileApp } = props.app;
    //addCard
    let [file, setFile] = useState(undefined);
    let handleChangeFile = ((event) => {
        if(event.target.files[0]&&event.target.files[0].size/1024/1024<50){
            setFile(event.target.files[0])
            setUrl(true)
        } else {
            showSnackBar('Файл слишком большой')
        }
    })
    let [name, setName] = useState(element&&element.name?element.name:'');
    let [video, setVideo] = useState(element&&element.video?element.video:'');
    let handleVideo =  (event) => {
        setVideo(event.target.value)
    };
    let [url, setUrl] = useState(element&&element.url?element.url:false);
    let handleName =  (event) => {
        setName(event.target.value)
    };
    let _roles = ['кассир', 'оператор', 'супервайзер', 'управляющий']
    let [roles, setRoles] = useState(element&&element.roles?element.roles:[]);
    let handleRoles =  (event) => {
        setRoles(event.target.value)
    };
    const { setMiniDialog, showMiniDialog, showFullDialog, setFullDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    let faqRef = useRef(null);
    return (
        <>
        {
            ['admin', 'superadmin'].includes(profile.role)&&profile.add?
                <Card className={isMobileApp?classes.cardM:classes.cardD}>
                    <CardContent>
                        <FormControl className={classes.input}>
                            <InputLabel>Роли</InputLabel>
                            <Select variant='standard'
                                multiple
                                value={roles}
                                onChange={handleRoles}
                                input={<Input/>}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 500,
                                            width: 250,
                                        },
                                    },
                                }}
                            >
                                {_roles.map((role) => (
                                    <MenuItem key={role} value={role}
                                              style={{background: roles.includes(role) ? '#f5f5f5' : '#ffffff'}}>
                                        {role}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <br/>
                        <br/>
                        <TextField variant='standard'
                            label='Название'
                            value={name}
                            className={classes.input}
                            onChange={handleName}
                        />
                        <br/>
                        <br/>
                        <TextField variant='standard'
                            label='Видео'
                            value={video}
                            className={classes.input}
                            onChange={handleVideo}
                        />
                        <br/>
                        <br/>
                        <Button color={url?'primary':'secondary'} onClick={async()=>{faqRef.current.click()}}>
                            Загрузить инструкцию
                        </Button>
                    </CardContent>
                    <CardActions>
                        {
                            element!==undefined?
                                <>
                                <Button onClick={async()=>{
                                    let editElement = {_id: element._id}
                                    if(name.length>0&&name!==element.name)editElement.name = name
                                    if(video!==element.video)editElement.video = video
                                    if(file!==undefined)editElement.file = file
                                    if(JSON.stringify(roles)!==JSON.stringify(element.roles))editElement.roles = roles
                                    const action = async() => {
                                        await setFaq(editElement)
                                    }
                                    setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                    showMiniDialog(true)
                                }} color='primary'>
                                    Сохранить
                                </Button>
                                <Button onClick={async()=>{
                                    const action = async() => {
                                        await deleteFaq(element._id)
                                        let _list = [...list]
                                        _list.splice(idx, 1)
                                        setList(_list)
                                    }
                                    setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                    showMiniDialog(true)
                                }} color='secondary'>
                                    Удалить
                                </Button>
                                </>
                                :
                                <Button onClick={async()=> {
                                    if (name.length > 0) {
                                        const action = async() => {
                                            setList([
                                                await addFaq({roles: roles, video: video, file: file, name: name}),
                                                ...list
                                            ])
                                        }
                                        setFile(undefined)
                                        setName('')
                                        setRoles([])
                                        setVideo('')
                                        setUrl(false)
                                        setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                        showMiniDialog(true)
                                    } else {
                                        showSnackBar('Заполните все поля')
                                    }
                                }} color='primary'>
                                    Добавить
                                </Button>
                        }
                    </CardActions>
                    <input
                        accept='application/pdf'
                        style={{ display: 'none' }}
                        ref={faqRef}
                        type='file'
                        onChange={handleChangeFile}
                    />
                </Card>
                :
                element!==undefined?
                    <Card className={isMobileApp?classes.cardM:classes.cardD}>
                        <CardActionArea>
                            <CardContent>
                                <h3 className={classes.input}>
                                    {element.name}
                                </h3>
                                {
                                    video?
                                        <>
                                        <br/>
                                        <Button onClick={async()=> {
                                            setFullDialog(element.name, <VideoViewer video={element.video}/>)
                                            showFullDialog(true)
                                        }} color='primary'>
                                            Просмотреть видео инструкцию
                                        </Button>
                                        </>
                                        :
                                        null
                                }
                                {
                                    element.url?
                                        <>
                                        <br/>
                                        <br/>
                                        <Button onClick={async()=> {
                                            setFullDialog(element.name, <PdfViewer pdf={element.url}/>)
                                            showFullDialog(true)
                                        }} color='primary'>
                                            Прочитать инструкцию
                                        </Button>
                                        </>
                                        :
                                        null
                                }
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    :null
        }</>
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

export default connect(mapStateToProps, mapDispatchToProps)(CardFaq)