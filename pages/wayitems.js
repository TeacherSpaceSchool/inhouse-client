import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import {getWayItems, getWayItemsCount, setWayItem, addWayItem, getUnloadWayItems, uploadWayItem} from '../src/gql/wayItem'
import {getWarehouses} from '../src/gql/warehouse'
import {getItems} from '../src/gql/item'
import {getStores} from '../src/gql/store'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import pageListStyle from '../src/styleMUI/list'
import { urlMain } from '../src/const'
import { cloneObject } from '../src/lib'
import Router from 'next/router'
import { forceCheck } from 'react-lazyload';
import { getClientGqlSsr } from '../src/apollo'
import initialApp from '../src/initialApp'
import * as snackbarActions from '../src/redux/actions/snackbar'
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
import History from '../components/dialog/History';
import ConfirmWayItem from '../components/dialog/ConfirmWayItem';
import SetBookings from '../components/dialog/SetBookings';
import HistoryIcon from '@mui/icons-material/History';
import AutocomplectOnline from '../components/app/AutocomplectOnline'
import { inputFloat, checkFloat, pdDatePicker, pdDDMMYYYY } from '../src/lib'
import Cancel from '@mui/icons-material/Cancel';
import Done from '@mui/icons-material/Done';
import Link from 'next/link';
import Button from '@mui/material/Button';
import UnloadUpload from '../components/app/UnloadUpload';

const uploadText = 'Формат xlsx:\n_id в пути (если требуется обновить);\n_id модели;\n_id магазина;\nколичество;\nприбытие (ДД.ММ.ГГГГ);\nбронь (через запятую с пробелом. Пример: _id менеджер1: количество1, _id менеджер2: количество2).'
const status = ['все', 'в пути', 'прибыл', 'отмена']
const colors = {
    'в пути': 'blue',
    'прибыл': 'green',
    'отмена': 'red'
}

