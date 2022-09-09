import React, { useState } from 'react';
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
import { validPhone1, validMail, inputPhone, pdDatePicker, validPhones1, validMails } from '../../src/lib'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import ConsultationEdit from './ConsultationEdit'

const levels = ['Бронза', 'Серебро', 'Золото', 'Платина']

const AddClient =  React.memo(
    (props) =>{
        const { classes } = dialogContentStyle();
        const { value, setClient, _consultation, closeConsultation } = props;
        const { isMobileApp, consultation } = props.app;
        const { setConsultation } = props.appActions;
        const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
        const { showSnackBar } = props.snackbarActions;
        const width = isMobileApp? (window.innerWidth-113) : 500
        let [name, setName] = useState(value);
        let [work, setWork] = useState('');
        let [passport, setPassport] = useState('');
        let [inn, setInn] = useState('');
        let [level, setLevel] = useState('');
        let handleLevel = (event) => {
            setLevel(event.target.value)
        };
        let [birthday, setBirthday] = useState(pdDatePicker(new Date()));
        let [info, setInfo] = useState('');
        let [address, setAddress] = useState('');
        let [address1, setAddress1] = useState('');
        let [emails, setEmails] = useState([]);
        let addEmails = ()=>{
            emails = [...emails, '']
            setEmails(emails)
        };
        let editEmails = (event, idx)=>{
            emails[idx] = event.target.value
            setEmails([...emails])
        };
        let deleteEmails = (idx)=>{
            emails.splice(idx, 1);
            setEmails([...emails])
        };
        let [phones, setPhones] = useState([]);
        let addPhones = ()=>{
            phones = [...phones, '']
            setPhones(phones)
        };
        let editPhones = (event, idx)=>{
            phones[idx] = inputPhone(event.target.value)
            setPhones([...phones])
        };
        let deletePhones = (idx)=>{
            phones.splice(idx, 1);
            setPhones([...phones])
        };
        return (
            <div className={classes.main} style={{width}}>
                <FormControl className={classes.input}>
                    <InputLabel error={!level}>Уровень</InputLabel>
                    <Select variant='standard' value={level} onChange={handleLevel} error={!level}>
                        {levels.map((element)=>
                            <MenuItem key={element} value={element}>{element}</MenuItem>
                        )}
                    </Select>
                </FormControl>
                <TextField variant='standard'
                           id='name'
                           error={!name.length}
                           label='ФИО'
                           value={name}
                           onChange={(event) => setName(event.target.value)}
                           className={classes.input}
                />
                <TextField variant='standard'
                           id='inn'
                           error={!inn.length}
                           label='ИНН'
                           value={inn}
                           onChange={(event) => setInn(event.target.value)}
                           className={classes.input}
                />
                <TextField variant='standard'
                           id='passport'
                           error={!passport.length}
                           label='Паспорт'
                           value={passport}
                           onChange={(event) => setPassport(event.target.value)}
                           className={classes.input}
                />
                <TextField variant='standard'
                           error={!work.length}
                           id='work'
                           label='Работа'
                           value={work}
                           onChange={(event) => setWork(event.target.value)}
                           className={classes.input}
                />
                <TextField variant='standard'
                           id='address'
                           error={!address.length}
                           label='Адрес проживания'
                           onChange={(event) => setAddress(event.target.value)}
                           value={address}
                           className={classes.input}
                />
                <TextField variant='standard'
                           id='address'
                           error={!address1.length}
                           label='Адрес прописки'
                           onChange={(event) => setAddress1(event.target.value)}
                           value={address1}
                           className={classes.input}
                />
                <TextField variant='standard'
                           id='birthday'
                           type='date'
                           error={!birthday.length}
                           label='День рождения'
                           onChange={(event) => setBirthday(event.target.value)}
                           value={birthday}
                           className={classes.input}
                />
                <br/>
                {phones?phones.map((element, idx)=>
                    <FormControl key={`phones${idx}`} className={classes.input}>
                        <InputLabel error={!validPhone1(element)}>Телефон</InputLabel>
                        <Input
                            error={!validPhone1(element)}
                            placeholder='Телефон'
                            type={isMobileApp?'number':'text'}
                            value={element}
                            className={classes.input}
                            onChange={(event)=>{editPhones(event, idx)}}
                            endAdornment={
                                <InputAdornment position='end'>
                                    <IconButton
                                        onClick={()=>{
                                            deletePhones(idx)
                                        }}
                                        aria-label='toggle password visibility'
                                    >
                                        <Remove/>
                                    </IconButton>
                                </InputAdornment>
                            }
                            startAdornment={<InputAdornment position='start'>+996</InputAdornment>}
                        />
                    </FormControl>
                ): null}
                <Button onClick={async()=>{
                    addPhones()
                }} size='small'  color={phones.length?'primary':'secondary'}>
                    Добавить телефон
                </Button>
                <br/>
                {emails?emails.map((element, idx)=>
                    <FormControl key={`emails${idx}`} className={classes.input}>
                        <InputLabel error={!validMail(element)}>Emails</InputLabel>
                        <Input
                            error={!validMail(element)}
                            placeholder='Emails'
                            value={element}
                            className={classes.input}
                            onChange={(event)=>{editEmails(event, idx)}}
                            endAdornment={
                                <InputAdornment position='end'>
                                    <IconButton
                                        onClick={()=>{
                                            deleteEmails(idx)
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
                <Button size='small' onClick={async()=>{
                    addEmails()
                }} color='primary'>
                    Добавить email
                </Button>
                <TextField
                    id='info'
                    variant='standard'
                    onChange={(event) => setInfo(event.target.value)}
                    label='Комментарий'
                    multiline={true}
                    maxRows='5'
                    value={info}
                    className={classes.input}
                />
                <br/>
                <div>
                    <Button variant='contained' color='secondary' onClick={()=>{
                        showMiniDialog(false);
                        setClient(null)
                    }} className={classes.button}>
                        Закрыть
                    </Button>
                    <Button variant='contained' color='primary' onClick={async()=>{
                        let checkPhones = !phones.length||validPhones1(phones)
                        let checkMail = !emails.length||validMails(emails)
                        let res
                        if (name&&checkPhones&&checkMail/*&&address&&address1&&work&&passport&&inn&&level&&birthday*/) {
                            let client = {name, emails, phones, address1, address, info, work, passport, inn, level, birthday}
                            res = await addClient(client)
                            if(res!=='ERROR'&&res) {
                                showSnackBar('Успешно', 'success')
                                client._id = res
                                setClient(client)
                                if(_consultation) {
                                    consultation.client = client
                                    setConsultation({...consultation})
                                    setMiniDialog('Комментировать', <ConsultationEdit closeConsultation={closeConsultation}/>)
                                }
                                else
                                    showMiniDialog(false);
                            }
                            else
                                showSnackBar('Ошибка', 'error')
                        } else
                            showSnackBar('Заполните все поля')
                    }} className={classes.button}>
                        Добавить
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
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddClient)