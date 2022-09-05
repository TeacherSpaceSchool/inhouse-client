import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import {getSalarys, getSalarysCount, setSalary, addSalary, deleteSalary, getEmploymentsForSalary, getUnloadSalarys, uploadSalary} from '../src/gql/salary'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import pageListStyle from '../src/styleMUI/list'
import { urlMain } from '../src/const'
import { cloneObject, pdMonthYYYY, inputMinusFloat, checkFloat, inputFloat } from '../src/lib'
import Router from 'next/router'
import { forceCheck } from 'react-lazyload';
import { getClientGqlSsr } from '../src/apollo'
import initialApp from '../src/initialApp'
import * as snackbarActions from '../src/redux/actions/snackbar'
import { bindActionCreators } from 'redux'
import { wrapper } from '../src/redux/configureStore'
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import SetDate from '../components/dialog/SetDate'
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MoreVert from '@mui/icons-material/MoreVert';
import Add from '@mui/icons-material/Add';
import Save from '@mui/icons-material/Save';
import Delete from '@mui/icons-material/Delete';
import Confirmation from '../components/dialog/Confirmation'
import Badge from '@mui/material/Badge'
import History from '../components/dialog/History';
import HistoryIcon from '@mui/icons-material/History';
import AutocomplectOnline from '../components/app/AutocomplectOnline'
import Link from 'next/link';
import UnloadUpload from '../components/app/UnloadUpload';

const uploadText = 'Формат xlsx:\nдата (ММ.ГГГГ);\nимя сотрудника;\nоклад;\nставка;\nфак дни;\nраб дни;\nпремия;\nбонус;\nштрафы;\nавансы;\nоплачено.'

const Salarys = React.memo((props) => {
    const {classes} = pageListStyle();
    //props
    const { data } = props;
    const { search, filter } = props.app;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    //настройка
    const unsaved = useRef({});
    const initialRender = useRef(true);
    let [date, setDate] = useState(data.date);
    let [newElement, setNewElement] = useState({
        salary: '',
        bid: '',
        actualDays: '',
        workingDay: '',
        debtStart: '',
        premium: '',
        accrued: '',
        bonus: '',
        penaltie: '',
        advance: '',
        pay: '',
        paid: '',
        debtEnd: ''
    });
    //получение данных
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const getList = async ()=>{
        setList(cloneObject(await getSalarys({
            search,
            skip: 0,
            date,
            ...filter.user?{employment: filter.user._id}:{},
            ...filter.store?{store: filter.store._id}:{},
            ...filter.department?{department: filter.department.name}:{},
            ...filter.position?{position: filter.position.name}:{},
        })));
        setCount(await getSalarysCount({
            search,
            date,
            ...filter.user?{employment: filter.user._id}:{},
            ...filter.department?{department: filter.department.name}:{},
            ...filter.position?{position: filter.position.name}:{},
            ...filter.store?{store: filter.store._id}:{}
        }));
        (document.getElementsByClassName('App-body-f'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
    }
    //поиск/фильтр
    let searchTimeOut = useRef(null);
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current)
                await getList()
        })()
    },[filter, date])
    useEffect(()=>{
        (async()=>{
            if(initialRender.current)
                initialRender.current = false;
            else {
                if(searchTimeOut.current)
                    clearTimeout(searchTimeOut.current)
                searchTimeOut.current = setTimeout(async () => await getList(), 500)
            }
        })()
    },[search])
    //пагинация
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = cloneObject(await getSalarys({
                skip: list.length,
                search,
                date,
                ...filter.user?{employment: filter.user._id}:{},
                ...filter.department?{department: filter.department.name}:{},
                ...filter.position?{position: filter.position.name}:{},
                ...filter.store?{store: filter.store._id}:{}
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
        <App full unsaved={unsaved} filterShow={{user: true, store: true, department: true, position: true}} checkPagination={checkPagination} pageName='Зарплаты' menuItems={menuItems} anchorElQuick={anchorElQuick} setAnchorElQuick={setAnchorElQuick}>
            <Head>
                <title>Зарплаты</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content='Зарплаты' />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/salarys`} />
                <link rel='canonical' href={`${urlMain}/salarys`}/>
            </Head>
            <Card className={classes.page} style={{width: 'fit-content'}}>
                <div className={classes.table}>
                    <div className={classes.tableHead} style={{width: 'fit-content'}}>
                        {data.edit?<div style={{width: 40, padding: 0}}/>:null}
                        <div className={classes.tableCell} style={{width: 200, justifyContent: data.edit?'center':'start'}}>
                            Сотрудник
                        </div>
                        <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                            Оклад
                        </div>
                        <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                            Ставка
                        </div>
                        <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                            Фак дни
                        </div>
                        <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                            Раб дни
                        </div>
                        <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                            Долг на начало
                        </div>
                        <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                            Начислено
                        </div>
                        <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                            Премия
                        </div>
                        <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                            Бонус
                        </div>
                        <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                            Штрафы
                        </div>
                        <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                            Авансы
                        </div>
                        <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                            К оплате
                        </div>
                        <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                            Оплачено
                        </div>
                        <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                            Долг на конец
                        </div>
                    </div>
                    {
                        data.add&&!search&&!filter.user&&!filter.department&&!filter.position?
                            <div className={classes.tableRow} style={{width: 'fit-content'}}>
                                <div className={classes.tableCell} style={{width: 40, padding: 0}}>
                                    <IconButton onClick={(event)=>{
                                        setMenuItems(
                                            <MenuItem onClick={()=>{
                                                if(newElement.employment) {
                                                    setMiniDialog('Вы уверены?', <Confirmation action={async ()=>{
                                                        let res = await addSalary({
                                                            employment: newElement.employment._id,
                                                            date,
                                                            salary: checkFloat(newElement.salary),
                                                            bid: checkFloat(newElement.bid),
                                                            actualDays: checkFloat(newElement.actualDays),
                                                            workingDay: checkFloat(newElement.workingDay),
                                                            debtStart: checkFloat(newElement.debtStart),
                                                            premium: checkFloat(newElement.premium),
                                                            accrued: checkFloat(newElement.accrued),
                                                            bonus: checkFloat(newElement.bonus),
                                                            penaltie: checkFloat(newElement.penaltie),
                                                            advance: checkFloat(newElement.advance),
                                                            pay: checkFloat(newElement.pay),
                                                            paid: checkFloat(newElement.paid),
                                                            debtEnd: checkFloat(newElement.debtEnd)
                                                        })
                                                        if(res&&res._id!=='ERROR') {
                                                            showSnackBar('Успешно', 'success')
                                                            setList([res, ...list])
                                                            setNewElement({
                                                                salary: '',
                                                                bid: '',
                                                                actualDays: '',
                                                                workingDay: '',
                                                                debtStart: '',
                                                                premium: '',
                                                                accrued: '',
                                                                bonus: '',
                                                                penaltie: '',
                                                                advance: '',
                                                                pay: '',
                                                                paid: '',
                                                                debtEnd: ''
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
                                <div className={classes.tableCell} style={{width: 200, justifyContent: data.edit?'center':'start'}}>
                                    <AutocomplectOnline
                                        element={newElement.employment}
                                        error={!newElement.employment}
                                        setElement={async(employment)=>{
                                            if(employment) {
                                                let lastSalary = await getSalarys({employment: employment._id, date, last: true})
                                                if(lastSalary[0])
                                                    newElement.debtStart = lastSalary[0].debtEnd
                                                else
                                                    newElement.debtStart = 0
                                                newElement.pay = checkFloat(checkFloat(newElement.debtStart)+checkFloat(newElement.accrued)+checkFloat(newElement.bonus)+checkFloat(newElement.premium)-checkFloat(newElement.penaltie)-checkFloat(newElement.advance))
                                                newElement.debtEnd = checkFloat(checkFloat(newElement.pay)-checkFloat(newElement.paid))
                                                setNewElement({...newElement})
                                            }
                                            else
                                                newElement.debtStart = 0
                                            newElement.unsaved = true
                                            unsaved.current['new'] = true
                                            newElement.employment = employment
                                            setNewElement({...newElement})
                                        }}
                                        defaultValue={newElement.employment}
                                        getElements={async (search)=>{
                                            return await getEmploymentsForSalary({search, date, ...filter.store?{store: filter.store._id}:{}})
                                        }}
                                        minLength={0}
                                    />
                                </div>
                                <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                                    <Input
                                        placeholder='Оклад'
                                        variant='standard'
                                        className={classes.input}
                                        value={newElement.salary}
                                        onChange={(event) => {
                                            newElement.unsaved = true
                                            unsaved.current['new'] = true
                                            newElement.salary = inputMinusFloat(event.target.value)
                                            newElement.accrued = checkFloat((checkFloat(newElement.workingDay)?(checkFloat(newElement.salary)/checkFloat(newElement.workingDay)*checkFloat(newElement.actualDays)):0)+checkFloat(newElement.bid)*checkFloat(newElement.actualDays))
                                            newElement.pay = checkFloat(checkFloat(newElement.debtStart)+checkFloat(newElement.accrued)+checkFloat(newElement.bonus)+checkFloat(newElement.premium)-checkFloat(newElement.penaltie)-checkFloat(newElement.advance))
                                            newElement.debtEnd = checkFloat(checkFloat(newElement.pay)-checkFloat(newElement.paid))
                                            setNewElement({...newElement})
                                        }}
                                    />
                                </div>
                                <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                                    <Input
                                        placeholder='Ставка'
                                        variant='standard'
                                        className={classes.input}
                                        value={newElement.bid}
                                        onChange={(event) => {
                                            newElement.unsaved = true
                                            unsaved.current['new'] = true
                                            newElement.bid = inputMinusFloat(event.target.value)
                                            newElement.accrued = checkFloat((checkFloat(newElement.workingDay)?(checkFloat(newElement.salary)/checkFloat(newElement.workingDay)*checkFloat(newElement.actualDays)):0)+checkFloat(newElement.bid)*checkFloat(newElement.actualDays))
                                            newElement.pay = checkFloat(checkFloat(newElement.debtStart)+checkFloat(newElement.accrued)+checkFloat(newElement.bonus)+checkFloat(newElement.premium)-checkFloat(newElement.penaltie)-checkFloat(newElement.advance))
                                            newElement.debtEnd = checkFloat(checkFloat(newElement.pay)-checkFloat(newElement.paid))
                                            setNewElement({...newElement})
                                        }}
                                    />
                                </div>
                                <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                                    <Input
                                        placeholder='Фак дни'
                                        variant='standard'
                                        className={classes.input}
                                        value={newElement.actualDays}
                                        onChange={(event) => {
                                            newElement.unsaved = true
                                            unsaved.current['new'] = true
                                            newElement.actualDays = inputFloat(event.target.value)
                                            newElement.accrued = checkFloat((checkFloat(newElement.workingDay)?(checkFloat(newElement.salary)/checkFloat(newElement.workingDay)*checkFloat(newElement.actualDays)):0)+checkFloat(newElement.bid)*checkFloat(newElement.actualDays))
                                            newElement.pay = checkFloat(checkFloat(newElement.debtStart)+checkFloat(newElement.accrued)+checkFloat(newElement.bonus)+checkFloat(newElement.premium)-checkFloat(newElement.penaltie)-checkFloat(newElement.advance))
                                            newElement.debtEnd = checkFloat(checkFloat(newElement.pay)-checkFloat(newElement.paid))
                                            setNewElement({...newElement})
                                        }}
                                    />
                                </div>
                                <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                                    <Input
                                        placeholder='Раб дни'
                                        variant='standard'
                                        className={classes.input}
                                        value={newElement.workingDay}
                                        onChange={(event) => {
                                            newElement.unsaved = true
                                            unsaved.current['new'] = true
                                            newElement.workingDay = inputFloat(event.target.value)
                                            newElement.accrued = checkFloat((checkFloat(newElement.workingDay)?(checkFloat(newElement.salary)/checkFloat(newElement.workingDay)*checkFloat(newElement.actualDays)):0)+checkFloat(newElement.bid)*checkFloat(newElement.actualDays))
                                            newElement.pay = checkFloat(checkFloat(newElement.debtStart)+checkFloat(newElement.accrued)+checkFloat(newElement.bonus)+checkFloat(newElement.premium)-checkFloat(newElement.penaltie)-checkFloat(newElement.advance))
                                            newElement.debtEnd = checkFloat(checkFloat(newElement.pay)-checkFloat(newElement.paid))
                                            setNewElement({...newElement})
                                        }}
                                    />
                                </div>
                                <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                                    {newElement.debtStart}
                                </div>
                                <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                                    {newElement.accrued}
                                </div>
                                <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                                    <Input
                                        placeholder='Премия'
                                        variant='standard'
                                        className={classes.input}
                                        value={newElement.premium}
                                        onChange={(event) => {
                                            newElement.unsaved = true
                                            unsaved.current['new'] = true
                                            newElement.premium = inputMinusFloat(event.target.value)
                                            newElement.pay = checkFloat(checkFloat(newElement.debtStart)+checkFloat(newElement.accrued)+checkFloat(newElement.bonus)+checkFloat(newElement.premium)-checkFloat(newElement.penaltie)-checkFloat(newElement.advance))
                                            newElement.debtEnd = checkFloat(checkFloat(newElement.pay)-checkFloat(newElement.paid))
                                            setNewElement({...newElement})
                                        }}
                                    />
                                </div>
                                <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                                    <Input
                                        placeholder='Бонус'
                                        variant='standard'
                                        className={classes.input}
                                        value={newElement.bonus}
                                        onChange={(event) => {
                                            newElement.unsaved = true
                                            unsaved.current['new'] = true
                                            newElement.bonus = inputMinusFloat(event.target.value)
                                            newElement.pay = checkFloat(checkFloat(newElement.debtStart)+checkFloat(newElement.accrued)+checkFloat(newElement.bonus)+checkFloat(newElement.premium)-checkFloat(newElement.penaltie)-checkFloat(newElement.advance))
                                            newElement.debtEnd = checkFloat(checkFloat(newElement.pay)-checkFloat(newElement.paid))
                                            setNewElement({...newElement})
                                        }}
                                    />
                                </div>
                                <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                                    <Input
                                        placeholder='Штраф'
                                        variant='standard'
                                        className={classes.input}
                                        value={newElement.penaltie}
                                        onChange={(event) => {
                                            newElement.unsaved = true
                                            unsaved.current['new'] = true
                                            newElement.penaltie = inputMinusFloat(event.target.value)
                                            newElement.pay = checkFloat(checkFloat(newElement.debtStart)+checkFloat(newElement.accrued)+checkFloat(newElement.bonus)+checkFloat(newElement.premium)-checkFloat(newElement.penaltie)-checkFloat(newElement.advance))
                                            newElement.debtEnd = checkFloat(checkFloat(newElement.pay)-checkFloat(newElement.paid))
                                            setNewElement({...newElement})
                                        }}
                                    />
                                </div>
                                <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                                    <Input
                                        placeholder='Аванс'
                                        variant='standard'
                                        className={classes.input}
                                        value={newElement.advance}
                                        onChange={(event) => {
                                            newElement.unsaved = true
                                            unsaved.current['new'] = true
                                            newElement.advance = inputMinusFloat(event.target.value)
                                            newElement.pay = checkFloat(checkFloat(newElement.debtStart)+checkFloat(newElement.accrued)+checkFloat(newElement.bonus)+checkFloat(newElement.premium)-checkFloat(newElement.penaltie)-checkFloat(newElement.advance))
                                            newElement.debtEnd = checkFloat(checkFloat(newElement.pay)-checkFloat(newElement.paid))
                                            setNewElement({...newElement})
                                        }}
                                    />
                                </div>
                                <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                                    {newElement.pay}
                                </div>
                                <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                                    <Input
                                        placeholder='Оплачено'
                                        variant='standard'
                                        className={classes.input}
                                        value={newElement.paid}
                                        onChange={(event) => {
                                            newElement.unsaved = true
                                            unsaved.current['new'] = true
                                            newElement.paid = inputMinusFloat(event.target.value)
                                            newElement.debtEnd = checkFloat(checkFloat(newElement.pay)-checkFloat(newElement.paid))
                                            setNewElement({...newElement})
                                        }}
                                    />
                                </div>
                                <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                                    {newElement.debtEnd}
                                </div>
                            </div>
                            :
                            null
                    }
                    {list.map((element, idx) =>
                        <div className={classes.tableRow} style={{width: 'fit-content'}}>
                            {
                                data.edit?
                                    <div className={classes.tableCell} style={{width: 40, padding: 0}}>
                                        <IconButton onClick={(event)=>{
                                            setMenuItems(
                                                [
                                                    <MenuItem sx={{marginBottom: '5px'}} key='MenuItem1' onClick={async()=>{
                                                        setMiniDialog('Вы уверены?', <Confirmation action={async () => {
                                                            let res = await setSalary({
                                                                _id: element._id,
                                                                salary: checkFloat(element.salary),
                                                                bid: checkFloat(element.bid),
                                                                actualDays: checkFloat(element.actualDays),
                                                                workingDay: checkFloat(element.workingDay),
                                                                debtStart: checkFloat(element.debtStart),
                                                                premium: checkFloat(element.premium),
                                                                accrued: checkFloat(element.accrued),
                                                                bonus: checkFloat(element.bonus),
                                                                penaltie: checkFloat(element.penaltie),
                                                                advance: checkFloat(element.advance),
                                                                pay: checkFloat(element.pay),
                                                                paid: checkFloat(element.paid),
                                                                debtEnd: checkFloat(element.debtEnd)
                                                            })
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
                                                    data.deleted?
                                                        <MenuItem key='MenuItem3' onClick={async()=>{
                                                            setMiniDialog('Вы уверены?', <Confirmation action={async () => {
                                                                let res = await deleteSalary(element._id)
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
                            <div className={classes.tableCell} style={{flexDirection: 'column', width: 200, justifyContent: data.edit?'center':'start'}}>
                                <Link href='/user/[id]' as={`/user/${element.employment._id}`}>
                                    <a>
                                        {element.employment.name}
                                    </a>
                                </Link>
                                {element.employment.position}
                            </div>
                            <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                                {
                                    data.edit?
                                        <Input
                                            placeholder='Оклад'
                                            variant='standard'
                                            className={classes.input}
                                            value={element.salary}
                                            onChange={(event) => {
                                                list[idx].unsaved = true
                                                unsaved.current[list[idx]._id] = true
                                                list[idx].salary = inputMinusFloat(event.target.value)
                                                list[idx].accrued = checkFloat((checkFloat(list[idx].workingDay)?(checkFloat(list[idx].salary)/checkFloat(list[idx].workingDay)*checkFloat(list[idx].actualDays)):0)+checkFloat(list[idx].bid)*checkFloat(list[idx].actualDays))
                                                list[idx].pay = checkFloat(checkFloat(list[idx].debtStart)+checkFloat(list[idx].accrued)+checkFloat(list[idx].bonus)+checkFloat(list[idx].premium)-checkFloat(list[idx].penaltie)-checkFloat(list[idx].advance))
                                                list[idx].debtEnd = checkFloat(checkFloat(list[idx].pay)-checkFloat(list[idx].paid))
                                                setList([...list])
                                            }}
                                        />
                                        :
                                        element.salary
                                }
                            </div>
                            <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                                {
                                    data.edit?
                                        <Input
                                            placeholder='Ставка'
                                            variant='standard'
                                            className={classes.input}
                                            value={element.bid}
                                            onChange={(event) => {
                                                list[idx].unsaved = true
                                                unsaved.current[list[idx]._id] = true
                                                list[idx].bid = inputMinusFloat(event.target.value)
                                                list[idx].accrued = checkFloat((checkFloat(list[idx].workingDay)?(checkFloat(list[idx].salary)/checkFloat(list[idx].workingDay)*checkFloat(list[idx].actualDays)):0)+checkFloat(list[idx].bid)*checkFloat(list[idx].actualDays))
                                                list[idx].pay = checkFloat(checkFloat(list[idx].debtStart)+checkFloat(list[idx].accrued)+checkFloat(list[idx].bonus)+checkFloat(list[idx].premium)-checkFloat(list[idx].penaltie)-checkFloat(list[idx].advance))
                                                list[idx].debtEnd = checkFloat(checkFloat(list[idx].pay)-checkFloat(list[idx].paid))
                                                setList([...list])
                                            }}
                                        />
                                        :
                                        element.bid
                                }
                            </div>
                            <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                                {
                                    data.edit?
                                        <Input
                                            placeholder='Фак дни'
                                            variant='standard'
                                            className={classes.input}
                                            value={element.actualDays}
                                            onChange={(event) => {
                                                list[idx].unsaved = true
                                                unsaved.current[list[idx]._id] = true
                                                list[idx].actualDays = inputFloat(event.target.value)
                                                list[idx].accrued = checkFloat((checkFloat(list[idx].workingDay)?(checkFloat(list[idx].salary)/checkFloat(list[idx].workingDay)*checkFloat(list[idx].actualDays)):0)+checkFloat(list[idx].bid)*checkFloat(list[idx].actualDays))
                                                list[idx].pay = checkFloat(checkFloat(list[idx].debtStart)+checkFloat(list[idx].accrued)+checkFloat(list[idx].bonus)+checkFloat(list[idx].premium)-checkFloat(list[idx].penaltie)-checkFloat(list[idx].advance))
                                                list[idx].debtEnd = checkFloat(checkFloat(list[idx].pay)-checkFloat(list[idx].paid))
                                                setList([...list])
                                            }}
                                        />
                                        :
                                        element.actualDays
                                }
                            </div>
                            <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                                {
                                    data.edit?
                                        <Input
                                            placeholder='Раб дни'
                                            variant='standard'
                                            className={classes.input}
                                            value={element.workingDay}
                                            onChange={(event) => {
                                                list[idx].unsaved = true
                                                unsaved.current[list[idx]._id] = true
                                                list[idx].workingDay = inputFloat(event.target.value)
                                                list[idx].accrued = checkFloat((checkFloat(list[idx].workingDay)?(checkFloat(list[idx].salary)/checkFloat(list[idx].workingDay)*checkFloat(list[idx].actualDays)):0)+checkFloat(list[idx].bid)*checkFloat(list[idx].actualDays))
                                                list[idx].pay = checkFloat(checkFloat(list[idx].debtStart)+checkFloat(list[idx].accrued)+checkFloat(list[idx].bonus)+checkFloat(list[idx].premium)-checkFloat(list[idx].penaltie)-checkFloat(list[idx].advance))
                                                list[idx].debtEnd = checkFloat(checkFloat(list[idx].pay)-checkFloat(list[idx].paid))
                                                setList([...list])
                                            }}
                                        />
                                        :
                                        element.workingDay
                                }
                            </div>
                            <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                                {element.debtStart}
                            </div>
                            <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                                {element.accrued}
                            </div>
                            <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                                {
                                    data.edit?
                                        <Input
                                            placeholder='Премия'
                                            variant='standard'
                                            className={classes.input}
                                            value={element.premium}
                                            onChange={(event) => {
                                                list[idx].unsaved = true
                                                unsaved.current[list[idx]._id] = true
                                                list[idx].premium = inputMinusFloat(event.target.value)
                                                list[idx].pay = checkFloat(checkFloat(list[idx].debtStart)+checkFloat(list[idx].accrued)+checkFloat(list[idx].bonus)+checkFloat(list[idx].premium)-checkFloat(list[idx].penaltie)-checkFloat(list[idx].advance))
                                                list[idx].debtEnd = checkFloat(checkFloat(list[idx].pay)-checkFloat(list[idx].paid))
                                                setList([...list])
                                            }}
                                        />
                                        :
                                        element.premium
                                }
                            </div>
                            <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                                {
                                    data.edit?
                                        <Input
                                            placeholder='Бонус'
                                            variant='standard'
                                            className={classes.input}
                                            value={element.bonus}
                                            onChange={(event) => {
                                                list[idx].unsaved = true
                                                unsaved.current[list[idx]._id] = true
                                                list[idx].bonus = inputMinusFloat(event.target.value)
                                                list[idx].pay = checkFloat(checkFloat(list[idx].debtStart)+checkFloat(list[idx].accrued)+checkFloat(list[idx].bonus)+checkFloat(list[idx].premium)-checkFloat(list[idx].penaltie)-checkFloat(list[idx].advance))
                                                list[idx].debtEnd = checkFloat(checkFloat(list[idx].pay)-checkFloat(list[idx].paid))
                                                setList([...list])
                                            }}
                                        />
                                        :
                                        element.bonus
                                }
                            </div>
                            <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                                {
                                    data.edit?
                                        <Input
                                            placeholder='Штраф'
                                            variant='standard'
                                            className={classes.input}
                                            value={element.penaltie}
                                            onChange={(event) => {
                                                list[idx].unsaved = true
                                                unsaved.current[list[idx]._id] = true
                                                list[idx].penaltie = inputMinusFloat(event.target.value)
                                                list[idx].pay = checkFloat(checkFloat(list[idx].debtStart)+checkFloat(list[idx].accrued)+checkFloat(list[idx].bonus)+checkFloat(list[idx].premium)-checkFloat(list[idx].penaltie)-checkFloat(list[idx].advance))
                                                list[idx].debtEnd = checkFloat(checkFloat(list[idx].pay)-checkFloat(list[idx].paid))
                                                setList([...list])
                                            }}
                                        />
                                        :
                                        element.penaltie
                                }
                            </div>
                            <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                                {
                                    data.edit?
                                        <Input
                                            placeholder='Аванс'
                                            variant='standard'
                                            className={classes.input}
                                            value={element.advance}
                                            onChange={(event) => {
                                                list[idx].unsaved = true
                                                unsaved.current[list[idx]._id] = true
                                                list[idx].advance = inputMinusFloat(event.target.value)
                                                list[idx].pay = checkFloat(checkFloat(list[idx].debtStart)+checkFloat(list[idx].accrued)+checkFloat(list[idx].bonus)+checkFloat(list[idx].premium)-checkFloat(list[idx].penaltie)-checkFloat(list[idx].advance))
                                                list[idx].debtEnd = checkFloat(checkFloat(list[idx].pay)-checkFloat(list[idx].paid))
                                                setList([...list])
                                            }}
                                        />
                                        :
                                        element.advance
                                }
                            </div>
                            <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                                {element.pay}
                            </div>
                            <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                                {
                                    data.edit?
                                        <Input
                                            placeholder='Оплачено'
                                            variant='standard'
                                            className={classes.input}
                                            value={element.paid}
                                            onChange={(event) => {
                                                list[idx].unsaved = true
                                                unsaved.current[list[idx]._id] = true
                                                list[idx].paid = inputMinusFloat(event.target.value)
                                                list[idx].pay = checkFloat(checkFloat(list[idx].debtStart)+checkFloat(list[idx].accrued)+checkFloat(list[idx].bonus)+checkFloat(list[idx].premium)-checkFloat(list[idx].penaltie)-checkFloat(list[idx].advance))
                                                list[idx].debtEnd = checkFloat(checkFloat(list[idx].pay)-checkFloat(list[idx].paid))
                                                setList([...list])
                                            }}
                                        />
                                        :
                                        element.paid
                                }
                            </div>
                            <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                                {element.debtEnd}
                            </div>
                        </div>
                    )}
                </div>
            </Card>
            {
                data.add||data.edit?
                    <UnloadUpload position={3} upload={uploadSalary} uploadText={uploadText} unload={()=>getUnloadSalarys({
                        search,
                        date,
                        ...filter.user?{employment: filter.user._id}:{},
                        ...filter.department?{department: filter.department.name}:{},
                        ...filter.position?{position: filter.position.name}:{},
                        ...filter.store?{store: filter.store._id}:{}
                    })}/>
                    :
                    null
            }
            <Button className={classes.fab} style={{width: 150, bottom: 30}} variant='contained' color='primary' onClick={()=>{
                setMiniDialog('Дата', <SetDate date={date} setDate={(_date)=>{
                    if(!unsaved||JSON.stringify(unsaved.current)==='{}') {
                        setNewElement({
                            salary: '',
                            bid: '',
                            actualDays: '',
                            workingDay: '',
                            debtStart: '',
                            premium: '',
                            accrued: '',
                            bonus: '',
                            penaltie: '',
                            advance: '',
                            pay: '',
                            paid: '',
                            debtEnd: ''
                        })
                        setDate(_date)
                    }
                    else
                        showSnackBar('Сохраните изменения или обновите страницу')
                }} month/>)
                showMiniDialog(true)
            }}>
                {pdMonthYYYY(date)}
            </Button>
            <div className='count' style={{left: 10}}>
                {`Всего: ${count}`}
            </div>
        </App>
    )
})

Salarys.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', 'управляющий', 'кассир'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        }
        else {
            Router.push('/')
        }
    let date = new Date()
    date.setHours(0, 0, 0, 0)
    date.setDate(1)
    return {
        data: {
            date,
            edit: store.getState().user.profile.edit&&['admin', 'кассир'].includes(store.getState().user.profile.role),
            add: store.getState().user.profile.add&&['admin', 'кассир'].includes(store.getState().user.profile.role),
            deleted: store.getState().user.profile.deleted&&['admin', 'кассир'].includes(store.getState().user.profile.role),
            list: cloneObject(await getSalarys({
                date,
                skip: 0,
                ...store.getState().app.filter.store?{store: store.getState().app.filter.store}:{}
            },  ctx.req?await getClientGqlSsr(ctx.req):undefined)),
            count: await getSalarysCount({date, ...store.getState().app.filter.store?{store: store.getState().app.filter.store}:{}}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
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
        snackbarActions: bindActionCreators(snackbarActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Salarys);