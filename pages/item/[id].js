import initialApp from '../../src/initialApp'
import Checkbox from '@mui/material/Checkbox';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import {getItem, setItem, addItem, deleteItem} from '../../src/gql/item'
import {getItemBarCode} from '../../src/gql/itemBarCode'
import itemStyle from '../../src/styleMUI/list'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useRouter } from 'next/router'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Router from 'next/router'
import * as userActions from '../../src/redux/actions/user'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import TextField from '@mui/material/TextField';
import Confirmation from '../../components/dialog/Confirmation'
import Category from '../../components/dialog/Category'
import { urlMain } from '../../src/const'
import { getClientGqlSsr } from '../../src/apollo'
import { pdDDMMYYHHMM, checkFloat, inputFloat, inputInt, checkInt } from '../../src/lib'
import ControlCamera from '../../icons/barcode-scanner.svg';
import Link from 'next/link';
import AutocomplectOnline from '../../components/app/AutocomplectOnline'
import {getLegalObjects} from '../../src/gql/legalObject'
import { openScanner } from '../../src/lib';
import { wrapper } from '../../src/redux/configureStore'
const types = ['товары', 'услуги']

const Item = React.memo((props) => {
    const { profile } = props.user;
    const {classes} = itemStyle();
    const { data } = props;
    const { isMobileApp } = props.app;
    const { showSnackBar } = props.snackbarActions;
    let [legalObject, setLegalObject] = useState(data.object?data.object.legalObject:undefined);
    let [name, setName] = useState(data.object?data.object.name:'');
    let [price, setPrice] = useState(data.object?data.object.price:'');
    let [priority, setPriority] = useState(data.object?data.object.priority:0);
    let [tnved, setTnved] = useState(data.object&&data.object.tnved?data.object.tnved:'');
    let [mark, setMark] = useState(data.object&&data.object.mark?data.object.mark:false);
    let [quick, setQuick] = useState(data.object&&data.object.quick?data.object.quick:false);
    let [category, setCategory] = useState(data.object?data.object.category:undefined);
    let [type, setType] = useState(data.object?data.object.type:'товары');
    let handleType = (event) => {
        setType(event.target.value)
        setCategory(undefined)
    };
    let [unit, setUnit] = useState(data.object?data.object.unit:'шт');
    let [editedPrice, setEditedPrice] = useState(data.object?data.object.editedPrice:false);
    let [barCode, setBarCode] = useState(data.object?data.object.barCode:'');
    const { setMiniDialog, showMiniDialog, setFullDialog, showFullDialog } = props.mini_dialogActions;
    const router = useRouter()
    useEffect(() => {
        if(process.browser)
            (async()=>{
                if(router.query.barcode&&localStorage.scancode!==router.query.scancode) {
                    let itemBarCode = await getItemBarCode({barCode: router.query.barcode})
                    if(itemBarCode&&itemBarCode.name) setName(itemBarCode.name)
                    setBarCode(router.query.barcode)
                    localStorage.scancode = router.query.scancode
                }
            })()
    }, [process.browser]);
    return (
        <App pageName={data.object!==null?router.query.id==='new'?'Добавить':data.object.name:'Ничего не найдено'}>
            <Head>
                <title>{data.object!==null?router.query.id==='new'?'Добавить':data.object.name:'Ничего не найдено'}</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content={data.object!==null?router.query.id==='new'?'Добавить':data.object.name:'Ничего не найдено'} />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/item/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/item/${router.query.id}`}/>
            </Head>
            <Card className={classes.page}>
                <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignItems: 'flex-start'}}>
                {
                    data.object!==null?
                        !profile.add?
                            <>
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Регистрация:&nbsp;
                                </div>
                                <div className={classes.value}>
                                    {pdDDMMYYHHMM(data.object.createdAt)}
                                </div>
                            </div>
                            {
                                ['admin', 'superadmin'].includes(profile.role)?
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
                                    :
                                    null
                            }
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Тип:&nbsp;
                                </div>
                                <div className={classes.value}>
                                    {type}
                                </div>
                            </div>
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Название:&nbsp;
                                </div>
                                <div className={classes.value}>
                                    {name}
                                </div>
                            </div>
                            {
                                barCode?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Штрих-код:&nbsp;
                                        </div>
                                        <div className={classes.value}>
                                            {barCode}
                                        </div>
                                    </div>
                                    :
                                    null
                            }
                            <div className={classes.row} style={{alignItems: 'flex-end'}}>
                                <div className={classes.nameField}>Редактируемая цена:&nbsp;</div>
                                <Checkbox

                                    checked={editedPrice}
                                    color='primary'
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                            </div>
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Цена:&nbsp;
                                </div>
                                <div className={classes.value}>
                                    {price} сом
                                </div>
                            </div>
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Единица измерения:&nbsp;
                                </div>
                                <div className={classes.value}>
                                    {unit}
                                </div>
                            </div>
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Категория:&nbsp;
                                </div>
                                <div className={classes.value}>
                                    {category?category.name:'Несортированно'}
                                </div>
                            </div>
                            {
                                tnved?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Kод ТНВЭД:&nbsp;
                                        </div>
                                        <div className={classes.value}>
                                            {tnved}
                                        </div>
                                    </div>
                                    :
                                    null
                            }
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Признак маркировки:&nbsp;
                                </div>
                                <div className={classes.value}>
                                    {mark?'присутсвует':'отсутсвует'}
                                </div>
                            </div>
                            </>
                            :
                            <>
                            {
                                router.query.id!=='new'?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Регистрация:&nbsp;
                                        </div>
                                        <div className={classes.value}>
                                            {pdDDMMYYHHMM(data.object.createdAt)}
                                        </div>
                                    </div>
                                    :
                                    null
                            }
                            {
                                ['admin', 'superadmin'].includes(profile.role)?router.query.id==='new'?
                                    <AutocomplectOnline
                                        error={!legalObject||!legalObject._id}
                                        setElement={setLegalObject}
                                        getElements={async (search)=>{return await getLegalObjects({search})}}
                                        label={'налогоплательщика'}
                                    />
                                    :
                                    <Link href='/legalobject/[id]' as={`/legalobject/${legalObject._id}`}>
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
                                    :
                                    null
                            }
                            <FormControl className={classes.input}>
                                <InputLabel>Тип</InputLabel>
                                <Select variant='standard' value={type} onChange={handleType}>
                                    {types.map((element)=>
                                        <MenuItem key={element} value={element}>{element}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                            <TextField variant='standard'
                                error={!name}
                                label='Название'
                                value={name}
                                className={classes.input}
                                onChange={(event)=>{setName(event.target.value)}}
                            />
                            <FormControl className={ classes.input}>
                                <InputLabel>Штрих-код</InputLabel>
                                <Input
                                    type={'text'}
                                    value={barCode}
                                    onChange={(event)=>{setBarCode(event.target.value)}}
                                    className={classes.input}
                                    onBlur={async()=>{
                                        if(barCode.length) {
                                            let itemBarCode = await getItemBarCode({barCode})
                                            if (itemBarCode&&itemBarCode.name) setName(itemBarCode.name)
                                        }
                                    }}
                                    endAdornment={
                                        isMobileApp?
                                            <InputAdornment position='end'>
                                                <IconButton aria-label='scanner' onClick={()=>{
                                                    openScanner({_idx: 0, path: `item/${router.query.id}`})
                                                }}>
                                                    <ControlCamera/>
                                                </IconButton>
                                            </InputAdornment>
                                            :
                                            null
                                    }
                                />
                            </FormControl>
                            <div className={classes.row} style={{alignItems: 'flex-end'}}>
                                <div className={classes.nameField}>Редактируемая цена:&nbsp;</div>
                                <Checkbox

                                    checked={editedPrice}
                                    onChange={()=>{setEditedPrice(!editedPrice)}}
                                    color='primary'
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                            </div>
                            <TextField variant='standard'
                                type={isMobileApp?'number':'text'}
                                error={!price&&!editedPrice}
                                label='Цена'
                                value={price}
                                className={classes.input}
                                onChange={(event)=>{setPrice(inputFloat(event.target.value))}}
                            />
                            <TextField variant='standard'
                                error={!unit}
                                label='Единица измерения'
                                value={unit}
                                className={classes.input}
                                onChange={(event)=>{setUnit(event.target.value)}}
                            />
                            <TextField variant='standard'
                                label='Категория'
                                value={category?category.name:'Несортированно'}
                                className={classes.input}
                                onClick={()=>{
                                    setFullDialog('Категория', <Category type={type} setCategory={setCategory}/>)
                                    showFullDialog(true)
                                }}
                            />
                            <TextField variant='standard'
                                label='Код ТНВЭД'
                                value={tnved}
                                className={classes.input}
                                onChange={(event)=>{setTnved(event.target.value)}}
                            />
                            <div className={classes.row} style={{alignItems: 'flex-end'}}>
                                <div className={classes.nameField}>Признак маркировки:&nbsp;</div>
                                <Checkbox

                                    checked={mark}
                                    onChange={()=>{setMark(!mark)}}
                                    color='primary'
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                            </div>
                            <div className={classes.row} style={{alignItems: 'flex-end'}}>
                                <div className={classes.nameField}>Быстрый доступ:&nbsp;</div>
                                <Checkbox

                                    checked={quick}
                                    onChange={()=>{setQuick(!quick)}}
                                    color='primary'
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                            </div>
                            <TextField variant='standard'
                                type={isMobileApp?'number':'text'}
                                label='Порядок быстрого доступа'
                                value={priority}
                                className={classes.input}
                                onChange={(event)=>{setPriority(inputInt(event.target.value))}}
                            />
                            <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD}>
                                <Button color='primary' onClick={()=>{
                                    if (name.length&&unit.length&&legalObject) {
                                        const action = async() => {
                                            if(router.query.id==='new') {
                                                price = checkFloat(price)
                                                if(checkFloat(price)||editedPrice) {
                                                    let res = await addItem({
                                                        legalObject: legalObject._id,
                                                        category: category ? category._id : category,
                                                        priority: checkInt(priority),
                                                        price,
                                                        editedPrice,
                                                        unit,
                                                        barCode,
                                                        name,
                                                        type,
                                                        tnved,
                                                        mark,
                                                        quick
                                                    })
                                                    Router.push(`/item/${res}`)
                                                    showSnackBar('Успешно', 'success')
                                                }
                                                else
                                                    showSnackBar('Укажите цену')
                                            }
                                            else {
                                                let element = {category: category?category._id:category, _id: router.query.id, }
                                                if (editedPrice!==data.object.editedPrice) element.editedPrice = editedPrice
                                                if (name!==data.object.name) element.name = name
                                                if (type!==data.object.type) element.type = type
                                                if (barCode!==data.object.barCode) element.barCode = barCode
                                                if (unit!==data.object.unit) element.unit = unit
                                                if (tnved!==data.object.tnved) element.tnved = tnved
                                                if (mark!==data.object.mark) element.mark = mark
                                                if (quick!==data.object.quick) element.quick = quick
                                                if (price!==data.object.price&&(checkFloat(price)||editedPrice)) element.price = checkFloat(price)
                                                if (priority!==data.object.priority) element.priority = checkInt(priority)
                                                await setItem(element)
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
                                                await deleteItem(router.query.id)
                                                Router.push(`/items/${data.object.legalObject._id}`)
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
                            </>
                        :
                        'Ничего не найдено'
                }
                </CardContent>
            </Card>
        </App>
    )
})

Item.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', 'superadmin', 'управляющий', 'кассир', 'супервайзер'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    return {
        data: {
            object:ctx.query.id!=='new'?await getItem({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined):{
                legalObject: store.getState().user.profile.legalObject?{_id: store.getState().user.profile.legalObject}:null,
                category: undefined, price: '', priority: 0, editedPrice: false, unit: 'шт', barCode: '', name: '', type: 'товары'}
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

export default connect(mapStateToProps, mapDispatchToProps)(Item);