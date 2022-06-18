import React, {useState} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import cardIntegrationObjectStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import { deleteIntegrationObject, addIntegrationObject, getItemsForIntegrationObjects, getDistrictsForIntegrationObjects, setIntegrationObject, getCashboxesForIntegrationObjects, getUsersForIntegrationObjects, getBranchsForIntegrationObjects, getClientsForIntegrationObjects} from '../src/gql/integrationObject'
import TextField from '@mui/material/TextField';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import * as snackbarActions from '../src/redux/actions/snackbar'
import Confirmation from './dialog/Confirmation'
import AutocomplectOnline from '../components/app/AutocomplectOnline'

const CardIntegrationObject = React.memo((props) => {
    const {classes} = cardIntegrationObjectStyle();
    const { getList, legalObject, type, element, idx, list, setList } = props;
    const { isMobileApp } = props.app;
    //addCard
    let [UUID, setUUID] = useState(element?element.UUID:'');
    let [object, setObject] = useState(element?type==='товары'?element.item:type==='районы'?element.district:type==='клиенты'?element.client:type==='объекты'?element.branch:type==='кассы'?element.cashbox:element.user:undefined);
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    return (
        <Card className={isMobileApp?classes.cardM:classes.cardD}>
            <CardContent>
                {
                    element?
                        <>
                        <h3>
                            {object.name}
                        </h3>
                        <br/>
                        </>
                        :
                        <AutocomplectOnline
                            setElement={setObject}
                            getElements={async (search)=>{return type==='клиенты'?await getClientsForIntegrationObjects({legalObject, search}):
                                type==='объекты'?await getBranchsForIntegrationObjects({legalObject, search}):
                                type==='кассы'?await getCashboxesForIntegrationObjects({legalObject, search}):
                                type==='товары'?await getItemsForIntegrationObjects({legalObject, search}):
                                type==='районы'?await getDistrictsForIntegrationObjects({legalObject, search}):
                                await getUsersForIntegrationObjects({legalObject, search})}}
                            label={type}
                        />
                }
                <TextField variant='standard'
                    label='UUID'
                    value={UUID}
                    className={classes.input}
                    onChange={(event)=>{setUUID(event.target.value)}}
                />
            </CardContent>
            <CardActions>
                {
                    element!==undefined?
                        <>
                        <Button onClick={async()=>{
                            let editElement = {
                                _id: element._id
                            }
                            if(UUID.length>0&&UUID!==element.UUID)editElement.UUID = UUID
                            const action = async() => {
                                await setIntegrationObject(editElement)
                            }
                            setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                            showMiniDialog(true)
                        }} color='primary'>
                            Сохранить
                        </Button>
                        <Button onClick={async()=>{
                            const action = async() => {
                                await deleteIntegrationObject(element._id)
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
                            if (UUID.length > 0 && object) {
                                const action = async() => {
                                    await addIntegrationObject({
                                        legalObject,
                                        UUID,
                                        branch: type==='объекты'?object._id:null,
                                        user: type==='пользователи'?object._id:null,
                                        cashbox: type==='кассы'?object._id:null,
                                        client: type==='клиенты'?object._id:null,
                                        district: type==='районы'?object._id:null,
                                        item: type==='товары'?object._id:null,
                                        type
                                    })
                                    await getList()
                                }
                                setObject(undefined)
                                setUUID('')
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
        </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(CardIntegrationObject)