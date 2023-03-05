import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import {getBonusManagers, getBonusManagersCount, setBonusManager, addBonusManager, getStoreForBonusManagers, deleteBonusManager, getUnloadBonusManagers} from '../src/gql/bonusManager'
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
import Delete from '@mui/icons-material/Delete';
import UnloadUpload from '../components/app/UnloadUpload';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const BonusManagers = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    const { isMobileApp, filter } = props.app;
    const unsaved = useRef({});
    const initialRender = useRef(true);
    let [newElement, setNewElement] = useState({
        sale: [],
        saleInstallment: [],
        order: [],
        orderInstallment: [],
        promotion: [],
        store: filter.store
    });
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const getList = async ()=>{
        setList(cloneObject(await getBonusManagers({...filter.store?{store: filter.store._id}:{}, skip: 0})));
        setCount(await getBonusManagersCount({...filter.store?{store: filter.store._id}:{}}));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
    }
    useEffect(()=>{
        (async()=>{
            if(initialRender.current)
                initialRender.current = false;
            else {
                if(filter.store&&(!newElement.store||filter.store._id!==newElement.store._id)) {
                    newElement.store = filter.store
                    setNewElement({...newElement})
                }
                await getList()
            }
        })()
    },[filter])
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = await getBonusManagers({...filter.store?{store: filter.store._id}:{}, skip: list.length})
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
        <App unsaved={unsaved} filterShow={{store: true}} checkPagination={checkPagination} pageName='Бонус менеджера' menuItems={menuItems} anchorElQuick={anchorElQuick} setAnchorElQuick={setAnchorElQuick}>
            <Head>
                <title>Бонус менеджера</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content='Бонус менеджера' />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/bonusmanagers`} />
                <link rel='canonical' href={`${urlMain}/bonusmanagers`}/>
            </Head>
            <div className={classes.tableHead} style={isMobileApp?{width: 'fit-content'}:{}}>
                {data.edit?<div style={{width: 40, padding: 0}}/>:null}
                <div className={classes.tableCell} style={{width: 150, justifyContent: data.edit?'center':'start'}}>
                    Магазин
                </div>
                <div className={classes.tableCell} style={{
                    ...isMobileApp?{minWidth: 250}:{},
                    width: data.edit?'calc(100% - 190px)':'calc(100% - 150px)',
                    justifyContent: data.edit?'center':'start'
                }}>
                    Ставка(Скидка%/Бонус%)
                </div>
            </div>
            <Card className={classes.page} style={isMobileApp?{width: 'fit-content'}:{}}>
                <div className={classes.table}>
                    {
                        data.add?
                            <div className={classes.tableRow}>
                                <div className={classes.tableCell} style={{width: 40, padding: 0}}>
                                    <IconButton onClick={(event)=>{
                                        setMenuItems(
                                            <MenuItem onClick={()=>{
                                                let checkBonus = true
                                                for(let i = 0; i <newElement.sale.length; i++)
                                                    if(!newElement.sale[i][0]||!newElement.sale[i][1]) {
                                                        checkBonus = false
                                                        break
                                                    }
                                                if(checkBonus) {
                                                    for (let i = 0; i < newElement.saleInstallment.length; i++)
                                                        if (!newElement.saleInstallment[i][0] || !newElement.saleInstallment[i][1]) {
                                                            checkBonus = false
                                                            break
                                                        }
                                                }
                                                if(checkBonus) {
                                                    for (let i = 0; i < newElement.order.length; i++)
                                                        if (!newElement.order[i][0] || !newElement.order[i][1]) {
                                                            checkBonus = false
                                                            break
                                                        }
                                                }
                                                if(checkBonus) {
                                                    for (let i = 0; i < newElement.orderInstallment.length; i++)
                                                        if (!newElement.orderInstallment[i][0] || !newElement.orderInstallment[i][1]) {
                                                            checkBonus = false
                                                            break
                                                        }
                                                }
                                                if(checkBonus) {
                                                    for (let i = 0; i < newElement.promotion.length; i++)
                                                        if (!newElement.promotion[i][0] || !newElement.promotion[i][1]) {
                                                            checkBonus = false
                                                            break
                                                        }
                                                }
                                                if(checkBonus&&newElement.store) {
                                                    setMiniDialog('Вы уверены?', <Confirmation action={async ()=>{
                                                        for(let i = 0; i <newElement.sale.length; i++)
                                                            newElement.sale[i] = [checkFloat(newElement.sale[i][0]), checkFloat(newElement.sale[i][1])]
                                                        for(let i = 0; i <newElement.saleInstallment.length; i++)
                                                            newElement.saleInstallment[i] = [checkFloat(newElement.saleInstallment[i][0]), checkFloat(newElement.saleInstallment[i][1])]
                                                        for(let i = 0; i <newElement.order.length; i++)
                                                            newElement.order[i] = [checkFloat(newElement.order[i][0]), checkFloat(newElement.order[i][1])]
                                                        for(let i = 0; i <newElement.orderInstallment.length; i++)
                                                            newElement.orderInstallment[i] = [checkFloat(newElement.orderInstallment[i][0]), checkFloat(newElement.orderInstallment[i][1])]
                                                        for(let i = 0; i <newElement.promotion.length; i++)
                                                            newElement.promotion[i] = [checkFloat(newElement.promotion[i][0]), checkFloat(newElement.promotion[i][1])]
                                                        let res = await addBonusManager({
                                                            store: newElement.store._id,
                                                            sale: newElement.sale,
                                                            saleInstallment: newElement.saleInstallment,
                                                            order: newElement.order,
                                                            orderInstallment: newElement.orderInstallment,
                                                            promotion: newElement.promotion
                                                        })
                                                        if(res&&res._id!=='ERROR') {
                                                            showSnackBar('Успешно', 'success')
                                                            setList([res, ...list])
                                                            setNewElement({
                                                                sale: [],
                                                                saleInstallment: [],
                                                                order: [],
                                                                orderInstallment: [],
                                                                promotion: []
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
                                <div className={classes.tableCell} style={{width: 150}}>
                                    {
                                        !filter.store?
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
                                                    return await getStoreForBonusManagers({search})
                                                }}
                                                placeholder={'Магазин'}
                                                minLength={0}
                                            />
                                            :
                                            newElement.store?
                                                newElement.store.name
                                                :
                                                null
                                    }
                                </div>
                                <div className={classes.tableCell} style={{
                                    ...isMobileApp?{minWidth: 250}:{},
                                    width: data.edit?'calc(100% - 190px)':'calc(100% - 150px)',
                                    justifyContent: data.edit?'center':'start',
                                    flexDirection: 'column'
                                }}>
                                    <Accordion style={{width: '100%'}}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls='sale-newelement-content'
                                            id='sale-newelement-header'
                                        >
                                            <Typography style={{color: newElement.sale.length?'black':'red'}}>Продажа {newElement.sale.length}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {newElement.sale.map((element1, idx1)=>
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
                                                            newElement.sale[idx1][0] = inputFloat(event.target.value)
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
                                                            newElement.sale[idx1][1] = inputFloat(event.target.value)
                                                            setNewElement({...newElement})
                                                        }}
                                                    />
                                                    <IconButton onClick={()=>{
                                                        newElement.unsaved = true
                                                        unsaved.current['new'] = true
                                                        newElement.sale.splice(idx1, 1)
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
                                                    newElement.sale = [...newElement.sale, ['', '']]
                                                    setNewElement({...newElement})
                                                }} size='small'>
                                                    Добавить ставку
                                                </Button>
                                            </center>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion style={{width: '100%'}}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls='saleInstallment-newelement-content'
                                            id='saleInstallment-newelement-header'
                                        >
                                            <Typography style={{color: newElement.saleInstallment.length?'black':'red'}}>Рассрочка {newElement.saleInstallment.length}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {newElement.saleInstallment.map((element1, idx1)=>
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
                                                            newElement.saleInstallment[idx1][0] = inputFloat(event.target.value)
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
                                                            newElement.saleInstallment[idx1][1] = inputFloat(event.target.value)
                                                            setNewElement({...newElement})
                                                        }}
                                                    />
                                                    <IconButton onClick={()=>{
                                                        newElement.unsaved = true
                                                        unsaved.current['new'] = true
                                                        newElement.saleInstallment.splice(idx1, 1)
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
                                                    newElement.saleInstallment = [...newElement.saleInstallment, ['', '']]
                                                    setNewElement({...newElement})
                                                }} size='small'>
                                                    Добавить ставку
                                                </Button>
                                            </center>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion style={{width: '100%'}}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls='order-newelement-content'
                                            id='order-newelement-header'
                                        >
                                            <Typography style={{color: newElement.order.length?'black':'red'}}>На заказ {newElement.order.length}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {newElement.order.map((element1, idx1)=>
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
                                                            newElement.order[idx1][0] = inputFloat(event.target.value)
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
                                                            newElement.order[idx1][1] = inputFloat(event.target.value)
                                                            setNewElement({...newElement})
                                                        }}
                                                    />
                                                    <IconButton onClick={()=>{
                                                        newElement.unsaved = true
                                                        unsaved.current['new'] = true
                                                        newElement.order.splice(idx1, 1)
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
                                                    newElement.order = [...newElement.order, ['', '']]
                                                    setNewElement({...newElement})
                                                }} size='small'>
                                                    Добавить ставку
                                                </Button>
                                            </center>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion style={{width: '100%'}}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls='orderInstallment-newelement-content'
                                            id='orderInstallment-newelement-header'
                                        >
                                            <Typography style={{color: newElement.orderInstallment.length?'black':'red'}}>На заказ рассрочка {newElement.orderInstallment.length}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {newElement.orderInstallment.map((element1, idx1)=>
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
                                                            newElement.orderInstallment[idx1][0] = inputFloat(event.target.value)
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
                                                            newElement.orderInstallment[idx1][1] = inputFloat(event.target.value)
                                                            setNewElement({...newElement})
                                                        }}
                                                    />
                                                    <IconButton onClick={()=>{
                                                        newElement.unsaved = true
                                                        unsaved.current['new'] = true
                                                        newElement.orderInstallment.splice(idx1, 1)
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
                                                    newElement.orderInstallment = [...newElement.orderInstallment, ['', '']]
                                                    setNewElement({...newElement})
                                                }} size='small'>
                                                    Добавить ставку
                                                </Button>
                                            </center>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion style={{width: '100%'}}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls='promotion-newelement-content'
                                            id='promotion-newelement-header'
                                        >
                                            <Typography style={{color: newElement.promotion.length?'black':'red'}}>Акция {newElement.promotion.length}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {newElement.promotion.map((element1, idx1)=>
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
                                                            newElement.promotion[idx1][0] = inputFloat(event.target.value)
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
                                                            newElement.promotion[idx1][1] = inputFloat(event.target.value)
                                                            setNewElement({...newElement})
                                                        }}
                                                    />
                                                    <IconButton onClick={()=>{
                                                        newElement.unsaved = true
                                                        unsaved.current['new'] = true
                                                        newElement.promotion.splice(idx1, 1)
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
                                                    newElement.promotion = [...newElement.promotion, ['', '']]
                                                    setNewElement({...newElement})
                                                }} size='small'>
                                                    Добавить ставку
                                                </Button>
                                            </center>
                                        </AccordionDetails>
                                    </Accordion>
                                </div>
                            </div>
                            :
                            null
                    }
                    {list&&list.map((element, idx) =>
                        <div className={classes.tableRow}>
                            {
                                data.edit?
                                    <div className={classes.tableCell} style={{width: 40, padding: 0}}>
                                        <IconButton onClick={(event)=>{
                                            setMenuItems(
                                                [
                                                    <MenuItem sx={{marginBottom: '5px'}} key='MenuItem1' onClick={async()=>{
                                                        let checkBonus = true
                                                        for(let i = 0; i <element.sale.length; i++)
                                                            if(!element.sale[i][0]||!element.sale[i][1]) {
                                                                checkBonus = false
                                                                break
                                                            }
                                                        if(checkBonus) {
                                                            for (let i = 0; i < element.saleInstallment.length; i++)
                                                                if (!element.saleInstallment[i][0] || !element.saleInstallment[i][1]) {
                                                                    checkBonus = false
                                                                    break
                                                                }
                                                        }
                                                        if(checkBonus) {
                                                            for (let i = 0; i < element.order.length; i++)
                                                                if (!element.order[i][0] || !element.order[i][1]) {
                                                                    checkBonus = false
                                                                    break
                                                                }
                                                        }
                                                        if(checkBonus) {
                                                            for (let i = 0; i < element.orderInstallment.length; i++)
                                                                if (!element.orderInstallment[i][0] || !element.orderInstallment[i][1]) {
                                                                    checkBonus = false
                                                                    break
                                                                }
                                                        }
                                                        if(checkBonus) {
                                                            for (let i = 0; i < element.promotion.length; i++)
                                                                if (!element.promotion[i][0] || !element.promotion[i][1]) {
                                                                    checkBonus = false
                                                                    break
                                                                }
                                                        }
                                                        if(checkBonus) {
                                                            setMiniDialog('Вы уверены?', <Confirmation action={async () => {
                                                                for(let i = 0; i <element.sale.length; i++)
                                                                    element.sale[i] = [checkFloat(element.sale[i][0]), checkFloat(element.sale[i][1])]
                                                                for(let i = 0; i <element.saleInstallment.length; i++)
                                                                    element.saleInstallment[i] = [checkFloat(element.saleInstallment[i][0]), checkFloat(element.saleInstallment[i][1])]
                                                                for(let i = 0; i <element.order.length; i++)
                                                                    element.order[i] = [checkFloat(element.order[i][0]), checkFloat(element.order[i][1])]
                                                                for(let i = 0; i <element.orderInstallment.length; i++)
                                                                    element.orderInstallment[i] = [checkFloat(element.orderInstallment[i][0]), checkFloat(element.orderInstallment[i][1])]
                                                                for(let i = 0; i <element.promotion.length; i++)
                                                                    element.promotion[i] = [checkFloat(element.promotion[i][0]), checkFloat(element.promotion[i][1])]
                                                                let res = await setBonusManager({
                                                                    sale: element.sale,
                                                                    saleInstallment: element.saleInstallment,
                                                                    order: element.order,
                                                                    orderInstallment: element.orderInstallment,
                                                                    promotion: element.promotion,
                                                                    _id: element._id
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
                                                                let res = await deleteBonusManager(element._id)
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
                            <div className={classes.tableCell} style={{width: 150}}>
                                {element.store.name}
                            </div>
                            <div className={classes.tableCell} style={{
                                ...isMobileApp?{minWidth: 250}:{},
                                width: data.edit?'calc(100% - 190px)':'calc(100% - 150px)',
                                justifyContent: data.edit?'center':'start',
                                flexDirection: 'column'
                            }}>
                                <Accordion style={{width: '100%'}}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls='sale-element-content'
                                        id='sale-element-header'
                                    >
                                        <Typography style={{color: element.sale.length?'black':'red'}}>Продажа {element.sale.length}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {element.sale.map((element1, idx1)=>
                                            <div className={classes.rowCenter} key={`newElement${idx1}`}>
                                                <Input
                                                    placeholder='Скидка'
                                                    error={!element1[0]&&element.unsaved}
                                                    variant='standard'
                                                    className={classes.inputHalf}
                                                    value={element1[0]}
                                                    inputProps={{readOnly: !data.edit}}
                                                    onChange={(event) => {
                                                        list[idx].unsaved = true
                                                        unsaved.current[element._id] = true
                                                        list[idx].sale[idx1][0] = inputFloat(event.target.value)
                                                        setList([...list])
                                                    }}
                                                />
                                                <Input
                                                    placeholder='Бонус'
                                                    error={!element1[1]&&element.unsaved}
                                                    variant='standard'
                                                    className={classes.inputHalf}
                                                    value={element1[1]}
                                                    inputProps={{readOnly: !data.edit}}
                                                    onChange={(event) => {
                                                        list[idx].unsaved = true
                                                        unsaved.current[element._id] = true
                                                        list[idx].sale[idx1][1] = inputFloat(event.target.value)
                                                        setList([...list])
                                                    }}
                                                />
                                                <IconButton onClick={()=>{
                                                    list[idx].unsaved = true
                                                    unsaved.current[element._id] = true
                                                    list[idx].sale.splice(idx1, 1)
                                                    setList([...list])
                                                }}>
                                                    <CloseIcon style={{color: 'red'}}/>
                                                </IconButton>
                                            </div>
                                        )}
                                        {
                                            data.edit?
                                                <center style={{width: '100%'}}>
                                                    <Button onClick={async()=>{
                                                        list[idx].unsaved = true
                                                        unsaved.current[element._id] = true
                                                        list[idx].sale = [...list[idx].sale, ['', '']]
                                                        setList([...list])
                                                    }} size='small'>
                                                        Добавить ставку
                                                    </Button>
                                                </center>
                                                :
                                                null
                                        }
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion style={{width: '100%'}}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls='saleInstallment-element-content'
                                        id='saleInstallment-element-header'
                                    >
                                        <Typography style={{color: element.saleInstallment.length?'black':'red'}}>Рассрочка {element.saleInstallment.length}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {element.saleInstallment.map((element1, idx1)=>
                                            <div className={classes.rowCenter} key={`newElement${idx1}`}>
                                                <Input
                                                    placeholder='Скидка'
                                                    error={!element1[0]&&element.unsaved}
                                                    variant='standard'
                                                    className={classes.inputHalf}
                                                    value={element1[0]}
                                                    inputProps={{readOnly: !data.edit}}
                                                    onChange={(event) => {
                                                        list[idx].unsaved = true
                                                        unsaved.current[element._id] = true
                                                        list[idx].saleInstallment[idx1][0] = inputFloat(event.target.value)
                                                        setList([...list])
                                                    }}
                                                />
                                                <Input
                                                    placeholder='Бонус'
                                                    error={!element1[1]&&element.unsaved}
                                                    variant='standard'
                                                    className={classes.inputHalf}
                                                    value={element1[1]}
                                                    inputProps={{readOnly: !data.edit}}
                                                    onChange={(event) => {
                                                        list[idx].unsaved = true
                                                        unsaved.current[element._id] = true
                                                        list[idx].saleInstallment[idx1][1] = inputFloat(event.target.value)
                                                        setList([...list])
                                                    }}
                                                />
                                                <IconButton onClick={()=>{
                                                    list[idx].unsaved = true
                                                    unsaved.current[element._id] = true
                                                    list[idx].saleInstallment.splice(idx1, 1)
                                                    setList([...list])
                                                }}>
                                                    <CloseIcon style={{color: 'red'}}/>
                                                </IconButton>
                                            </div>
                                        )}
                                        {
                                            data.edit?
                                                <center style={{width: '100%'}}>
                                                    <Button onClick={async()=>{
                                                        list[idx].unsaved = true
                                                        unsaved.current[element._id] = true
                                                        list[idx].saleInstallment = [...list[idx].saleInstallment, ['', '']]
                                                        setList([...list])
                                                    }} size='small'>
                                                        Добавить ставку
                                                    </Button>
                                                </center>
                                                :
                                                null
                                        }
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion style={{width: '100%'}}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls='order-element-content'
                                        id='order-element-header'
                                    >
                                        <Typography style={{color: element.order.length?'black':'red'}}>На заказ {element.order.length}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {element.order.map((element1, idx1)=>
                                            <div className={classes.rowCenter} key={`newElement${idx1}`}>
                                                <Input
                                                    placeholder='Скидка'
                                                    error={!element1[0]&&element.unsaved}
                                                    variant='standard'
                                                    className={classes.inputHalf}
                                                    value={element1[0]}
                                                    inputProps={{readOnly: !data.edit}}
                                                    onChange={(event) => {
                                                        list[idx].unsaved = true
                                                        unsaved.current[element._id] = true
                                                        list[idx].order[idx1][0] = inputFloat(event.target.value)
                                                        setList([...list])
                                                    }}
                                                />
                                                <Input
                                                    placeholder='Бонус'
                                                    error={!element1[1]&&element.unsaved}
                                                    variant='standard'
                                                    className={classes.inputHalf}
                                                    value={element1[1]}
                                                    inputProps={{readOnly: !data.edit}}
                                                    onChange={(event) => {
                                                        list[idx].unsaved = true
                                                        unsaved.current[element._id] = true
                                                        list[idx].order[idx1][1] = inputFloat(event.target.value)
                                                        setList([...list])
                                                    }}
                                                />
                                                <IconButton onClick={()=>{
                                                    list[idx].unsaved = true
                                                    unsaved.current[element._id] = true
                                                    list[idx].order.splice(idx1, 1)
                                                    setList([...list])
                                                }}>
                                                    <CloseIcon style={{color: 'red'}}/>
                                                </IconButton>
                                            </div>
                                        )}
                                        {
                                            data.edit?
                                                <center style={{width: '100%'}}>
                                                    <Button onClick={async()=>{
                                                        list[idx].unsaved = true
                                                        unsaved.current[element._id] = true
                                                        list[idx].order = [...list[idx].order, ['', '']]
                                                        setList([...list])
                                                    }} size='small'>
                                                        Добавить ставку
                                                    </Button>
                                                </center>
                                                :
                                                null
                                        }
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion style={{width: '100%'}}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls='orderInstallment-element-content'
                                        id='orderInstallment-element-header'
                                    >
                                        <Typography style={{color: element.orderInstallment.length?'black':'red'}}>На заказ рассрочка {element.orderInstallment.length}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {element.orderInstallment.map((element1, idx1)=>
                                            <div className={classes.rowCenter} key={`newElement${idx1}`}>
                                                <Input
                                                    placeholder='Скидка'
                                                    error={!element1[0]&&element.unsaved}
                                                    variant='standard'
                                                    className={classes.inputHalf}
                                                    value={element1[0]}
                                                    inputProps={{readOnly: !data.edit}}
                                                    onChange={(event) => {
                                                        list[idx].unsaved = true
                                                        unsaved.current[element._id] = true
                                                        list[idx].orderInstallment[idx1][0] = inputFloat(event.target.value)
                                                        setList([...list])
                                                    }}
                                                />
                                                <Input
                                                    placeholder='Бонус'
                                                    error={!element1[1]&&element.unsaved}
                                                    variant='standard'
                                                    className={classes.inputHalf}
                                                    value={element1[1]}
                                                    inputProps={{readOnly: !data.edit}}
                                                    onChange={(event) => {
                                                        list[idx].unsaved = true
                                                        unsaved.current[element._id] = true
                                                        list[idx].orderInstallment[idx1][1] = inputFloat(event.target.value)
                                                        setList([...list])
                                                    }}
                                                />
                                                <IconButton onClick={()=>{
                                                    list[idx].unsaved = true
                                                    unsaved.current[element._id] = true
                                                    list[idx].orderInstallment.splice(idx1, 1)
                                                    setList([...list])
                                                }}>
                                                    <CloseIcon style={{color: 'red'}}/>
                                                </IconButton>
                                            </div>
                                        )}
                                        {
                                            data.edit?
                                                <center style={{width: '100%'}}>
                                                    <Button onClick={async()=>{
                                                        list[idx].unsaved = true
                                                        unsaved.current[element._id] = true
                                                        list[idx].orderInstallment = [...list[idx].orderInstallment, ['', '']]
                                                        setList([...list])
                                                    }} size='small'>
                                                        Добавить ставку
                                                    </Button>
                                                </center>
                                                :
                                                null
                                        }
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion style={{width: '100%'}}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls='promotion-element-content'
                                        id='promotion-element-header'
                                    >
                                        <Typography style={{color: element.promotion.length?'black':'red'}}>Акция {element.promotion.length}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {element.promotion.map((element1, idx1)=>
                                            <div className={classes.rowCenter} key={`newElement${idx1}`}>
                                                <Input
                                                    placeholder='Скидка'
                                                    error={!element1[0]&&element.unsaved}
                                                    variant='standard'
                                                    className={classes.inputHalf}
                                                    value={element1[0]}
                                                    inputProps={{readOnly: !data.edit}}
                                                    onChange={(event) => {
                                                        list[idx].unsaved = true
                                                        unsaved.current[element._id] = true
                                                        list[idx].promotion[idx1][0] = inputFloat(event.target.value)
                                                        setList([...list])
                                                    }}
                                                />
                                                <Input
                                                    placeholder='Бонус'
                                                    error={!element1[1]&&element.unsaved}
                                                    variant='standard'
                                                    className={classes.inputHalf}
                                                    value={element1[1]}
                                                    inputProps={{readOnly: !data.edit}}
                                                    onChange={(event) => {
                                                        list[idx].unsaved = true
                                                        unsaved.current[element._id] = true
                                                        list[idx].promotion[idx1][1] = inputFloat(event.target.value)
                                                        setList([...list])
                                                    }}
                                                />
                                                <IconButton onClick={()=>{
                                                    list[idx].unsaved = true
                                                    unsaved.current[element._id] = true
                                                    list[idx].promotion.splice(idx1, 1)
                                                    setList([...list])
                                                }}>
                                                    <CloseIcon style={{color: 'red'}}/>
                                                </IconButton>
                                            </div>
                                        )}
                                        {
                                            data.edit?
                                                <center style={{width: '100%'}}>
                                                    <Button onClick={async()=>{
                                                        list[idx].unsaved = true
                                                        unsaved.current[element._id] = true
                                                        list[idx].promotion = [...list[idx].promotion, ['', '']]
                                                        setList([...list])
                                                    }} size='small'>
                                                        Добавить ставку
                                                    </Button>
                                                </center>
                                                :
                                                null
                                        }
                                    </AccordionDetails>
                                </Accordion>
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
                    <UnloadUpload unload={()=>getUnloadBonusManagers({...filter.store?{store: filter.store._id}:{}})}/>
                    :
                    null
            }
        </App>
    )
})

BonusManagers.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin',  'управляющий'].includes(store.getState().user.profile.role))
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
            list: cloneObject(await getBonusManagers({
                ...store.getState().app.filter.store?{store: store.getState().app.filter.store._id}:{},
                skip: 0
            },  ctx.req?await getClientGqlSsr(ctx.req):undefined)),
            count: await getBonusManagersCount({
                ...store.getState().app.filter.store?{store: store.getState().app.filter.store._id}:{}
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

export default connect(mapStateToProps, mapDispatchToProps)(BonusManagers);