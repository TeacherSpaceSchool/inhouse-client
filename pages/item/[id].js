import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React, { useState, useRef, useEffect } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import { getItem, setItem, addItem, deleteItem } from '../../src/gql/item'
import { getCategorys } from '../../src/gql/category'
import { getFactorys } from '../../src/gql/factory'
import { getCharacteristics } from '../../src/gql/characteristic'
import { getTypeCharacteristics } from '../../src/gql/typeCharacteristic'
import pageListStyle from '../../src/styleMUI/list'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/router'
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Router from 'next/router'
import * as userActions from '../../src/redux/actions/user'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import * as appActions from '../../src/redux/actions/app'
import TextField from '@mui/material/TextField';
import Confirmation from '../../components/dialog/Confirmation'
import UsdToKgs from '../../components/dialog/UsdToKgs'
import { urlMain } from '../../src/const'
import { getClientGqlSsr } from '../../src/apollo'
import { cloneObject, inputFloat, checkFloat } from '../../src/lib'
import History from '../../components/dialog/History';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { wrapper } from '../../src/redux/configureStore'
import AutocomplectOnline from '../../components/app/AutocomplectOnline'
import randomstring from 'randomstring';
import Link from 'next/link';

const Item = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const { profile } = props.user;
    const { isMobileApp } = props.app;
    const { showSnackBar } = props.snackbarActions;
    const { setShowLightbox, setImagesLightbox, setIndexLightbox } = props.appActions;
    const unsaved = useRef();
    let imageRef = useRef(null);
    let [name, setName] = useState(data.object?data.object.name:'');
    let [art, setArt] = useState(data.object?data.object.art:'');
    let [category, setCategory] = useState(data.object?data.object.category:null);
    let [ID, setID] = useState(data.object?data.object.ID:'');
    const checkIDTimeout = useRef(false);
    let [errorID, setErrorID] = useState(false);
    let [images, setImages] = useState(data.object?cloneObject(data.object.images):[]);
    let [uploads, setUploads] = useState([]);
    let handleChangeImage = (async (event) => {
        if(event.target.files[0]&&event.target.files[0].size / 1024 / 1024 < 50) {
            setUploads([event.target.files[0], ...uploads])
            setImages([URL.createObjectURL(event.target.files[0]), ...images])
        } else {
            showSnackBar('Файл слишком большой')
        }
    })
    let [priceUSD, setPriceUSD] = useState(data.object?data.object.priceUSD:'');
    let [primeCostUSD, setPrimeCostUSD] = useState(data.object?data.object.primeCostUSD:'');
    let [priceKGS, setPriceKGS] = useState(data.object?data.object.priceKGS:'');
    let [primeCostKGS, setPrimeCostKGS] = useState(data.object?data.object.primeCostKGS:'');
    let [discount, setDiscount] = useState(data.object?data.object.discount:'');
    let [typeDiscount, setTypeDiscount] = useState(data.object?data.object.typeDiscount:'%');
    let [priceAfterDiscountKGS, setPriceAfterDiscountKGS] = useState(data.object?data.object.priceAfterDiscountKGS:0);
    let [info, setInfo] = useState(data.object?data.object.info:'');
    let [unit, setUnit] = useState(data.object?data.object.unit:'шт');
    let [size, setSize] = useState(data.object?data.object.size:'');
    let [characteristics, setCharacteristics] = useState(data.object?cloneObject(data.object.characteristics):[]);
    let [factory, setFactory] = useState(data.object?data.object.factory:null);
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const router = useRouter()
    useEffect(()=>{
        (async()=>{
            priceKGS = checkFloat(priceKGS)
            discount = checkFloat(discount)
            if(typeDiscount==='%')
                priceAfterDiscountKGS = priceKGS - priceKGS/100*discount
            else
                priceAfterDiscountKGS = priceKGS - discount
            setPriceAfterDiscountKGS(priceAfterDiscountKGS>0?checkFloat(priceAfterDiscountKGS):0)
        })()
    }, [priceKGS, discount, typeDiscount])
    useEffect(()=>{
        if(!unsaved.current)
            unsaved.current = {}
        else
            unsaved.current[router.query.id] = true
    },[name,  art, category, ID, images, uploads, priceUSD, primeCostUSD, priceKGS, primeCostKGS, discount, typeDiscount, priceAfterDiscountKGS, info, unit, size, characteristics, factory])
    return (
        <App unsaved={unsaved} pageName={data.object!==null?router.query.id==='new'?'Добавить':data.object.name:'Ничего не найдено'}>
            <Head>
                <title>{data.object!==null?router.query.id==='new'?'Добавить':data.object.name:'Ничего не найдено'}</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content={data.object!==null?router.query.id==='new'?'Добавить':data.object.name:'Ничего не найдено'} />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website'/>
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/item/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/item/${router.query.id}`}/>
                <meta name='viewport' content='maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, initial-scale=1.0, width=device-width, shrink-to-fit=no' />
            </Head>
            <Card className={classes.page}>
                <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignItems: 'flex-start'}}>
                    {
                        data.edit&&data.object&&data.object._id?
                            <>
                            <div className={classes.status}>
                                <HistoryIcon onClick={async()=>{
                                    setMiniDialog('История', <History where={data.object._id}/>)
                                    showMiniDialog(true)
                                }} style={{ color: '#10183D'}}/>
                            </div>
                            <br/>
                            </>
                            :
                            null
                    }
                    {
                        data.object?
                            <>
                            <div className={classes.noteImageList}>
                                {
                                    data.edit?
                                        <img className={classes.noteImage} src='/add.png' onClick={()=>{imageRef.current.click()}} />
                                        :
                                        null
                                }
                                {images.map((element, idx)=> <div key={`noteImageDiv${idx}`} className={classes.noteImageDiv}>
                                    <img className={classes.noteImage} src={element} onClick={()=>{
                                        setShowLightbox(true)
                                        setImagesLightbox(images)
                                        setIndexLightbox(idx)
                                    }}/>
                                    {
                                        data.edit?
                                            <div className={classes.noteImageButton} style={{background: 'red'}} onClick={()=>{
                                                images.splice(idx, 1)
                                                setImages([...images])
                                                uploads.splice(idx, 1)
                                                setUploads([...uploads])
                                            }}>X</div>
                                            :
                                            null
                                    }
                                </div>)}
                            </div>
                            {
                                data.edit||data.add?
                                    <>
                                    <TextField
                                        id='name'
                                        variant='standard'
                                        error={!name.length}
                                        label='Название'
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        className={classes.input}
                                    />
                                    <TextField
                                        id='art'
                                        variant='standard'
                                        label='Артикул'
                                        value={art}
                                        onChange={(event) => setArt(event.target.value)}
                                        className={classes.input}
                                    />
                                    <FormControl className={classes.input}>
                                        <InputLabel error={errorID}>ID</InputLabel>
                                        <Input
                                            error={errorID}
                                            value={ID}
                                            onChange={async(event) => {
                                                ID = event.target.value
                                                setID(ID)

                                                if(checkIDTimeout.current)
                                                    clearTimeout(checkIDTimeout.current)
                                                if(ID!==data.object.ID&&ID)
                                                    checkIDTimeout.current = setTimeout(async()=>setErrorID((await getItem({_id: ID}))), 1000)

                                            }}
                                            endAdornment={
                                                <InputAdornment position='end'>
                                                    <IconButton onClick={async()=>{
                                                        ID = randomstring.generate(12)
                                                        setErrorID((await getItem({_id: ID})))
                                                        setID(ID)
                                                    }}>
                                                        <AutorenewIcon/>
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                    <AutocomplectOnline
                                        element={category}
                                        setElement={(category)=>{
                                            setCategory(category)
                                        }}
                                        error={!category}
                                        defaultValue={category}
                                        getElements={async (search)=>{
                                            return await getCategorys({search})
                                        }}
                                        minLength={0}
                                        label={'Категория'}/>
                                    <AutocomplectOnline
                                        element={factory}
                                        error={!factory}
                                        setElement={(factory)=>{
                                            setFactory(factory)
                                        }}
                                        defaultValue={factory}
                                        getElements={async (search)=>{
                                            return await getFactorys({search})
                                        }}
                                        minLength={0}
                                        label={'Фабрика'}/>
                                    <div className={isMobileApp?classes.column:classes.row}>
                                        <TextField
                                            id='priceUSD'
                                            error={!priceUSD}
                                            variant='standard'
                                            type={isMobileApp?'number':'text'}
                                            label='Цена в долларах'
                                            onChange={(event) => setPriceUSD(inputFloat(event.target.value))}
                                            value={priceUSD}
                                            className={classes.input}
                                        />
                                        <TextField
                                            id='primeCostUSD'
                                            variant='standard'
                                            type={isMobileApp?'number':'text'}
                                            label='Себестоимость в долларах'
                                            onChange={(event) => setPrimeCostUSD(inputFloat(event.target.value))}
                                            value={primeCostUSD}
                                            className={classes.input}
                                        />
                                    </div>
                                    <div className={isMobileApp?classes.column:classes.row}>
                                        <TextField
                                            id='priceKGS'
                                            error={!priceKGS}
                                            variant='standard'
                                            type={isMobileApp?'number':'text'}
                                            label='Цена в сомах'
                                            onChange={(event) => setPriceKGS(inputFloat(event.target.value))}
                                            value={priceKGS}
                                            className={classes.input}
                                        />
                                        <TextField
                                            id='primeCostKGS'
                                            variant='standard'
                                            type={isMobileApp?'number':'text'}
                                            label='Себестоимость в сомах'
                                            onChange={(event) => setPrimeCostKGS(inputFloat(event.target.value))}
                                            value={primeCostKGS}
                                            className={classes.input}
                                        />
                                    </div>
                                    <div className={isMobileApp?classes.column:classes.row}>
                                        <FormControl className={classes.input}>
                                            <InputLabel>Скидка</InputLabel>
                                            <Input
                                                placeholder='Скидка'
                                                value={discount}
                                                onChange={(event)=>setDiscount(inputFloat(event.target.value))}
                                                endAdornment={
                                                    <InputAdornment position='end'>
                                                        <IconButton onClick={()=>setTypeDiscount(typeDiscount==='%'?'сом':'%')}>
                                                            {typeDiscount}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                        </FormControl>
                                        <TextField
                                            id='priceAfterDiscountKGS'
                                            variant='standard'
                                            type={isMobileApp?'number':'text'}
                                            label='Цена после скидки в сомах'
                                            value={priceAfterDiscountKGS}
                                            className={classes.input}
                                        />
                                    </div>
                                    <div className={isMobileApp?classes.column:classes.row}>
                                        <TextField
                                            id='unit'
                                            variant='standard'
                                            error={!unit.length}
                                            label='Единица измерения'
                                            value={unit}
                                            onChange={(event) => setUnit(event.target.value)}
                                            className={classes.input}
                                        />
                                        <TextField
                                            id='size'
                                            variant='standard'
                                            label='Размер'
                                            value={size}
                                            onChange={(event) => setSize(event.target.value)}
                                            className={classes.input}
                                        />
                                    </div>
                                    {characteristics?characteristics.map((element, idx)=>
                                        <div className={isMobileApp?classes.column:classes.row} key={`characteristic${idx}`}>
                                            <AutocomplectOnline
                                                element={element[0]}
                                                error={!element[0]}
                                                freeSolo
                                                setElement={(typeCharacteristic)=>{
                                                    if(typeCharacteristic)
                                                        characteristics[idx][0] = typeCharacteristic.name
                                                    else
                                                        characteristics[idx][0] = ''

                                                    setCharacteristics([...characteristics])
                                                }}
                                                defaultValue={element[0]}
                                                getElements={async (search)=>{
                                                    return await getTypeCharacteristics({search})
                                                }}
                                                minLength={0}
                                                label={`Тип характеристики ${idx+1}`}/>
                                            <AutocomplectOnline
                                                element={element[1]}
                                                error={!element[1]}
                                                freeSolo
                                                setElement={(characteristic)=>{
                                                    if(characteristic)
                                                        characteristics[idx][1] = characteristic.name
                                                    else
                                                        characteristics[idx][1] = ''

                                                    setCharacteristics([...characteristics])
                                                }}
                                                defaultValue={element[1]}
                                                getElements={async (search)=>{
                                                    return await getCharacteristics({search})
                                                }}
                                                minLength={0}
                                                label={`Характеристика ${idx+1}`}/>
                                            <IconButton onClick={()=>{
                                                characteristics.splice(idx, 1)
                                                setCharacteristics([...characteristics])
                                            }}>
                                                <CloseIcon style={{color: 'red'}}/>
                                            </IconButton>
                                        </div>
                                    ): null}
                                    <br/>
                                    <center style={{width: '100%'}}>
                                        <Button onClick={async()=>{
                                            setCharacteristics([...characteristics, ['', '']])
                                        }} size='small'>
                                            Добавить характеристику
                                        </Button>
                                    </center>
                                    <TextField
                                        id='info'
                                        variant='standard'
                                        onChange={(event) => setInfo(event.target.value)}
                                        label='Комментарий'
                                        multiline={true}
                                        maxRows='5'
                                        value={info}
                                        className={classes.input}
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
                                            Артикул:&nbsp;
                                        </div>
                                        <div className={classes.value}>
                                            {art}
                                        </div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            ID:&nbsp;
                                        </div>
                                        <div className={classes.value}>
                                            {ID}
                                        </div>
                                    </div>
                                    {
                                        category?
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>
                                                    Категория:&nbsp;
                                                </div>
                                                <div className={classes.value}>
                                                    {category.name}
                                                </div>
                                            </div>
                                            :
                                            null
                                    }
                                    {
                                        factory?
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>
                                                    Фабрика:&nbsp;
                                                </div>
                                                <div className={classes.value}>
                                                    {factory.name}
                                                </div>
                                            </div>
                                            :
                                            null
                                    }
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Цена в долларах:&nbsp;
                                        </div>
                                        <div className={classes.value}>
                                            {priceUSD}
                                        </div>
                                    </div>
                                    {
                                        ['admin', 'управляющий'].includes(profile.role)?
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>
                                                    Себестоимость в долларах:&nbsp;
                                                </div>
                                                <div className={classes.value}>
                                                    {primeCostUSD}
                                                </div>
                                            </div>
                                            :
                                            null
                                    }
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Цена в сомах:&nbsp;
                                        </div>
                                        <div className={classes.value}>
                                            {priceKGS}
                                        </div>
                                    </div>
                                    {
                                        ['admin', 'управляющий'].includes(profile.role)?
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>
                                                    Себестоимость в сомах:&nbsp;
                                                </div>
                                                <div className={classes.value}>
                                                    {primeCostKGS}
                                                </div>
                                            </div>
                                            :
                                            null
                                    }
                                    {
                                        discount?
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>
                                                    Скидка:&nbsp;
                                                </div>
                                                <div className={classes.value}>
                                                    {discount} {typeDiscount}
                                                </div>
                                            </div>
                                            :
                                            null
                                    }
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Цена после скидки в сомах:&nbsp;
                                        </div>
                                        <div className={classes.value}>
                                            {priceAfterDiscountKGS}
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
                                    {
                                        size?
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>
                                                    Размер:&nbsp;
                                                </div>
                                                <div className={classes.value}>
                                                    {size}
                                                </div>
                                            </div>
                                            :
                                            null
                                    }
                                    {
                                        characteristics.length?
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>
                                                    Характеристики:&nbsp;
                                                </div>
                                                <div className={classes.value}>
                                                    {characteristics.map((element, idx)=><div className={classes.value} key={`characteristic${idx}`}>{element[0]} - {element[1]}</div>)}
                                                </div>
                                            </div>
                                            :
                                            null
                                    }
                                    {
                                        info?
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>
                                                    Комментарий:&nbsp;
                                                </div>
                                                <div className={classes.value}>
                                                    {info}
                                                </div>
                                            </div>
                                            :
                                            null
                                    }
                                    </>
                            }
                            <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD}>
                                {
                                    data.edit||data.add?
                                        <>
                                        {
                                            router.query.id!=='new'?
                                                <Link
                                                    href={{
                                                        pathname: '/storebalanceitems',
                                                        query: {item: router.query.id}
                                                    }}
                                                    as={
                                                        `/storebalanceitems?item=${router.query.id}`
                                                    }>
                                                    <Button color='primary'>
                                                        Баланс
                                                    </Button>
                                                </Link>
                                                :
                                                null
                                        }
                                        <Button color='primary' onClick={()=>{
                                            setMiniDialog('Рассчитать по курсу', <UsdToKgs priceUSD={priceUSD} primeCostUSD={primeCostUSD} setPriceKGS={setPriceKGS} setPrimeCostKGS={setPrimeCostKGS}/>)
                                            showMiniDialog(true)
                                        }}>
                                            Курс
                                        </Button>
                                        <Button color='primary' onClick={()=>{
                                            let res
                                            let checkCharacteristics = true
                                            for(let i = 0; i <characteristics.length; i++) {
                                                if(!characteristics[i][0]||!characteristics[i][1]) {
                                                    checkCharacteristics = false
                                                    break
                                                }
                                            }
                                            if (checkCharacteristics&&name&&!errorID&&priceUSD&&priceKGS&&unit) {
                                                const action = async() => {
                                                    if(router.query.id==='new') {
                                                        res = await addItem({
                                                            ID,
                                                            name,
                                                            art,
                                                            uploads,
                                                            priceUSD: checkFloat(priceUSD),
                                                            primeCostUSD: checkFloat(primeCostUSD),
                                                            priceKGS: checkFloat(priceKGS),
                                                            primeCostKGS: checkFloat(primeCostKGS),
                                                            discount: checkFloat(discount),
                                                            priceAfterDiscountKGS: checkFloat(priceAfterDiscountKGS),
                                                            info,
                                                            unit,
                                                            size,
                                                            typeDiscount,
                                                            characteristics,
                                                            category: category._id,
                                                            factory: factory._id
                                                        })
                                                        if(res!=='ERROR'&&res) {
                                                            unsaved.current = {}
                                                            showSnackBar('Успешно', 'success')
                                                            Router.push(`/item/${res}`)
                                                        }
                                                        else
                                                            showSnackBar('Ошибка', 'error')
                                                    }
                                                    else {
                                                        let element = {_id: router.query.id}
                                                        if (typeDiscount!==data.object.typeDiscount) element.typeDiscount = typeDiscount
                                                        if (ID!==data.object.ID) element.ID = ID
                                                        if (name!==data.object.name) element.name = name
                                                        if (art!==data.object.art) element.art = art
                                                        if (priceUSD!=data.object.priceUSD) element.priceUSD = checkFloat(priceUSD)
                                                        if (primeCostUSD!=data.object.primeCostUSD) element.primeCostUSD = checkFloat(primeCostUSD)
                                                        if (priceKGS!=data.object.priceKGS) element.priceKGS = checkFloat(priceKGS)
                                                        if (primeCostKGS!=data.object.primeCostKGS) element.primeCostKGS = checkFloat(primeCostKGS)
                                                        if (discount!=data.object.discount) element.discount = checkFloat(discount)
                                                        if (priceAfterDiscountKGS!=data.object.priceAfterDiscountKGS) element.priceAfterDiscountKGS = checkFloat(priceAfterDiscountKGS)
                                                        if (unit!==data.object.unit) element.unit = unit
                                                        if (size!==data.object.size) element.size = size
                                                        if (info!==data.object.info) element.info = info

                                                        if (JSON.stringify(characteristics)!==JSON.stringify(data.object.characteristics)) element.characteristics = characteristics

                                                        if (JSON.stringify(images)!==JSON.stringify(data.object.images)) element.images = images
                                                        if (uploads.length) element.uploads = uploads

                                                        if (category._id!==data.object.category._id) element.category = category._id
                                                        if (factory._id!==data.object.factory._id) element.factory = factory._id
                                                        res = await setItem(element)
                                                        if(res&&res!=='ERROR') {
                                                            showSnackBar('Успешно', 'success')
                                                            Router.reload()
                                                        }
                                                        else
                                                            showSnackBar('Ошибка', 'error')
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
                                            router.query.id!=='new'&&data.deleted?
                                                <Button color='secondary' onClick={()=>{
                                                    const action = async() => {
                                                        let res = await deleteItem(router.query.id)
                                                        if(res==='OK') {
                                                            showSnackBar('Успешно', 'success')
                                                            Router.push(`/items`)
                                                        }
                                                        else if(res==='USED')
                                                            showSnackBar('Объект используется')
                                                        else
                                                            showSnackBar('Ошибка', 'error')
                                                    }
                                                    setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                                    showMiniDialog(true)
                                                }}>
                                                    Удалить
                                                </Button>
                                                :
                                                null
                                        }
                                        </>
                                        :
                                        null
                                }
                            </div>
                            <input
                                ref={imageRef}
                                accept='image/*'
                                style={{ display: 'none' }}
                                id={'addCertificate'}
                                type='file'
                                onChange={handleChangeImage}
                            />
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
    if(!store.getState().user.authenticated)
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    return {
        data: {
            edit: store.getState().user.profile.edit&&['admin', 'завсклад',  'менеджер/завсклад'].includes(store.getState().user.profile.role),
            add: store.getState().user.profile.add&&['admin', 'завсклад',  'менеджер/завсклад'].includes(store.getState().user.profile.role),
            deleted: store.getState().user.profile.deleted&&['admin', 'завсклад',  'менеджер/завсклад'].includes(store.getState().user.profile.role),
            object:ctx.query.id!=='new'?
                await getItem({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
                :
                {
                    name: '',
                    art: '',
                    category: null,
                    ID: '',
                    images: [],
                    priceUSD: '',
                    primeCostUSD: '',
                    priceKGS: '',
                    primeCostKGS: '',
                    discount: '',
                    priceAfterDiscountKGS: 0,
                    info: '',
                    unit: 'шт',
                    size: '',
                    characteristics: [],
                    factory: null,
                    typeDiscount: '%'
                }
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
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Item);