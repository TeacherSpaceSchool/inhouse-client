import React, {useState} from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import drawerStyle from '../../src/styleMUI/drawer'
import * as appActions from '../../src/redux/actions/app'
import Drawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Collapse from '@mui/material/Collapse';
//import Badge from '@mui/material/Badge';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import CategoryIcon from '@mui/icons-material/Category';
import ListItemIcon from '@mui/material/ListItemIcon';
import PointofsaleIcon from '../../icons/pointofsale.svg';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import EqualizerIcon from '@mui/icons-material/Settings';
import RateReview from '@mui/icons-material/RateReview';
import ArtTrackIcon from '@mui/icons-material/ArtTrack';
import SmsIcon from '@mui/icons-material/Sms';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';

const MyDrawer = React.memo((props) => {
 //   const { unread } = props
    const {classes} = drawerStyle()
    const { drawer, isMobileApp } = props.app;
    const { profile } = props.user;
    const { showDrawer } = props.appActions;
    const open = isMobileApp?drawer:true;
    const router = useRouter();
    const variant = isMobileApp?'temporary' : 'permanent';
    let [uncover, setUncover] = useState(
        (router.pathname.includes('report')||router.pathname.includes('sale')&&!router.pathname.includes('salenew')||router.pathname.includes('workshift')||router.pathname.includes('deposithistory')||router.pathname.includes('withdrawhistory'))&&!router.pathname.includes('statistic')?
            'ККМ'
            :
            (router.pathname.includes('user')||router.pathname.includes('district')||router.pathname.includes('item')||router.pathname.includes('cashbox')||router.pathname.includes('branch')||router.pathname.includes('legalobject'))&&!router.pathname.includes('statistic')?
                'Предприятие'
                :
                (router.pathname.includes('prepayment')||router.pathname.includes('consignation')||router.pathname.includes('client'))&&!router.pathname.includes('statistic')?
                    'CRM'
                    :
                    router.pathname.includes('/payment')||router.pathname==='/applicationaddcategorys'||router.pathname==='/scanner'||router.pathname.includes('statistic')||router.pathname==='/faq'||router.pathname==='/category'?
                        'Инструменты'
                        :
                        ''
    );
    const handleUncover = (item)=>{
        if(uncover===item)item = ''
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
                isMobileApp?
                    null
                    :
                    <div className={classes.toolbar}/>
            }
            <List>
                <Divider />
                {
                    profile.legalObject||!profile.role?
                        <>
                        <Link href={'/'} as={'/'}>
                            <ListItem style={{background: router.pathname.includes('salenew')||router.pathname==='/'?'#f5f5f5':'#ffffff'}} button onClick={()=>{handleUncover('');showDrawer(false)}}>
                                <ListItemIcon><HomeIcon color='inherit'/></ListItemIcon>
                                <ListItemText primary='Главная' />
                            </ListItem>
                        </Link>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    ['admin', 'superadmin', 'управляющий', 'кассир', 'супервайзер'].includes(profile.role)?
                        <>
                        <ListItem style={{background: (router.pathname.includes('report')||router.pathname.includes('sale')&&!router.pathname.includes('salenew')||router.pathname.includes('workshift')||router.pathname.includes('deposithistory')||router.pathname.includes('withdrawhistory'))&&!router.pathname.includes('statistic')?'#f5f5f5':'#ffffff'}} button onClick={()=>{handleUncover('ККМ');}}>
                            <ListItemIcon><PointofsaleIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='ККМ' />
                            <ListItemIcon>{uncover==='ККМ'?<UnfoldMoreIcon color='inherit'/>:<UnfoldLessIcon color='inherit'/>}</ListItemIcon>
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                <Collapse in={uncover==='ККМ'} timeout='auto' unmountOnExit>
                    <List component='div' disablePadding>
                        {
                            ['admin', 'superadmin', 'управляющий', 'кассир', 'супервайзер'].includes(profile.role)?
                                <>
                                <Link href={profile.legalObject?'/sales/[id]':'/sales'} as={profile.legalObject?`/sales/${profile.legalObject}`:'/sales'}>
                                    <ListItem style={{marginLeft: 16, background: router.pathname.includes('sale')&&!router.pathname.includes('salenew')&&!router.pathname.includes('statistic')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                        <ListItemText primary='Операции' />
                                    </ListItem>
                                </Link>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'superadmin', 'управляющий', 'супервайзер', 'кассир'].includes(profile.role)?
                                <>
                                <Link href={profile.legalObject?'/deposithistorys/[id]':'/deposithistorys'} as={profile.legalObject?`/deposithistorys/${profile.legalObject}`:'/deposithistorys'}>
                                    <ListItem style={{marginLeft: 16, background: router.pathname.includes('deposithistory')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                        <ListItemText primary='Внесения' />
                                    </ListItem>
                                </Link>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'superadmin', 'управляющий', 'супервайзер', 'кассир'].includes(profile.role)?
                                <>
                                <Link href={profile.legalObject?'/withdrawhistorys/[id]':'/withdrawhistorys'} as={profile.legalObject?`/withdrawhistorys/${profile.legalObject}`:'/withdrawhistorys'}>
                                    <ListItem style={{marginLeft: 16, background: router.pathname.includes('withdrawhistory')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                        <ListItemText primary='Изъятия' />
                                    </ListItem>
                                </Link>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'superadmin', 'управляющий', 'супервайзер', 'кассир'].includes(profile.role)?
                                <>
                                <Link href={{pathname: profile.legalObject?'/reports/[id]':'/reports', query: {type: 'X'}}} as={`${profile.legalObject?`/reports/${profile.legalObject}`:'/reports'}?type=X`}>
                                    <ListItem style={{marginLeft: 16, background: router.asPath.includes('report')&&router.asPath.includes('X')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                        <ListItemText primary='Х-Отчет' />
                                    </ListItem>
                                </Link>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'superadmin', 'управляющий', 'супервайзер', 'кассир'].includes(profile.role)?
                                <>
                                <Link href={{pathname: profile.legalObject?'/reports/[id]':'/reports', query: {type: 'Z'}}} as={`${profile.legalObject?`/reports/${profile.legalObject}`:'/reports'}?type=Z`}>
                                    <ListItem style={{marginLeft: 16, background: router.asPath.includes('report')&&router.asPath.includes('Z')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                        <ListItemText primary='Z-Отчет' />
                                    </ListItem>
                                </Link>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'superadmin', 'управляющий', 'супервайзер', 'кассир'].includes(profile.role)?
                                <>
                                <Link href={profile.legalObject?'/workshifts/[id]':'/workshifts'} as={profile.legalObject?`/workshifts/${profile.legalObject}`:'/workshifts'}>
                                    <ListItem style={{marginLeft: 16, background: router.pathname.includes('workshift')&&!router.pathname.includes('statistic')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                        <ListItemText primary='Смены' />
                                    </ListItem>
                                </Link>
                                <Divider/>
                                </>
                                :
                                null
                        }
                    </List>
                </Collapse>
                {
                    ['admin', 'superadmin', 'управляющий', 'супервайзер', 'оператор'].includes(profile.role)?
                        <>
                        <ListItem style={{background: (router.pathname.includes('user')||router.pathname.includes('district')||router.pathname.includes('item')||router.pathname.includes('cashbox')||router.pathname.includes('branch')||router.pathname.includes('legalobject'))&&!router.pathname.includes('statistic')?'#f5f5f5':'#ffffff'}} button onClick={()=>{handleUncover('Предприятие');}}>
                            <ListItemIcon><BusinessCenterIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='Предприятие' />
                            <ListItemIcon>{uncover==='Предприятие'?<UnfoldMoreIcon color='inherit'/>:<UnfoldLessIcon color='inherit'/>}</ListItemIcon>
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                <Collapse in={uncover==='Предприятие'} timeout='auto' unmountOnExit>
                    <List component='div' disablePadding>
                        {
                            ['admin', 'superadmin', 'управляющий', 'оператор'].includes(profile.role)?
                                <>
                                <Link href={profile.legalObject?'/legalobject/[id]':'/legalobjects'} as={profile.legalObject?`/legalobject/${profile.legalObject}`:'/legalobjects'}>
                                    <ListItem style={{marginLeft: 16, background: router.pathname.includes('legalobject')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                        <ListItemText primary={`Налогоплательщик${'управляющий'===profile.role?'':'и'}`} />
                                    </ListItem>
                                </Link>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'superadmin', 'управляющий', 'супервайзер', 'оператор'].includes(profile.role)?
                                <>
                                <Link href={profile.legalObject?'/branchs/[id]':'/branchs'} as={profile.legalObject?`/branchs/${profile.legalObject}`:'/branchs'}>
                                    <ListItem style={{marginLeft: 16, background: router.pathname.includes('branch')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                        <ListItemText primary='Объекты'/>
                                    </ListItem>
                                </Link>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'superadmin', 'управляющий', 'супервайзер', 'оператор'].includes(profile.role)?
                                <>
                                <Link href={profile.legalObject?'/cashboxes/[id]':'/cashboxes'} as={profile.legalObject?`/cashboxes/${profile.legalObject}`:'/cashboxes'}>
                                    <ListItem style={{marginLeft: 16, background: router.pathname.includes('cashbox')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                        <ListItemText primary='Кассы' />
                                    </ListItem>
                                </Link>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'superadmin', 'управляющий', 'супервайзер', 'оператор'].includes(profile.role)?
                                <>
                                <Link href={profile.legalObject?'/users/[id]':'/users'} as={profile.legalObject?`/users/${profile.legalObject}`:'/users'}>
                                    <ListItem style={{marginLeft: 16, background: router.pathname.includes('user')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                        <ListItemText primary='Пользователи' />
                                    </ListItem>
                                </Link>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'superadmin', 'управляющий', 'супервайзер'].includes(profile.role)?
                                <>
                                <Link href={profile.legalObject?'/items/[id]':'/items'} as={profile.legalObject?`/items/${profile.legalObject}`:'/items'}>
                                    <ListItem style={{marginLeft: 16, background: router.pathname.includes('item')&&!router.pathname.includes('statistic')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                        <ListItemText primary='Товары' />
                                    </ListItem>
                                </Link>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'superadmin', 'управляющий', 'супервайзер'].includes(profile.role)?
                                <>
                                <Link href={profile.legalObject?'/districts/[id]':'/districts'} as={profile.legalObject?`/districts/${profile.legalObject}`:'/districts'}>
                                    <ListItem style={{marginLeft: 16, background: router.pathname.includes('district')&&!router.pathname.includes('statistic')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                        <ListItemText primary='Районы' />
                                    </ListItem>
                                </Link>
                                <Divider/>
                                </>
                                :
                                null
                        }
                    </List>
                </Collapse>
                {
                    'кассир'===profile.role?
                        <>
                        <Link href={'/items/[id]'} as={`/items/${profile.legalObject}`}>
                            <ListItem style={{background: router.pathname.includes('item')&&!router.pathname.includes('statistic')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                <ListItemIcon><CategoryIcon color='inherit'/></ListItemIcon>
                                <ListItemText primary='Товары' />
                            </ListItem>
                        </Link>
                        <Divider/>
                        </>
                        :
                        null
                }
                {
                    ['admin', 'superadmin', 'управляющий', 'супервайзер', 'кассир'].includes(profile.role)?
                        <>
                        <ListItem style={{background: (router.pathname.includes('prepayment')||router.pathname.includes('consignation')||router.pathname.includes('client'))&&!router.pathname.includes('statistic')?'#f5f5f5':'#ffffff'}} button onClick={()=>{handleUncover('CRM');}}>
                            <ListItemIcon><AssignmentIndIcon color='inherit'/></ListItemIcon>
                            <ListItemText primary='CRM' />
                            <ListItemIcon>{uncover==='CRM'?<UnfoldMoreIcon color='inherit'/>:<UnfoldLessIcon color='inherit'/>}</ListItemIcon>
                        </ListItem>
                        <Divider/>
                        </>
                        :
                        null
                }
                <Collapse in={uncover==='CRM'} timeout='auto' unmountOnExit>
                    <List component='div' disablePadding>
                        {
                            ['admin', 'superadmin', 'управляющий', 'супервайзер', 'кассир'].includes(profile.role)?
                                <>
                                <Link href={profile.legalObject?'/clients/[id]':'/clients'} as={profile.legalObject?`/clients/${profile.legalObject}`:'/clients'}>
                                    <ListItem style={{marginLeft: 16, background: router.pathname.includes('client')&&!router.pathname.includes('statistic')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                        <ListItemText primary='Клиенты' />
                                    </ListItem>
                                </Link>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'superadmin', 'управляющий', 'супервайзер', 'кассир'].includes(profile.role)?
                                <>
                                <Link href={profile.legalObject?'/prepayments/[id]':'/prepayments'} as={profile.legalObject?`/prepayments/${profile.legalObject}`:'/prepayments'}>
                                    <ListItem style={{marginLeft: 16, background: router.pathname.includes('prepayment')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                        <ListItemText primary='Аванс'/>
                                    </ListItem>
                                </Link>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'superadmin', 'управляющий', 'супервайзер', 'кассир'].includes(profile.role)?
                                <>
                                <Link href={profile.legalObject?'/consignations/[id]':'/consignations'} as={profile.legalObject?`/consignations/${profile.legalObject}`:'/consignations'}>
                                    <ListItem style={{marginLeft: 16, background: router.pathname.includes('consignation')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                        <ListItemText primary='Кредиты'/>
                                    </ListItem>
                                </Link>
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
                        <ListItem style={{background: router.pathname.includes('/payment')||router.pathname==='/applicationaddcategorys'||router.pathname==='/scanner'||router.pathname.includes('statistic')||router.pathname==='/faq'||router.pathname==='/category'?'#f5f5f5':'#ffffff'}} button onClick={()=>{handleUncover('Инструменты');}}>
                            <ListItemIcon><EqualizerIcon color='inherit'/></ListItemIcon>
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
                            ['admin', 'superadmin'].includes(profile.role)?
                                <>
                                <Link href='/category'>
                                    <ListItem style={{marginLeft: 16, background: router.pathname==='/category'?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                        <ListItemText primary='Категории' />
                                    </ListItem>
                                </Link>
                                <Divider/>
                                </>
                                :null
                        }
                        {
                            profile.role?
                                <>
                                <Link href={'/faq'}>
                                    <ListItem style={{marginLeft: 16, background: router.pathname==='/faq'?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                        <ListItemText primary='Инструкции' />
                                    </ListItem>
                                </Link>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        {
                            ['admin', 'superadmin', 'управляющий', 'супервайзер', 'кассир'].includes(profile.role)&&isMobileApp?
                                <>
                                <Link href={'/scanner'}>
                                    <ListItem style={{marginLeft: 16, background: router.pathname.includes('scanner')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                        <ListItemText primary='Сканер' />
                                    </ListItem>
                                </Link>
                                <Divider/>
                                </>
                                :null
                        }
                        {
                            ['admin', 'superadmin', 'управляющий', 'оператор'].includes(profile.role)||['супервайзер', 'кассир'].includes(profile.role)&&profile.payment?
                                <>
                                <Link href={'/payments'}>
                                    <ListItem style={{marginLeft: 16, background: router.pathname.includes('/payment')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                        <ListItemText primary='Платежи' />
                                    </ListItem>
                                </Link>
                                <Divider/>
                                </>
                                :null
                        }
                        {
                            ['admin', 'superadmin', 'оператор', 'инспектор', 'агент'].includes(profile.role)||['управляющий', 'супервайзер', 'кассир'].includes(profile.role)&&profile.statistic?
                                <>
                                <Link href={'/statistic'}>
                                    <ListItem style={{marginLeft: 16, background: router.pathname.includes('statistic')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                        <ListItemText primary='Прочие инструменты' />
                                    </ListItem>
                                </Link>
                                <Divider/>
                                </>
                                :null
                        }
                    </List>
                </Collapse>
                {
                    ['admin', 'superadmin', 'управляющий', 'супервайзер', 'кассир'].includes(profile.role)?
                        <>
                        <Link href='/reviews'>
                            <ListItem style={{background: router.pathname==='/reviews'?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                <ListItemIcon><RateReview color='inherit'/></ListItemIcon>
                                <ListItemText primary='Отзывы' />
                            </ListItem>
                        </Link>
                        <Divider/>
                        </>
                        :null
                }
                {
                    ['admin', 'superadmin', 'управляющий', 'супервайзер', 'кассир', 'оператор'].includes(profile.role)?
                        <>
                        <Link href='/blog'>
                            <ListItem style={{background: router.pathname==='/blog'?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                <ListItemIcon><ArtTrackIcon color='inherit'/></ListItemIcon>
                                <ListItemText primary='Новости' />
                            </ListItem>
                        </Link>
                        <Divider/>
                        </>
                        :null
                }
                {
                    ['admin','superadmin', 'оператор'].includes(profile.role)||!profile.role?
                        <>
                        <Link href='/connectionapplications'>
                            <ListItem style={{background: router.pathname==='/connectionapplications'?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                <ListItemIcon><SmsIcon color='inherit'/></ListItemIcon>
                                <ListItemText primary='Заявка на подключение' />
                            </ListItem>
                        </Link>
                        <Divider/>
                        </>
                        :null
                }
                <Link href={'/contact'}>
                    <ListItem style={{background: router.pathname==='/contact'||router.pathname==='/ofert'||router.pathname==='/privacy'?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                        <ListItemIcon><InfoIcon color='inherit'/></ListItemIcon>
                        <ListItemText primary='Контакты' />
                    </ListItem>
                </Link>
                <Divider/>
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyDrawer)