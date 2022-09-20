import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import {getInstallments, getInstallmentsCount, setInstallment, getUnloadInstallments} from '../src/gql/installment'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import pageListStyle from '../src/styleMUI/list'
import { urlMain } from '../src/const'
import { cloneObject, pdDDMMYYYY, pdDatePicker } from '../src/lib'
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
import TableViewIcon from '@mui/icons-material/TableView';
import AddIcon from '@mui/icons-material/Add';
import PaidIcon from '@mui/icons-material/Paid';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import AddInstallment from '../components/dialog/AddInstallment';
import SetDate from '../components/dialog/SetDate';
import Fab from '@mui/material/Fab';
import Link from 'next/link';
import UnloadUpload from '../components/app/UnloadUpload';

const colors = {
    'активна': 'orange',
    'оплачен': 'green',
    'отмена': 'red',
    'перерасчет': 'red',
    'безнадежна': 'red',
}
const status = ['все', 'активна', 'оплачен', 'отмена', 'перерасчет', 'безнадежна']

const Installments = React.memo((props) => {
    const {classes} = pageListStyle();
    const unsaved = useRef({});
    const { data } = props;
    const { filter, search } = props.app;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    let [today, setToday] = useState();
    const initialRender = useRef(true);
    const [showComment, setShowComment] = useState(false);
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const getList = async ()=>{
        setList(cloneObject(await getInstallments({
            search,
            skip: 0,
            ...filter.client?{client: filter.client._id}:{},
            ...filter.status?{status: filter.status}:{},
            ...filter.date?{date: filter.date}:{},
            ...filter.timeDif==='late'?{late: true}:filter.timeDif==='soon'?{soon: true}:filter.timeDif==='today'?{today: true}:{},
            ...filter.store?{store: filter.store._id}:{},
            ...data._id?{_id: data._id}:{},
        })));
        setCount(await getInstallmentsCount({
            search,
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
    let searchTimeOut = useRef(null);
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current) await getList()
        })()
    },[filter])
    useEffect(()=>{
        (async()=>{
            if(initialRender.current) {
                today = new Date()
                today.setHours(0, 0, 0, 0)
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
            let addedList = cloneObject(await getInstallments({
                search,
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
    const [anchorElQuick, setAnchorElQuick] = useState(null);
    const [menuItems, setMenuItems] = useState(null);
    let handleMenuQuick = event => setAnchorElQuick(event.currentTarget);
    let handleCloseQuick = () => setAnchorElQuick(null);
    return (
        <App searchShow={true} full unsaved={unsaved} filterShow={{client: true, store: true, status, date: true, timeDif: true }} checkPagination={checkPagination} pageName='Рассрочки' menuItems={menuItems} anchorElQuick={anchorElQuick} setAnchorElQuick={setAnchorElQuick}>
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
                        <div className={classes.tableCell} style={{width: 105, justifyContent: data.edit?'center':'start'}}>
                            Статус
                        </div>
                        <div className={classes.tableCell} style={{width: 200, justifyContent: data.edit?'center':'start'}}>
                            Клиент
                        </div>
                        <div className={classes.tableCell} onClick={()=>setShowComment(!showComment)} style={{width: showComment?400:30, overflow: 'hidden', justifyContent: data.edit&&showComment?'center':'start'}}>
                            {
                                showComment?'Комментарий':'...'
                            }
                        </div>
                        <div className={classes.tableCell} style={{width: 100, justifyContent: data.edit?'center':'start'}}>
                            Долг
                        </div>
                        <div className={classes.tableCell} style={{width: 115, justifyContent: data.edit?'center':'start'}}>
                            Сумма оплат
                        </div>
                        <div className={classes.tableCell} style={{width: 'fit-content', minWidth: 100, justifyContent: 'start'}}>
                            График оплат
                        </div>
                    </div>
                    {list.map((element, idx) =>
                        <div className={classes.tableRow}>
                            {
                                data.edit?
                                    <div className={classes.tableCell} style={{width: 40, padding: 0}}>
                                        <IconButton onClick={(event)=>{
                                            setMenuItems(
                                                [
                                                    ['активна', 'безнадежна'].includes(element.status)?
                                                        <MenuItem sx={{marginBottom: '5px'}} key='MenuItem1' onClick={async()=>{
                                                        setMiniDialog('Вы уверены?', <Confirmation
                                                            action={async () => {
                                                                let grid = []
                                                                for(let i=0; i<element.grid.length; i++) {
                                                                    grid.push({
                                                                        month: element.grid[i].month,
                                                                        amount: element.grid[i].amount,
                                                                        paid: element.grid[i].paid,
                                                                        datePaid: element.grid[i].datePaid
                                                                    })
                                                                }
                                                                let res = await setInstallment({
                                                                    _id: element._id,
                                                                    info: element.info,
                                                                    grid,
                                                                })
                                                                if (res === 'OK') {
                                                                    showSnackBar('Успешно', 'success')
                                                                    list[idx].unsaved = false
                                                                    delete unsaved.current[list[idx]._id]
                                                                    setList([...list])
                                                                }
                                                                else
                                                                    showSnackBar('Ошибка', 'error')
                                                            }
                                                            }/>)
                                                        showMiniDialog(true)
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
                                                    <MenuItem sx={{marginBottom: '5px'}} key='MenuItem2' onClick={async()=>{
                                                        Router.push(`/moneyflows?installment=${element._id}`)
                                                    }}>
                                                        <PaidIcon/>&nbsp;Платежи
                                                    </MenuItem>,
                                                    data.edit&&['активна', 'безнадежна'].includes(element.status)?
                                                        <MenuItem key='MenuItem3' onClick={async()=>{
                                                            setMiniDialog('Добавить рассрочку', <AddInstallment idx={idx} list={list} setList={setList}/>)
                                                            showMiniDialog(true)
                                                            handleCloseQuick()
                                                        }}>
                                                            <TableViewIcon/>&nbsp;Перерасчет
                                                        </MenuItem>
                                                        :
                                                        null,
                                                    data.edit&&'активна'===element.status?
                                                        <MenuItem key='MenuItem4' onClick={async()=>{
                                                            setMiniDialog('Вы уверены?', <Confirmation action={async () => {
                                                                let res = await setInstallment({
                                                                    _id: element._id,
                                                                    status: 'безнадежна'
                                                                })
                                                                if(res==='OK'){
                                                                    showSnackBar('Успешно', 'success')
                                                                    let _list = [...list]
                                                                    _list[idx].status = 'безнадежна'
                                                                    setList(_list)
                                                                }
                                                                else
                                                                    showSnackBar('Ошибка', 'error')
                                                            }}/>)
                                                            showMiniDialog(true)
                                                            handleCloseQuick()
                                                        }}>
                                                            <ViewCarouselIcon style={{color: 'red'}}/>&nbsp;Отметить безнадежной
                                                        </MenuItem>
                                                        :
                                                        data.edit&&'безнадежна'===element.status?
                                                            <MenuItem key='MenuItem4' onClick={async()=>{
                                                                setMiniDialog('Вы уверены?', <Confirmation action={async () => {
                                                                    let res = await setInstallment({
                                                                        _id: element._id,
                                                                        status: 'активна'
                                                                    })
                                                                    if(res==='OK'){
                                                                        showSnackBar('Успешно', 'success')
                                                                        let _list = [...list]
                                                                        _list[idx].status = 'активна'
                                                                        setList(_list)
                                                                    }
                                                                    else
                                                                        showSnackBar('Ошибка', 'error')
                                                                }}/>)
                                                                showMiniDialog(true)
                                                                handleCloseQuick()
                                                            }}>
                                                                <ViewCarouselIcon style={{color: 'orange'}}/>&nbsp;Отметить активной
                                                            </MenuItem>
                                                            :
                                                            null,
                                                    data.deleted&&['активна', 'безнадежна'].includes(element.status)?
                                                        <MenuItem key='MenuItem5' onClick={async()=>{
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
                                    </div>
                                    :
                                    null
                            }
                            <div className={classes.tableCell} style={{width: 40, justifyContent: data.edit?'center':'start'}}>
                                {element.number}
                            </div>
                            <div className={classes.tableCell} style={{width: 105, justifyContent: data.edit?'center':'start', fontWeight: 'bold', color: colors[element.status]}}>
                                {element.status}
                            </div>
                            <div className={classes.tableCell} style={{flexDirection: 'column', width: 200, justifyContent: data.edit?'center':'start'}}>
                                <Link href='/client/[id]' as={`/client/${element.client._id}`}>
                                    <a>
                                        {element.client.name}
                                    </a>
                                </Link>
                                {
                                    element.sale?
                                        <Link href={`/${element.sale.order?'order':'sale'}/[id]`} as={`/${element.sale.order?'order':'sale'}/${element.sale._id}`}>
                                            <a>
                                                {element.sale.order?'На заказ':'Продажа'} №{element.sale.number}
                                            </a>
                                        </Link>
                                        :
                                        null
                                }
                            </div>
                            <div className={classes.tableCell} onClick={()=>{if(!showComment)setShowComment(true)}} style={{width: showComment?400:30, justifyContent: data.edit?'center':'start'}}>
                                {
                                    showComment?
                                        data.edit&&['активна', 'безнадежна'].includes(element.status)?
                                            <Input
                                                placeholder='Комментарий'
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
                            <div className={classes.tableCell} style={{width: 115, borderRight: 'solid 1px #00000040', justifyContent: data.edit?'center':'start', flexDirection: 'column'}}>
                                <div style={{height: 30, width: '100%', borderBottom: 'solid 1px #00000040', justifyContent: 'start', display: 'flex', alignItems: 'center'}}/>
                                <div style={{height: 30, width: '100%', borderBottom: 'solid 1px #00000040', justifyContent: 'start', display: 'flex', alignItems: 'center'}}>{element.amount}</div>
                                <div style={{height: 30, width: '100%', justifyContent: 'start', display: 'flex', alignItems: 'center', ...element.amount<element.paid?{color: 'red'}:{}}}>{element.paid}</div>
                            </div>
                            <div className={classes.tableCell} style={{width: 'fit-content', minWidth: 100, justifyContent: 'start'}}>
                                {
                                    element.grid.map((grid, idx1)=>
                                        <div className={classes.column} key={`${element._id}${idx1}`} style={{width: 100, borderRight: 'solid 1px #00000040', padding: 5}}>
                                            <div
                                                onClick={()=>{
                                                    if(data.edit&&['активна', 'безнадежна'].includes(element.status)) {
                                                        let date = pdDatePicker(grid.month)
                                                        setMiniDialog('Месяц', <SetDate date={date} setDate={(date)=>{
                                                            list[idx].unsaved = true
                                                            unsaved.current[list[idx]._id] = true
                                                            list[idx].grid[idx1].month = date
                                                            setList([...list])
                                                            showMiniDialog(false)
                                                        }}/>)
                                                        showMiniDialog(true)
                                                    }
                                                }}
                                                style={{fontWeight: 'bold', color: grid.amount!=0&&(!grid.paid||grid.paid==0)&&['активна', 'безнадежна'].includes(element.status)&&new Date(grid.month)<today?'red':grid.paid>=grid.amount?'green':'orange', height: 30, borderBottom: 'solid 1px #00000040', justifyContent: 'start', display: 'flex', alignItems: 'center'}}>
                                                {
                                                    pdDDMMYYYY(grid.month)
                                                }
                                            </div>
                                            <div style={{height: 30, borderBottom: 'solid 1px #00000040', justifyContent: 'start', display: 'flex', alignItems: 'center'}}>{grid.amount}</div>
                                            <div style={{height: 30, justifyContent: 'start', display: 'flex', alignItems: 'center'}}>{grid.paid}</div>
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
            <UnloadUpload position={2} unload={()=>getUnloadInstallments({
                search,
                ...filter.client?{client: filter.client._id}:{},
                ...filter.status?{status: filter.status}:{},
                ...filter.date?{date: filter.date}:{},
                ...filter.timeDif==='late'?{late: true}:filter.timeDif==='soon'?{soon: true}:filter.timeDif==='today'?{today: true}:{},
                ...filter.store?{store: filter.store._id}:{},
                ...data._id?{_id: data._id}:{},
            })}/>
            <div className='count' style={{left: 10}}>
                {`Всего: ${count}`}
            </div>
        </App>
    )
})

Installments.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
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
    return {
        data: {
            edit: store.getState().user.profile.edit&&['admin', 'кассир'].includes(store.getState().user.profile.role),
            add: store.getState().user.profile.add&&['admin', 'кассир'].includes(store.getState().user.profile.role),
            deleted: store.getState().user.profile.deleted&&['admin'].includes(store.getState().user.profile.role),
            list: cloneObject(await getInstallments({
                skip: 0,
                ...ctx.query._id?{_id: ctx.query._id}:{},
                ...store.getState().app.filter.store?{store: store.getState().app.filter.store._id}:{}
            },  ctx.req?await getClientGqlSsr(ctx.req):undefined)),
            count: await getInstallmentsCount({
                ...ctx.query._id?{_id: ctx.query._id}:{},
                ...store.getState().app.filter.store?{store: store.getState().app.filter.store._id}:{}
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