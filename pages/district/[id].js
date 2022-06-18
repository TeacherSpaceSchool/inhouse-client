import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import {getDistrict, setDistrict, addDistrict, deleteDistrict, getBranchsForDistricts, getCashiersForDistricts} from '../../src/gql/district'
import {getLegalObjects} from '../../src/gql/legalObject'
import {getUsers} from '../../src/gql/user'
import districtStyle from '../../src/styleMUI/list'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import { useRouter } from 'next/router'
import Router from 'next/router'
import * as userActions from '../../src/redux/actions/user'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import TextField from '@mui/material/TextField';
import Confirmation from '../../components/dialog/Confirmation'
import { urlMain } from '../../src/const'
import { getClientGqlSsr } from '../../src/apollo'
import { pdDDMMYYHHMM } from '../../src/lib'
import AutocomplectOnline from '../../components/app/AutocomplectOnline'
import Autocomplete from '@mui/material/Autocomplete';
import CardBranch from '../../components/CardBranch'
import LazyLoad from 'react-lazyload';
import CardBranchPlaceholder from '../../components/CardPlaceholder'
import Checkbox from '@mui/material/Checkbox';
import Link from 'next/link';
import { wrapper } from '../../src/redux/configureStore'
const height = 186

const District = React.memo((props) => {
    const { profile } = props.user;
    const {classes} = districtStyle();
    const { data } = props;
    const { isMobileApp, search } = props.app;
    const { showSnackBar } = props.snackbarActions;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const router = useRouter()
    let [name, setName] = useState(data.object?data.object.name:'');
    let [legalObject, setLegalObject] = useState(data.object?data.object.legalObject:undefined);
    let [branchs, setBranchs] = useState(data.object?data.object.branchs:[]);
    let [cashiers, setCashiers] = useState(data.object?data.object.cashiers:[]);
    let [supervisors, setSupervisors] = useState(data.object?data.object.supervisors:[]);
    let [branchsForDistricts, setBranchsForDistricts] = useState([]);
    let [cashiersForDistricts, setCashiersForDistricts] = useState([]);
    let [supervisorsForDistricts, setSupervisorsForDistricts] = useState([]);
    let [filtredBranchs, setFiltredBranchs] = useState([]);
    let [pagination, setPagination] = useState(100);
    let [selectType, setSelectType] = useState('Все');
    const checkPagination = ()=>{
        if(pagination<filtredBranchs.length){
            setPagination(pagination+100)
        }
    }
    useEffect(() => {
        (async()=>{
            if(legalObject){
                setBranchsForDistricts(await getBranchsForDistricts({legalObject: legalObject._id}));
                setCashiersForDistricts(await getCashiersForDistricts({legalObject: legalObject._id}));
                setSupervisorsForDistricts(await getUsers({legalObject: legalObject._id, role: 'супервайзер'}));
            }
        })()
    }, [legalObject]);
    useEffect(()=>{
        (async()=>{
            if(data.object) {
                setPagination(100)
                let filtredBranchs= []
                if (selectType === 'Все')
                    filtredBranchs=[...branchs, ...branchsForDistricts]
                else if (selectType === 'Свободные')
                    filtredBranchs=[...branchsForDistricts]
                else if (selectType === 'Выбраные')
                    filtredBranchs=[...branchs]
                if(search.length>0)
                    filtredBranchs = filtredBranchs.filter(element=>element.inn.includes(search.toLowerCase())||element.name.toLowerCase().includes(search.toLowerCase()))
                setFiltredBranchs([...filtredBranchs])
            }
        })()
    },[selectType, search, branchsForDistricts, branchs])
    return (
        <App checkPagination={checkPagination} searchShow={true} pageName={data.object!==null?router.query.id==='new'?'Добавить':data.object.name:'Ничего не найдено'}>
            <Head>
                <title>{data.object!==null?router.query.id==='new'?'Добавить':data.object.name:'Ничего не найдено'}</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content={data.object!==null?router.query.id==='new'?'Добавить':data.object.name:'Ничего не найдено'} />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/district/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/district/${router.query.id}`}/>
            </Head>
             {
                    data.object!==null?
                        <>
                        <Card className={classes.page}>
                            <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignItems: 'flex-start'}}>
                                {
                                    ['admin', 'superadmin'].includes(profile.role)?
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
                                                getElements={async (search)=>{return await getLegalObjects({search})}}
                                                label={'налогоплательщика'}
                                            />
                                        :
                                        null
                                }
                                {
                                    profile.add?
                                        <>
                                        <TextField variant='standard'
                                            error={!name}
                                            label='Название'
                                            value={name}
                                            className={classes.input}
                                            onChange={(event)=>{setName(event.target.value)}}
                                        />
                                        <Autocomplete
                                            multiple
                                            className={classes.input}
                                            options={supervisorsForDistricts}
                                            getOptionLabel={(option) => option.name}
                                            value={supervisors}
                                            onChange={(event, newValue) => {
                                                setSupervisors(newValue)
                                            }}
                                            noOptionsText='Ничего не найдено'
                                            renderInput={(params) => (
                                                <TextField variant='standard'
                                                    {...params}
                                                    label='Супервайзеры'
                                                />
                                            )}
                                        />
                                        <Autocomplete
                                            multiple
                                            className={classes.input}
                                            options={cashiersForDistricts}
                                            getOptionLabel={(option) => option.name}
                                            value={cashiers}
                                            onChange={(event, newValue) => {
                                                setCashiers(newValue)
                                            }}
                                            noOptionsText='Ничего не найдено'
                                            renderInput={(params) => (
                                                <TextField variant='standard'
                                                    {...params}
                                                    label='Кассиры'
                                                />
                                            )}
                                        />
                                        </>
                                        :
                                        <>
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                Название:&nbsp;
                                            </div>
                                            <div className={classes.value}>
                                                {name}
                                            </div>
                                        </div>
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                Супервайзеры:&nbsp;
                                            </div>
                                            <div className={classes.value}>
                                                {supervisors.map((element, idx)=>
                                                    <>{element.name}{idx!==supervisors.length-1?', ':''}</>
                                                )}
                                            </div>
                                        </div>
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                Кассиры:&nbsp;
                                            </div>
                                            <div className={classes.value}>
                                                {cashiers.map((element, idx)=>
                                                    <>{element.name}{idx!==cashiers.length-1?', ':''}</>
                                                )}
                                            </div>
                                        </div>
                                        </>
                                }
                                <br/>
                                <div style={{ justifyContent: 'center' }} className={classes.row}>
                                    <div style={{background: selectType==='Все'?'#10183D':'#ffffff', color: selectType==='Все'?'white':'black'}} onClick={()=>{setSelectType('Все')}} className={classes.selectType}>
                                        Все
                                    </div>
                                    <div style={{background: selectType==='Свободные'?'#10183D':'#ffffff', color: selectType==='Свободные'?'white':'black'}} onClick={()=>{setSelectType('Свободные')}} className={classes.selectType}>
                                        {`Своб. ${branchsForDistricts.length}`}
                                    </div>
                                    <div style={{background: selectType==='Выбраные'?'#10183D':'#ffffff', color: selectType==='Выбраные'?'white':'black'}} onClick={()=>{setSelectType('Выбраные')}} className={classes.selectType}>
                                        {`Выбр. ${branchs.length}`}
                                    </div>
                                </div>
                                <br/>
                                {
                                    profile.add?
                                        <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD}>
                                            <Button color='primary' onClick={()=>{
                                                if (legalObject&&name.length) {
                                                    const action = async() => {
                                                        if(router.query.id==='new') {
                                                            let res = await addDistrict({legalObject: legalObject._id, name, branchs: branchs.map(elem=>elem._id), cashiers: cashiers.map(elem=>elem._id), supervisors: supervisors.map(elem=>elem._id)})
                                                            Router.push(`/district/${res}`)
                                                            showSnackBar('Успешно', 'success')
                                                        }
                                                        else {
                                                            let element = {_id: router.query.id}
                                                            if (name!==data.object.name) element.name = name
                                                            if (JSON.stringify(branchs)!==data.object.branchs) element.branchs = branchs.map(elem=>elem._id)
                                                            if (JSON.stringify(cashiers)!==data.object.cashiers) element.cashiers = cashiers.map(elem=>elem._id)
                                                            if (JSON.stringify(supervisors)!==data.object.supervisors) element.supervisors = supervisors.map(elem=>elem._id)
                                                            {
                                                                await setDistrict(element)
                                                                Router.reload()
                                                            }
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
                                                            await deleteDistrict(router.query.id)
                                                            Router.push(`/districts/${legalObject._id}`)
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
                                        :
                                        null
                                }
                            </CardContent>
                        </Card>
                        <div className={classes.list}>
                            {filtredBranchs?filtredBranchs.map((element, idx)=> {
                                if (idx <= pagination)
                                    return (
                                        <div key={element._id} style={isMobileApp ? {alignItems: 'baseline', width: 'auto'} : {width: 'auto'}}
                                             className={isMobileApp ? classes.column : classes.row}>
                                            {
                                                profile.add?
                                                    <Checkbox checked={branchs.includes(element)}
                                                              onChange={() => {
                                                                  if (!branchs.includes(element)) {
                                                                      branchs.push(element)
                                                                      branchsForDistricts.splice(branchsForDistricts.indexOf(element), 1)
                                                                  } else {
                                                                      branchs.splice(branchs.indexOf(element), 1)
                                                                      branchsForDistricts.push(element)
                                                                  }
                                                                  setBranchs([...branchs])
                                                                  setBranchsForDistricts([...branchsForDistricts])
                                                              }}
                                                    />
                                                    :
                                                    null
                                            }
                                            <LazyLoad scrollContainer={'.App-body'} key={element._id}
                                                      height={height} offset={[height, 0]} debounce={0}
                                                      once={true}
                                                      placeholder={<CardBranchPlaceholder height={height}/>}>
                                                <CardBranch element={element}/>
                                            </LazyLoad>
                                        </div>
                                    )
                                else return null
                            }):null}
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

District.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', 'superadmin', 'управляющий', 'супервайзер'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    return {
        data: {
            object: ctx.query.id!=='new'?await getDistrict({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined):{legalObject: store.getState().user.profile.legalObject?{_id: store.getState().user.profile.legalObject}:undefined,name: '', branchs: [], cashiers: [], supervisors: []}
        }
    };
});

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

export default connect(mapStateToProps, mapDispatchToProps)(District);