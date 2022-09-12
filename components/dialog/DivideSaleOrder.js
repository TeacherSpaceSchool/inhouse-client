import React, { useState } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { inputFloat, checkFloat, cloneObject } from '../../src/lib'
import Confirmation from './Confirmation'
import { divideSale } from '../../src/gql/sale';
import Router from 'next/router'

const DivideSaleOrder =  React.memo(
    (props) =>{
        const {classes} = dialogContentStyle()
        const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
        const { isMobileApp } = props.app;
        const { showSnackBar } = props.snackbarActions;
        const width = isMobileApp? (window.innerWidth-113) : 500
        const { _id, currentItems, _newItems, type } = props;
        let [newItems, setNewItems] = useState(_newItems);
        return (
            <div className={classes.main} style={{width}}>
                {
                    newItems.map((newItem, idx) =>
                        <TextField
                            id='confirm'
                            key={`DivideSaleOrder${idx}`}
                            variant='standard'
                            label={`${newItem.name}: ${currentItems[idx].count} ${currentItems[idx].unit}`}
                            value={newItem.count}
                            onChange={(event) => {
                                newItems[idx].count = inputFloat(event.target.value)
                                if(newItems[idx].count>currentItems[idx].count)
                                    newItems[idx].count = currentItems[idx].count
                                setNewItems([...newItems])
                            }}
                            className={classes.input}
                        />
                    )
                }
                <div>
                    <Button variant='contained' color='secondary' onClick={()=>showMiniDialog(false)} className={classes.button}>
                        Закрыть
                    </Button>
                    <Button variant='contained' color='primary' onClick={async()=>{
                        let _newItems = cloneObject(newItems)
                        let _currentItems = cloneObject(currentItems)
                        let checkNewItems = 0, checkCurrentItems = 0
                        for(let i=0; i<_newItems.length; i++){
                            _newItems[i] = {
                                count: checkFloat(_newItems[i].count),
                                characteristics: _newItems[i].characteristics,
                                name: _newItems[i].name,
                                unit: _newItems[i].unit,
                                item: _newItems[i].item,
                                price: checkFloat(_newItems[i].price),
                                status: _newItems[i].status
                            }
                            _newItems[i].amount = checkFloat(_newItems[i].count * _newItems[i].price)

                            _currentItems[i] = {
                                _id: _currentItems[i]._id,
                                count: checkFloat(_currentItems[i].count - _newItems[i].count),
                                characteristics: _currentItems[i].characteristics,
                                name: _currentItems[i].name,
                                unit: _currentItems[i].unit,
                                item: _currentItems[i].item,
                                price: checkFloat(_currentItems[i].price),
                                status: _currentItems[i].status
                            }
                            _currentItems[i].amount = checkFloat(_currentItems[i].count * _currentItems[i].price)

                            checkNewItems += _newItems[i].count
                            checkCurrentItems += _currentItems[i].count
                        }
                        if(checkNewItems&&checkCurrentItems) {
                            const action = async () => {
                                let res = await divideSale({
                                    _id,
                                    newItems: _newItems,
                                    currentItems: _currentItems
                                })
                                if (res === 'ERROR'||!res)
                                    showSnackBar('Ошибка', 'error')
                                else {
                                    showSnackBar('Успешно', 'success')
                                    Router.push(`/${type}/${res}`)
                                }
                            }
                            setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                        }
                        else
                            showSnackBar('Количество слишком мало')
                    }} className={classes.button}>
                        Разделить
                    </Button>
                </div>
            </div>
        );
    }
)

function mapStateToProps (state) {
    return {
        app: state.app,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DivideSaleOrder)