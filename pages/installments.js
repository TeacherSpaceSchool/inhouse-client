import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import {getInstallments, getInstallmentsCount, setInstallment} from '../src/gql/installment'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import pageListStyle from '../src/styleMUI/list'
import { urlMain } from '../src/const'
import { cloneObject, pdDDMMYYYY, checkFloat, inputFloat } from '../src/lib'
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
import Save from '@mui/icons-material/Save';
import Confirmation from '../components/dialog/Confirmation'
import Badge from '@mui/material/Badge'
import History from '../components/dialog/History';
import HistoryIcon from '@mui/icons-material/History';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import AddInstallment from '../components/dialog/AddInstallment';
import Fab from '@mui/material/Fab';

const colors = {
    'активна': 'orange',
    'оплачен': 'green',
    'отмена': 'red',
    'перерасчет': 'red',
}
const status = ['все', 'активна', 'оплачен', 'отмена', 'перерасчет']

const Installments = React.memo((props) => {
    const {classes} = pageListStyle();
    //props
    const unsaved = useRef({});
    const { data } = props;
    const { filter } = props.app;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    //настройка
    const today = useRef();
    const initialRender = useRef(true);
    const [showComment, setShowComment] = useState(false);
    //получение данных
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const getList = async ()=>{
        setList(cloneObject(await getInstallments({
            skip: 0,
            ...filter.client?{client: filter.client._id}:{},
            ...filter.status?{status: filter.status}:{},
            ...filter.date?{date: filter.date}:{},
            ...filter.timeDif==='late'?{late: true}:filter.timeDif==='soon'?{soon: true}:filter.timeDif==='today'?{today: true}:{},
            ...filter.store?{store: filter.store._id}:{},
            ...data._id?{_id: data._id}:{},
        })));
        setCount(await getInstallmentsCount({
            ...filter.client?{client: filter.client._id}:{},
            ...filter.status?{status: filter.status}:{},
            ...filter.date?{date: filter.date}:{},
            ...filter.timeDif==='late'?{late: true}:filter.timeDif==='soon'?{soon: true}:filter.timeDif==='today'?{today: true}:{},
            ...filter.store?{store: filter.store._id}:{},
            ...data._id?{_id: data._id}:{},
        }));
        (document.getElementsByClassName('App-body-f'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
    }
    //поиск/фильтр
    useEffect(()=>{
        (async()=>{
            if(initialRender.current) {
                today.current = new Date()
                today.current.setHours(0, 0, 0, 0)
                initialRender.current = false;
            }
            else
                await getList()
        })()
    },[filter])
    //пагинация
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = cloneObject(await getInstallments({
                skip: list.length,
                ...filter.client?{client: filter.client._id}:{},
                ...filter.status?{status: filter.status}:{},
                ...filter.date?{date: filter.date}:{},
                ...filter.timeDif==='late'?{late: true}:filter.timeDif==='soon'?{soon: true}:filter.timeDif==='today'?{today: true}:{},
                ...filter.store?{store: filter.store._id}:{},
                ...data._id?{_id: data._id}:{},
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
        <App full unsaved={unsaved} filterShow={{client: true, store: true, status, date: true, timeDif: true }} checkPagination={checkPagination} pageName='Рассрочки' menuItems={menuItems} anchorElQuick={anchorElQuick} setAnchorElQuick={setAnchorElQuick}>
            <Head>
                <title>Рассрочки</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content='Рассрочки' />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/installments`} />
                <link rel='canonical' href={`${urlMain}/installments`}/>
            </Head>
            <Card className={classes.page} style={{width: 'fit-content'}}>
                <div className={classes.table}>
                    <div className={classes.tableHead} style={{width: '100%'}}>
                        {data.edit?<div style={{width: 40, padding: 0}}/>:null}
                        <div className={classes.tableCell} style={{width: 40, justifyContent: data.edit?'center':'start'}}>
                            №
                        </div>
                        <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                            Статус
                        </div>
                        <div className={classes.tableCell} style={{width: 200, justifyContent: data.edit?'center':'start'}}>
                            Клиент
                        </div>
                        <div className={classes.tableCell} onClick={()=>setShowComment(!showComment)} style={{width: showComment?200:30, overflow: 'hidden', justifyContent: data.edit&&showComment?'center':'start'}}>
                            {
                                showComment?'Комментарий':'...'
                            }
                        </div>
                        <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                            Долг
                        </div>
                        <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                            Сумма оплат
                        </div>
                        <div className={classes.tableCell} style={{width: 'fit-content', minWidth: 100, justifyContent: 'start'}}>
                            График оплат
                        </div>
                    </div>
                    {list.map((element, idx) =>
                        <div className={classes.tableRow} style={{width: 'fit-content'}}>
                            {
                                data.edit?
                                    <div className={classes.tableCell} style={{width: 40, padding: 0}}>
                                        {
                                            element.status==='активна'?
                                                <IconButton onClick={(event)=>{
                                                    setMenuItems(
                                                        [
                                                            <MenuItem sx={{marginBottom: '5px'}} key='MenuItem1' onClick={async()=>{
                                                                if(element.amount>=element.paid) {
                                                                    setMiniDialog('Вы уверены?', <Confirmation
                                                                        action={async () => {
                                                                            let grid = cloneObject(element.grid)
                                                                            for(let i=0; i<element.grid.length; i++) {
                                                                                if(grid[i].paid)
                                                                                    grid[i].paid = checkFloat(grid[i].paid)
                                                                                else
                                                                                    grid[i].paid = null
                                                                                delete grid[i].__typename
                                                                            }
                                                                            let res = await setInstallment({
                                                                                _id: element._id,
                                                                                grid,
                                                                                info: element.info,
                                                                                ...element.amount===element.paid?{status: 'оплачен'}:{},
                                                                                debt: element.debt,
                                                                                paid: element.paid,
                                                                                datePaid: element.datePaid
                                                                            })
                                                                            if (res === 'OK') {
                                                                                showSnackBar('Успешно', 'success')
                                                                                list[idx].unsaved = false
                                                                                delete unsaved.current[list[idx]._id]
                                                                                if(element.amount===element.paid)
                                                                                    list[idx].status = 'оплачен'
                                                                                setList([...list])
                                                                            }
                                                                            else
                                                                                showSnackBar('Ошибка', 'error')
                                                                        }
                                                                        }/>)
                                                                    showMiniDialog(true)
                                                                }
                                                                else
                                                                    showSnackBar('Сумма оплат не верна')
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
                                                                        let res = await setInstallment({
                                                                            _id: element._id,
                                                                            status: 'отмена'
                                                                        })
                                                                        if(res==='OK'){
                                                                            showSnackBar('Успешно', 'success')
                                                                            let _list = [...list]
                                                                            _list[idx].status = 'отмена'
                                                                            setList(_list)
                                                                        }
                                                                        else
                                                                            showSnackBar('Ошибка', 'error')
                                                                    }}/>)
                                                                    showMiniDialog(true)
                                                                    handleCloseQuick()
                                                                }}>
                                                                    <CancelIcon style={{color: 'red'}}/>&nbsp;Отмена
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
                                                :
                                                null
                                        }
                                    </div>
                                    :
                                    null
                            }
                            <div className={classes.tableCell} style={{width: 40, justifyContent: data.edit?'center':'start'}}>
                                {element.number}
                            </div>
                            <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start', fontWeight: 'bold', color: colors[element.status]}}>
                                {element.status}
                            </div>
                            <div className={classes.tableCell} style={{width: 200, justifyContent: data.edit?'center':'start'}}>
                                {element.client.name}
                                {
                                    element.sale?
                                        <>
                                        <br/>
                                        Продажа №{element.sale.number}
                                        </>
                                        :
                                        null
                                }
                            </div>
                            <div className={classes.tableCell} onClick={()=>{if(!showComment)setShowComment(true)}} style={{width: showComment?200:30, justifyContent: data.edit?'center':'start'}}>
                                {
                                    showComment?
                                        data.edit&&element.status==='активна'?
                                            <Input
                                                placeholder='Информация'
                                                multiline={true}
                                                maxRows='5'
                                                variant='standard'
                                                className={classes.inputNoMargin}
                                                value={element.info}
                                                onChange={(event) => {
                                                    list[idx].unsaved = true
                                                    unsaved.current[list[idx]._id] = true
                                                    list[idx].info = event.target.value
                                                    setList([...list])
                                                }}
                                            />
                                            :
                                            element.info
                                        :
                                        null
                                }
                            </div>
                            <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start', ...element.amount<element.paid?{color: 'red'}:{}}}>
                                {element.debt}
                            </div>
                            <div className={classes.tableCell} style={{width: 100, borderRight: 'solid 1px #00000040', justifyContent: data.edit?'center':'start', flexDirection: 'column'}}>
                                <div style={{height: 30, width: '100%', borderBottom: 'solid 1px #00000040', justifyContent: 'start', display: 'flex', alignItems: 'center'}}/>
                                <div style={{height: 30, width: '100%', borderBottom: 'solid 1px #00000040', justifyContent: 'start', display: 'flex', alignItems: 'center'}}>{element.amount}</div>
                                <div style={{height: 30, width: '100%', justifyContent: 'start', display: 'flex', alignItems: 'center', ...element.amount<element.paid?{color: 'red'}:{}}}>{element.paid}</div>
                            </div>
                            <div className={classes.tableCell} style={{width: 'fit-content', minWidth: 100, justifyContent: 'start'}}>
                                {
                                    element.grid.map((grid, idx1)=>
                                        <div className={classes.column} key={`${element._id}${idx1}`} style={{width: 100, borderRight: 'solid 1px #00000040', padding: 5}}>
                                            <div style={{height: 30, borderBottom: 'solid 1px #00000040', justifyContent: 'start', display: 'flex', alignItems: 'center', color: !grid.paid&&['активна'].includes(element.status)&&new Date(grid.month)<today.current?'red':'black'}}>{pdDDMMYYYY(grid.month)}</div>
                                            <div style={{height: 30, borderBottom: 'solid 1px #00000040', justifyContent: 'start', display: 'flex', alignItems: 'center'}}>{grid.amount}</div>
                                            {
                                                data.edit&&idx1&&element.status==='активна'?
                                                    <Input
                                                        placeholder='Оплачено'
                                                        variant='standard'
                                                        className={classes.inputNoMargin}
                                                        value={grid.paid}
                                                        onChange={(event) => {
                                                            list[idx].unsaved = true
                                                            unsaved.current[list[idx]._id] = true
                                                            let paid = checkFloat(event.target.value)
                                                            list[idx].paid = checkFloat(element.paid - list[idx].grid[idx1].paid + paid)
                                                            list[idx].debt = checkFloat(element.amount - element.paid)
                                                            list[idx].grid[idx1].paid = inputFloat(event.target.value)
                                                            if(!list[idx].grid[idx1].datePaid)
                                                                list[idx].grid[idx1].datePaid = new Date()
                                                            for(let i=0; i<list[idx].grid.length; i++) {
                                                                if(!checkFloat(list[idx].grid[i].paid)) {
                                                                    list[idx].datePaid = list[idx].grid[i].month
                                                                    break
                                                                }
                                                            }
                                                            setList([...list])
                                                        }}
                                                    />
                                                    :
                                                    <div style={{height: 30, justifyContent: 'start', display: 'flex', alignItems: 'center'}}>{grid.paid}</div>
                                            }
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    )}
                </div>
                {
                    data.add?
                        <Fab color='primary' aria-label='add' className={classes.fab} onClick={()=>{
                            setMiniDialog('Добавить рассрочку', <AddInstallment list={list} setList={setList}/>)
                            showMiniDialog(true)
                        }}>
                            <AddIcon />
                        </Fab>
                        :
                        null
                }
            </Card>
            <div className='count' style={{left: 10}}>
                {`Всего: ${count}`}
            </div>
        </App>
    )
})

Installments.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
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
    return {
        data: {
            edit: store.getState().user.profile.edit&&['admin'].includes(store.getState().user.profile.role),
            add: store.getState().user.profile.add&&['admin'].includes(store.getState().user.profile.role),
            deleted: store.getState().user.profile.deleted&&['admin'].includes(store.getState().user.profile.role),
            list: cloneObject(await getInstallments({
                skip: 0,
                ...ctx.query._id?{_id: ctx.query._id}:{},
                ...store.getState().app.filter.store?{store: store.getState().app.filter.store}:{}
            },  ctx.req?await getClientGqlSsr(ctx.req):undefined)),
            count: await getInstallmentsCount({
                ...ctx.query._id?{_id: ctx.query._id}:{},
                ...store.getState().app.filter.store?{store: store.getState().app.filter.store}:{}
            }, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            ...ctx.query._id?{_id: ctx.query._id}:{},
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

export default connect(mapStateToProps, mapDispatchToProps)(Installments);