const WayItems = React.memo((props) => {
    const {classes} = pageListStyle();
    //props
    const { data } = props;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    const { isMobileApp, filter } = props.app;
    //настройка
    const unsaved = useRef({});
    const initialRender = useRef(true);
    let [today, setToday] = useState();
    let [newElement, setNewElement] = useState({
        amount: '',
        bookings: []
    });
    //получение данных
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const getList = async ()=>{
        list = cloneObject(await getWayItems({
            skip: 0,
            ...filter.date?{date: filter.date}:{},
            ...filter.item?{item: filter.item._id}:{},
            ...filter.store?{store: filter.store._id}:{},
            ...filter.status?{status: filter.status}:{},
            ...filter.timeDif==='late'?{late: true}:filter.timeDif==='soon'?{soon: true}:filter.timeDif==='today'?{today: true}:{}
        }))
        for(let i=0; i<list.length; i++)
            if(list[i].arrivalDate)
                list[i].arrivalDate = pdDatePicker(list[i].arrivalDate)
        setList(list);
        setCount(await getWayItemsCount({
            ...filter.date?{date: filter.date}:{},
            ...filter.item?{item: filter.item._id}:{},
            ...filter.store?{store: filter.store._id}:{},
            ...filter.status?{status: filter.status}:{},
            ...filter.timeDif==='late'?{late: true}:filter.timeDif==='soon'?{soon: true}:filter.timeDif==='today'?{today: true}:{}
        }));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
    }
    //поиск/фильтр
    useEffect(()=>{
        (async()=>{
            if(initialRender.current) {
                initialRender.current = false;
                today = new Date()
                today.setHours(0, 0, 0, 0)
                setToday(today)
            }
            else
                await getList()
        })()
    },[filter])
    //пагинация
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = cloneObject(await getWayItems({skip: list.length,
                ...filter.item?{item: filter.item._id}:{},
                ...filter.date?{date: filter.date}:{},
                ...filter.store?{store: filter.store._id}:{},
                ...filter.status?{status: filter.status}:{},
                ...filter.timeDif==='late'?{late: true}:filter.timeDif==='soon'?{soon: true}:filter.timeDif==='today'?{today: true}:{}
            }))
            for(let i=0; i<addedList.length; i++)
                if(addedList[i].arrivalDate)
                    addedList[i].arrivalDate = pdDatePicker(addedList[i].arrivalDate)
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
        <App unsaved={unsaved} filterShow={{item: true, store: true, status, timeDif: true, date: true}} checkPagination={checkPagination} pageName='В пути' menuItems={menuItems} anchorElQuick={anchorElQuick} setAnchorElQuick={setAnchorElQuick}>
            <Head>
                <title>В пути</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content='В пути' />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/wayitems`} />
                <link rel='canonical' href={`${urlMain}/wayitems`}/>
            </Head>
            <Card className={classes.page} style={isMobileApp?{width: 'fit-content'}:{}}>
                <div className={classes.table}>
                    <div className={classes.tableHead} style={isMobileApp?{width: 'fit-content'}:{}}>
                        {data.edit?<div style={{width: 40, padding: 0}}/>:null}
                        <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                            Статус
                        </div>
                        <div className={classes.tableCell} style={{...isMobileApp?{minWidth: 200}:{}, width: `calc((100% - ${data.edit?575:535}px) / 2)`, justifyContent: data.edit?'center':'start'}}>
                            Модель
                        </div>
                        <div className={classes.tableCell} style={{width: 150, justifyContent: data.edit?'center':'start'}}>
                            Магазин
                        </div>
                        <div className={classes.tableCell} style={{width: 150, justifyContent: data.edit?'center':'start'}}>
                            Количество
                        </div>
                        <div className={classes.tableCell} style={{width: 135, justifyContent: data.edit?'center':'start'}}>
                            Прибытие
                        </div>
                        <div className={classes.tableCell} style={{...isMobileApp?{minWidth: 200}:{}, width: `calc((100% - ${data.edit?575:535}px) / 2)`, justifyContent: data.edit?'center':'start'}}>
                            Бронь
                        </div>
                    </div>
                    {
                        data.add?
                            <div className={classes.tableRow} style={isMobileApp?{width: 'fit-content'}:{}}>
                                <div className={classes.tableCell} style={{width: 40, padding: 0}}>
                                    <IconButton onClick={(event)=>{
                                        setMenuItems(
                                            <MenuItem onClick={()=>{
                                                if(newElement.amount&&newElement.store&&newElement.item) {
                                                    let bookingsAmount = 0, bookings = []
                                                    for(let i=0; i<newElement.bookings.length; i++) {
                                                        bookingsAmount = checkFloat(bookingsAmount + newElement.bookings[i].amount)
                                                        bookings.push({
                                                            manager: newElement.bookings[i].manager._id,
                                                            nameManager: newElement.bookings[i].manager.name,
                                                            client: newElement.bookings[i].client?newElement.bookings[i].client._id:null,
                                                            nameClient: newElement.bookings[i].client?newElement.bookings[i].client.name:null,
                                                            amount: newElement.bookings[i].amount
                                                        })
                                                    }
                                                    if(newElement.amount>=bookingsAmount) {
                                                        setMiniDialog('Вы уверены?', <Confirmation action={async ()=>{
                                                            let res = await addWayItem({item: newElement.item._id, store: newElement.store._id, bookings, amount: checkFloat(newElement.amount), arrivalDate: newElement.arrivalDate})
                                                            if(res&&res._id!=='ERROR') {
                                                                showSnackBar('Успешно', 'success')
                                                                if(res.arrivalDate)
                                                                    res.arrivalDate = pdDatePicker(res.arrivalDate)
                                                                setList([res, ...list])
                                                                setNewElement({
                                                                    amount: '',
                                                                    arrivalDate: '',
                                                                    bookings: []
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
                                                        showSnackBar('Бронь больше количества')
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
                                <div className={classes.tableCell} style={{width: 100}}/>
                                <div className={classes.tableCell} style={{...isMobileApp?{minWidth: 200}:{}, width: `calc((100% - ${data.edit?575:535}px) / 2)`, justifyContent: data.edit?'center':'start'}}>
                                    <AutocomplectOnline
                                        element={newElement.item}
                                        error={!newElement.item&&newElement.unsaved}
                                        setElement={(item)=>{
                                            newElement.unsaved = true
                                            unsaved.current['new'] = true
                                            newElement.item = item
                                            setNewElement({...newElement})
                                        }}
                                        getElements={async (search)=>{
                                            return await getItems({search})
                                        }}
                                        placeholder={'Модель'}
                                    />
                                </div>
                                <div className={classes.tableCell} style={{width: 150, justifyContent: data.edit?'center':'start'}}>
                                    <AutocomplectOnline
                                        error={!newElement.store&&newElement.unsaved}
                                        setElement={(store)=>{
                                            newElement.unsaved = true
                                            unsaved.current['new'] = true
                                            newElement.store = store
                                            setNewElement({...newElement})
                                        }}
                                        element={newElement.store}
                                        getElements={async (search)=>{
                                            return await getStores({search})
                                        }}
                                        placeholder={'Магазин'}
                                        minLength={0}
                                    />
                                </div>
                                <div className={classes.tableCell} style={{width: 150}}>
                                    <Input
                                        placeholder='Количество'
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
                                <div className={classes.tableCell} style={{width: 135}}>
                                    <Input
                                        type='date'
                                        placeholder='Прибытие'
                                        variant='standard'
                                        className={classes.input}
                                        value={newElement.arrivalDate}
                                        onChange={(event) => {
                                            newElement.unsaved = true
                                            unsaved.current['new'] = true
                                            newElement.arrivalDate = event.target.value
                                            setNewElement({...newElement})
                                        }}
                                    />
                                </div>
                                <div className={classes.tableCell} style={{...isMobileApp?{minWidth: 200}:{}, width: `calc((100% - ${data.edit?575:535}px) / 2)`, flexDirection: 'column'}} onClick={()=>{
                                    setMiniDialog('Бронь', <SetBookings edit={data.edit} element={newElement} setElement={(bookings)=>{
                                        newElement.unsaved = true
                                        unsaved.current['new'] = true
                                        newElement.bookings = bookings
                                        setNewElement({...newElement})
                                    }}/>)
                                    showMiniDialog(true)
                                }}>
                                    {
                                        newElement.bookings.length?
                                            newElement.bookings.map((booking, idx) =>
                                                <div className={classes.row} key={`booking${idx}`}>
                                                        <div className={classes.nameField} style={{fontWeight: 500}}>
                                                            <Link href='/user/[id]' as={`/user/${booking.manager._id}`}>
                                                                <a>
                                                                    {booking.manager.name}
                                                                    </a>
                                                            </Link>
                                                            :&nbsp;
                                                        </div>
                                                    <div className={classes.value} style={{fontWeight: 400}}>
                                                        {booking.amount} шт
                                                    </div>
                                                </div>
                                            )
                                            :
                                            <center style={{width: '100%'}}><Button size='small' color='primary'>
                                                Добавить бронь
                                            </Button></center>
                                    }
                                </div>
                            </div>
                            :
                            null
                    }
                    {list.map((element, idx) =>
                        <div className={classes.tableRow} key={element._id} style={isMobileApp?{width: 'fit-content'}:{}}>
                            {
                                data.edit?
                                    <div className={classes.tableCell} style={{width: 40, padding: 0}}>
                                        <IconButton onClick={(event)=>{
                                            setMenuItems(
                                                [
                                                    ['обработка', 'в пути'].includes(element.status)?
                                                        <MenuItem sx={{marginBottom: '5px'}} key='MenuItem1' onClick={async()=>{
                                                            if(element.amount) {
                                                                let bookingsAmount = 0, bookings = []
                                                                for(let i=0; i<element.bookings.length; i++) {
                                                                    bookingsAmount = checkFloat(bookingsAmount + element.bookings[i].amount)
                                                                    bookings.push({
                                                                        manager: element.bookings[i].manager._id,
                                                                        nameManager: element.bookings[i].manager.name,
                                                                        client: element.bookings[i].client?element.bookings[i].client._id:null,
                                                                        nameClient: element.bookings[i].client?element.bookings[i].client.name:null,
                                                                        amount: element.bookings[i].amount
                                                                    })
                                                                }
                                                                if(element.amount>=bookingsAmount) {
                                                                    setMiniDialog('Вы уверены?', <Confirmation
                                                                        action={async () => {
                                                                            let res = await setWayItem({
                                                                                _id: element._id,
                                                                                bookings,
                                                                                arrivalDate: element.arrivalDate,
                                                                                amount: checkFloat(element.amount),
                                                                            })
                                                                            if (res === 'OK') {
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
                                                                    showSnackBar('Бронь больше количества')
                                                            }
                                                            else
                                                                showSnackBar('Заполните все поля')
                                                            handleCloseQuick()
                                                        }}>
                                                            <Badge color='secondary' variant='dot' invisible={!element.unsaved}>
                                                                <Save sx={{color: '#0f0'}}/>&nbsp;Сохранить
                                                            </Badge>
                                                        </MenuItem>
                                                        :
                                                        null,
                                                    <MenuItem sx={{marginBottom: '5px'}} key='MenuItem2' onClick={async()=>{
                                                        setMiniDialog('История', <History where={element._id}/>)
                                                        showMiniDialog(true)
                                                        handleCloseQuick()
                                                    }}>
                                                        <HistoryIcon/>&nbsp;История
                                                    </MenuItem>,
                                                    ['обработка', 'в пути'].includes(element.status)&&!element.unsaved?
                                                        <MenuItem key='MenuItem3' onClick={async()=>{
                                                            const warehouses = await getWarehouses({store: element.store._id})
                                                            setMiniDialog(`Распределение: ${element.amount} ${element.item.unit}`, <ConfirmWayItem unsaved={unsaved} setList={setList} idx={idx} list={list} warehouses={warehouses} element={element}/>)
                                                            showMiniDialog(true)
                                                            handleCloseQuick()
                                                        }}>
                                                            <Done sx={{color: '#0f0'}}/>&nbsp;Прибыл
                                                        </MenuItem>
                                                        :
                                                        null,
                                                    ['обработка', 'в пути'].includes(element.status)&&data.deleted&&!element.unsaved?
                                                        <MenuItem key='MenuItem3' onClick={async()=>{
                                                            setMiniDialog('Вы уверены?', <Confirmation action={async () => {
                                                                let res = await setWayItem({
                                                                    _id: element._id,
                                                                    status: 'отмена',
                                                                })
                                                                if (res === 'OK') {
                                                                    showSnackBar('Успешно', 'success')
                                                                    list[idx].unsaved = false
                                                                    delete unsaved.current[list[idx]._id]
                                                                    list[idx].status = 'отмена'
                                                                    setList([...list])
                                                                }
                                                                else
                                                                    showSnackBar('Ошибка', 'error')
                                                            }}/>)
                                                            showMiniDialog(true)
                                                            handleCloseQuick()
                                                        }}>
                                                            <Cancel sx={{color: 'red'}}/>&nbsp;Отменить
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
                            <div className={classes.tableCell} style={{width: 100, fontWeight: 'bold', color: colors[element.status], justifyContent: data.edit?'center':'start'}}>
                                {element.status}
                            </div>
                            <div className={classes.tableCell} style={{...isMobileApp?{minWidth: 200}:{}, width: `calc((100% - ${data.edit?575:535}px) / 2)`, justifyContent: data.edit?'center':'start'}}>
                                {
                                    element.item.name
                                }
                            </div>
                            <div className={classes.tableCell} style={{width: 150, justifyContent: data.edit?'center':'start'}}>
                                {
                                    element.store.name
                                }
                            </div>
                            <div className={classes.tableCell} style={{width: 150, justifyContent: data.edit?'center':'start'}}>
                                {
                                    data.edit&&['обработка', 'в пути'].includes(element.status)?
                                        <Input
                                            placeholder='Количество'
                                            error={!element.amount}
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
                                        <>{element.amount} {element.item.unit}</>
                                }
                            </div>
                            <div className={classes.tableCell} style={{width: 135, justifyContent: data.edit?'center':'start', color: element.arrivalDate&&['обработка', 'в пути'].includes(element.status)&&new Date(element.arrivalDate)<today?'red':'black'}}>
                                {
                                    data.edit&&['обработка', 'в пути'].includes(element.status)?
                                        <Input
                                            error={element.arrivalDate&&new Date(element.arrivalDate)<today}
                                            type='date'
                                            placeholder='Прибытие'
                                            variant='standard'
                                            className={classes.input}
                                            value={element.arrivalDate}
                                            onChange={(event) => {
                                                list[idx].unsaved = true
                                                unsaved.current[list[idx]._id] = true
                                                list[idx].arrivalDate = inputFloat(event.target.value)
                                                setList([...list])
                                            }}
                                        />
                                        :
                                        element.arrivalDate?
                                            pdDDMMYYYY(element.arrivalDate)
                                            :
                                            null
                                }
                            </div>
                            <div className={classes.tableCell} style={{...isMobileApp?{minWidth: 200}:{}, width: `calc((100% - ${data.edit?575:535}px) / 2)`, flexDirection: 'column'}} onClick={()=>{
                                setMiniDialog('Бронь', <SetBookings edit={data.edit} element={element} setElement={(bookings)=>{
                                    list[idx].unsaved = true
                                    unsaved.current[list[idx]._id] = true
                                    list[idx].bookings = bookings
                                    setList([...list])
                                }}/>)
                                showMiniDialog(true)
                            }}>
                                {
                                    element.bookings.length?
                                        element.bookings.map((booking, idx) =>
                                            <div className={classes.row} key={`booking${idx}`}>
                                                <div className={classes.nameField} style={{fontWeight: 500}}>
                                                    {booking.manager.name}:&nbsp;
                                                </div>
                                                <div className={classes.value} style={{fontWeight: 400}}>
                                                    {booking.amount} шт
                                                </div>
                                            </div>
                                        )
                                        :
                                        data.edit?
                                            <center style={{width: '100%'}}><Button size='small' color='primary'>
                                                Добавить бронь
                                            </Button></center>
                                            :
                                            null
                                }
                            </div>
                        </div>
                    )}
                </div>
            </Card>
            {
                data.add||data.edit?
                    <UnloadUpload upload={uploadWayItem} uploadText={uploadText} unload={()=>getUnloadWayItems({
                        ...filter.date?{date: filter.date}:{},
                        ...filter.item?{item: filter.item._id}:{},
                        ...filter.store?{store: filter.store._id}:{},
                        ...filter.status?{status: filter.status}:{},
                        ...filter.timeDif==='late'?{late: true}:filter.timeDif==='soon'?{soon: true}:filter.timeDif==='today'?{today: true}:{}
                    })}/>
                    :
                    null
            }
            <div className='count'>
                {`Всего: ${count}`}
            </div>
        </App>
    )
})

WayItems.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', 'управляющий', 'менеджер', 'менеджер/завсклад', 'завсклад'].includes(store.getState().user.profile.role))
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
    let list = cloneObject(await getWayItems({
            skip: 0,
            ...store.getState().app.filter.store?{store: store.getState().app.filter.store}:{}
        },  ctx.req?await getClientGqlSsr(ctx.req):undefined))
    for(let i=0; i<list.length; i++)
        if(list[i].arrivalDate)
            list[i].arrivalDate = pdDatePicker(list[i].arrivalDate)
    return {
        data: {
            edit: store.getState().user.profile.edit&&['admin', 'менеджер/завсклад', 'завсклад'].includes(store.getState().user.profile.role),
            add: store.getState().user.profile.add&&['admin', 'менеджер/завсклад', 'завсклад'].includes(store.getState().user.profile.role),
            deleted: store.getState().user.profile.deleted&&['admin', 'менеджер/завсклад', 'завсклад'].includes(store.getState().user.profile.role),
            list,
            count: await getWayItemsCount({
                ...store.getState().app.filter.store?{store: store.getState().app.filter.store}:{}
            }, ctx.req?await getClientGqlSsr(ctx.req):undefined),
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WayItems);