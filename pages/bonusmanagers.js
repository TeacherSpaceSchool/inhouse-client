import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import {getBonusManagers, getBonusManagersCount, setBonusManager, addBonusManager, getManagerForBonusManagers} from '../src/gql/bonusManager'
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
import HistoryIcon from '@mui/icons-material/History';
import AutocomplectOnline from '../components/app/AutocomplectOnline'
import { inputFloat, checkFloat } from '../src/lib'
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

const BonusManagers = React.memo((props) => {
    const {classes} = pageListStyle();
    //props
    const { data } = props;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    const { search, isMobileApp } = props.app;
    //настройка
    const unsaved = useRef({});
    const initialRender = useRef(true);
    let [newElement, setNewElement] = useState({
        bonus: []
    });
    //получение данных
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const getList = async ()=>{
        setList(cloneObject(await getBonusManagers({search, skip: 0})));
        setCount(await getBonusManagersCount({search}));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
    }
    //поиск/фильтр
    let searchTimeOut = useRef(null);
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
            let addedList = cloneObject(await getBonusManagers({skip: list.length, search}))
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
        <App unsaved={unsaved} checkPagination={checkPagination} searchShow={true} pageName='Ставки' menuItems={menuItems} anchorElQuick={anchorElQuick} setAnchorElQuick={setAnchorElQuick}>
            <Head>
                <title>Ставки</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content='Ставки' />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/bonusmanagers`} />
                <link rel='canonical' href={`${urlMain}/bonusmanagers`}/>
            </Head>
            <Card className={classes.page} style={isMobileApp?{width: 'fit-content'}:{}}>
                <div className={classes.table}>
                    <div className={classes.tableHead} style={isMobileApp?{width: 'fit-content'}:{}}>
                        {data.edit?<div style={{width: 40, padding: 0}}/>:null}
                        <div className={classes.tableCell} style={{...isMobileApp?{minWidth: 200}:{}, width: data.edit?'calc((100% - 40px) / 2)':'calc(100% / 2)', justifyContent: data.edit?'center':'start'}}>
                            Менеджер
                        </div>
                        <div className={classes.tableCell} style={{...isMobileApp?{minWidth: 200}:{}, width: data.edit?'calc((100% - 40px) / 2)':'calc(100% / 2)', justifyContent: data.edit?'center':'start'}}>
                            Ставка(Скидка/Бонус)
                        </div>
                    </div>
                    {
                        data.add?
                            <div className={classes.tableRow} style={isMobileApp?{width: 'fit-content'}:{}}>
                                <div className={classes.tableCell} style={{width: 40, padding: 0}}>
                                    <IconButton onClick={(event)=>{
                                        setMenuItems(
                                            <MenuItem onClick={()=>{
                                                if(newElement.manager&&newElement.bonus.length) {
                                                    setMiniDialog('Вы уверены?', <Confirmation action={async ()=>{
                                                        for(let i = 0; i <newElement.bonus.length; i++)
                                                            newElement.bonus[i] = [checkFloat(newElement.bonus[i][0]), checkFloat(newElement.bonus[i][1])]
                                                        let res = await addBonusManager({manager: newElement.manager._id, bonus: newElement.bonus})
                                                        if(res&&res._id!=='ERROR') {
                                                            showSnackBar('Успешно', 'success')
                                                            setList([res, ...list])
                                                            setNewElement({
                                                                bonus: []
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
                                <div className={classes.tableCell} style={{...isMobileApp?{minWidth: 200}:{}, width: 'calc((100% - 40px) / 2)'}}>
                                    <AutocomplectOnline
                                        element={newElement.manager}
                                        error={!newElement.manager&&newElement.unsaved}
                                        setElement={(manager)=>{
                                            newElement.unsaved = true
                                            unsaved.current['new'] = true
                                            newElement.manager = manager
                                            setNewElement({...newElement})
                                        }}
                                        getElements={async (search)=>{
                                            return await getManagerForBonusManagers({search})
                                        }}
                                        placeholder={'Менеджер'}
                                        minLength={0}
                                    />
                                </div>
                                <div className={classes.tableCell} style={{flexDirection: 'column', ...isMobileApp?{minWidth: 200}:{}, width: 'calc((100% - 40px) / 2)'}}>
                                    {newElement.bonus.map((element1, idx1)=>
                                        <div className={classes.rowCenter} key={`newElement${idx1}`}>
                                            <Input
                                                placeholder='Скидка'
                                                error={!element1[0]&&newElement.unsaved}
                                                variant='standard'
                                                className={classes.inputHalf}
                                                value={element1[0]}
                                                onChange={(event) => {
                                                    newElement.unsaved = true
                                                    unsaved.current['new'] = true
                                                    newElement.bonus[idx1][0] = inputFloat(event.target.value)
                                                    setNewElement({...newElement})
                                                }}
                                            />
                                            <Input
                                                placeholder='Бонус'
                                                error={!element1[1]&&newElement.unsaved}
                                                variant='standard'
                                                className={classes.inputHalf}
                                                value={element1[1]}
                                                onChange={(event) => {
                                                    newElement.unsaved = true
                                                    unsaved.current['new'] = true
                                                    newElement.bonus[idx1][1] = inputFloat(event.target.value)
                                                    setNewElement({...newElement})
                                                }}
                                            />
                                            <IconButton onClick={()=>{
                                                newElement.unsaved = true
                                                unsaved.current['new'] = true
                                                newElement.bonus.splice(idx1, 1)
                                                setNewElement({...newElement})
                                            }}>
                                                <CloseIcon style={{color: 'red'}}/>
                                            </IconButton>
                                        </div>
                                    )}
                                    <center style={{width: '100%'}}>
                                        <Button onClick={async()=>{
                                            newElement.unsaved = true
                                            unsaved.current['new'] = true
                                            newElement.bonus = [['', ''], ...newElement.bonus]
                                            setNewElement({...newElement})
                                        }} size='small'>
                                            Добавить ставку
                                        </Button>
                                    </center>
                                </div>
                            </div>
                            :
                            null
                    }
                    {list.map((element, idx) =>
                        <div className={classes.tableRow} style={isMobileApp?{width: 'fit-content'}:{}}>
                            {
                                data.edit?
                                    <div className={classes.tableCell} style={{width: 40, padding: 0}}>
                                        <IconButton onClick={(event)=>{
                                            setMenuItems(
                                                [
                                                    <MenuItem sx={{marginBottom: '5px'}} key='MenuItem1' onClick={async()=>{
                                                        if(element.bonus.length) {
                                                            setMiniDialog('Вы уверены?', <Confirmation action={async () => {
                                                                for(let i = 0; i <element.bonus.length; i++)
                                                                    element.bonus[i] = [checkFloat(element.bonus[i][0]), checkFloat(element.bonus[i][1])]
                                                                let res = await setBonusManager({bonus: element.bonus, _id: element._id})
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
                            <div className={classes.tableCell} style={{...isMobileApp?{minWidth: 200}:{}, width: data.edit?'calc((100% - 40px) / 2)':'calc(100% / 2)'}}>
                                {element.manager.name}
                            </div>
                            <div className={classes.tableCell} style={{flexDirection: 'column', ...isMobileApp?{minWidth: 200}:{}, width: data.edit?'calc((100% - 40px) / 2)':'calc(100% / 2)'}}>
                                {element.bonus.map((element1, idx1)=>
                                    <div className={classes.rowCenter} key={`newElement${idx1}`}>
                                        <Input
                                            placeholder='Скидка'
                                            error={!element1[0]&&element.unsaved}
                                            variant='standard'
                                            className={classes.inputHalf}
                                            value={element1[0]}
                                            inputProps={{
                                                'aria-placeholder': 'description',
                                                readOnly: !data.edit,
                                            }}
                                            onChange={(event) => {
                                                unsaved.current[list[idx]._id] = true
                                                list[idx].unsaved = true
                                                list[idx].bonus[idx1][0] = inputFloat(event.target.value)
                                                setList([...list])
                                            }}
                                        />
                                        <Input
                                            placeholder='Бонус'
                                            error={!element1[1]&&element.unsaved}
                                            variant='standard'
                                            className={classes.inputHalf}
                                            value={element1[1]}
                                            onChange={(event) => {
                                                list[idx].unsaved = true
                                                unsaved.current[list[idx]._id] = true
                                                list[idx].bonus[idx1][1] = inputFloat(event.target.value)
                                                setList([...list])
                                            }}
                                            inputProps={{
                                                'aria-placeholder': 'description',
                                                readOnly: !data.edit,
                                            }}
                                        />
                                        {
                                            data.edit?
                                                <IconButton onClick={()=>{
                                                    list[idx].unsaved = true
                                                    unsaved.current[list[idx]._id] = true
                                                    list[idx].bonus.splice(idx1, 1)
                                                    setList([...list])
                                                }}>
                                                    <CloseIcon style={{color: 'red'}}/>
                                                </IconButton>
                                                :
                                                null
                                        }
                                    </div>
                                )}
                                {
                                    data.edit?
                                        <center style={{width: '100%'}}>
                                            <Button onClick={async()=>{
                                                list[idx].unsaved = true
                                                unsaved.current[list[idx]._id] = true
                                                list[idx].bonus = [['', ''], ...list[idx].bonus]
                                                setList([...list])
                                            }} size='small'>
                                                Добавить ставку
                                            </Button>
                                        </center>
                                        :
                                        null
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

BonusManagers.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
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
            list: cloneObject(await getBonusManagers({skip: 0},  ctx.req?await getClientGqlSsr(ctx.req):undefined)),
            count: await getBonusManagersCount({}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
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

export default connect(mapStateToProps, mapDispatchToProps)(BonusManagers);