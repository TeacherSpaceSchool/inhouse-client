import React, { useState } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import * as appActions from '../../src/redux/actions/app'
import Button from '@mui/material/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import { getCharacteristics } from '../../src/gql/characteristic'
import { getTypeCharacteristics } from '../../src/gql/typeCharacteristic'
import AutocomplectOnline from '../../components/app/AutocomplectOnline'
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import * as snackbarActions from '../../src/redux/actions/snackbar'

const SetCharacteristics =  React.memo(
    (props) =>{
        const { classes } = dialogContentStyle();
        const { _id, setBasket, basket, setList, list, idx, characteristics } = props;
        const { isMobileApp } = props.app;
        let [_characteristics, _setCharacteristics] = useState(characteristics);
        const { showMiniDialog, showFullDialog } = props.mini_dialogActions;
        const width = isMobileApp? '100%' : 500
        const { showSnackBar } = props.snackbarActions;
        return (
            <div className={classes.main} style={{width}}>
                <div className={isMobileApp?classes.fullDialogBody:classes.miniDialogBody}>
                    {_characteristics?_characteristics.map((element, idx)=>
                        <div className={isMobileApp?classes.column:classes.row} key={`characteristic${idx}`}>
                            <AutocomplectOnline
                                element={element[0]}
                                error={!element[0]}
                                freeSolo
                                setElement={(typeCharacteristic)=>{
                                    if(typeCharacteristic)
                                        _characteristics[idx][0] = typeCharacteristic.name
                                    else
                                        _characteristics[idx][0] = ''

                                    _setCharacteristics([..._characteristics])
                                }}
                                defaultValue={element[0]}
                                getElements={async (search)=>{
                                    return await getTypeCharacteristics({search})
                                }}
                                minLength={0}
                                label={`Тип характеристики ${idx+1}`}/>
                            <AutocomplectOnline
                                element={element[1]}
                                error={!element[1]}
                                freeSolo
                                setElement={(characteristic)=>{
                                    if(characteristic)
                                        _characteristics[idx][1] = characteristic.name
                                    else
                                        _characteristics[idx][1] = ''

                                    _setCharacteristics([..._characteristics])
                                }}
                                defaultValue={element[1]}
                                getElements={async (search)=>{
                                    return await getCharacteristics({search})
                                }}
                                minLength={0}
                                label={`Характеристика ${idx+1}`}/>
                            <IconButton onClick={()=>{
                                _characteristics.splice(idx, 1)
                                _setCharacteristics([..._characteristics])
                            }}>
                                <CloseIcon style={{color: 'red'}}/>
                            </IconButton>
                        </div>
                    ): null}
                    <br/>
                    <center style={{width: '100%'}}>
                        <Button onClick={async()=>{
                            _setCharacteristics([..._characteristics, ['', '']])
                        }} size='small'>
                            Добавить характеристику
                        </Button>
                    </center>
                </div>
                <div>
                    <Button variant='contained' color='primary' onClick={async()=>{
                        let checkCharacteristics = true
                        for(let i = 0; i <_characteristics.length; i++) {
                            if(!_characteristics[i][0]||!_characteristics[i][1]) {
                                checkCharacteristics = false
                                break
                            }
                        }
                        if(checkCharacteristics) {
                            if(list) {
                                list[idx].characteristics = _characteristics
                                setList([...list])
                            }
                            else {
                                basket[_id].characteristics = _characteristics
                                setBasket({...basket})
                            }
                            showMiniDialog(false);
                            showFullDialog(false);
                        }
                        else
                            showSnackBar('Заполните все поля')
                    }} className={classes.button}>
                        Сохранить
                    </Button>
                    <Button variant='contained' color='secondary' onClick={()=>{
                        showMiniDialog(false);
                        showFullDialog(false);
                    }} className={classes.button}>
                        Закрыть
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

export default connect(mapStateToProps, mapDispatchToProps)(SetCharacteristics)