import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import {getBalanceItems, getBalanceItemsCount, setBalanceItem, addBalanceItem, getItemsForBalanceItem, uploadBalanceItem, getUnloadBalanceItems} from '../src/gql/balanceItem'
import {getWarehouses} from '../src/gql/warehouse'
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
import SwapHoriz from '@mui/icons-material/SwapHoriz';
import Add from '@mui/icons-material/Add';
import Save from '@mui/icons-material/Save';
import Confirmation from '../components/dialog/Confirmation'
import MovingWarehouses from '../components/dialog/MovingWarehouses'
import Badge from '@mui/material/Badge'
import History from '../components/dialog/History';
import HistoryIcon from '@mui/icons-material/History';
import AutocomplectOnline from '../components/app/AutocomplectOnline'
import { inputFloat, checkFloat } from '../src/lib'
import Link from 'next/link';
import UnloadUpload from '../components/app/UnloadUpload';
import Fab from '@mui/material/Fab';
import {getStores} from '../src/gql/store'

const uploadText = 'Формат xlsx:\nназвание модели;\nназвание склада;\nназвание магазина;\nостаток.'
const sorts = [
    {
        name: 'Остаток',
        field: 'amount'
    }
]

const BalanceItems = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    const { search, isMobileApp, filter, sort } = props.app;
    const unsaved = useRef({});
    const initialRender = useRef(true);
    let [newElement, setNewElement] = useState({
        amount: ''
    });
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const getList = async ()=>{
        setList(cloneObject(await getBalanceItems({sort, search, skip: 0, ...filter.item?{item: filter.item._id}:{}, ...filter.warehouse?{warehouse: filter.warehouse._id}:{}, ...filter.store?{store: filter.store._id}:{}})));
        setCount(await getBalanceItemsCount({
            search,
            ...filter.item?{item: filter.item._id}:{},
            ...filter.warehouse?{warehouse: filter.warehouse._id}:{},
            ...filter.store?{store: filter.store._id}:{}
        }));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
    }
    let searchTimeOut = useRef(null);
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current)
                await getList()
        })()
    },[filter, sort])
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
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = cloneObject(await getBalanceItems({sort, skip: list.length, search, ...filter.item?{item: filter.item._id}:{}, ...filter.warehouse?{warehouse: filter.warehouse._id}:{}, ...filter.store?{store: filter.store._id}:{}}))
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
        <App sorts={sorts} unsaved={unsaved} filterShow={{item: true, warehouse: true, store: true}} checkPagination={checkPagination} searchShow={true} pageName='Баланс складов' menuItems={menuItems} anchorElQuick={anchorElQuick} setAnchorElQuick={setAnchorElQuick}>
            <Head>
                <title>Баланс складов</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content='Баланс складов' />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/balanceitems`} />
                <link rel='canonical' href={`${urlMain}/balanceitems`}/>
            </Head>
            <Card className={classes.page} style={isMobileApp?{width: 'fit-content'}:{}}>
                <div className={classes.table}>
                    <div className={classes.tableHead}>
                        {data.edit?<div style={{width: 40, padding: 0}}/>:null}
                        <div className={classes.tableCell} style={{...isMobileApp?{minWidth: 200}:{}, width: `calc((100% - ${data.edit?190:150}px) / 3)`, justifyContent: data.edit?'center':'start'}}>
                            Магазин
                        </div>
                        <div className={classes.tableCell} style={{...isMobileApp?{minWidth: 200}:{}, width: `calc((100% - ${data.edit?190:150}px) / 3)`, justifyContent: data.edit?'center':'start'}}>
                            Склад
                        </div>
                        <div className={classes.tableCell} style={{...isMobileApp?{minWidth: 200}:{}, width: `calc((100% - ${data.edit?190:150}px) / 3)`, justifyContent: data.edit?'center':'start'}}>
                            Модель
                        </div>
                        <div className={classes.tableCell} style={{width: 150, justifyContent: data.edit?'center':'start'}}>
                            Остаток
                        </div>
                    </div>
                    {
                        data.add&&!search&&!filter.item&&!filter.warehouse?
                            <div className={classes.tableRow}>
                                <div className={classes.tableCell} style={{width: 40, padding: 0}}>
                                    <IconButton onClick={(event)=>{
                                        setMenuItems(
                                            <MenuItem onClick={()=>{
                                                if(newElement.amount.length&&newElement.warehouse&&newElement.item) {
                                                    setMiniDialog('Вы уверены?', <Confirmation action={async ()=>{
                                                        let res = await addBalanceItem({amount: checkFloat(newElement.amount), warehouse: newElement.warehouse._id, item: newElement.item._id})
                                                        if(res&&res._id!=='ERROR') {
                                                            showSnackBar('Успешно', 'success')
                                                            setList([res, ...list])
                                                            delete unsaved.current['new']
                                                            setNewElement({
                                                                amount: ''
                                                            })
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
                                <div className={classes.tableCell} style={{...isMobileApp?{minWidth: 200}:{}, width: 'calc((100% - 190px) / 3)', justifyContent: 'center'}}>
                                    <AutocomplectOnline
                                        error={!newElement.store}
                                        element={newElement.store}
                                        setElement={store=>{
                                            newElement.unsaved = true
                                            unsaved.current['new'] = true
                                            if(!store) {
                                                newElement.item = null
                                                newElement.warehouse = null
                                            }
                                            newElement.store = store
                                            setNewElement({...newElement})
                                        }}
                                        getElements={async (search)=>{
                                            return await getStores({search})
                                        }}
                                        minLength={0}
                                    />
                                </div>
                                <div className={classes.tableCell} style={{...isMobileApp?{minWidth: 200}:{}, width: 'calc((100% - 190px) / 3)'}}>
                                    <AutocomplectOnline
                                        element={newElement.warehouse}
                                        error={!newElement.warehouse&&newElement.unsaved}
                                        setElement={(warehouse)=>{
                                            newElement.unsaved = true
                                            unsaved.current['new'] = true
                                            if(!warehouse)
                                                newElement.item = null
                                            newElement.warehouse = warehouse
                                            setNewElement({...newElement})
                                        }}
                                        getElements={async (search)=>{
                                            if(newElement.store)
                                                return await getWarehouses({
                                                    search,
                                                    store: newElement.store._id,
                                                })
                                            else {
                                                showSnackBar('Укажите магазин')
                                                return []
                                            }
                                        }}
                                        placeholder={'Склад'}
                                        minLength={0}
                                    />
                                </div>
                                <div className={classes.tableCell} style={{...isMobileApp?{minWidth: 200}:{}, width: 'calc((100% - 190px) / 3)'}}>
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
                                            if(newElement.warehouse)
                                                return await getItemsForBalanceItem({search, warehouse: newElement.warehouse._id})
                                            else {
                                                showSnackBar('Укажите склад')
                                                return []
                                            }
                                        }}
                                        placeholder={'Модель'}
                                    />
                                </div>
                                <div className={classes.tableCell} style={{width: 150}}>
                                    <Input
                                        placeholder='Остатки'
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
                            </div>
                            :
                            null
                    }
                    {list.map((element, idx) =>
                        <div className={classes.tableRow} key={element._id}>
                            {
                                data.edit?
                                    <div className={classes.tableCell} style={{width: 40, padding: 0}}>
                                        <IconButton onClick={(event)=>{
                                            setMenuItems(
                                                [
                                                    <MenuItem sx={{marginBottom: '5px'}} key='MenuItem1' onClick={async()=>{
                                                        if(element.amount&&element.warehouse&&element.item) {
                                                            setMiniDialog('Вы уверены?', <Confirmation action={async () => {
                                                                let res = await setBalanceItem({amount: checkFloat(element.amount), warehouse: element.warehouse._id, item: element.item._id})
                                                                if(res==='OK') {
                                                                    showSnackBar('Успешно', 'success')
                                                                    list[idx].unsaved = false
                                                                    delete unsaved.current[list[idx]._id]
                                                                    setList([...list])
                                                                }
                                                                else
                                                                    showSnackBar('Неверный остаток', 'error')
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
                                                    </MenuItem>
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
                            <div className={classes.tableCell} style={{...isMobileApp?{minWidth: 200}:{}, justifyContent: data.edit?'center':'start', width: `calc((100% - ${data.edit?190:150}px) / 3)`, maxHeight: 100, overflow: 'auto'}}>
                                <Link href='/item/[id]' as={`/item/${element.item._id}`}>
                                    <a>
                                        {
                                           element.item.name
                                        }
                                    </a>
                                </Link>
                            </div>
                            <div className={classes.tableCell} style={{...isMobileApp?{minWidth: 200}:{}, justifyContent: data.edit?'center':'start', width: `calc((100% - ${data.edit?190:150}px) / 3)`, maxHeight: 100, overflow: 'auto'}}>
                                {
                                    element.warehouse.name
                                }
                            </div>
                            <div className={classes.tableCell} style={{...isMobileApp?{minWidth: 200}:{}, justifyContent: data.edit?'center':'start', width: `calc((100% - ${data.edit?190:150}px) / 3)`, maxHeight: 100, overflow: 'auto'}}>
                                {
                                    element.store.name
                                }
                            </div>
                            <div className={classes.tableCell} style={{flexDirection: 'column', width: 150}}>
                                {
                                    data.edit?
                                        <Input
                                            placeholder='Остатки'
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
                        </div>
                    )}
                </div>
            </Card>
            {
                data.edit?
                    <Fab color='primary' aria-label='add' className={classes.fab} onClick={()=>{
                        setMiniDialog('Переместить', <MovingWarehouses/>)
                        showMiniDialog(true)
                    }}>
                        <SwapHoriz/>
                    </Fab>
                    :
                    null
            }
            {
                data.add||data.edit?
                    <UnloadUpload position={2} upload={uploadBalanceItem} uploadText={uploadText} unload={()=>getUnloadBalanceItems({search, ...filter.item?{item: filter.item._id}:{}, ...filter.warehouse?{warehouse: filter.warehouse._id}:{}, ...filter.store?{store: filter.store._id}:{}})}/>
                    :
                    null
            }
            <div className='count'>
                {`Всего: ${count}`}
            </div>
        </App>
    )
})

BalanceItems.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', 'менеджер', 'менеджер/завсклад', 'управляющий', 'завсклад'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        }
        else {
            Router.push('/')
        }
    store.getState().app.sort = '-amount'
    return {
        data: {
            edit: store.getState().user.profile.edit&&['admin', 'менеджер/завсклад', 'завсклад'].includes(store.getState().user.profile.role),
            add: store.getState().user.profile.add&&['admin', 'менеджер/завсклад', 'завсклад'].includes(store.getState().user.profile.role),
            list: cloneObject(await getBalanceItems({skip: 0, ...store.getState().app.filter.store?{store: store.getState().app.filter.store._id}:{}},  ctx.req?await getClientGqlSsr(ctx.req):undefined)),
            count: await getBalanceItemsCount({...store.getState().app.filter.store?{store: store.getState().app.filter.store._id}:{}}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
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

export default connect(mapStateToProps, mapDispatchToProps)(BalanceItems);