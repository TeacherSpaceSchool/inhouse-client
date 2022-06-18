import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import pageListStyle from '../src/styleMUI/list'
import { urlMain } from '../src/const'
import Link from 'next/link';
import Router from 'next/router'
import initialApp from '../src/initialApp'
import Card from '@mui/material/Card';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { wrapper } from '../src/redux/configureStore'
const list = {
    statisticSalykStore: [
        {
            name: 'Отложенная синхронизация ККМ',
            link: '/statistic/statisticsynckkm',
            role: ['admin', 'superadmin']
        },
        {
            name: 'Ошибка синхронизации ККМ',
            link: '/statistic/statisticintegration',
            role: ['admin', 'superadmin']
        },
        {
            name: 'Просроченные смены',
            link: '/statistic/statisticexpiredworkshifts',
            role: ['admin', 'superadmin']
        },
        {
            name: 'Статистика активности налогоплательщиков',
            link: '/statistic/statisticactivitylegalobject',
            role: ['admin', 'superadmin', 'агент']
        },
        {
            name: 'Статистика платежей',
            link: '/statistic/statisticpayment',
            role: ['admin', 'superadmin']
        },
    ],
    statistic: [
        {
            name: 'Статистика операций',
            link: '/statistic/statisticsale',
            role: ['admin', 'superadmin', 'управляющий']
        },
    ],
    tools: [
        {
            name: 'Корзина',
            link: '/statistic/trash',
            role: ['superadmin']
        },
        {
            name: 'Полное удаление налогоплательщика',
            link: '/statistic/fulldeletelegalobjects',
            role: ['superadmin']
        },
        {
            name: 'Пуш-уведомления',
            link: '/statistic/notificationstatistic',
            role: ['admin', 'superadmin']
        },
        {
            name: 'Сбои',
            link: '/statistic/errors',
            role: ['admin', 'superadmin']
        },
        {
            name: 'Синхронизация данных',
            link: '/statistic/sync',
            role: ['кассир']
        },
        {
            name: 'Тарифы',
            link: '/statistic/tariffs',
            role: ['admin', 'superadmin']
        },
        {
            name: 'Файловое хранилище',
            link: '/statistic/files',
            role: ['admin', 'superadmin']
        },
        {
            name: 'Хранилище коллекций',
            link: '/statistic/statisticstoragesize',
            role: ['admin', 'superadmin']
        },
        {
            name: 'Целостность системы',
            link: '/statistic/checkintegrity',
            role: ['admin', 'superadmin', 'инспектор']
        },
        {
            name: 'Штрих-коды',
            link: '/statistic/itembarcodes',
            role: ['admin', 'superadmin']
        },
    ],
    integrate: [
        {
            name: 'Загрузка клиентов',
            link: '/statistic/uploadingclients',
            role: ['admin', 'superadmin']
        },
        {
            name: 'Загрузка районов',
            link: '/statistic/uploadingdistricts',
            role: ['admin', 'superadmin']
        },
        {
            name: 'Загрузка товаров',
            link: '/statistic/uploadingitems',
            role: ['admin', 'superadmin']
        },
        {
            name: 'Интеграции',
            link: '/statistic/integrations',
            role: ['admin', 'superadmin']
        },
    ],
    load: [
    ]
}

const Statistic = React.memo((props) => {
    const {classes} = pageListStyle();
    const { search } = props.app;
    const { profile } = props.user;
    let [showList, setShowList] = useState(props.showList);
    const [expanded, setExpanded] = React.useState(false);
    const initialRender = useRef(true);
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    useEffect(()=>{
        (async()=>{
            if(initialRender.current) {
                initialRender.current = false;
            } else {
                showList = {
                    statistic: [],
                    tools: [],
                    integrate: [],
                    load: [],
                    statisticSalykStore: []
                }
                for (let i = 0; i < list.statisticSalykStore.length; i++) {
                    if (list.statisticSalykStore[i].name.toLowerCase().includes(search.toLowerCase()) && list.statisticSalykStore[i].role.includes(profile.role) && (profile.statistic||profile.role==='агент'))
                        showList.statisticSalykStore.push(list.statisticSalykStore[i])
                }
                for (let i = 0; i < list.statistic.length; i++) {
                    if (list.statistic[i].name.toLowerCase().includes(search.toLowerCase()) && list.statistic[i].role.includes(profile.role) && profile.statistic)
                        showList.statistic.push(list.statistic[i])
                }
                for (let i = 0; i < list.tools.length; i++) {
                    if (list.tools[i].name.toLowerCase().includes(search.toLowerCase()) && list.tools[i].role.includes(profile.role))
                        showList.tools.push(list.tools[i])
                }
                for (let i = 0; i < list.integrate.length; i++) {
                    if (list.integrate[i].name.toLowerCase().includes(search.toLowerCase()) && list.integrate[i].role.includes(profile.role) && profile.add)
                        showList.integrate.push(list.integrate[i])
                }
                for (let i = 0; i < list.load.length; i++) {
                    if (list.load[i].name.toLowerCase().includes(search.toLowerCase()) && list.load[i].role.includes(profile.role))
                        showList.load.push(list.load[i])
                }
                setShowList({...showList})
            }
        })()
    },[search])
    return (
        <App searchShow={true} pageName='Прочие инструменты'>
            <Head>
                <title>Прочие инструменты</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content='Прочие инструменты' />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/statistics`} />
                <link rel='canonical' href={`${urlMain}/statistics`}/>
            </Head>
            <div className={classes.page}>
                {
                    showList.load&&showList.load.length>0?
                        <Accordion expanded={expanded === 'load'} onChange={handleChange('load')} style={{width: 'calc(100% - 20px)', margin: 10, background: '#F5F5F5'}}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls='panel1a-content'
                                id='panel1a-header'
                                style={{background: '#fff'}}
                            >
                                <h3>Выгрузка</h3>
                            </AccordionSummary>
                            <AccordionDetails className={classes.page}>
                                {showList.load.map((element, idx)=>
                                    <Link key={`unload${idx}`} href={element.link}>
                                        <Card className={classes.statisticButton}>
                                            <h3>
                                                {element.name}
                                            </h3>
                                        </Card>
                                    </Link>
                                )}
                            </AccordionDetails>
                        </Accordion>
                        :
                        null
                }
                {
                    showList.tools&&showList.tools.length>0?
                        <Accordion expanded={expanded === 'tools'} onChange={handleChange('tools')} style={{width: 'calc(100% - 20px)', margin: 10, background: '#F5F5F5'}}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls='panel1a-content'
                                id='panel1a-header'
                                style={{background: '#fff'}}
                            >
                                <b>Инструменты</b>
                            </AccordionSummary>
                            <AccordionDetails className={classes.page} >
                                {showList.tools.map((element, idx)=>
                                    <Link key={`tool${idx}`} href={element.link}>
                                        <Card className={classes.statisticButton}>
                                            <h3>
                                                {element.name}
                                            </h3>
                                        </Card>
                                    </Link>
                                )}
                            </AccordionDetails>
                        </Accordion>
                        :
                        null
                }
                {
                    showList.integrate&& showList.integrate.length>0?
                        <Accordion expanded={expanded === 'integrate'} onChange={handleChange('integrate')} style={{width: 'calc(100% - 20px)', margin: 10, background: '#F5F5F5'}}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls='panel1a-content'
                                id='panel1a-header'
                                style={{background: '#fff'}}
                            >
                                <h3>Интеграция</h3>
                            </AccordionSummary>
                            <AccordionDetails className={classes.page} >
                                {showList.integrate.map((element, idx)=>
                                    <Link key={`integrate${idx}`} href={element.link}>
                                        <Card className={classes.statisticButton}>
                                            <h3>
                                                {element.name}
                                            </h3>
                                        </Card>
                                    </Link>
                                )}
                            </AccordionDetails>
                        </Accordion>
                        :
                        null
                }
                {
                    showList.statistic&&showList.statistic.length>0?
                        <Accordion expanded={expanded === 'statistic'} onChange={handleChange('statistic')} style={{width: 'calc(100% - 20px)', margin: 10, background: '#F5F5F5'}}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls='panel1a-content'
                                id='panel1a-header'
                                style={{background: '#fff'}}
                            >
                                <h3>Статистика</h3>
                            </AccordionSummary>
                            <AccordionDetails className={classes.page} >
                                {showList.statistic.map((element, idx)=>
                                    <Link key={`stat${idx}`} href={element.link}>
                                        <Card className={classes.statisticButton}>
                                            <h3>
                                                {element.name}
                                            </h3>
                                        </Card>
                                    </Link>
                                )}
                            </AccordionDetails>
                        </Accordion>
                        :
                        null
                }
                {
                    showList.statisticSalykStore&&showList.statisticSalykStore.length>0?
                        <Accordion expanded={expanded === 'statisticSalykStore'} onChange={handleChange('statisticSalykStore')} style={{width: 'calc(100% - 20px)', margin: 10, background: '#F5F5F5'}}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls='panel1a-content'
                                id='panel1a-header'
                                style={{background: '#fff'}}
                            >
                                <h3>Статистика SALYK.STORE</h3>
                            </AccordionSummary>
                            <AccordionDetails className={classes.page} >
                                {showList.statisticSalykStore.map((element, idx)=>
                                    <Link key={`statSalykStore${idx}`} href={element.link}>
                                        <Card className={classes.statisticButton}>
                                            <h3>
                                                {element.name}
                                            </h3>
                                        </Card>
                                    </Link>
                                )}
                            </AccordionDetails>
                        </Accordion>
                        :
                        null
                }
            </div>
        </App>
    )
})

Statistic.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', 'superadmin', 'управляющий', 'супервайзер', 'кассир', 'оператор', 'инспектор', 'агент'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    let showList = {
        statistic: [],
        tools: [],
        integrate: [],
        load: [],
        statisticSalykStore: []
    }
    for(let i=0; i<list.statisticSalykStore.length; i++){
        if(list.statisticSalykStore[i].role.includes(store.getState().user.profile.role) && (store.getState().user.profile.statistic||store.getState().user.profile.role==='агент'))
            showList.statisticSalykStore.push(list.statisticSalykStore[i])
    }
    for(let i=0; i<list.statistic.length; i++){
        if(list.statistic[i].role.includes(store.getState().user.profile.role) && store.getState().user.profile.statistic)
            showList.statistic.push(list.statistic[i])
    }
    for(let i=0; i<list.tools.length; i++){
        if(list.tools[i].role.includes(store.getState().user.profile.role))
            showList.tools.push(list.tools[i])
    }
    for(let i=0; i<list.integrate.length; i++){
        if(list.integrate[i].role.includes(store.getState().user.profile.role) && store.getState().user.profile.add)
            showList.integrate.push(list.integrate[i])
    }
    for(let i=0; i<list.load.length; i++){
        if(list.load[i].role.includes(store.getState().user.profile.role))
            showList.load.push(list.load[i])
    }
    return {
        showList: showList
    }
})

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

export default connect(mapStateToProps)(Statistic);