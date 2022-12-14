import React, { useState } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import * as appActions from '../../src/redux/actions/app'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import {getClients} from '../../src/gql/client'
import {setConsultation} from '../../src/gql/consultation'
import AutocomplectOnline from '../../components/app/AutocomplectOnline'
import Confirmation from './Confirmation'
import AddClient from './AddClient';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const statusClients = ['холодный', 'теплый', 'горячий']

const ConsultationEdit =  React.memo(
    (props) =>{
        const { classes } = dialogContentStyle();
        const { closeConsultation } = props
        const { isMobileApp, consultation } = props.app;
        const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
        const { showSnackBar } = props.snackbarActions;
        const width = isMobileApp? (window.innerWidth-113) : 500
        let [client, setClient] = useState(consultation.client);
        let [info, setInfo] = useState(consultation.info);
        let [statusClient, setStatusClient] = useState(consultation.statusClient);
        let handleStatus = (event) => {
            setStatusClient(event.target.value)
        };
        return (
            <div className={classes.main} style={{width}}>
                <br/>
                <FormControl className={classes.input}>
                    <InputLabel error={!statusClient}>Статус клиента</InputLabel>
                    <Select error={!statusClient} variant='standard' value={statusClient} onChange={handleStatus}>
                        {statusClients.map((element)=>
                            <MenuItem key={element} value={element}>{element}</MenuItem>
                        )}
                    </Select>
                </FormControl>
                <AutocomplectOnline
                    error={!client}
                    defaultValue={client}
                    element={client}
                    setElement={async (client)=>{
                        setClient(client)
                    }}
                    dialogAddElement={(setElement, setInputValue, value)=>{return <AddClient
                        _consultation closeConsultation={closeConsultation} setClient={setClient}
                        value={value}
                    />}}
                    getElements={async (search)=>{
                        return await getClients({search})
                    }}
                    minLength={0}
                    label={'Клиент'}
                />
                <TextField
                    error={!info}
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
                    }} className={classes.button}>
                        {closeConsultation?'Отмена':'Закрыть'}
                    </Button>
                    <Button variant='contained' color='primary' onClick={async()=>{
                        if(!closeConsultation||info&&client&&statusClient) {
                            setMiniDialog('Вы уверены?', <Confirmation action={async () => {
                                let res = await setConsultation({
                                    info,
                                    client: client ? client._id : null,
                                    statusClient
                                })
                                if (!res || res === 'ERROR') {
                                    showSnackBar('Ошибка', 'error')
                                }
                                else {
                                    showSnackBar('Успешно', 'success')
                                    if (closeConsultation) {
                                        await closeConsultation()
                                    }
                                    else {
                                        consultation.client = client
                                        consultation.info = info
                                        consultation.statusClient = statusClient
                                        props.appActions.setConsultation({...consultation})
                                    }
                                    showMiniDialog(false)
                                }
                        }}/>)
                        }
                        else
                            showSnackBar('Заполните все поля')
                    }} className={classes.button}>
                        {closeConsultation?'Закрыть консультацию':'Сохранить'}
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

export default connect(mapStateToProps, mapDispatchToProps)(ConsultationEdit)