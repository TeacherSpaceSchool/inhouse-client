import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import {getMoneyArticles, getMoneyArticlesCount, addMoneyArticle, setMoneyArticle, deleteMoneyArticle, getUnloadMoneyArticles, uploadMoneyArticle} from '../src/gql/moneyArticle'
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
import Card from '@mui/material/Card';
import UnloadUpload from '../components/app/UnloadUpload';
const uploadText = 'Формат xlsx:\n_id или текущее название статьи (если требуется обновить);\nназвание.'

const MoneyArticle = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    const { search } = props.app;
    const unsaved = useRef({});
    const initialRender = useRef(true);
    let [newElement, setNewElement] = useState({
        name: ''
    });
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const getList = async ()=>{
        setList(cloneObject(await getMoneyArticles({search, skip: 0})));
        setCount(await getMoneyArticlesCount({search}));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
    }
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
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = cloneObject(await getMoneyArticles({skip: list.length, search}))
            if(addedList&&addedList.length>0)
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
        <App unsaved={unsaved} checkPagination={checkPagination} searchShow={true} pageName='Статьи' menuItems={menuItems} anchorElQuick={anchorElQuick} setAnchorElQuick={setAnchorElQuick}>
            <Head>
                <title>Статьи</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content='Статьи' />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/moneyarticles`} />
                <link rel='canonical' href={`${urlMain}/moneyarticles`}/>
            </Head>
            <div className={classes.tableHead}>
                {data.edit?<div style={{width: 40, padding: 0}}/>:null}
                <div className={classes.tableCell} style={{width: data.edit?'calc(100% - 40px)':'100%', justifyContent: 'center'}}>
                    Название
                </div>
            </div>
            <Card className={classes.page}>
                <div className={classes.table}>
                    {
                        data.add?
                            <div className={classes.tableRow}>
                                <div className={classes.tableCell} style={{width: 40, padding: 0}}>
                                <IconButton onClick={(event)=>{
                                        setMenuItems(
                                            <MenuItem onClick={()=>{
                                                if(newElement.name.length) {
                                                    setMiniDialog('Вы уверены?', <Confirmation action={async ()=>{
                                                        let res = await addMoneyArticle(newElement)
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
                                <div className={classes.tableCell} style={{width: data.edit?'calc(100% - 40px)':'100%'}}>
                                <Input
                                        placeholder='Название'
                                        error={!newElement.name.length&&newElement.unsaved}
                                        variant='standard'
                                        className={classes.input}
                                        value={newElement.name}
                                        onChange={(event) => {
                                            if(!['Зарплата', 'Не указано'].includes(event.target.value)) {
                                                newElement.unsaved = true
                                                unsaved.current['new'] = true
                                                newElement.name = event.target.value
                                                setNewElement({...newElement})
                                            }
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
                                        {
                                            !['Зарплата', 'Не указано'].includes(element.name)?
                                                <IconButton onClick={(event)=>{
                                                    setMenuItems(
                                                        [
                                                            <MenuItem sx={{marginBottom: '5px'}} key='MenuItem1' onClick={async()=>{
                                                                if(element.name.length) {
                                                                    setMiniDialog('Вы уверены?', <Confirmation action={async () => {
                                                                        let res = await setMoneyArticle(element)
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
                                                                        let res = await deleteMoneyArticle(element._id)
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
                                                :
                                                null
                                        }
                                    </div>
                                    :
                                    null
                            }
                            <div className={classes.tableCell} style={{width: data.edit?'calc(100% - 40px)':'100%', maxHeight: 100, overflow: 'auto'}}>
                                {
                                    data.edit?
                                        <Input
                                            placeholder='Название'
                                            error={!element.name.length}
                                            variant='standard'
                                            className={classes.input}
                                            value={element.name}
                                            onChange={(event) => {
                                                if(!['Зарплата', 'Не указано'].includes(element.name)&&!['Зарплата', 'Не указано'].includes(event.target.value)) {
                                                    list[idx].unsaved = true
                                                    unsaved.current[list[idx]._id] = true
                                                    list[idx].name = event.target.value
                                                    setList([...list])
                                                }
                                            }}
                                        />
                                        :
                                        element.name
                                }
                            </div>
                        </div>
                    )}
                </div>
            </Card>
            <div className='count'>
                {`Всего: ${count}`}
            </div>
            {
                data.add||data.edit?
                    <UnloadUpload upload={uploadMoneyArticle} uploadText={uploadText} unload={()=>getUnloadMoneyArticles({search})}/>
                    :
                    null
            }
        </App>
    )
})

MoneyArticle.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
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
    return {
        data: {
            edit: store.getState().user.profile.edit&&['admin', 'кассир'].includes(store.getState().user.profile.role),
            add: store.getState().user.profile.add&&['admin', 'кассир'].includes(store.getState().user.profile.role),
            deleted: store.getState().user.profile.deleted&&['admin', 'кассир'].includes(store.getState().user.profile.role),
            list: cloneObject(await getMoneyArticles({skip: 0},  ctx.req?await getClientGqlSsr(ctx.req):undefined)),
            count: await getMoneyArticlesCount({}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
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

export default connect(mapStateToProps, mapDispatchToProps)(MoneyArticle);