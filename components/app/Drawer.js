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
import Link from 'next/link';
import { useRouter } from 'next/router';
import Collapse from '@mui/material/Collapse';
//import Badge from '@mui/material/Badge';
import ListItemIcon from '@mui/material/ListItemIcon';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import Router from 'next/router'

const MyDrawer = React.memo((props) => {
    const { unread, unsaved, full } = props
    const {classes} = drawerStyle()
    const { drawer, isMobileApp } = props.app;
    const { profile } = props.user;
    const { showDrawer } = props.appActions;
    const { showSnackBar } = props.snackbarActions;
    const open = isMobileApp||full?drawer:true;
    const router = useRouter();
    const variant = isMobileApp||full?'temporary' : 'permanent';
    let [uncover, setUncover] = useState('');
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
                    ['менеджер'].includes(profile.role)?
                        <>
                        <ListItem style={{background: router.pathname==='/'?'#f5f5f5':'#ffffff'}} button onClick={()=>{
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
                    ['admin'].includes(profile.role)?
                        <>
                        <ListItem style={{background: router.pathname==='/categories'?'#f5f5f5':'#ffffff'}} button onClick={()=>{
                            showDrawer(false)
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/categories')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                        }}>
                            <ListItemIcon><InfoIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Категории' />
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    ['admin'].includes(profile.role)?
                        <>
                        <ListItem style={{background: router.pathname==='/typecharacteristics'?'#f5f5f5':'#ffffff'}} button onClick={()=>{
                            showDrawer(false)
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/typecharacteristics')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                        }}>
                            <ListItemIcon><InfoIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Типы характеристик' />
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    ['admin'].includes(profile.role)?
                        <>
                        <ListItem style={{background: router.pathname==='/characteristics'?'#f5f5f5':'#ffffff'}} button onClick={()=>{
                            showDrawer(false)
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/characteristics')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                        }}>
                            <ListItemIcon><InfoIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Характеристики' />
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    ['admin'].includes(profile.role)?
                        <>
                        <ListItem style={{background: router.pathname==='/moneyrecipients'?'#f5f5f5':'#ffffff'}} button onClick={()=>{
                            showDrawer(false)
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/moneyrecipients')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                        }}>
                            <ListItemIcon><InfoIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Получатели денег' />
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    ['admin'].includes(profile.role)?
                        <>
                        <ListItem style={{background: router.pathname==='/moneyarticles'?'#f5f5f5':'#ffffff'}} button onClick={()=>{
                            showDrawer(false)
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/moneyarticles')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                        }}>
                            <ListItemIcon><InfoIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Статьи движения денег' />
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    ['admin'].includes(profile.role)?
                        <>
                        <ListItem style={{background: router.pathname.includes('store')&&!router.pathname.includes('storebalanceitems')?'#f5f5f5':'#ffffff'}} button onClick={()=>{
                            showDrawer(false)
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/stores')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                        }}>
                            <ListItemIcon><InfoIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Магазины' />
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    ['admin'].includes(profile.role)?
                        <>
                        <ListItem style={{background: router.pathname.includes('warehouse')?'#f5f5f5':'#ffffff'}} button onClick={()=>{
                            showDrawer(false)
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/warehouses')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                        }}>
                            <ListItemIcon><InfoIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Склады' />
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    ['admin'].includes(profile.role)?
                        <>
                        <ListItem style={{background: router.pathname.includes('factory')?'#f5f5f5':'#ffffff'}} button onClick={()=>{
                            showDrawer(false)
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/factorys')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                        }}>
                            <ListItemIcon><InfoIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Фабрики' />
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    ['admin'].includes(profile.role)?
                        <>
                        <ListItem style={{background: router.pathname.includes('client')&&!router.pathname.includes('balanceclients')?'#f5f5f5':'#ffffff'}} button onClick={()=>{
                            showDrawer(false)
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/clients')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                        }}>
                            <ListItemIcon><InfoIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Клиенты' />
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    ['admin'].includes(profile.role)?
                        <>
                        <ListItem style={{background: router.pathname.includes('cpa')?'#f5f5f5':'#ffffff'}} button onClick={()=>{
                            showDrawer(false)
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/cpas')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                        }}>
                            <ListItemIcon><InfoIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Партнеры' />
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    ['admin'].includes(profile.role)?
                        <>
                        <ListItem style={{background: router.pathname==='/cashboxes'?'#f5f5f5':'#ffffff'}} button onClick={()=>{
                            showDrawer(false)
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/cashboxes')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                        }}>
                            <ListItemIcon><InfoIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Кассы/Банки' />
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    profile.role?
                        <>
                        <ListItem style={{background: router.pathname==='/faqs'?'#f5f5f5':'#ffffff'}} button onClick={()=>{
                            showDrawer(false)
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/faqs')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                        }}>
                            <ListItemIcon><InfoIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Инструкции' />
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    ['admin'].includes(profile.role)?
                        <>
                        <ListItem style={{background:router.pathname.includes('item')&&!router.pathname.includes('balanceitems')&&!router.pathname.includes('wayitems')?'#f5f5f5':'#ffffff'}} button onClick={()=>{
                            showDrawer(false)
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/items')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                        }}>
                            <ListItemIcon><InfoIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Модели' />
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    ['admin'].includes(profile.role)?
                        <>
                        <ListItem style={{background:router.pathname.includes('user')?'#f5f5f5':'#ffffff'}} button onClick={()=>{
                            showDrawer(false)
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/users')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                        }}>
                            <ListItemIcon><InfoIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Пользователи' />
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    ['admin'].includes(profile.role)?
                        <>
                        <ListItem style={{background: router.pathname==='/balanceitems'?'#f5f5f5':'#ffffff'}} button onClick={()=>{
                            showDrawer(false)
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/balanceitems')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                        }}>
                            <ListItemIcon><InfoIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Баланс складов' />
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    ['admin'].includes(profile.role)?
                        <>
                        <ListItem style={{background: router.pathname==='/storebalanceitems'?'#f5f5f5':'#ffffff'}} button onClick={()=>{
                            showDrawer(false)
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/storebalanceitems')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                        }}>
                            <ListItemIcon><InfoIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Баланс моделей' />
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    ['admin'].includes(profile.role)?
                        <>
                        <ListItem style={{background: router.pathname==='/bonusmanagers'?'#f5f5f5':'#ffffff'}} button onClick={()=>{
                            showDrawer(false)
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/bonusmanagers')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                        }}>
                            <ListItemIcon><InfoIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Ставки' />
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    ['admin'].includes(profile.role)?
                        <>
                        <ListItem style={{background: router.pathname==='/balanceclients'?'#f5f5f5':'#ffffff'}} button onClick={()=>{
                            showDrawer(false)
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/balanceclients')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                        }}>
                            <ListItemIcon><InfoIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Баланс клиентов' />
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    ['admin'].includes(profile.role)?
                        <>
                        <ListItem style={{background: router.pathname==='/salarys'?'#f5f5f5':'#ffffff'}} button onClick={()=>{
                            showDrawer(false)
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/salarys')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                        }}>
                            <ListItemIcon><InfoIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Зарплаты' />
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    ['admin'].includes(profile.role)?
                        <>
                        <ListItem style={{background: router.pathname==='/moneyflows'?'#f5f5f5':'#ffffff'}} button onClick={()=>{
                            showDrawer(false)
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/moneyflows')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                           }}>
                            <ListItemIcon><InfoIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Движения денег' />
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    ['admin'].includes(profile.role)?
                        <>
                        <ListItem style={{background: router.pathname==='/wayitems'?'#f5f5f5':'#ffffff'}} button onClick={()=>{
                            showDrawer(false)
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/wayitems')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                        }}>
                            <ListItemIcon><InfoIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='В пути' />
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    ['admin'].includes(profile.role)?
                        <>
                        <ListItem style={{background: router.pathname.includes('task')?'#f5f5f5':'#ffffff'}} button onClick={()=>{
                            showDrawer(false)
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/tasks')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                        }}>
                            <ListItemIcon><InfoIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Задачи' />
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    ['admin'].includes(profile.role)?
                        <>
                        <ListItem style={{background: router.pathname==='/consultations'?'#f5f5f5':'#ffffff'}} button onClick={()=>{
                            showDrawer(false)
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/consultations')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                        }}>
                            <ListItemIcon><InfoIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Консультации' />
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    ['admin'].includes(profile.role)?
                        <>
                        <ListItem style={{background: router.pathname.includes('order')?'#f5f5f5':'#ffffff'}} button onClick={()=>{
                            showDrawer(false)
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/orders')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                        }}>
                            <ListItemIcon><InfoIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='На заказ' />
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    ['admin'].includes(profile.role)?
                        <>
                        <ListItem style={{background: router.pathname.includes('reservation')?'#f5f5f5':'#ffffff'}} button onClick={()=>{
                            showDrawer(false)
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/reservations')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                        }}>
                            <ListItemIcon><InfoIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Брони' />
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    ['admin'].includes(profile.role)?
                        <>
                        <ListItem style={{background: router.pathname.includes('sale')?'#f5f5f5':'#ffffff'}} button onClick={()=>{
                            showDrawer(false)
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/sales')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                        }}>
                            <ListItemIcon><InfoIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Продажи' />
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    ['admin'].includes(profile.role)?
                        <>
                        <ListItem style={{background: router.pathname==='/installments'?'#f5f5f5':'#ffffff'}} button onClick={()=>{
                            showDrawer(false)
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/installments')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                        }}>
                            <ListItemIcon><InfoIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Рассрочки' />
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    ['admin'].includes(profile.role)?
                        <>
                        <ListItem style={{background: router.pathname.includes('refund')?'#f5f5f5':'#ffffff'}} button onClick={()=>{
                            showDrawer(false)
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/refunds')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                        }}>
                            <ListItemIcon><InfoIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Возвраты' />
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    ['admin'].includes(profile.role)?
                        <>
                        <ListItem style={{background: router.pathname==='/doc'?'#f5f5f5':'#ffffff'}} button onClick={()=>{
                            showDrawer(false)
                            if(!unsaved||JSON.stringify(unsaved.current)==='{}')
                                Router.push('/doc')
                            else
                                showSnackBar('Сохраните изменения или обновите страницу')
                        }}>
                            <ListItemIcon><InfoIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Реквизиты' />
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
        appActions: bindActionCreators(appActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyDrawer)