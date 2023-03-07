import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import {getMoneyFlows, getMoneyFlowsCount, setMoneyFlow, addMoneyFlow, deleteMoneyFlow, getPKO, getRKO, uploadMoneyFlow, getUnloadMoneyFlows} from '../src/gql/moneyFlow'
import {getCashboxes} from '../src/gql/cashbox'
import {getMoneyArticles, getMoneyArticleByName} from '../src/gql/moneyArticle'
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
import SetRecipientE from '../components/dialog/SetRecipientE';
import History from '../components/dialog/History';
import HistoryIcon from '@mui/icons-material/History';
import DownloadIcon from '@mui/icons-material/Download';
import AutocomplectOnline from '../components/app/AutocomplectOnline'
import { inputFloat, checkFloat, pdDatePicker, pdDDMMYYYY, pdDDMMYY } from '../src/lib'
import Select from '@mui/material/Select';
import Delete from '@mui/icons-material/Delete';
import Link from 'next/link';
import UnloadUpload from '../components/app/UnloadUpload';

const uploadText = 'Формат xlsx:' +
    '\nномер движения денег (если требуется обновить);' +
    '\nдата (ДД.ММ.ГГГГ);' +
    '\nназвание магазина;' +
    '\nназвание кассы;' +
    '\nтип получателя (клиент, сотрудник, касса, получатель денег);' +
    '\nимя получателя;' +
    '\nназвание статьи;' +
    '\nоперация (приход, расход);' +
    '\nсумма;' +
    '\nвалюта (сом, доллар, рубль, тенге, юань);' +
    '\nкурс;' +
    '\nкомментарий.'
const operations = ['приход', 'расход']
const currencies = ['сом', 'доллар', 'рубль', 'тенге', 'юань']

const MoneyFlows = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    const { filter, search } = props.app;
    const { showLoad } = props.appActions;
    let [today, setToday] = useState();
    const unsaved = useRef({});
    const initialRender = useRef(true);
    let [showStat, setShowStat] = useState(true);
    let [newElement, setNewElement] = useState({
        date: pdDatePicker(new Date()),
        typeRecipient: '',
        operation: 'приход',
        currency: 'сом',
        typeClientOperation: '',
        info: '',
        exchangeRate: 1,
        moneyArticle: data.defaultMoneyArticle['Не указано'],
        cashbox: filter.cashbox
    });
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const getMoneyFlowsCountWithFilter = async ()=>{
        setCount(await getMoneyFlowsCount({
            search,
            ...filter.store?{store: filter.store._id}:{},
            ...filter.dateStart&&filter.dateStart.length?{dateStart: filter.dateStart}:{},
            ...filter.dateEnd&&filter.dateEnd.length?{dateEnd: filter.dateEnd}:{},
            ...filter.currency?{currency: filter.currency}:{},
            ...filter.operation?{operation: filter.operation}:{},
            ...filter.moneyArticle?{moneyArticle: filter.moneyArticle._id}:{},
            ...filter.moneyRecipient?{moneyRecipient: filter.moneyRecipient._id}:{},
            ...filter.user?{employment: filter.user._id}:{},
            ...filter.client?{client: filter.client._id}:{},
            ...filter.cashbox?{cashbox: filter.cashbox._id}:{},
            ...data.installment?{installment: data.installment}:{},
            ...data.sale?{sale: data.sale}:{},
            ...data.reservation?{reservation: data.reservation}:{},
            ...data.order?{order: data.order}:{},
            ...data.refund?{refund: data.refund}:{},
        }));
    }
    const getList = async ()=>{
        setList(cloneObject(await getMoneyFlows({skip: 0,
            search,
            ...filter.dateStart&&filter.dateStart.length?{dateStart: filter.dateStart}:{},
            ...filter.dateEnd&&filter.dateEnd.length?{dateEnd: filter.dateEnd}:{},
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
            ...data.installment?{installment: data.installment}:{},
            ...data.order?{order: data.order}:{},
            ...data.refund?{refund: data.refund}:{},
        })));
        await getMoneyFlowsCountWithFilter();
        (document.getElementsByClassName('App-body-f'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
    }
    useEffect(()=>{
        newElement.amountEnd = checkFloat(newElement.amount * newElement.exchangeRate)
        setNewElement({...newElement})
    },[newElement.amount, newElement.exchangeRate])
    let searchTimeOut = useRef(null);
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current) {
                let changeNewElement
                if(filter.currency&&filter.currency!==newElement.currency) {
                    changeNewElement = true
                    newElement.currency = filter.currency
                    if(newElement.currency==='сом'&&newElement.exchangeRate!==1) {
                        newElement.exchangeRate = 1
                    }

                }
                if(filter.store&&newElement.cashbox&&filter.store._id!==newElement.cashbox.store._id) {
                    changeNewElement = true
                    newElement.cashbox = null
                }
                if(!newElement.clientOperation&&filter.operation&&filter.operation!==newElement.operation) {
                    changeNewElement = true
                    newElement.operation = filter.operation
                }
                if(filter.moneyArticle&&filter.moneyArticle!==newElement.moneyArticle) {
                    changeNewElement = true
                    newElement.moneyArticle = filter.moneyArticle
                }
                if(filter.cashbox&&(!newElement.cashbox||filter.cashbox._id!==newElement.cashbox._id)) {
                    changeNewElement = true
                    newElement.cashbox = filter.cashbox
                }
                if(changeNewElement)
                    setNewElement({...newElement})

                await getList()
            }
        })()
    },[filter])
    useEffect(()=>{
        (async()=>{
            if(initialRender.current) {
                today = new Date()
                today.setHours(6, 0, 0, 0)
                setToday(today)
                initialRender.current = false;
            }
            else {
                if(searchTimeOut.current)
                    clearTimeout(searchTimeOut.current)
                searchTimeOut.current = setTimeout(async () => await getList(), 500)
            }
        })()
    },[search])
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = await getMoneyFlows({skip: list.length,
                search,
                ...filter.store?{store: filter.store._id}:{},
                ...filter.dateStart&&filter.dateStart.length?{dateStart: filter.dateStart}:{},
                ...filter.dateEnd&&filter.dateEnd.length?{dateEnd: filter.dateEnd}:{},
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
                ...data.installment?{installment: data.installment}:{},
            })
            if(addedList&&addedList.length>0){list = [...list, ...addedList]; setList(list);}
            else
                paginationWork.current = false
        }
    }
    const [anchorElQuick, setAnchorElQuick] = useState(null);
    const [menuItems, setMenuItems] = useState(null);
    let handleMenuQuick = event => setAnchorElQuick(event.currentTarget);
    let handleCloseQuick = () => setAnchorElQuick(null);
    return (
        <App searchShow={true} full unsaved={unsaved} filterShow={{period: true, store: true, currency: true, operation: true, moneyArticle: true, moneyRecipient: true, user: true, client: true, cashbox: true}} list={list} checkPagination={checkPagination} pageName='Движения денег' menuItems={menuItems} anchorElQuick={anchorElQuick} setAnchorElQuick={setAnchorElQuick}>
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
            <div className={classes.tableHead} style={{width: 'fit-content'}}>
                {data.edit?<div style={{width: 40, padding: 0}}/>:null}
                <div className={classes.tableCell} style={{width: 135, justifyContent: data.edit?'center':'start'}}>
                    Дата/Номер
                </div>
                <div className={classes.tableCell} style={{width: 200, justifyContent: data.edit?'center':'start'}}>
                    Касса/Банк
                </div>
                <div className={classes.tableCell} style={{width: 200, justifyContent: data.edit?'center':'start'}}>
                    Получатель
                </div>
                <div className={classes.tableCell} style={{width: 250, justifyContent: data.edit?'center':'start'}}>
                    Статья
                </div>
                <div className={classes.tableCell} style={{width: 115, justifyContent: data.edit?'center':'start'}}>
                    Операция
                </div>
                <div className={classes.tableCell} style={{width: 150, justifyContent: data.edit?'center':'start'}}>
                    Сумма
                </div>
                <div className={classes.tableCell} style={{width: 115, justifyContent: data.edit?'center':'start'}}>
                    Валюта
                </div>
                <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                    Курс
                </div>
                <div className={classes.tableCell} style={{width: 150, justifyContent: data.edit?'center':'start'}}>
                    Итого
                </div>
                <div className={classes.tableCell} style={{width: 400, justifyContent: data.edit?'center':'start'}}>
                    Комментарий
                </div>
            </div>
            <Card className={classes.page} style={{width: 'fit-content'}}>
                <div className={classes.table}>
                    {
                        data.add&&(
                            !search&&
                            !filter.moneyRecipient&&
                            /*!filter.dateStart&&*/
                            !filter.user&&
                            !filter.client&&
                            !data.sale&&
                            !data.reservation&&
                            !data.order&&
                            !data.refund&&
                            !data.installment
                        )?
                            <div className={classes.tableRow}>
                                <div className={classes.tableCell} style={{width: 40, padding: 0}}>
                                    <IconButton onClick={(event)=>{
                                        setMenuItems(
                                            <MenuItem onClick={()=>{
                                                if(
                                                    (newElement.typeClientOperation!=='Рассрочка'||(newElement.clientOperation&&newElement.installmentMonth))&&
                                                    newElement.date&&new Date(newElement.date)<=today&&
                                                    newElement.currency&&
                                                    newElement.amount&&
                                                    newElement.exchangeRate&&
                                                    newElement.operation&&
                                                    newElement.moneyArticle&&
                                                    newElement.cashbox&&
                                                    //newElement.recipient&&
                                                    (newElement.typeRecipient!=='Касса'||newElement.recipient&&newElement.cashbox._id!==newElement.recipient._id)
                                                ) {
                                                    setMiniDialog('Вы уверены?', <Confirmation action={async ()=>{
                                                        let res = await addMoneyFlow({
                                                            client: newElement.typeRecipient==='Клиент'&&newElement.recipient?newElement.recipient._id:null,
                                                            employment: newElement.typeRecipient==='Сотрудник'&&newElement.recipient?newElement.recipient._id:null,
                                                            cashboxRecipient: newElement.typeRecipient==='Касса'&&newElement.recipient?newElement.recipient._id:null,
                                                            moneyRecipient: newElement.typeRecipient==='Получатель денег'&&newElement.recipient?newElement.recipient._id:null,
                                                            ...newElement.clientOperation&&newElement.typeClientOperation==='Продажа'?{sale: newElement.clientOperation._id}:{},
                                                            ...newElement.clientOperation&&newElement.typeClientOperation==='На заказ'?{order: newElement.clientOperation._id}:{},
                                                            ...newElement.clientOperation&&newElement.typeClientOperation==='Бронь'?{reservation: newElement.clientOperation._id}:{},
                                                            ...newElement.clientOperation&&newElement.typeClientOperation==='Возврат'?{refund: newElement.clientOperation._id}:{},
                                                            ...newElement.clientOperation&&newElement.typeClientOperation==='Рассрочка'&&newElement.installmentMonth?{installment: newElement.clientOperation._id, installmentMonth: newElement.installmentMonth}:{},
                                                            cashbox: newElement.cashbox._id,
                                                            moneyArticle: newElement.moneyArticle?newElement.moneyArticle._id:null,
                                                            operation: newElement.operation,
                                                            info: newElement.info,
                                                            amount: checkFloat(newElement.amount),
                                                            amountEnd: checkFloat(newElement.amountEnd),
                                                            exchangeRate: checkFloat(newElement.exchangeRate),
                                                            currency: newElement.currency,
                                                            date: newElement.date
                                                        })
                                                        if(res&&res._id!=='ERROR') {
                                                            showSnackBar('Успешно', 'success')
                                                            setList([res, ...list])
                                                            setNewElement({
                                                                date: pdDatePicker(new Date()),
                                                                typeRecipient: '',
                                                                operation: 'приход',
                                                                typeClientOperation: '',
                                                                currency: 'сом',
                                                                exchangeRate: 1,
                                                                info: '',
                                                                amount: '',
                                                                cashbox: filter.cashbox,
                                                                moneyArticle: data.defaultMoneyArticle['Не указано']
                                                            })
                                                            delete unsaved.current['new']
                                                            await getMoneyFlowsCountWithFilter();
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
                                        error={!newElement.date&&newElement.unsaved||newElement.date&&new Date(newElement.date)>today}
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
                                <div className={classes.tableCell} style={{width: 200}}>
                                    {
                                        !filter.cashbox?
                                            <AutocomplectOnline
                                                defaultValue={newElement.cashbox}
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
                                                placeholder={'Касса/Банк'}
                                            />
                                            :
                                            newElement.cashbox?
                                                newElement.cashbox.name
                                                :
                                                null
                                    }
                                </div>
                                <div className={classes.tableCell} style={{width: 200, flexDirection: 'column', justifyContent: !newElement.recipient?'center':'start', color: !newElement.recipient||(newElement.typeRecipient==='Касса'&&newElement.cashbox&&newElement.cashbox._id===newElement.recipient._id)?'red':'black'}}
                                     onClick={()=>{
                                        setMiniDialog('Получатель', <SetRecipient defaultMoneyArticle={data.defaultMoneyArticle} unsaved={unsaved} newElement={newElement} setNewElement={setNewElement}/>)
                                        showMiniDialog(true)
                                     }}
                                >
                                    {
                                        newElement.recipient?newElement.recipient.name:'не указан'
                                    }
                                    {
                                        newElement.clientOperation?
                                            <span style={{color: !newElement.installmentMonth&&newElement.typeClientOperation==='Рассрочка'?'red':'black'}}>
                                                {newElement.typeClientOperation} №{newElement.clientOperation.number}
                                            </span>
                                            :
                                            null
                                    }
                                    {
                                        newElement.installment?
                                            <span>
                                                Рассрочка №{newElement.installment.number}
                                            </span>
                                            :
                                            null
                                    }
                                    {
                                        newElement.installmentMonth?pdDDMMYYYY(newElement.installmentMonth):null
                                    }
                                </div>
                                <div className={classes.tableCell} style={{width: 250}}>
                                    {
                                        !filter.moneyArticle?
                                            <AutocomplectOnline
                                                defaultValue={newElement.moneyArticle}
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
                                            :
                                            newElement.moneyArticle?
                                                newElement.moneyArticle.name
                                                :
                                                null
                                    }
                                </div>
                                <div className={classes.tableCell} style={{width: 115}}>
                                    {
                                        filter.operation?
                                            newElement.operation
                                            :
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
                                    }
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
                                    {
                                        !filter.currency?
                                            <Select className={classes.input} error={!newElement.currency&&newElement.unsaved} variant='standard' value={newElement.currency} onChange={(event) => {
                                                newElement.unsaved = true
                                                unsaved.current['new'] = true
                                                newElement.currency = event.target.value
                                                if(event.target.value==='сом') {
                                                    newElement.exchangeRate = 1
                                                }
                                                setNewElement({...newElement})
                                            }}>
                                                {currencies.map((element)=>
                                                    <MenuItem key={element} value={element}>{element}</MenuItem>
                                                )}
                                            </Select>
                                            :
                                            newElement.currency
                                    }
                                </div>
                                <div className={classes.tableCell} style={{width: 100}}>
                                    {
                                        newElement.currency==='сом'?
                                            newElement.exchangeRate
                                            :
                                            <Input
                                                placeholder='Курс'
                                                error={!newElement.exchangeRate&&newElement.unsaved}
                                                variant='standard'
                                                className={classes.input}
                                                value={newElement.exchangeRate}
                                                onChange={(event) => {
                                                    newElement.unsaved = true
                                                    unsaved.current['new'] = true
                                                    newElement.exchangeRate = inputFloat(event.target.value)
                                                    setNewElement({...newElement})
                                                }}
                                            />
                                    }
                                </div>
                                <div className={classes.tableCell} style={{width: 150}}>
                                    {newElement.amountEnd}
                                </div>
                                <div className={classes.tableCell} style={{width: 400}}>
                                    <Input
                                        placeholder='Комментарий'
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
                    {list&&list.map((element, idx) =>
                        <div className={classes.tableRow} key={element._id}>
                            {
                                data.edit?
                                    <div className={classes.tableCell} style={{width: 40, padding: 0}}>
                                        <IconButton onClick={(event)=>{
                                            setMenuItems(
                                                [
                                                    <MenuItem sx={{marginBottom: '5px'}} key='MenuItem1' onClick={async()=>{
                                                        if(element.amount&&element.moneyArticle) {
                                                            setMiniDialog('Вы уверены?', <Confirmation action={async () => {
                                                                let res = await setMoneyFlow({
                                                                    _id: element._id,
                                                                    amount: checkFloat(element.amount),
                                                                    exchangeRate: checkFloat(element.exchangeRate),
                                                                    amountEnd: checkFloat(element.amountEnd),
                                                                    moneyArticle: element.moneyArticle._id,
                                                                    info: element.info
                                                                })
                                                                if(res==='OK') {
                                                                    showSnackBar('Успешно', 'success')
                                                                    list[idx].unsaved = false
                                                                    delete unsaved.current[list[idx]._id]
                                                                    setList([...list])
                                                                    await getMoneyFlowsCountWithFilter();
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
                                                                    await getMoneyFlowsCountWithFilter();
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
                            <div className={classes.tableCell} style={{width: 200}}>
                                {
                                    element.cashbox.name
                                }
                            </div>
                            <div className={classes.tableCell} style={{flexDirection: 'column', width: 200,
                                color: !element.client&&!element.moneyRecipient&&!element.moneyRecipient&&!element.cashboxRecipient?'red':'black'
                            }}>
                                {
                                    element.client?
                                        <Link href='/client/[id]' as={`/client/${element.client._id}`}>
                                            <a>
                                                {element.client.name}
                                            </a>
                                        </Link>
                                        :
                                    element.moneyRecipient?element.moneyRecipient.name
                                        :
                                    element.employment?
                                        <Link href='/user/[id]' as={`/user/${element.employment._id}`}>
                                            <a>
                                                {element.employment.name}
                                            </a>
                                        </Link>
                                        :
                                    element.cashboxRecipient?element.cashboxRecipient.name
                                        :
                                    'не указан'
                                }
                                {
                                    element.sale?
                                        <><Link href='/sale/[id]' as={`/sale/${element.sale._id}`}><a>Продажа №{element.sale.number}</a></Link></>
                                        :
                                        null
                                }
                                {
                                    element.refund?
                                        <><Link href='/refund/[id]' as={`/refund/${element.refund._id}`}><a>Возврат №{element.refund.number}</a></Link></>
                                        :
                                        null
                                }
                                {
                                    element.reservation?
                                        <><Link href='/reservation/[id]' as={`/reservation/${element.reservation._id}`}><a>Бронь №{element.reservation.number}</a></Link></>:
                                        null
                                }
                                {
                                    element.order?
                                        <><Link href='/order/[id]' as={`/order/${element.order._id}`}><a>На заказ №{element.order.number}</a></Link></>
                                        :
                                        null
                                }
                                {
                                    element.installment?
                                        <><Link
                                            href={{
                                                pathname: '/installments',
                                                query: {_id: element.installment._id}
                                            }}
                                            as={
                                                `/installments?_id=${element.installment._id}`
                                            }>
                                            <a>Рассрочка №{element.installment.number}</a></Link>{pdDDMMYYYY(element.installmentMonth)}
                                        </>
                                        :
                                        null
                                }
                                {
                                    data.edit?
                                        <div style={{marginTop: 10, fontWeight: 450, color: '#183B37'}} onClick={()=>{
                                            if(data.edit) {
                                                setMiniDialog('Получатель', <SetRecipientE list={list} idx={idx} setList={setList}/>)
                                                showMiniDialog(true)
                                            }
                                        }}>Изменить</div>
                                        :
                                        null
                                }
                            </div>
                            <div className={classes.tableCell} style={{width: 250}}>
                                {
                                    data.edit?
                                        <AutocomplectOnline
                                            defaultValue={element.moneyArticle}
                                            minLength={0}
                                            element={element.moneyArticle}
                                            error={!element.moneyArticle&&element.unsaved}
                                            setElement={(moneyArticle)=>{
                                                list[idx].unsaved = true
                                                unsaved.current[list[idx]._id] = true
                                                list[idx].moneyArticle = moneyArticle
                                                setList([...list])
                                            }}
                                            getElements={async (search)=>{
                                                return await getMoneyArticles({search})
                                            }}
                                            placeholder={'Статья'}
                                        />
                                        :
                                        element.moneyArticle.name
                                }
                            </div>
                            <div className={classes.tableCell} style={{width: 115}}>
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
                                                list[idx].amountEnd = checkFloat(element.amount * element.exchangeRate)
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
                            <div className={classes.tableCell} style={{width: 100}}>
                                {
                                    element.currency==='сом'?
                                        element.exchangeRate
                                        :
                                        <Input
                                            placeholder='Курс'
                                            error={!element.exchangeRate&&element.unsaved}
                                            variant='standard'
                                            className={classes.input}
                                            value={element.exchangeRate}
                                            onChange={(event) => {
                                                list[idx].unsaved = true
                                                unsaved.current[list[idx]._id] = true
                                                list[idx].exchangeRate = inputFloat(event.target.value)
                                                list[idx].amountEnd = checkFloat(element.amount * element.exchangeRate)
                                                setList([...list])
                                            }}
                                        />
                                }
                            </div>
                            <div className={classes.tableCell} style={{width: 150}}>
                                {element.amountEnd}
                            </div>
                            <div className={classes.tableCell} style={{width: 400, ...data.edit?{}:{maxHeight: 100, overflow: 'auto'}}}>
                                {
                                    data.edit?
                                        <Input
                                            placeholder='Комментарий'
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
            {
                count?
                    <div className='count' style={{left: 10, fontWeight: 'unset', fontSize: 13}} onClick={()=>{setShowStat(!showStat)}}>
                        Всего: <b>{count[0][0]}</b><br/>
                        {
                            showStat?
                                <>
                                Приход: сом: <b>{count[1][0]}</b>{count[1][1]!=0?<> | доллар: <b>{count[1][1]}</b></>:null}{count[1][2]!=0?<> | рубль: <b>{count[1][2]}</b></>:null}{count[1][3]!=0?<> | тенге: <b>{count[1][3]}</b></>:null}{count[1][4]!=0?<> | юань: <b>{count[1][4]}</b></>:null}<br/>
                                Расход: сом: <b>{count[2][0]}</b>{count[2][1]!=0?<> | доллар: <b>{count[2][1]}</b></>:null}{count[2][2]!=0?<> | рубль: <b>{count[2][2]}</b></>:null}{count[2][3]!=0?<> | тенге: <b>{count[2][3]}</b></>:null}{count[2][4]!=0?<> | юань: <b>{count[2][4]}</b></>:null}<br/>
                                                                 {
                                                                     count[3]?
                                                                         <>{count[3][0]}: сом: <b>{count[3][1]}</b>{count[3][2]?<> | доллар: <b>{count[3][2]}</b></>:null}{count[3][3]?<> | рубль: <b>{count[3][3]}</b></>:null}{count[3][4]?<> | тенге: <b>{count[3][4]}</b></>:null}{count[3][5]?<> | юань: <b>{count[3][5]}</b></>:null}<br/></>
                                                                         :
                                                                         null
                                                                 }
                                                                 {
                                                                     count[4]?
                                                                         <>{count[4][0]}: сом: <b>{count[4][1]}</b>{count[4][2]?<> | доллар: <b>{count[4][2]}</b></>:null}{count[4][3]?<> | рубль: <b>{count[4][3]}</b></>:null}{count[4][4]?<> | тенге: <b>{count[4][4]}</b></>:null}{count[4][5]?<> | юань: <b>{count[4][5]}</b></>:null}<br/></>
                                                                         :
                                                                         null
                                                                 }
                                                                 {
                                                                     count[5]?
                                                                         <>{count[5][0]}: сом: <b>{count[5][1]}</b>{count[5][2]?<> | доллар: <b>{count[5][2]}</b></>:null}{count[5][3]?<> | рубль: <b>{count[5][3]}</b></>:null}{count[5][4]?<> | тенге: <b>{count[5][4]}</b></>:null}{count[5][5]?<> | юань: <b>{count[5][5]}</b></>:null}<br/></>
                                                                         :
                                                                         null
                                                                 }
                                                                 {
                                                                     count[6]?
                                                                         <>{count[6][0]}: сом: <b>{count[6][1]}</b>{count[6][2]?<> | доллар: <b>{count[6][2]}</b></>:null}{count[6][3]?<> | рубль: <b>{count[6][3]}</b></>:null}{count[6][4]?<> | тенге: <b>{count[6][4]}</b></>:null}{count[6][5]?<> | юань: <b>{count[6][5]}</b></>:null}<br/></>
                                                                         :
                                                                         null
                                                                 }
                                                                 {
                                                                     count[7]?
                                                                         <>{count[7][0]}: сом: <b>{count[7][1]}</b>{count[7][2]?<> | доллар: <b>{count[7][2]}</b></>:null}{count[7][3]?<> | рубль: <b>{count[7][3]}</b></>:null}{count[7][4]?<> | тенге: <b>{count[7][4]}</b></>:null}{count[7][5]?<> | юань: <b>{count[7][5]}</b></>:null}<br/></>
                                                                         :
                                                                         null
                                                                 }
                                                                 {
                                                                     count[8]?
                                                                         <>{count[8][0]}: сом: <b>{count[8][1]}</b>{count[8][2]?<> | доллар: <b>{count[8][2]}</b></>:null}{count[8][3]?<> | рубль: <b>{count[8][3]}</b></>:null}{count[8][4]?<> | тенге: <b>{count[8][4]}</b></>:null}{count[8][5]?<> | юань: <b>{count[8][5]}</b></>:null}<br/></>
                                                                         :
                                                                         null
                                                                 }
                                                                 {
                                                                     count[9]?
                                                                         <>{count[9][0]}: сом: <b>{count[9][1]}</b>{count[9][2]?<> | доллар: <b>{count[9][2]}</b></>:null}{count[9][3]?<> | рубль: <b>{count[9][3]}</b></>:null}{count[9][4]?<> | тенге: <b>{count[9][4]}</b></>:null}{count[9][5]?<> | юань: <b>{count[9][5]}</b></>:null}<br/></>
                                                                         :
                                                                         null
                                                                 }
                                                                 {
                                                                     count[10]?
                                                                         <>{count[10][0]}: сом: <b>{count[10][1]}</b>{count[10][2]?<> | доллар: <b>{count[10][2]}</b></>:null}{count[10][3]?<> | рубль: <b>{count[10][3]}</b></>:null}{count[10][4]?<> | тенге: <b>{count[10][4]}</b></>:null}{count[10][5]?<> | юань: <b>{count[10][5]}</b></>:null}<br/></>
                                                                         :
                                                                         null
                                                                 }
                                </>
                                :
                                null
                        }
                    </div>
                    :
                    null
            }
            {
                data.add||data.edit?
                    <UnloadUpload upload={uploadMoneyFlow} uploadText={uploadText} unload={()=>getUnloadMoneyFlows({
                        search,
                        ...filter.store?{store: filter.store._id}:{},
                        ...filter.dateStart&&filter.dateStart.length?{dateStart: filter.dateStart}:{},
                        ...filter.dateEnd&&filter.dateEnd.length?{dateEnd: filter.dateEnd}:{},
                        ...filter.currency?{currency: filter.currency}:{},
                        ...filter.operation?{operation: filter.operation}:{},
                        ...filter.moneyArticle?{moneyArticle: filter.moneyArticle._id}:{},
                        ...filter.moneyRecipient?{moneyRecipient: filter.moneyRecipient._id}:{},
                        ...filter.user?{employment: filter.user._id}:{},
                        ...filter.client?{client: filter.client._id}:{},
                        ...filter.cashbox?{cashbox: filter.cashbox._id}:{},
                        ...data.installment?{installment: data.installment}:{},
                        ...data.sale?{sale: data.sale}:{},
                        ...data.reservation?{reservation: data.reservation}:{},
                        ...data.order?{order: data.order}:{},
                        ...data.refund?{refund: data.refund}:{}
                    })}/>
                    :
                    null
            }
        </App>
    )
})

MoneyFlows.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', 'управляющий', 'кассир', 'менеджер', 'менеджер/завсклад', 'юрист'].includes(store.getState().user.profile.role))
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
    if(store.getState().user.profile.cashbox)
        store.getState().app.filter.cashbox = store.getState().user.profile.cashbox
    return {
        data: {
            defaultMoneyArticle: {
                'Зарплата': await getMoneyArticleByName('Зарплата', ctx.req?await getClientGqlSsr(ctx.req):undefined),
                'Не указано': await getMoneyArticleByName('Не указано', ctx.req?await getClientGqlSsr(ctx.req):undefined)
            },
            edit: store.getState().user.profile.edit&&['admin', 'кассир'].includes(store.getState().user.profile.role),
            add: store.getState().user.profile.add&&['admin', 'кассир'].includes(store.getState().user.profile.role),
            deleted: store.getState().user.profile.deleted&&['admin', 'кассир'].includes(store.getState().user.profile.role),
            list: cloneObject(await getMoneyFlows({
                ...store.getState().app.filter.cashbox?{store: store.getState().app.filter.cashbox._id}:{},
                ...store.getState().app.filter.store?{store: store.getState().app.filter.store._id}:{},
                ...ctx.query.sale?{sale: ctx.query.sale}:{},
                ...ctx.query.installment?{installment: ctx.query.installment}:{},
                ...ctx.query.reservation?{reservation: ctx.query.reservation}:{},
                ...ctx.query.order?{order: ctx.query.order}:{},
                ...ctx.query.refund?{refund: ctx.query.refund}:{},
                skip: 0
            }, ctx.req?await getClientGqlSsr(ctx.req):undefined)),
            count: await getMoneyFlowsCount({
                ...store.getState().app.filter.cashbox?{store: store.getState().app.filter.cashbox._id}:{},
                ...store.getState().app.filter.store?{store: store.getState().app.filter.store._id}:{},
                ...ctx.query.sale?{sale: ctx.query.sale}:{},
                ...ctx.query.reservation?{reservation: ctx.query.reservation}:{},
                ...ctx.query.order?{order: ctx.query.order}:{},
                ...ctx.query.refund?{refund: ctx.query.refund}:{},
                ...ctx.query.installment?{installment: ctx.query.installment}:{},
            }, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            ...ctx.query.sale?{sale: ctx.query.sale}:{},
            ...ctx.query.reservation?{reservation: ctx.query.reservation}:{},
            ...ctx.query.order?{order: ctx.query.order}:{},
            ...ctx.query.refund?{refund: ctx.query.refund}:{},
            ...ctx.query.installment?{installment: ctx.query.installment}:{},
        }
    };
})

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user
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