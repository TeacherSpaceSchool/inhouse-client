import React, {useState} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import cardCategoryStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import { addCategory, setCategory, deleteCategory, getCategorys, getCategorysCount } from '../src/gql/category'
import TextField from '@mui/material/TextField';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import * as snackbarActions from '../src/redux/actions/snackbar'
import Confirmation from './dialog/Confirmation'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import * as appActions from '../src/redux/actions/app'
import { forceCheck } from 'react-lazyload';

const CardCategory = React.memo((props) => {
    const {classes} = cardCategoryStyle();
    const { element, setList, list, idx, category, history, setHistory, setCount, paginationWork } = props;
    const { showLoad } = props.appActions;
    const { search, filter, isMobileApp } = props.app;
    let types = ['товары', 'услуги']
    let [type, setType] = useState(element&&element.typex?element.typex:'товары');
    let handleType =  (event) => {
        setType(event.target.value)
    };
    let [name, setName] = useState(element?element.name:'');
    let handleName =  (event) => {
        setName(event.target.value)
    };
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    return (
        <Card className={isMobileApp?classes.cardM:classes.cardD} style={{cursor: 'pointer'}} onClick={async ()=>{
            if(!setCount) {
                showLoad(true)
                setHistory([...history, element])
                setList(await getCategorys({skip: 0, search, category: element._id, type: filter}));
                showLoad(false)
            }
        }}>
            <CardContent>
                {
                    setCount?
                        <>
                        {
                            !element?
                                <>
                                <FormControl className={classes.input}>
                                    <InputLabel>Тип</InputLabel>
                                    <Select variant='standard'
                                        value={type}
                                        onChange={handleType}
                                    >
                                        {types.map((element)=>
                                            <MenuItem key={element} value={element}>{element}</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                                <br/>
                                </>
                                :
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Тип:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {element.type}
                                    </div>
                                </div>
                        }
                        <TextField variant='standard'
                            label='Название'
                            value={name}
                            className={classes.input}
                            onChange={handleName}
                        />
                        </>
                        :
                        <h3>{name}</h3>
                }
            </CardContent>
            {
                setCount?
                    <CardActions>
                        {
                            element!==undefined?
                                <>
                                <Button onClick={async()=>{
                                    let editElement = {_id: element._id}
                                    if(name.length>0&&name!==element.name)editElement.name = name
                                    const action = async() => {
                                        await setCategory(editElement)
                                    }
                                    setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                    showMiniDialog(true)
                                }} color='primary'>
                                    Сохранить
                                </Button>
                                <Button color='secondary' onClick={()=>{
                                    const action = async() => {
                                        await deleteCategory(element._id)
                                        let _list = [...list]
                                        _list.splice(idx, 1)
                                        setList(_list)
                                        forceCheck();
                                    }
                                    setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                    showMiniDialog(true)
                                }}>
                                    Удалить
                                </Button>
                                <Button color='primary' onClick={async ()=>{
                                    showLoad(true)
                                    setHistory([...history, element])
                                    setList(await getCategorys({skip: 0, search, category: element._id, type: filter}));
                                    setCount(await getCategorysCount({search, category: element._id, type: filter}));
                                    paginationWork.current = true
                                    showLoad(false)
                                }}>
                                    Перейти
                                </Button>
                                </>
                                :
                                <Button onClick={async()=> {
                                    if (name.length) {
                                        setName('')
                                        const action = async() => {
                                            setList([(await addCategory({category: category, type: type, name: name})).addCategory, ...list])
                                        }
                                        setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                        showMiniDialog(true)
                                    } else
                                        showSnackBar('Заполните все поля')

                                }
                                } color='primary'>
                                    Добавить
                                </Button>}
                    </CardActions>
                    :
                    null
            }
        </Card>
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
        appActions: bindActionCreators(appActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardCategory)