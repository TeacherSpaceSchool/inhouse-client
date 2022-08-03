import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import {getWarehouses, getWarehousesCount, addWarehouse, setWarehouse, deleteWarehouse} from '../src/gql/warehouse'
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
import Card from '@mui/material/Card';

const Warehouses = React.memo((props) => {
    const {classes} = pageListStyle();
    //props
    const { data } = props;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    const { search, filter } = props.app;
    //настройка
    const unsaved = useRef({});
    const initialRender = useRef(true);
    let [newElement, setNewElement] = useState({
        name: ''
    });
    //получение данных
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const getList = async ()=>{
        setList(cloneObject(await getWarehouses({search, skip: 0, ...filter.store?{store: filter.store._id}:{}})));
        setCount(await getWarehousesCount({search, ...filter.store?{store: filter.store._id}:{}}));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
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
    },[filter])
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
            let addedList = cloneObject(await getWarehouses({skip: list.length, search, ...filter.store?{store: filter.store._id}:{}}))
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
        <App unsaved={unsaved} filterShow={{store: true}} checkPagination={checkPagination} searchShow={true} pageName='Склады' menuItems={menuItems} anchorElQuick={anchorElQuick} setAnchorElQuick={setAnchorElQuick}>
            <Head>
                <title>Склады</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content='Склады' />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/warehouses`} />
                <link rel='canonical' href={`${urlMain}/warehouses`}/>
            </Head>
            <Card className={classes.page}>
                <div className={classes.table}>
                    <div className={classes.tableHead}>
                        {data.edit?<div style={{width: 40, padding: 0}}/>:null}
                        <div className={classes.tableCell} style={{width: data.edit?'calc((100% - 40px) / 2)':'calc(100% / 2)', justifyContent: data.edit?'center':'start'}}>
                            Название
                        </div>
                        <div className={classes.tableCell} style={{width: data.edit?'calc((100% - 40px) / 2)':'calc(100% / 2)', justifyContent: data.edit?'center':'start'}}>
                            Магазин
                        </div>
                    </div>
                    {
                        data.add?
                            <div className={classes.tableRow}>
                                <div className={classes.tableCell} style={{width: 40, padding: 0}}>
                                    <IconButton onClick={(event)=>{
                                        setMenuItems(
                                            <MenuItem onClick={()=>{
                                                if(newElement.name.length&&newElement.store) {
                                                    setMiniDialog('Вы уверены?', <Confirmation action={async ()=>{
                                                        let res = await addWarehouse({...newElement, store: newElement.store._id})
                                                        if(res&&res._id!=='ERROR') {
                                                            showSnackBar('Успешно', 'success')
                                                            setList([res, ...list])
                                                            setNewElement({
                                                                name: ''
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
                                <div className={classes.tableCell} style={{width: data.edit?'calc((100% - 40px) / 2)':'calc(100% / 2)'}}>
                                    <Input
                                        placeholder='Название'
                                        error={!newElement.name.length&&newElement.unsaved}
                                        variant='standard'
                                        className={classes.input}
                                        value={newElement.name}
                                        onChange={(event) => {
                                            newElement.unsaved = true
                                            unsaved.current['new'] = true
                                            newElement.name = event.target.value
                                            setNewElement({...newElement})
                                        }}
                                    />
                                </div>
                                <div className={classes.tableCell} style={{width: data.edit?'calc((100% - 40px) / 2)':'calc(100% / 2)'}}>
                                    <AutocomplectOnline
                                        element={newElement.store}
                                        error={!newElement.store&&newElement.unsaved}
                                        setElement={(store)=>{
                                            newElement.unsaved = true
                                            unsaved.current['new'] = true
                                            newElement.store = store
                                            setNewElement({...newElement})
                                        }}
                                        getElements={async (search)=>{
                                            return await getStores({search})
                                        }}
                                        placeholder={'Магазин'}
                                        minLength={0}
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
                                                        if(element.name.length) {
                                                            setMiniDialog('Вы уверены?', <Confirmation action={async () => {
                                                                let res = await setWarehouse({...element})
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
                                                    data.deleted?
                                                        <MenuItem key='MenuItem3' onClick={async()=>{
                                                            setMiniDialog('Вы уверены?', <Confirmation action={async () => {
                                                                let res = await deleteWarehouse(element._id)
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
                            <div className={classes.tableCell} style={{width: data.edit?'calc((100% - 40px) / 2)':'calc(100% / 2)', maxHeight: 100, overflow: 'auto'}}>
                                {
                                    data.edit?
                                        <Input
                                            placeholder='Название'
                                            error={!element.name.length}
                                            variant='standard'
                                            className={classes.input}
                                            value={element.name}
                                            onChange={(event) => {
                                                list[idx].unsaved = true
                                                unsaved.current[list[idx]._id] = true
                                                list[idx].name = event.target.value
                                                setList([...list])
                                            }}
                                        />
                                        :
                                        element.name
                                }
                            </div>
                            <div className={classes.tableCell} style={{width: data.edit?'calc((100% - 40px) / 2)':'calc(100% / 2)', maxHeight: 100, overflow: 'auto'}}>
                                {
                                    element.store.name
                                }
                            </div>
                        </div>
                    )}
                </div>
            </Card>
            <div className='count'>
                {`Всего: ${count}`}
            </div>
        </App>
    )
})

Warehouses.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
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
            list: cloneObject(await getWarehouses({
                skip: 0,
                ...store.getState().app.filter.store?{store: store.getState().app.filter.store}:{}
            },  ctx.req?await getClientGqlSsr(ctx.req):undefined)),
            count: await getWarehousesCount({
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

export default connect(mapStateToProps, mapDispatchToProps)(Warehouses);