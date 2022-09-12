import React, {useState} from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import drawerStyle from '../../src/styleMUI/drawer'
import * as appActions from '../../src/redux/actions/app'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import Drawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useRouter } from 'next/router';
import Collapse from '@mui/material/Collapse';
//import Badge from '@mui/material/Badge';
import ListItemIcon from '@mui/material/ListItemIcon';
import HomeIcon from '@mui/icons-material/Home';
import Router from 'next/router'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import HelpIcon from '@mui/icons-material/Help';
import ArticleIcon from '@mui/icons-material/Article';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import TimelineIcon from '@mui/icons-material/Timeline';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TableViewIcon from '@mui/icons-material/TableView';
import SettingsIcon from '@mui/icons-material/Settings';
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import ClearDB from '../../components/dialog/ClearDB'

const MyDrawer = React.memo((props) => {
    const { unsaved, full } = props
    const {classes} = drawerStyle()
    const { drawer, isMobileApp } = props.app;
    const { profile } = props.user;
    const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
    const { showDrawer } = props.appActions;
    const { showSnackBar } = props.snackbarActions;
    const open = isMobileApp||full?drawer:true;
    const router = useRouter();
    const variant = isMobileApp||full?'temporary' : 'permanent';
    let [uncover, setUncover] = useState(
        ['/categories', '/typecharacteristics', '/characteristics', '/promotions', '/factorys'].includes(router.pathname)||
        router.pathname.includes('store')&&!router.pathname.includes('storebalanceitems')||
        router.pathname.includes('client')&&!router.pathname.includes('balanceclients')||
        router.pathname.includes('cpa')&&'/bonuscpas'!==router.pathname&&'/statisticcpa'!==router.pathname||
        router.pathname.includes('item')&&!router.pathname.includes('balanceitems')&&!router.pathname.includes('balanceitemdays')&&!router.pathname.includes('wayitems')||
        router.pathname.includes('user')?
            'Данные'
            :
            ['/wayitems'].includes(router.pathname)||
            router.pathname.includes('refund')||
            router.pathname.includes('order')||
            router.pathname.includes('reservation')||
            router.pathname.includes('sale')?
                'Операции'
                :
                ['/bonusmanagers', '/bonuscpas', '/balanceclients', '/salarys', '/moneyflows', '/installments', '/moneyrecipients', '/moneyarticles', '/cashboxes', '/doc'].includes(router.pathname)?
                    'Бухгалтерия'
                    :
                    ['/consultations', '/statisticcpa'].includes(router.pathname)?
                        'Статистика'
                        :
                        ['/balanceitems', '/balanceitemdays', '/storebalanceitems', '/warehouses'].includes(router.pathname)?
                            'Склад'
                            :
                            ['/errors'].includes(router.pathname)?
                                'Инструменты'
                                :
                                ''
    );
    const handleUncover = (item)=>{
        if(uncover===item) item = ''
        setUncover(item)
    }
    return (
        <Drawer
            disableSwipeToOpen = {true}
            disableBackdropTransition = {true}
            onOpen={()=>showDrawer(true)}
            disableDiscovery={true}
            variant= {variant}
            className={classes.drawer}
            open={open}
            onClose={()=>showDrawer(false)}
            classes={{paper: classes.drawerPaper,}}
        >
            {
                isMobileApp||full?
                    null
                    :
                    <div className={classes.toolbar}/>
            }
            <List>
                <Divider />
                {
                    ['менеджер', 'менеджер/завсклад'].includes(profile.role)?
                        <>
                        <ListItem style={{background: router.pathname==='/'||router.pathname==='/catalog'?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                            handleUncover('');
                            showDrawer(false);
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                        }}>
                            <ListItemIcon><HomeIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Главная' />
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    ['admin', 'менеджер', 'завсклад', 'менеджер/завсклад', 'управляющий'].includes(profile.role)?
                        <>
                        <ListItem style={{
                            background:
                                ['/categories', '/typecharacteristics', '/characteristics', '/promotions', '/factorys'].includes(router.pathname)||
                                router.pathname.includes('store')&&!router.pathname.includes('storebalanceitems')||
                                router.pathname.includes('client')&&!router.pathname.includes('balanceclients')||
                                router.pathname.includes('cpa')&&'/bonuscpas'!==router.pathname&&'/statisticcpa'!==router.pathname||
                                router.pathname.includes('item')&&!router.pathname.includes('balanceitems')&&!router.pathname.includes('balanceitemdays')&&!router.pathname.includes('wayitems')||
                                router.pathname.includes('user')?
                                    'rgba(24, 59, 55, .1)'
                                    :
                                    '#ffffff'
                        }} button onClick={()=>{handleUncover('Данные');}}>
                            <ListItemIcon><DashboardIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Данные' />
                            <ListItemIcon>{uncover==='Данные'?<UnfoldMoreIcon color='inherit'/>:<UnfoldLessIcon color='inherit'/>}</ListItemIcon>
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                <Collapse in={uncover==='Данные'} timeout='auto' unmountOnExit>
                    <List component='div' disablePadding>
                        {
                            ['admin',  'управляющий'].includes(profile.role)?
                                <>
                                <ListItem style={{marginLeft: 16, background: router.pathname.includes('store')&&!router.pathname.includes('storebalanceitems')?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/stores')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='Магазины' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'управляющий'].includes(profile.role)?
                                <>
                                <ListItem style={{marginLeft: 16, background:router.pathname.includes('user')?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/users')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='Пользователи' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'менеджер', 'менеджер/завсклад', 'управляющий'].includes(profile.role)?
                                <>
                                <ListItem style={{marginLeft: 16, background: router.pathname.includes('client')&&!router.pathname.includes('balanceclients')?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/clients')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='Клиенты' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', ', менеджер', 'менеджер/завсклад', 'управляющий'].includes(profile.role)?
                                <>
                                <ListItem style={{marginLeft: 16, background: router.pathname.includes('cpa')&&'/bonuscpas'!==router.pathname&&'/statisticcpa'!==router.pathname?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/cpas')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='Дизайнеры' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'завсклад', 'менеджер/завсклад', 'управляющий', 'менеджер'].includes(profile.role)?
                                <>
                                <ListItem style={{marginLeft: 16, background:router.pathname.includes('item')&&!router.pathname.includes('balanceitems')&&!router.pathname.includes('balanceitemdays')&&!router.pathname.includes('wayitems')?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/items')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='Модели' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'менеджер/завсклад', 'завсклад', 'управляющий'].includes(profile.role)?
                                <>
                                <ListItem style={{marginLeft: 16, background: router.pathname.includes('factory')?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/factorys')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='Фабрики' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin',  'завсклад',  'менеджер/завсклад',  'управляющий'].includes(profile.role)?
                                <>
                                <ListItem style={{marginLeft: 16, background: router.pathname==='/categories'?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/categories')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='Категории' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin',  'завсклад',  'менеджер/завсклад',  'управляющий'].includes(profile.role)?
                                <>
                                <ListItem style={{marginLeft: 16, background: router.pathname==='/typecharacteristics'?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/typecharacteristics')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='Типы характеристик' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin',  'завсклад',  'менеджер/завсклад',  'управляющий'].includes(profile.role)?
                                <>
                                <ListItem style={{marginLeft: 16, background: router.pathname==='/characteristics'?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/characteristics')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='Характеристики' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'управляющий'].includes(profile.role)?
                                <>
                                <ListItem style={{marginLeft: 16, background: router.pathname==='/promotions'?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/promotions')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='Акции' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                    </List>
                </Collapse>
                {
                    ['admin', 'управляющий', 'менеджер', 'менеджер/завсклад', 'доставщик', 'завсклад'].includes(profile.role)?
                        <>
                        <ListItem style={{
                            background:
                                ['/wayitems'].includes(router.pathname)||
                                router.pathname.includes('refund')||
                                router.pathname.includes('order')||
                                router.pathname.includes('reservation')||
                                router.pathname.includes('sale')?
                                    'rgba(24, 59, 55, .1)'
                                    :
                                    '#ffffff'
                        }} button onClick={()=>{handleUncover('Операции');}}>
                            <ListItemIcon><ReceiptIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Операции' />
                            <ListItemIcon>{uncover==='Операции'?<UnfoldMoreIcon color='inherit'/>:<UnfoldLessIcon color='inherit'/>}</ListItemIcon>
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                <Collapse in={uncover==='Операции'} timeout='auto' unmountOnExit>
                    <List component='div' disablePadding>
                        {
                            ['admin', 'управляющий', 'менеджер', 'менеджер/завсклад', 'завсклад'].includes(profile.role)?
                                <>
                                <ListItem style={{marginLeft: 16, background: router.pathname.includes('sale')?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/sales')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='Продажи' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'управляющий', 'менеджер', 'менеджер/завсклад', 'завсклад', 'менеджер/завсклад'].includes(profile.role)?
                                <>
                                <ListItem style={{marginLeft: 16, background: router.pathname.includes('reservation')?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/reservations')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='Брони' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'управляющий', 'менеджер', 'менеджер/завсклад', 'завсклад'].includes(profile.role)?
                                <>
                                <ListItem style={{marginLeft: 16, background: router.pathname.includes('order')?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/orders')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='На заказ' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'управляющий', 'менеджер', 'менеджер/завсклад', 'завсклад'].includes(profile.role)?
                                <>
                                <ListItem style={{marginLeft: 16, background: router.pathname.includes('refund')?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/refunds')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='Возвраты' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'управляющий', 'менеджер', 'менеджер/завсклад', 'завсклад'].includes(profile.role)?
                                <>
                                <ListItem style={{marginLeft: 16, background: router.pathname==='/wayitems'?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/wayitems')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='В пути' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                    </List>
                </Collapse>
                {
                    ['admin', 'управляющий', 'кассир', 'менеджер', 'менеджер/завсклад', 'юрист'].includes(profile.role)?
                        <>
                        <ListItem style={{
                            background:
                                ['/bonusmanagers', '/bonuscpas', '/balanceclients', '/salarys', '/moneyflows', '/installments', '/moneyrecipients', '/moneyarticles', '/cashboxes', '/doc'].includes(router.pathname)?
                                    'rgba(24, 59, 55, .1)'
                                    :
                                    '#ffffff'
                        }} button onClick={()=>{handleUncover('Бухгалтерия');}}>
                            <ListItemIcon><TableViewIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Бухгалтерия' />
                            <ListItemIcon>{uncover==='Бухгалтерия'?<UnfoldMoreIcon color='inherit'/>:<UnfoldLessIcon color='inherit'/>}</ListItemIcon>
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                <Collapse in={uncover==='Бухгалтерия'} timeout='auto' unmountOnExit>
                    <List component='div' disablePadding>
                        {
                            ['admin', 'кассир', 'менеджер', 'менеджер/завсклад', 'управляющий'].includes(profile.role)?
                                <>
                                <ListItem style={{marginLeft: 16, background: router.pathname==='/balanceclients'?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/balanceclients')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='Баланс клиентов' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'управляющий', 'кассир', 'менеджер', 'менеджер/завсклад', 'юрист'].includes(profile.role)?
                                <>
                                <ListItem style={{marginLeft: 16, background: router.pathname==='/installments'?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/installments')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='Рассрочки' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'управляющий', 'кассир'].includes(profile.role)?
                                <>
                                <ListItem style={{marginLeft: 16, background: router.pathname==='/salarys'?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/salarys')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='Зарплаты' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'управляющий'].includes(profile.role)?
                                <>
                                <ListItem style={{marginLeft: 16, background: router.pathname==='/bonusmanagers'?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/bonusmanagers')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='Бонус менеджера' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'управляющий'].includes(profile.role)?
                                <>
                                <ListItem style={{marginLeft: 16, background: router.pathname==='/bonuscpas'?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/bonuscpas')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='Бонус дизайнера' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'управляющий', 'кассир', 'юрист'].includes(profile.role)?
                                <>
                                <ListItem style={{marginLeft: 16, background: router.pathname==='/moneyflows'?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/moneyflows')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='Движения денег' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'управляющий', 'кассир'].includes(profile.role)?
                                <>
                                <ListItem style={{marginLeft: 16, background: router.pathname==='/cashboxes'?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/cashboxes')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='Кассы/Банки' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'управляющий', 'кассир'].includes(profile.role)?
                                <>
                                <ListItem style={{marginLeft: 16, background: router.pathname==='/moneyrecipients'?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/moneyrecipients')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='Получатели денег' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'управляющий', 'кассир'].includes(profile.role)?
                                <>
                                <ListItem style={{marginLeft: 16, background: router.pathname==='/moneyarticles'?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/moneyarticles')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='Статьи' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'управляющий'].includes(profile.role)?
                                <>
                                <ListItem style={{marginLeft: 16, background: router.pathname==='/doc'?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/doc')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='Реквизиты' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                    </List>
                </Collapse>
                {
                    ['admin', 'менеджер', 'менеджер/завсклад', 'управляющий', 'завсклад'].includes(profile.role)?
                        <>
                        <ListItem style={{
                            background:
                                ['/balanceitemdays', '/balanceitems', '/storebalanceitems', '/warehouses'].includes(router.pathname)?
                                    'rgba(24, 59, 55, .1)'
                                    :
                                    '#ffffff'
                        }} button onClick={()=>{handleUncover('Склад');}}>
                            <ListItemIcon><WarehouseIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Склад' />
                            <ListItemIcon>{uncover==='Склад'?<UnfoldMoreIcon color='inherit'/>:<UnfoldLessIcon color='inherit'/>}</ListItemIcon>
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                <Collapse in={uncover==='Склад'} timeout='auto' unmountOnExit>
                    <List component='div' disablePadding>
                        {
                            ['admin', 'менеджер/завсклад', 'управляющий', 'завсклад'].includes(profile.role)?
                                <>
                                <ListItem style={{marginLeft: 16, background: router.pathname.includes('warehouse')?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/warehouses')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='Склады' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'менеджер', 'менеджер/завсклад', 'управляющий', 'завсклад'].includes(profile.role)?
                                <>
                                <ListItem style={{marginLeft: 16, background: router.pathname==='/balanceitems'?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/balanceitems')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='Баланс складов' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'менеджер', 'менеджер/завсклад', 'управляющий', 'завсклад'].includes(profile.role)?
                                <>
                                <ListItem style={{marginLeft: 16, background: router.pathname==='/storebalanceitems'?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/storebalanceitems')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='Баланс моделей' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'менеджер/завсклад', 'управляющий', 'завсклад'].includes(profile.role)?
                                <>
                                <ListItem style={{marginLeft: 16, background: router.pathname==='/balanceitemdays'?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/balanceitemdays')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='Движение на складах' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                    </List>
                </Collapse>
                {
                    ['admin', 'управляющий'].includes(profile.role)?
                        <>
                        <ListItem style={{
                            background:
                                ['/consultations', '/statisticcpa'].includes(router.pathname)?
                                    'rgba(24, 59, 55, .1)'
                                    :
                                    '#ffffff'
                        }} button onClick={()=>{handleUncover('Статистика');}}>
                            <ListItemIcon><TimelineIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Статистика' />
                            <ListItemIcon>{uncover==='Статистика'?<UnfoldMoreIcon color='inherit'/>:<UnfoldLessIcon color='inherit'/>}</ListItemIcon>
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                <Collapse in={uncover==='Статистика'} timeout='auto' unmountOnExit>
                    <List component='div' disablePadding>
                        {
                            ['admin', 'управляющий'].includes(profile.role)?
                                <>
                                <ListItem style={{marginLeft: 16, background: router.pathname==='/consultations'?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/consultations')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='Консультации' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'управляющий'].includes(profile.role)?
                                <>
                                <ListItem style={{marginLeft: 16, background: router.pathname==='/statisticcpa'?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/statisticcpa')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='Статистика дизайнеров' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                    </List>
                </Collapse>
                {
                    'admin'===profile.role?
                        <>
                        <ListItem style={{
                            background:
                                ['/errors'].includes(router.pathname)?
                                    'rgba(24, 59, 55, .1)'
                                    :
                                    '#ffffff'
                        }} button onClick={()=>{handleUncover('Инструменты');}}>
                            <ListItemIcon><SettingsIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Инструменты' />
                            <ListItemIcon>{uncover==='Инструменты'?<UnfoldMoreIcon color='inherit'/>:<UnfoldLessIcon color='inherit'/>}</ListItemIcon>
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                <Collapse in={uncover==='Инструменты'} timeout='auto' unmountOnExit>
                    <List component='div' disablePadding>
                        {
                            profile.role==='admin'?
                                <>
                                <ListItem style={{marginLeft: 16, background: router.pathname==='/errors'?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                        Router.push('/errors')
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='Сбои' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            profile.role==='admin'?
                                <>
                                <ListItem style={{marginLeft: 16}} button onClick={()=>{
                                    showDrawer(false)
                                    if(!unsaved||JSON.stringify(unsaved.current)==='{}') {
                                        setMiniDialog('Очистить БД', <ClearDB/>)
                                        showMiniDialog(true)
                                    }
                                    else
                                        showSnackBar('Сохраните изменения или обновите страницу')
                                }}>
                                    <ListItemText primary='Очистить БД' />
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                    </List>
                </Collapse>
                {
                    profile.role?
                        <>
                        <ListItem style={{background: router.pathname.includes('task')?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                            showDrawer(false)
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/tasks')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                        }}>
                            <ListItemIcon><ArticleIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Задачи' />
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    profile.role?
                        <>
                        <ListItem style={{background: router.pathname==='/faqs'?'rgba(24, 59, 55, .1)':'#ffffff'}} button onClick={()=>{
                            showDrawer(false)
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/faqs')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                        }}>
                            <ListItemIcon><HelpIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Инструкции' />
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
            </List>
        </Drawer>
    )
})

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyDrawer)