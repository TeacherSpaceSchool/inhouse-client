import React, { useState } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import * as appActions from '../../src/redux/actions/app'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import {getWarehouses} from '../../src/gql/warehouse'
import {getBalanceItems, setBalanceItem} from '../../src/gql/balanceItem'
import {getStoreBalanceItems} from '../../src/gql/storeBalanceItem'
import {getItems} from '../../src/gql/item'
import { checkFloat, inputFloat } from '../../src/lib'
import AutocomplectOnline from '../../components/app/AutocomplectOnline'
import Router from 'next/router'
import Confirmation from './Confirmation'
import {getStores} from '../../src/gql/store'

const MovingWarehouses =  React.memo(
    (props) =>{
        const { classes } = dialogContentStyle();
        const { isMobileApp, filter } = props.app;
        const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
        const { showSnackBar } = props.snackbarActions;
        const width = isMobileApp? (window.innerWidth-113) : 500
        let [warehouse1, setWarehouse1] = useState(null);
        let [warehouse2, setWarehouse2] = useState(null);
        let [store, setStore] = useState(null);
        let [item, setItem] = useState(null);
        let [free, setFree] = useState(null);
        let [count, setCount] = useState(null);
        let [info, setInfo] = useState('');
        return (
            <div className={classes.main} style={{width}}>
                <AutocomplectOnline
                    element={store}
                    error={!store}
                    setElement={(store)=>{
                        setStore(store)
                        setWarehouse1(null)
                        setWarehouse2(null)
                        setItem(null)
                    }}
                    getElements={async (search)=>{
                        return await getStores({search})
                    }}
                    minLength={0}
                    label={'Магазин'}
                />
                {
                    store?
                        <AutocomplectOnline
                            element={warehouse1}
                            error={!warehouse1}
                            setElement={(warehouse)=>{
                                setWarehouse1(warehouse)
                                setWarehouse2(null)
                                setItem(null)
                                setCount('')
                                setFree(0)
                            }}
                            getElements={async (search)=>{
                                return await getWarehouses({
                                    search,
                                    store: store._id
                                })
                            }}
                            label='Отправитель'
                            minLength={0}
                        />
                        :
                        null
                }
                {
                    warehouse1?
                        <>
                        <AutocomplectOnline
                            element={item}
                            error={!item}
                            setElement={async (item)=>{
                                setItem(item)
                                if(item) {
                                    let balanceItem = (await getBalanceItems({item: item._id, warehouse: warehouse1._id, store: warehouse1.store._id}))[0];
                                    let storeBalanceItem = (await getStoreBalanceItems({item: item._id, store: warehouse1.store._id}))[0];
                                    if(['Брак', 'Реставрация'].includes(warehouse1.name))
                                        free = balanceItem.amount
                                    else if(!balanceItem||!storeBalanceItem)
                                        free = 0
                                    else {
                                        free = balanceItem.amount>storeBalanceItem.free?storeBalanceItem.free:balanceItem.amount
                                    }
                                    setFree(free)
                                }
                                else
                                    setFree(0)
                                setCount('')
                            }}
                            getElements={async (search)=>{
                                return await getItems({
                                    search,
                                })
                            }}
                            label='Модель'
                        />
                        {
                            item?
                                <>
                                <TextField
                                    id='count'
                                    error={!count||count>free}
                                    variant='standard'
                                    value={count}
                                    className={classes.input}
                                    onChange={(event) => {
                                        count = inputFloat(event.target.value)
                                        if(count>free)
                                            count = free
                                        setCount(count)
                                    }}
                                    label={`Доступно: ${free}`}
                                />
                                <AutocomplectOnline
                                    element={warehouse2}
                                    error={!warehouse2||warehouse2._id===warehouse1._id}
                                    setElement={warehouse=>setWarehouse2(warehouse)}
                                    getElements={async (search)=>{
                                        return await getWarehouses({
                                            search,
                                            store: store._id
                                        })
                                    }}
                                    label='Получатель'
                                    minLength={0}
                                />
                                <TextField
                                    id='info'
                                    variant='standard'
                                    onChange={(event) => setInfo(event.target.value)}
                                    label='Комментарий'
                                    multiline={true}
                                    value={info}
                                    className={classes.input}
                                />
                                </>
                                :
                                null
                        }
                        </>
                        :
                        null
                }
                <br/>
                <div>
                    <Button variant='contained' color='secondary' onClick={()=>{
                        showMiniDialog(false);
                    }} className={classes.button}>
                        Закрыть
                    </Button>
                    <Button variant='contained' color='primary' onClick={async()=>{
                        count = checkFloat(count)
                        if (warehouse1&&warehouse2&&warehouse1._id!==warehouse2._id&&item&&count&&count<=free) {
                            setMiniDialog('Вы уверены?', <Confirmation action={async () => {
                                let res = await setBalanceItem({
                                    item: item._id,
                                    warehouse: warehouse1._id,
                                    amount: count,
                                    type: '-',
                                    warehouse2: warehouse2.name,
                                    info
                                })
                                if (!res || res === 'ERROR') {
                                    showSnackBar('Ошибка', 'error')
                                }
                                else {
                                    res = await setBalanceItem({
                                        item: item._id,
                                        warehouse: warehouse2._id,
                                        amount: count,
                                        type: '+',
                                        info,
                                        warehouse2: warehouse1.name
                                    })
                                    if (!res || res === 'ERROR') {
                                        showSnackBar('Ошибка', 'error')
                                    }
                                    else {
                                        showSnackBar('Успешно', 'success')
                                        Router.reload()
                                    }
                                }
                            }}/>)
                        } else
                            showSnackBar('Заполните все поля')
                    }} className={classes.button}>
                        Сохранить
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

export default connect(mapStateToProps, mapDispatchToProps)(MovingWarehouses)