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
import VideoViewer from '../components/dialog/VideoViewer'
import ViewText from './dialog/ViewText';

const CardFaq = React.memo((props) => {
    const {classes} = cardFaqStyle();
    const { element, setList, list, idx, edit, deleted } = props;
    const { isMobileApp } = props.app;
    let [file, setFile] = useState(undefined);
    let handleChangeFile = ((event) => {
        if(event.target.files[0]&&event.target.files[0].size/1024/1024<50){
            setFile(event.target.files[0])
            setUrl(true)
        } else {
            showSnackBar('Файл слишком большой')
        }
    })
    let [text, setText] = useState(element&&element.text?element.text:'');
    let [name, setName] = useState(element&&element.name?element.name:'');
    let [video, setVideo] = useState(element&&element.video?element.video:'');
    let handleVideo =  (event) => {
        setVideo(event.target.value)
    };
    let [url, setUrl] = useState(element&&element.url?element.url:false);
    let handleName =  (event) => {
        setName(event.target.value)
    };
    const { setMiniDialog, showMiniDialog, showFullDialog, setFullDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    let faqRef = useRef(null);
    return (
        <>
        {
            !element||edit||deleted?
                <Card className={isMobileApp?classes.cardM:classes.cardD}>
                    <CardContent>
                        <TextField
                            variant='standard'
                            label='Название'
                                   id='name'
                                   value={name}
                            className={classes.input}
                            onChange={handleName}
                        />
                        <TextField
                            variant='standard'
                                   id='video'
                                   label='Видео'
                            value={video}
                            className={classes.input}
                            onChange={handleVideo}
                        />
                        <br/>
                        <br/>
                        <Button size='small' color={url?'primary':'secondary'} onClick={async()=>{faqRef.current.click()}}>
                            Загрузить инструкцию
                        </Button>
                        <br/>
                        <br/>
                        <Button size='small' color={text?'primary':'secondary'} onClick={()=>{
                            setMiniDialog(name, <ViewText text={text} setText={setText}/>)
                            showMiniDialog(true)
                        }}>
                            Редактировать текст
                        </Button>
                    </CardContent>
                    <CardActions>
                        {
                            element!==undefined?
                                <>
                                {
                                    edit?
                                        <Button onClick={async()=>{
                                            let editElement = {_id: element._id}
                                            if(name.length>0&&name!==element.name)editElement.name = name
                                            if(video!==element.video)editElement.video = video
                                            if(file!==undefined)editElement.file = file
                                            if(text!==element.text)editElement.text = text
                                            const action = async() => {
                                                await setFaq(editElement)
                                            }
                                            setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                            showMiniDialog(true)
                                        }} color='primary'>
                                            Сохранить
                                        </Button>
                                        :
                                        null
                                }
                                {
                                    deleted?
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
                                        :
                                        null
                                }
                                </>
                                :
                                <Button onClick={async()=> {
                                    if (name.length > 0) {
                                        const action = async() => {
                                            setList([
                                                await addFaq({video, file, name, text}),
                                                ...list
                                            ])
                                        }
                                        setFile(undefined)
                                        setName('')
                                        setText('')
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
                                        <Button size='small' onClick={async()=> {
                                            setFullDialog(element.name, <VideoViewer video={element.video}/>)
                                            showFullDialog(true)
                                        }} color='primary'>
                                            Просмотреть видео инструкцию
                                        </Button>
                                        <br/>
                                        </>
                                        :
                                        null
                                }
                                {
                                    element.url?
                                        <>
                                        <br/>
                                        <Button size='small' onClick={async()=> {
                                            window.open(url,'_blank')
                                        }} color='primary'>
                                            Прочитать инструкцию
                                        </Button>
                                        <br/>
                                        </>
                                        :
                                        null
                                }
                                {
                                    element.text?
                                        <>
                                        <br/>
                                        <Button size='small' color='primary' onClick={()=>{
                                            setMiniDialog(name, <ViewText text={text}/>)
                                            showMiniDialog(true)
                                        }}>
                                            Прочитать текст
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