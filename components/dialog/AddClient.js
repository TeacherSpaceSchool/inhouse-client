import React, { useState, useRef } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import * as appActions from '../../src/redux/actions/app'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import {addClient} from '../../src/gql/client'
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import Remove from '@mui/icons-material/Remove';
import { validPhone1, validMail, inputPhone } from '../../src/lib'

const AddClient =  React.memo(
    (props) =>{
        const { classes } = dialogContentStyle();
        const { setClient, value, setInputValue, legalObject } = props;
        const { isMobileApp } = props.app;
        const { showMiniDialog } = props.mini_dialogActions;
        const { showSnackBar } = props.snackbarActions;
        const width = isMobileApp? (window.innerWidth-112) : 500
        const { setShowAppBar, setShowLightbox, setImagesLightbox, setIndexLightbox } = props.appActions;
        let [name, setName] = useState(value);
        let [info, setInfo] = useState('');
        let [inn, setInn] = useState('');
        let [files, setFiles] = useState([]);
        let [uploads, setUploads] = useState([]);
        let [address, setAddress] = useState('');
        let [phone, setPhone] = useState([]);
        let addPhone = ()=>{
            phone = [...phone, '']
            setPhone(phone)
        };
        let editPhone = (event, idx)=>{
            phone[idx] = inputPhone(event.target.value)
            setPhone([...phone])
        };
        let deletePhone = (idx)=>{
            phone.splice(idx, 1);
            setPhone([...phone])
        };
        let [email, setEmail] = useState([]);
        let addEmail = ()=>{
            email = [...email, '']
            setEmail(email)
        };
        let editEmail = (event, idx)=>{
            email[idx] = event.target.value
            setEmail([...email])
        };
        let deleteEmail = (idx)=>{
            email.splice(idx, 1);
            setEmail([...email])
        };
        let fileRef = useRef(null);
        let handleChangeFile = (async (event) => {
            if(files.length<5) {
                if(event.target.files[0]&&event.target.files[0].size / 1024 / 1024 < 50) {
                    setUploads([event.target.files[0], ...uploads])
                    setFiles([URL.createObjectURL(event.target.files[0]), ...files])
                } else {
                    showSnackBar('Файл слишком большой')
                }
            } else {
                showSnackBar('Cлишком много документов')
            }
        })
        return (
            <div className={classes.main}>
                <TextField variant='standard'
                    style={{width: width}}
                    className={classes.textField}
                    label='Имя'
                    margin='normal'
                    value={name}
                    onChange={(event)=>{setName(event.target.value)}}
                />
                <TextField variant='standard'
                    style={{width: width}}
                    className={classes.textField}
                    label='ИНН'
                    margin='normal'
                    value={inn}
                    onChange={(event)=>{setInn(event.target.value)}}
                />
                <TextField variant='standard'
                    label='Адрес'
                    style={{width: width}}
                    className={classes.textField}
                    margin='normal'
                    value={address}
                    onChange={(event)=>{setAddress(event.target.value)}}
                />
                {phone?phone.map((element, idx)=>
                    <FormControl key={`phone${idx}`}
                                 style={{width: width}}
                                 className={classes.textField}>
                        <InputLabel error={!validPhone1(element)}>Телефон. Формат: +996556899871</InputLabel>
                        <Input
                            startAdornment={<InputAdornment position='start'>+996</InputAdornment>}
                            error={!validPhone1(element)}
                            placeholder='Телефон. Формат: +996556899871'
                            value={element}
                            style={{width: width}}
                            className={classes.textField}
                            onChange={(event)=>{editPhone(event, idx)}}
                            endAdornment={
                                <InputAdornment position='end'>
                                    <IconButton
                                        onClick={()=>{
                                            deletePhone(idx)
                                        }}
                                        aria-label='toggle password visibility'
                                    >
                                        <Remove/>
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                ): null}
                <Button onClick={async()=>{
                    addPhone()
                }} color='primary'>
                    Добавить телефон
                </Button>
                {email?email.map((element, idx)=>
                    <FormControl key={`email${idx}`} style={{width: width}}
                    className={classes.textField}>
                        <InputLabel error={!validMail(element)}>Email</InputLabel>
                        <Input
                            error={!validMail(element)}
                            placeholder='Email'
                            value={element}
                            style={{width: width}}
                            className={classes.textField}
                            onChange={(event)=>{editEmail(event, idx)}}
                            endAdornment={
                                <InputAdornment position='end'>
                                    <IconButton
                                        onClick={()=>{
                                            deleteEmail(idx)
                                        }}
                                        aria-label='toggle password visibility'
                                    >
                                        <Remove/>
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                ): null}
                <Button onClick={async()=>{
                    addEmail()
                }} color='primary'>
                    Добавить email
                </Button>
                <br/>
                <div className={classes.row}>
                    <div className={classes.nameField}>Документы:</div>
                    <div className={classes.noteImageList}>
                        <img className={classes.noteImage} src='/add.png' onClick={()=>{fileRef.current.click()}} />
                        {files.map((element, idx)=> <div className={classes.noteImageDiv}>
                            <img className={classes.noteImage} src={element} onClick={()=>{
                                setShowAppBar(false)
                                setShowLightbox(true)
                                setImagesLightbox(files)
                                setIndexLightbox(idx)
                            }}/>
                            <div className={classes.noteImageButton} style={{background: 'red'}} onClick={()=>{
                                files.splice(idx, 1)
                                setFiles([...files])
                            }}>X</div>
                        </div>)}
                    </div>
                </div>
                <TextField variant='standard'
                    multiline={true}
                    label='Информация'
                    value={info}
                    style={{width: width}}
                    className={classes.textField}
                    onChange={(event)=>{setInfo(event.target.value)}}
                />
                <br/>
                <div>
                    <Button variant='contained' color='primary' onClick={async()=>{
                        if(name.length) {
                            setInputValue(name)
                            setClient(await addClient({legalObject, phone, name, inn, uploads, email, address, info}))
                            showMiniDialog(false)
                        } else
                            showSnackBar('Заполните все поля')
                    }} className={classes.button}>
                        Сохранить
                    </Button>
                    <Button variant='contained' color='secondary' onClick={()=>{showMiniDialog(false);}} className={classes.button}>
                        Закрыть
                    </Button>
                </div>
                <input
                    ref={fileRef}
                    accept='image/*'
                    style={{ display: 'none' }}
                    id='contained-button-file'
                    type='file'
                    onChange={handleChangeFile}
                />
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
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddClient)