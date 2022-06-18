import initialApp from '../../../src/initialApp'
import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../../../layouts/App';
import { connect } from 'react-redux'
import {setIntegration, getIntegration, addIntegration, deleteIntegration, getLegalObjectsForIntegrations} from '../../../src/gql/integration'
import {getIntegrationObjectsCount, getIntegrationObjects} from '../../../src/gql/integrationObject'
import integrationStyle from '../../../src/styleMUI/list'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../../src/redux/actions/mini_dialog'
import { useRouter } from 'next/router'
import Router from 'next/router'
import * as userActions from '../../../src/redux/actions/user'
import * as snackbarActions from '../../../src/redux/actions/snackbar'
import TextField from '@mui/material/TextField';
import Confirmation from '../../../components/dialog/Confirmation'
import { urlMain } from '../../../src/const'
import { getClientGqlSsr } from '../../../src/apollo'
import { pdDDMMYYHHMM } from '../../../src/lib'
import AutocomplectOnline from '../../../components/app/AutocomplectOnline'
import CardIntegrationObject from '../../../components/CardIntegrationObject'
import LazyLoad from 'react-lazyload';
import CardIntegrationObjectPlaceholder from '../../../components/CardPlaceholder';
import Link from 'next/link';
import { forceCheck } from 'react-lazyload';
import { wrapper } from '../../../src/redux/configureStore'
const height = 186
const filters = [
    {
        name: 'Кассы',
        value: 'кассы'
    },
    {
        name: 'Клиенты',
        value: 'клиенты'
    },
    {
        name: 'Объекты',
        value: 'объекты'
    },
    {
        name: 'Пользователи',
        value: 'пользователи'
    },
    {
        name: 'Районы',
        value: 'районы'
    },
    {
        name: 'Товары',
        value: 'товары'
    }
]

const Integration = React.memo((props) => {
    const {classes} = integrationStyle();
    const { data } = props;
    const { isMobileApp, search, filter } = props.app;
    const { showSnackBar } = props.snackbarActions;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const router = useRouter()
    let [IP, setIP] = useState(data.object?data.object.IP:'');
    let [password, setPassword] = useState(data.object?data.object.password:'');
    let [legalObject, setLegalObject] = useState(data.object?data.object.legalObject:undefined);
    let [list, setList] = useState([]);
    let [count, setCount] = useState(0);
    let searchTimeOut = useRef(null);
    const initialRender = useRef(true);
    const getList = async ()=>{
        if(legalObject){
            setList(await getIntegrationObjects({skip: 0, search, legalObject: legalObject._id, type: filter}))
            setCount(await getIntegrationObjectsCount({search, legalObject: legalObject._id, type: filter}));
            (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
            forceCheck();
            paginationWork.current = true
        }
    }
    useEffect(() => {
        (async()=>{
            getList()
        })()
    }, [legalObject, filter]);
    useEffect(()=>{
        (async()=>{
            if(initialRender.current) {
                initialRender.current = false;
            } else {
                if(searchTimeOut.current)
                    clearTimeout(searchTimeOut.current)
                searchTimeOut.current = setTimeout(async()=>{
                    await getList()
                }, 500)

            }
        })()
    },[ search])
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = await getIntegrationObjects({skip: list.length, search, legalObject: legalObject._id, type: filter})
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }

    return (
        <App checkPagination={checkPagination} filters={filters} searchShow={true} pageName={data.object!==null?router.query.id==='new'?'Добавить':data.object.legalObject.name:'Ничего не найдено'}>
            <Head>
                <title>{data.object!==null?router.query.id==='new'?'Добавить':data.object.legalObject.name:'Ничего не найдено'}</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content={data.object!==null?router.query.id==='new'?'Добавить':data.object.legalObject.name:'Ничего не найдено'} />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/statistic/integration/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/statistic/integration/${router.query.id}`}/>
            </Head>
             {
                    data.object!==null?
                        <>
                        <Card className={classes.page}>
                            <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignItems: 'flex-start'}}>
                                {
                                    router.query.id!=='new'?
                                        <>
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                Регистрация:&nbsp;
                                            </div>
                                            <div className={classes.value}>
                                                {pdDDMMYYHHMM(data.object.createdAt)}
                                            </div>
                                        </div>
                                        <Link href='/legalobject/[id]' as={`/legalobject/${data.object.legalObject._id}`}>
                                            <a>
                                                <div className={classes.row}>
                                                    <div className={classes.nameField}>
                                                        Налогоплательщик:&nbsp;
                                                    </div>
                                                    <div className={classes.value}>
                                                        {data.object.legalObject.name}
                                                    </div>
                                                </div>
                                            </a>
                                        </Link>
                                        </>
                                        :
                                        <AutocomplectOnline
                                            error={!legalObject}
                                            setElement={setLegalObject}
                                            getElements={async (search)=>{return await getLegalObjectsForIntegrations({search})}}
                                            label={'налогоплательщика'}
                                        />
                                }
                                <TextField variant='standard'
                                    label='IP-адрес'
                                    value={IP}
                                    className={classes.input}
                                    onChange={(event)=>{setIP(event.target.value)}}
                                />
                                <TextField variant='standard'
                                    error={!password}
                                    label='Пароль'
                                    value={password}
                                    className={classes.input}
                                    onChange={(event)=>{setPassword(event.target.value)}}
                                />
                                <br/>
                                <div className={classes.row}>
                                    <Button color='primary' onClick={()=>{
                                        if (legalObject&&password.length) {
                                            const action = async() => {
                                                if(router.query.id==='new') {
                                                    let res = await addIntegration({legalObject: legalObject._id, IP, password})
                                                    Router.push(`/statistic/integration/${res}`)
                                                    showSnackBar('Успешно', 'success')
                                                }
                                                else {
                                                    let element = {_id: router.query.id}
                                                    if (IP!==data.object.IP) element.IP = IP
                                                    if (password!==data.object.password&&password.length) element.password = password
                                                    await setIntegration(element)
                                                    Router.reload()
                                                }
                                            }
                                            setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                            showMiniDialog(true)
                                        } else
                                            showSnackBar('Заполните все поля')
                                    }}>
                                        Сохранить
                                    </Button>
                                    {
                                        router.query.id!=='new'?
                                            <Button color='secondary' onClick={()=>{
                                                const action = async() => {
                                                    await deleteIntegration(router.query.id)
                                                    Router.push('/statistic/integrations')
                                                }
                                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                                showMiniDialog(true)
                                            }}>
                                                Удалить
                                            </Button>
                                            :
                                            null
                                    }
                                </div>
                            </CardContent>
                        </Card>
                        <div className={classes.list}>
                            {list&&legalObject&&router.query.id!=='new'?
                                <>
                                <CardIntegrationObject getList={getList} legalObject={legalObject._id} type={filter}/>
                                {list.map((element, idx)=>
                                        <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardIntegrationObjectPlaceholder height={height}/>}>
                                            <CardIntegrationObject list={list} key={element._id} setList={setList} legalObject={legalObject._id} type={filter} element={element} idx={idx}/>
                                        </LazyLoad>
                                )}
                                <div className='count'>
                                    {`Всего: ${count}`}
                                </div>
                                </>
                                :
                                null
                            }
                        </div>
                        </>
                        :
                        <Card className={classes.page}>
                            <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignItems: 'flex-start'}}>
                                Ничего не найдено
                            </CardContent>
                        </Card>
                }
        </App>
    )
})

Integration.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', 'superadmin'].includes(store.getState().user.profile.role)||!store.getState().user.profile.add)
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    store.getState().app.filter = 'кассы'
    return {
        data: {
            object:
                ctx.query.id!=='new'?await getIntegration({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
                :
                {legalObject: undefined, password: '', IP: ''}
        }
    };
})

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Integration);