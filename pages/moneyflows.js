import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import {getMoneyFlows, getMoneyFlowsCount, setMoneyFlow, addMoneyFlow, deleteMoneyFlow, getPKO, getRKO} from '../src/gql/moneyFlow'
import {getCashboxes} from '../src/gql/cashbox'
import {getMoneyArticles} from '../src/gql/moneyArticle'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import pageListStyle from '../src/styleMUI/list'
import { urlMain } from '../src/const'
import { cloneObject } from '../src/lib'
import Router from 'next/router'
import { forceCheck } from 'react-lazyload';
import { getClientGqlSsr } from '../src/apollo'
import initialApp from '../src/initialApp'
import * as snackbarActions from '../src/redux/actions/snackbar'
import * as appActions from '../src/redux/actions/app'
import { bindActionCreators } from 'redux'
import { wrapper } from '../src/redux/configureStore'
import Card from '@mui/material/Card';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MoreVert from '@mui/icons-material/MoreVert';
import Add from '@mui/icons-material/Add';
import Save from '@mui/icons-material/Save';
import Confirmation from '../components/dialog/Confirmation'
import Badge from '@mui/material/Badge'
import SetRecipient from '../components/dialog/SetRecipient';
import History from '../components/dialog/History';
import HistoryIcon from '@mui/icons-material/History';
import DownloadIcon from '@mui/icons-material/Download';
import AutocomplectOnline from '../components/app/AutocomplectOnline'
import { inputFloat, checkFloat, pdDatePicker, pdDDMMYY } from '../src/lib'
import Select from '@mui/material/Select';
import Delete from '@mui/icons-material/Delete';

const operations = ['приход', 'расход']
const currencies = ['сом', 'доллар', 'рубль', 'тенге', 'юань']

const MoneyFlows = React.memo((props) => {
    const {classes} = pageListStyle();
    //props
    const { data } = props;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    const { filter } = props.app;
    const { showLoad } = props.appActions;
    //настройка
    const unsaved = useRef({});
    const initialRender = useRef(true);
    let [newElement, setNewElement] = useState({
        date: pdDatePicker(new Date()),
        typeRecipient: 'Получатель денег',
        operation: 'приход',
        currency: 'сом',
        typeClientOperation: 'Продажа',
        info: ''
    });
    //получение данных
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const getList = async ()=>{
        setList(cloneObject(await getMoneyFlows({skip: 0,
            ...filter.date?{date: filter.date}:{},
            ...filter.currency?{currency: filter.currency}:{},
            ...filter.operation?{operation: filter.operation}:{},
            ...filter.store?{store: filter.store._id}:{},
            ...filter.moneyArticle?{moneyArticle: filter.moneyArticle._id}:{},
            ...filter.moneyRecipient?{moneyRecipient: filter.moneyRecipient._id}:{},
            ...filter.user?{employment: filter.user._id}:{},
            ...filter.client?{client: filter.client._id}:{},
            ...filter.cashbox?{cashbox: filter.cashbox._id}:{},
            ...data.sale?{sale: data.sale}:{},
            ...data.reservation?{reservation: data.reservation}:{},
            ...data.order?{order: data.order}:{},
            ...data.refund?{refund: data.refund}:{},
        })));
        setCount(await getMoneyFlowsCount({
            ...filter.store?{store: filter.store._id}:{},
            ...filter.date?{date: filter.date}:{},
            ...filter.currency?{currency: filter.currency}:{},
            ...filter.operation?{operation: filter.operation}:{},
            ...filter.moneyArticle?{moneyArticle: filter.moneyArticle._id}:{},
            ...filter.moneyRecipient?{moneyRecipient: filter.moneyRecipient._id}:{},
            ...filter.user?{employment: filter.user._id}:{},
            ...filter.client?{client: filter.client._id}:{},
            ...filter.cashbox?{cashbox: filter.cashbox._id}:{},
            ...data.sale?{sale: data.sale}:{},
            ...data.reservation?{reservation: data.reservation}:{},
            ...data.order?{order: data.order}:{},
            ...data.refund?{refund: data.refund}:{},
        }));
        (document.getElementsByClassName('App-body-f'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
    }
    //поиск/фильтр
    useEffect(()=>{
        (async()=>{
            if(initialRender.current)
                initialRender.current = false;
            else
                await getList()
        })()
    },[filter])
    //пагинация
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = cloneObject(await getMoneyFlows({skip: list.length,
                ...filter.store?{store: filter.store._id}:{},
                ...filter.date?{date: filter.date}:{},
                ...filter.currency?{currency: filter.currency}:{},
                ...filter.operation?{operation: filter.operation}:{},
                ...filter.moneyArticle?{moneyArticle: filter.moneyArticle._id}:{},
                ...filter.moneyRecipient?{moneyRecipient: filter.moneyRecipient._id}:{},
                ...filter.user?{employment: filter.user._id}:{},
                ...filter.client?{client: filter.client._id}:{},
                ...filter.cashbox?{cashbox: filter.cashbox._id}:{},
                ...data.sale?{sale: data.sale}:{},
                ...data.reservation?{reservation: data.reservation}:{},
                ...data.order?{order: data.order}:{},
                ...data.refund?{refund: data.refund}:{},
            }))
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    //быстрое меню
    const [anchorElQuick, setAnchorElQuick] = useState(null);
    const [menuItems, setMenuItems] = useState(null);
    let handleMenuQuick = event => setAnchorElQuick(event.currentTarget);
    let handleCloseQuick = () => setAnchorElQuick(null);
    //render
    return (
        <App full unsaved={unsaved} filterShow={{date: true, store: true, currency: true, operation: true, moneyArticle: true, moneyRecipient: true, user: true, client: true, cashbox: true}} checkPagination={checkPagination} pageName='Движения денег' menuItems={menuItems} anchorElQuick={anchorElQuick} setAnchorElQuick={setAnchorElQuick}>
            <Head>
                <title>Движения денег</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content='Движения денег' />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/moneyflows`} />
                <link rel='canonical' href={`${urlMain}/moneyflows`}/>
            </Head>
            <Card className={classes.page} style={{width: 'fit-content'}}>
                <div className={classes.table}>
                    <div className={classes.tableHead} style={{width: 'fit-content'}}>
                        {data.edit?<div style={{width: 40, padding: 0}}/>:null}
                        <div className={classes.tableCell} style={{width: 135, justifyContent: data.edit?'center':'start'}}>
                            Дата
                        </div>
                        <div className={classes.tableCell} style={{width: 150, justifyContent: data.edit?'center':'start'}}>
                            Касса
                        </div>
                        <div className={classes.tableCell} style={{width: 200, justifyContent: data.edit?'center':'start'}}>
                            Получатель
                        </div>
                        <div className={classes.tableCell} style={{width: 200, justifyContent: data.edit?'center':'start'}}>
                            Статья
                        </div>
                        <div className={classes.tableCell} style={{width: 120, justifyContent: data.edit?'center':'start'}}>
                            Операция
                        </div>
                        <div className={classes.tableCell} style={{width: 150, justifyContent: data.edit?'center':'start'}}>
                            Сумма
                        </div>
                        <div className={classes.tableCell} style={{width: 115, justifyContent: data.edit?'center':'start'}}>
                            Валюта
                        </div>
                        <div className={classes.tableCell} style={{width: 200, justifyContent: data.edit?'center':'start'}}>
                            Коментарий
                        </div>
                    </div>
                    {
                        data.add?
                            <div className={classes.tableRow} style={{width: 'fit-content'}}>
                                <div className={classes.tableCell} style={{width: 40, padding: 0}}>
                                    <IconButton onClick={(event)=>{
                                        setMenuItems(
                                            <MenuItem onClick={()=>{
                                                if(newElement.date&&newElement.currency&&newElement.amount&&newElement.operation&&newElement.moneyArticle&&newElement.cashbox&&newElement.recipient&&(newElement.typeRecipient!=='Касса'||newElement.cashbox._id!==newElement.recipient._id)) {
                                                    setMiniDialog('Вы уверены?', <Confirmation action={async ()=>{
                                                        let res = await addMoneyFlow({
                                                            client: newElement.typeRecipient==='Клиент'?newElement.recipient._id:null,
                                                            employment: newElement.typeRecipient==='Сотрудник'?newElement.recipient._id:null,
                                                            cashboxRecipient: newElement.typeRecipient==='Касса'?newElement.recipient._id:null,
                                                            moneyRecipient: newElement.typeRecipient==='Получатель денег'?newElement.recipient._id:null,
                                                            ...newElement.clientOperation&&newElement.typeClientOperation==='Продажа'?{sale: newElement.clientOperation._id}:{},
                                                            ...newElement.clientOperation&&newElement.typeClientOperation==='На заказ'?{order: newElement.clientOperation._id}:{},
                                                            ...newElement.clientOperation&&newElement.typeClientOperation==='Бронь'?{reservation: newElement.clientOperation._id}:{},
                                                            ...newElement.clientOperation&&newElement.typeClientOperation==='Возврат'?{refund: newElement.clientOperation._id}:{},
                                                            cashbox: newElement.cashbox?newElement.cashbox._id:null,
                                                            moneyArticle: newElement.moneyArticle?newElement.moneyArticle._id:null,
                                                            operation: newElement.operation,
                                                            info: newElement.info,
                                                            amount: checkFloat(newElement.amount),
                                                            currency: newElement.currency,
                                                            date: newElement.date
                                                        })
                                                        if(res&&res._id!=='ERROR') {
                                                            showSnackBar('Успешно', 'success')
                                                            setList([res, ...list])
                                                            setNewElement({
                                                                date: pdDatePicker(new Date()),
                                                                typeRecipient: 'Получатель денег',
                                                                operation: 'приход',
                                                                typeClientOperation: 'Продажа',
                                                                currency: 'сом',
                                                                info: '',
                                                                amount: '',
                                                                moneyArticle: null
                                                            })
                                                            delete unsaved.current['new']
                                                            setCount(++count)
                                                        }
                                                        else
                                                            showSnackBar('Ошибка', 'error')
                                                    }}/>)
                                                    showMiniDialog(true)
                                                }
                                                else
                                                    showSnackBar('Заполните все поля')
                                                handleCloseQuick()
                                            }}>
                                                <Badge color='secondary' variant='dot' invisible={!newElement.unsaved}>
                                                    <Add sx={{color: '#00ff00'}}/>&nbsp;Добавить
                                                </Badge>
                                            </MenuItem>
                                        )
                                        handleMenuQuick(event)
                                    }}>
                                        <Badge color='secondary' variant='dot' invisible={!newElement.unsaved}>
                                            <MoreVert/>
                                        </Badge>
                                    </IconButton>
                                </div>
                                <div className={classes.tableCell} style={{width: 135}}>
                                    <Input
                                        placeholder='Дата'
                                        error={!newElement.date&&newElement.unsaved}
                                        variant='standard'
                                        type='date'
                                        className={classes.input}
                                        value={newElement.date}
                                        onChange={(event) => {
                                            newElement.unsaved = true
                                            unsaved.current['new'] = true
                                            newElement.date = event.target.value
                                            setNewElement({...newElement})
                                        }}
                                    />
                                </div>
                                <div className={classes.tableCell} style={{width: 150}}>
                                    <AutocomplectOnline
                                        minLength={0}
                                        element={newElement.cashbox}
                                        error={!newElement.cashbox&&newElement.unsaved}
                                        setElement={(cashbox)=>{
                                            newElement.unsaved = true
                                            unsaved.current['new'] = true
                                            newElement.cashbox = cashbox
                                            setNewElement({...newElement})
                                        }}
                                        getElements={async (search)=>{
                                            return await getCashboxes({search, ...filter.store?{store: filter.store._id}:{}})
                                        }}
                                        placeholder={'Касса'}
                                    />
                                </div>
                                <div className={classes.tableCell} style={{width: 200, justifyContent: !newElement.recipient?'center':'start', color: !newElement.recipient||(newElement.typeRecipient==='Касса'&&newElement.cashbox&&newElement.cashbox._id===newElement.recipient._id)?'red':'black'}} onClick={()=>{
                                    setMiniDialog('Получатель', <SetRecipient unsaved={unsaved} newElement={newElement} setNewElement={setNewElement}/>)
                                    showMiniDialog(true)
                                }}>
                                    {
                                        newElement.recipient?newElement.recipient.name:'не указан'
                                    }
                                    {
                                        newElement.clientOperation?<><br/>{newElement.typeClientOperation} №{newElement.clientOperation.number}</>:null
                                    }
                                </div>
                                <div className={classes.tableCell} style={{width: 200}}>
                                    <AutocomplectOnline
                                        minLength={0}
                                        element={newElement.moneyArticle}
                                        error={!newElement.moneyArticle&&newElement.unsaved}
                                        setElement={(moneyArticle)=>{
                                            newElement.unsaved = true
                                            unsaved.current['new'] = true
                                            newElement.moneyArticle = moneyArticle
                                            setNewElement({...newElement})
                                        }}
                                        getElements={async (search)=>{
                                            return await getMoneyArticles({search})
                                        }}
                                        placeholder={'Статья'}
                                    />
                                </div>
                                <div className={classes.tableCell} style={{width: 120}}>
                                    <Select className={classes.input} error={!newElement.operation&&newElement.unsaved} variant='standard' value={newElement.operation} onChange={(event) => {
                                        newElement.unsaved = true
                                        unsaved.current['new'] = true
                                        newElement.operation = event.target.value
                                        setNewElement({...newElement})
                                    }}>
                                        {operations.map((element)=>
                                            <MenuItem key={element} value={element}>{element}</MenuItem>
                                        )}
                                    </Select>
                                </div>
                                <div className={classes.tableCell} style={{width: 150}}>
                                    <Input
                                        placeholder='Сумма'
                                        error={!newElement.amount&&newElement.unsaved}
                                        variant='standard'
                                        className={classes.input}
                                        value={newElement.amount}
                                        onChange={(event) => {
                                            newElement.unsaved = true
                                            unsaved.current['new'] = true
                                            newElement.amount = inputFloat(event.target.value)
                                            setNewElement({...newElement})
                                        }}
                                    />
                                </div>
                                <div className={classes.tableCell} style={{width: 115}}>
                                    <Select className={classes.input} error={!newElement.currency&&newElement.unsaved} variant='standard' value={newElement.currency} onChange={(event) => {
                                        newElement.unsaved = true
                                        unsaved.current['new'] = true
                                        newElement.currency = event.target.value
                                        setNewElement({...newElement})
                                    }}>
                                        {currencies.map((element)=>
                                            <MenuItem key={element} value={element}>{element}</MenuItem>
                                        )}
                                    </Select>
                                </div>
                                <div className={classes.tableCell} style={{width: 200}}>
                                    <Input
                                        placeholder='Информация'
                                        multiline={true}
                                        maxRows='5'
                                        variant='standard'
                                        className={classes.input}
                                        value={newElement.info}
                                        onChange={(event) => {
                                            newElement.unsaved = true
                                            unsaved.current['new'] = true
                                            newElement.info = event.target.value
                                            setNewElement({...newElement})
                                        }}
                                    />
                                </div>
                            </div>
                            :
                            null
                    }
                    {list.map((element, idx) =>
                        <div className={classes.tableRow} key={element._id} style={{width: 'fit-content'}}>
                            {
                                data.edit?
                                    <div className={classes.tableCell} style={{width: 40, padding: 0}}>
                                        <IconButton onClick={(event)=>{
                                            setMenuItems(
                                                [
                                                    <MenuItem sx={{marginBottom: '5px'}} key='MenuItem1' onClick={async()=>{
                                                        if(element.amount) {
                                                            setMiniDialog('Вы уверены?', <Confirmation action={async () => {
                                                                let res = await setMoneyFlow({_id: element._id, amount: checkFloat(element.amount), info: element.info})
                                                                if(res==='OK') {
                                                                    showSnackBar('Успешно', 'success')
                                                                    list[idx].unsaved = false
                                                                    delete unsaved.current[list[idx]._id]
                                                                    setList([...list])
                                                                }
                                                                else
                                                                    showSnackBar('Ошибка', 'error')
                                                            }}/>)
                                                            showMiniDialog(true)
                                                        }
                                                        else
                                                            showSnackBar('Заполните все поля')
                                                        handleCloseQuick()
                                                    }}>
                                                        <Badge color='secondary' variant='dot' invisible={!element.unsaved}>
                                                            <Save sx={{color: '#0f0'}}/>&nbsp;Сохранить
                                                        </Badge>
                                                    </MenuItem>,
                                                    <MenuItem sx={{marginBottom: '5px'}} key='MenuItem2' onClick={async()=>{
                                                        setMiniDialog('История', <History where={element._id}/>)
                                                        showMiniDialog(true)
                                                        handleCloseQuick()
                                                    }}>
                                                        <HistoryIcon/>&nbsp;История
                                                    </MenuItem>,
                                                    <MenuItem sx={{marginBottom: '5px'}} key='MenuItem2' onClick={async()=>{
                                                        await showLoad(true)
                                                        let res = element.operation==='приход'?await getPKO(element._id):await getRKO(element._id)
                                                        if(res)
                                                            window.open(res, '_blank');
                                                        else
                                                            showSnackBar('Ошибка', 'error')
                                                        await showLoad(false)
                                                        handleCloseQuick()
                                                    }}>
                                                        <DownloadIcon/>&nbsp;{element.operation==='приход'?'ПКО':'РКО'}
                                                    </MenuItem>,
                                                    data.deleted?
                                                        <MenuItem key='MenuItem3' onClick={async()=>{
                                                            setMiniDialog('Вы уверены?', <Confirmation action={async () => {
                                                                let res = await deleteMoneyFlow(element._id)
                                                                if(res==='OK'){
                                                                    showSnackBar('Успешно', 'success')
                                                                    delete unsaved.current[list[idx]._id]
                                                                    let _list = [...list]
                                                                    _list.splice(idx, 1)
                                                                    setList(_list)
                                                                    setCount(--count)
                                                                }
                                                                else
                                                                    showSnackBar('Ошибка', 'error')
                                                            }}/>)
                                                            showMiniDialog(true)
                                                            handleCloseQuick()
                                                        }}>
                                                            <Delete sx={{color: 'red'}}/>&nbsp;Удалить
                                                        </MenuItem>
                                                        :
                                                        null
                                                ]
                                            )
                                            handleMenuQuick(event)
                                        }}>
                                            <Badge color='secondary' variant='dot' invisible={!element.unsaved}>
                                                <MoreVert/>
                                            </Badge>
                                        </IconButton>
                                    </div>
                                    :
                                    null
                            }
                            <div className={classes.tableCell} style={{width: 135}}>
                                {pdDDMMYY(element.date)}/{element.number}
                            </div>
                            <div className={classes.tableCell} style={{width: 150}}>
                                {
                                    element.cashbox.name
                                }
                            </div>
                            <div className={classes.tableCell} style={{width: 200}} >
                                {
                                    element.client?element.client.name
                                        :
                                    element.moneyRecipient?element.moneyRecipient.name
                                        :
                                    element.employment?element.employment.name
                                        :
                                    element.cashboxRecipient?element.cashboxRecipient.name
                                        :
                                    'не указан'
                                }
                                {
                                    element.sale?<><br/>Продажа №{element.sale.number}</>:null
                                }
                                {
                                    element.refund?<><br/>Возврат №{element.refund.number}</>:null
                                }
                                {
                                    element.reservation?<><br/>Бронь №{element.reservation.number}</>:null
                                }
                                {
                                    element.order?<><br/>На заказ №{element.order.number}</>:null
                                }
                            </div>
                            <div className={classes.tableCell} style={{width: 200}}>
                                {element.moneyArticle.name}
                            </div>
                            <div className={classes.tableCell} style={{width: 120}}>
                                {element.operation}
                            </div>
                            <div className={classes.tableCell} style={{width: 150}}>
                                {
                                    data.edit?
                                        <Input
                                            placeholder='Сумма'
                                            error={!element.amount&&element.unsaved}
                                            variant='standard'
                                            className={classes.input}
                                            value={element.amount}
                                            onChange={(event) => {
                                                list[idx].unsaved = true
                                                unsaved.current[list[idx]._id] = true
                                                list[idx].amount = inputFloat(event.target.value)
                                                setList([...list])
                                            }}
                                        />
                                        :
                                        element.amount
                                }
                            </div>
                            <div className={classes.tableCell} style={{width: 115}}>
                                {element.currency}
                            </div>
                            <div className={classes.tableCell} style={{width: 200}}>
                                {
                                    data.edit?
                                        <Input
                                            placeholder='Информация'
                                            multiline={true}
                                            maxRows='5'
                                            variant='standard'
                                            className={classes.input}
                                            value={element.info}
                                            onChange={(event) => {
                                                list[idx].unsaved = true
                                                unsaved.current[list[idx]._id] = true
                                                list[idx].info = event.target.value
                                                setList([...list])
                                            }}
                                        />
                                        :
                                        newElement.info
                                }
                            </div>
                        </div>
                    )}
                </div>
            </Card>
            <div className='count' style={{left: 10}}>
                {`Всего: ${count}`}
            </div>
        </App>
    )
})

MoneyFlows.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        }
        else {
            Router.push('/')
        }
    store.getState().app.sort = 'amount'
    return {
        data: {
            edit: store.getState().user.profile.edit&&['admin'].includes(store.getState().user.profile.role),
            add: store.getState().user.profile.add&&['admin'].includes(store.getState().user.profile.role),
            deleted: store.getState().user.profile.deleted&&['admin'].includes(store.getState().user.profile.role),
            list: cloneObject(await getMoneyFlows({
                ...store.getState().app.filter.store?{store: store.getState().app.filter.store}:{},
                ...ctx.query.sale?{sale: ctx.query.sale}:{},
                ...ctx.query.reservation?{reservation: ctx.query.reservation}:{},
                ...ctx.query.order?{order: ctx.query.order}:{},
                ...ctx.query.refund?{refund: ctx.query.refund}:{},
                skip: 0
            },  ctx.req?await getClientGqlSsr(ctx.req):undefined)),
            count: await getMoneyFlowsCount({
                ...store.getState().app.filter.store?{store: store.getState().app.filter.store}:{},
                ...ctx.query.sale?{sale: ctx.query.sale}:{},
                ...ctx.query.reservation?{reservation: ctx.query.reservation}:{},
                ...ctx.query.order?{order: ctx.query.order}:{},
                ...ctx.query.refund?{refund: ctx.query.refund}:{},
            }, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            ...ctx.query.sale?{sale: ctx.query.sale}:{},
            ...ctx.query.reservation?{reservation: ctx.query.reservation}:{},
            ...ctx.query.order?{order: ctx.query.order}:{},
            ...ctx.query.refund?{refund: ctx.query.refund}:{},
        }
    };
})

function mapStateToProps (state) {
    return {
        app: state.app,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MoneyFlows);