import Head from 'next/head';
import React, {useState, useRef, useEffect} from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import pageListStyle from '../src/styleMUI/list'
import { urlMain } from '../src/const'
import initialApp from '../src/initialApp'
import Router from 'next/router'
import LazyLoad from 'react-lazyload';
import CardPlaceholder from '../components/CardPlaceholder'
import Button from '@mui/material/Button';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import * as snackbarActions from '../src/redux/actions/snackbar'
import Card from '@mui/material/Card';
import Buy from '../components/dialog/Buy'
import GetSale from '../components/dialog/GetSale'
import AddItem from '../components/dialog/AddItem'
import SetClient from '../components/dialog/SetClient'
import CardContent from '@mui/material/CardContent';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getConsignation } from '../src/gql/consignation'
import { getPrepayment } from '../src/gql/prepayment'
import { getItems } from '../src/gql/item'
import { inputFloat, checkFloat } from '../src/lib'
import { ndsTypes, nspTypes } from '../src/const'
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import { useRouter } from 'next/router'
import IconButton from '@mui/material/IconButton';
import {getWorkShifts} from '../src/gql/workShift'
import {getLegalObject} from '../src/gql/legalObject'
import {getCashbox} from '../src/gql/cashbox'
import { getClientGqlSsr } from '../src/apollo'
import { mainWindow } from '../layouts/App'
import Clear from '@mui/icons-material/Clear';
import InputAdornment from '@mui/material/InputAdornment';
import BarcodeScannerIcon from '../icons/barcode-scanner.svg';
import { openScanner } from '../src/lib';
import { wrapper } from '../src/redux/configureStore'

const types = ['Продажа', 'Возврат продажи', 'Погашение кредита', 'Аванс', 'Возврат аванса', 'Покупка', 'Возврат покупки']

const Selnew = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const { profile} = props.user;
    const { isMobileApp, legalObject} = props.app;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    const initialRender = useRef(true);
    const router = useRouter()
    let [client, setClient] = useState(undefined);
    let [sale, setSale] = useState(undefined);
    let [allAmount, setAllAmount] = useState(0);
    let [allNds, setAllNds] = useState(0);
    let [allNsp, setAllNsp] = useState(0);
    let [type, setType] = useState('Продажа');
    let [comment, setComment] = useState('');
    let [items, setItems] = useState([]);
    let handleType = async (event) => {
        setSale(undefined)
        setItems([])
        if('Возврат аванса'===event.target.value&&client) setPrepayment((await getPrepayment(client._id)).balance)
        else setPrepayment(0)
        if('Погашение кредита'===event.target.value&&client) setConsignation((await getConsignation(client._id)).debt)
        else setConsignation(0)
        setType(event.target.value)
    };
    let calculateAmountItem = (item) => {
        let allPrecent = 100+ndsTypes[item.ndsType]+nspTypes[item.nspType]
        item.amountStart = checkFloat(item.count*item.price)
        item.amountEnd = checkFloat(item.amountStart + (item.extraType==='%'?item.amountStart/100*item.extra:checkFloat(item.extra)) - (item.discountType==='%'?item.amountStart/100*item.discount:item.discount))
        item.nds = checkFloat(item.amountEnd/allPrecent*ndsTypes[item.ndsType])
        item.nsp = checkFloat(item.amountEnd/allPrecent*nspTypes[item.nspType])
    };
    let addItem = (item) => {
        if(item) {
            let search = false
            for(let i=0; i<items.length; i++) {
                if(items[i]._id===item._id){
                    items[i].count = checkFloat(checkFloat(items[i].count) + 1)
                    calculateAmountItem(items[i])
                    setItems([...items])
                    search = true
                    break
                }
            }
            if(!search) {
                let ndsType = legalObject.ndsType
                let nspType = legalObject.nspType
                let allPrecent = 100+ndsTypes[ndsType]+nspTypes[nspType]
                setItems([{
                    editedPrice: item.editedPrice,
                    _id: item._id,
                    name: item.name,
                    unit: item.unit,
                    count: 1,
                    price: item.price,
                    discount: '',
                    discountType: '%',
                    extra: '',
                    extraType: '%',
                    amountStart: item.price,
                    amountEnd: item.price,
                    nds: checkFloat(item.price / allPrecent * ndsTypes[ndsType]),
                    nsp: checkFloat(item.price / allPrecent * nspTypes[nspType]),
                    tnved: item.tnved,
                    mark: item.mark,
                    ndsType,
                    nspType
                }, ...items])
            }
            setInputValue('')
        }
    };
    const [inputValue, setInputValue] = React.useState('');
    const [prepayment, setPrepayment] = useState(0);
    const [usedPrepayment, setUsedPrepayment] = useState(0);
    const [consignation, setConsignation] = useState(0);
    let searchTimeOut = useRef(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    //setSaleUser
    useEffect(() => {
        if(!initialRender.current) {
            if(sale&&sale.client) {
                setClient(sale.client)
            }
        }
    }, [sale]);
    //calculateAmountAll
    useEffect(() => {
        if(initialRender.current) {
            initialRender.current = false;
        } else {
            allAmount = 0
            allNds = 0
            allNsp = 0
            for (let i = 0; i < items.length; i++) {
                allAmount += items[i].amountEnd
                allNds += items[i].nds
                allNsp += items[i].nsp
            }
            setAllAmount(checkFloat(allAmount))
            setAllNds(checkFloat(allNds))
            setAllNsp(checkFloat(allNsp))
            if(type==='Продажа')
                localStorage.items = JSON.stringify(items)
        }
    }, [items]);
    //getItems
    useEffect(() => {
        (async()=>{
            if (inputValue.length<3) {
                setElements(data.quickItems?data.quickItems:[]);
                if(open)
                    setOpen(false)
                if(loading)
                    setLoading(false)
            }
            else {
                if(!loading)
                    setLoading(true)
                if(searchTimeOut.current)
                    clearTimeout(searchTimeOut.current)
                searchTimeOut.current = setTimeout(async()=>{
                    setElements(await getItems({search: inputValue}))
                    if(!open)
                        setOpen(true)
                    setLoading(false)
                }, 500)

            }
        })()
    }, [inputValue]);
    const handleChange = event => {
        setInputValue(event.target.value);
    };
    let [elements, setElements] = useState(data.quickItems?data.quickItems:[]);
    //barCodeReader
    useEffect(() => {
        if(process.browser)
            (async()=>{
                if(localStorage.items)
                    items = JSON.parse(localStorage.items)
                else
                    items = []
                if(router.query.barcode&&localStorage.scancode!==router.query.scancode) {
                    let scanItems = await getItems({search: router.query.barcode})
                    if (scanItems.length){
                        let search = false
                        for(let i=0; i<items.length; i++) {
                            if(items[i]._id===scanItems[0]._id){
                                items[i].count = checkFloat(checkFloat(items[i].count) + 1)
                                calculateAmountItem(items[i])
                                items = [...items]
                                search = true
                            }
                        }
                        if(!search) {
                            let ndsType = legalObject.ndsType
                            let nspType = legalObject.nspType
                            let allPrecent = 100+ndsTypes[ndsType]+nspTypes[nspType]
                            items = [{
                                editedPrice: scanItems[0].editedPrice,
                                _id: scanItems[0]._id,
                                name: scanItems[0].name,
                                unit: scanItems[0].unit,
                                count: 1,
                                price: scanItems[0].price,
                                discount: '',
                                discountType: '%',
                                extra: '',
                                extraType: '%',
                                amountStart: scanItems[0].price,
                                amountEnd: scanItems[0].price,
                                nds: checkFloat(scanItems[0].price / allPrecent * ndsTypes[ndsType]),
                                nsp: checkFloat(scanItems[0].price / allPrecent * nspTypes[nspType]),
                                tnved: scanItems[0].tnved,
                                mark: scanItems[0].mark,
                                ndsType,
                                nspType
                            }, ...items]
                        }
                    }
                    else {
                        setMiniDialog('Товар вне списка', <AddItem _addItem={addItem} value={''} _barCode={router.query.barcode}/>)
                        showMiniDialog(true)
                    }
                    localStorage.scancode = router.query.scancode
                }
                setItems(items)
            })()
    }, [process.browser]);
    return (
        <App pageName={type}>
            <Head>
                <title>{type}</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content='Продажа' />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/selnew.js`} />
                <link rel='canonical' href={`${urlMain}/selnew.js`}/>
            </Head>
            <Card className={classes.page}>
                <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignItems: 'flex-start', maxWidth: 700}}>
                    <div className={classes.selectClient}>
                        {
                            client?
                                <>
                                <a href={`/client/${client._id}`} target='_blank'>
                                    {client.name}
                                </a>
                                <Clear style={{marginLeft: 10, cursor: 'pointer', color: 'red'}} onClick={()=>{setClient(undefined)}}/>
                                </>
                                :
                                <div onClick={()=>{
                                    setMiniDialog('Клиенты', <SetClient _setClient={setClient} dialogAddElement/>);
                                    showMiniDialog(true);
                                }}>
                                    Выбрать клиента
                                </div>
                        }
                    </div>
                    <div className={classes.row} style={{...mainWindow.current&&mainWindow.current.offsetWidth<350?{width: '100vw', marginLeft: -16}:{}, alignItems: 'unset'}}>
                        <FormControl className={classes.input}>
                            <InputLabel>Тип</InputLabel>
                            <Select variant='standard' value={type} onChange={handleType}>
                                {types.map((element)=>
                                    <MenuItem key={element} value={element}>{element}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                        <TextField variant='standard'
                            className={classes.input}
                            label={`Выберите ${type==='Возврат покупки'?'покупку':type==='Возврат аванса'?'аванс':type==='Возврат продажи'?'продажу':type==='Продажа'?'аванс':type==='Погашение кредита'?'кредит':'операцию'}`}
                            margin='normal'
                            value={sale?sale.number:''}
                            error={type.includes('Возврат')&&!sale}
                            inputProps = {{
                                readOnly: true
                            }}
                            InputProps={{
                                endAdornment:
                                    sale?
                                        <InputAdornment position='end'>
                                            <IconButton
                                                onClick={()=>{
                                                    setSale(undefined)
                                                    if(type!=='Продажа')
                                                        setItems([])
                                                    setUsedPrepayment(0)
                                                }}
                                            >
                                                <Clear/>
                                            </IconButton>
                                        </InputAdornment>
                                        :
                                        null
                            }}
                            onClick={()=>{
                                if(type.includes('Возврат')||type==='Продажа'||type==='Погашение кредита') {
                                    setMiniDialog(
                                        `Выберите ${type === 'Возврат покупки' ? 'покупку' : type === 'Возврат аванса' ? 'аванс' : type === 'Возврат продажи' ? 'продажу' : type === 'Продажа' ? 'аванс' : type === 'Погашение кредита' ? 'кредит' : 'операцию'}`,
                                        <GetSale
                                            type={type === 'Возврат покупки' ? 'Покупка' : type === 'Возврат аванса' ? 'Аванс' : type === 'Продажа' ? 'Аванс' : type === 'Погашение кредита' ? 'Кредит' : type}
                                            setSale={
                                                async (sale) => {
                                                    if (type === 'Продажа' || type === 'Возврат аванса') {
                                                        setUsedPrepayment(sale.paid)
                                                    }
                                                    else {
                                                        setItems(sale.items.map(item => {
                                                            return {
                                                                editedPrice: false,
                                                                _id: item._id,
                                                                name: item.name,
                                                                unit: item.unit,
                                                                count: item.count,
                                                                price: checkFloat(item.amountEnd / item.count),
                                                                discount: '',
                                                                discountType: '%',
                                                                extra: '',
                                                                extraType: '%',
                                                                amountStart: item.amountEnd,
                                                                amountEnd: item.amountEnd,
                                                                nds: item.nds,
                                                                nsp: item.nsp,
                                                                ndsType: item.ndsType,
                                                                nspType: item.nspType,
                                                                tnved: item.tnved,
                                                                mark: item.mark,
                                                            }
                                                        }))
                                                    }
                                                    setSale(sale)
                                                }
                                            }
                                        />
                                    )
                                    showMiniDialog(true);
                                }
                            }}
                        />
                    </div>
                    {
                        ['Продажа', 'Возврат продажи', 'Покупка', 'Возврат покупки'].includes(type)?
                            <>
                            {
                                ['Продажа', 'Покупка'].includes(type)?
                                    <div className={classes.row} style={{alignItems: 'center'}}>
                                        <Autocomplete
                                            onClose={()=>setOpen(false)}
                                            open={open}
                                            inputValue={inputValue}
                                            disableOpenOnFocus
                                            className={classes.input}
                                            options={elements}
                                            getOptionLabel={option => option.name}
                                            onChange={(event, newValue) => {
                                                if (typeof newValue === 'string') {
                                                    setTimeout(() => {
                                                        setMiniDialog('Товар вне списка', <AddItem _addItem={addItem} value={newValue}/>)
                                                        showMiniDialog(true)
                                                    });
                                                } else if (newValue && newValue.inputValue) {
                                                    setMiniDialog('Товар вне списка', <AddItem _addItem={addItem} value={newValue.inputValue}/>)
                                                    showMiniDialog(true)
                                                } else {
                                                    addItem(newValue)
                                                }
                                            }}
                                            filterOptions={(options, params) => {
                                                if (params.inputValue.length>2&&profile.add) {
                                                    options.push({
                                                        inputValue: params.inputValue,
                                                        name: `Добавить ${params.inputValue}`
                                                    });
                                                }
                                                return options;
                                            }}
                                            noOptionsText='Ничего не найдено'
                                            renderInput={params => (
                                                <TextField {...params} label='Добавить товар/услугу' variant='outlined' fullWidth
                                                           onChange={handleChange}
                                                           onClick={()=>{
                                                               if(data.quickItems&&data.quickItems.length&&!open)
                                                                   setOpen(true)
                                                           }}
                                                           InputProps={{
                                                               ...params.InputProps,
                                                               endAdornment: (
                                                                   <React.Fragment>
                                                                       {loading ? <CircularProgress color='inherit' size={20} /> : null}
                                                                       {params.InputProps.endAdornment}
                                                                   </React.Fragment>
                                                               ),
                                                           }}
                                                />
                                            )}
                                        />
                                        {
                                            isMobileApp&&type==='Продажа'?
                                                <IconButton aria-label='scanner' onClick={()=>{
                                                    openScanner({_idx: 0, path: 'salenew'})
                                                }}>
                                                    <BarcodeScannerIcon color='inherit'/>
                                                </IconButton>
                                                :
                                                null
                                        }
                                    </div>
                                    :
                                    null
                            }
                            {
                                sale&&'Продажа'===type?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Аванс операции:&nbsp;
                                        </div>
                                        <div className={classes.value}>
                                            {sale.amountEnd} сом
                                        </div>
                                    </div>
                                    :
                                    isMobileApp?
                                        <Divider/>
                                        :
                                        null
                            }
                            {
                                items.map((item, idx) => {
                                    return(
                                        <LazyLoad scrollContainer={'.App-body'} key={item._id} offset={[186, 0]} debounce={0} once={true}  placeholder={<CardPlaceholder/>}>
                                            <div className={classes.column}>
                                                <div className={classes.row} style={{alignItems: 'end'}}>
                                                    <div className={classes.nameBasket}>
                                                        {item.name}
                                                    </div>
                                                    <CloseIcon className={classes.closeNameBasket} onClick={() => {
                                                        items.splice(idx, 1)
                                                        setItems([...items])
                                                    }}/>
                                                </div>
                                                <div className={classes.row}>
                                                    <div className={classes.columnBasket} style={{width: '100%'}}>
                                                        <div className={classes.nameFieldBasket}>
                                                            Цена(сом)
                                                        </div>
                                                        {
                                                            item.editedPrice?
                                                                <input style={{width: 100, textAlign: 'left'}} type={isMobileApp?'number':'text'} className={classes.counternmbrBasket} value={item.price} onChange={(event) => {
                                                                    items[idx].price = inputFloat(event.target.value)
                                                                    calculateAmountItem(items[idx])
                                                                    setItems([...items])
                                                                }}/>
                                                                :
                                                                <div className={classes.valueFieldBasket} style={{width: '100%'}}>
                                                                    {item.price}
                                                                </div>

                                                        }
                                                    </div>
                                                    <div className={classes.columnBasket} style={{textAlign: 'center'}}>
                                                        <div className={classes.nameFieldBasket}>
                                                            Кол-во
                                                        </div>
                                                        <div className={classes.counterBasket}>
                                                            <div className={classes.counterbtnBasket} onClick={() => {
                                                                if(items[idx].count>1) {
                                                                    items[idx].count = checkFloat(items[idx].count - 1)
                                                                    calculateAmountItem(items[idx])
                                                                    setItems([...items])
                                                                }
                                                            }}>–</div>
                                                            <input
                                                                type={isMobileApp?'number':'text'}
                                                                className={classes.counternmbrBasket}
                                                                value={item.count}
                                                                onChange={(event) => {
                                                                    if(['Покупка', 'Продажа'].includes(type)) {
                                                                        items[idx].count = inputFloat(event.target.value)
                                                                        calculateAmountItem(items[idx])
                                                                        setItems([...items])
                                                                    }
                                                                }}
                                                                onFocus={()=>{
                                                                    items[idx].count = inputFloat('')
                                                                    calculateAmountItem(items[idx])
                                                                    setItems([...items])
                                                                }}
                                                            />
                                                            <div className={classes.counterbtnBasket} onClick={() => {
                                                                if(['Покупка', 'Продажа'].includes(type)||items[idx].count<sale.items[idx].count) {
                                                                    items[idx].count = checkFloat(checkFloat(items[idx].count) + 1)
                                                                    calculateAmountItem(items[idx])
                                                                    setItems([...items])
                                                                }
                                                            }}>+
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={classes.columnBasket} style={{width: '100%', textAlign: 'end'}}>
                                                        <div className={classes.nameFieldBasket}>
                                                            Сумма(сом)
                                                        </div>
                                                        <div className={classes.valueFieldBasket} style={{width: '100%', justifyContent: 'flex-end'}}>
                                                            {item.amountStart}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={classes.row}>
                                                    {
                                                        ['Продажа', 'Возврат продажи', 'Возврат покупки'].includes(type)?
                                                            <div className={classes.column}>
                                                                <div className={classes.showBasket} style={{color: item.discountShow||item.discount?'#10183D':'black', ...item.discountShow||item.discount?{margin: '5px 0 10px 0'}:{margin: '5px 0 5px 0'}, textAlign: 'start'}} onClick={()=>{
                                                                    items[idx].discountShow = !items[idx].discountShow
                                                                    setItems([...items])
                                                                }}>
                                                                    {'Продажа'===type?'Скидка':'Уценка'}
                                                                </div>
                                                                {
                                                                    item.discountShow||item.discount&&item.discount!=='0'?
                                                                        <div className={classes.row}>
                                                                            <div className={classes.counterBasket}>
                                                                                <div className={classes.counterbtnBasket} onClick={() => {
                                                                                    if(items[idx].discount>0) {
                                                                                        items[idx].discount = checkFloat(items[idx].discount - 1)
                                                                                        calculateAmountItem(items[idx])
                                                                                        setItems([...items])
                                                                                    }
                                                                                }}>–</div>
                                                                                <input
                                                                                    type={isMobileApp?'number':'text'}
                                                                                    className={classes.counternmbrBasket}
                                                                                    value={item.discount}
                                                                                    onChange={(event) => {
                                                                                        items[idx].discount = inputFloat(event.target.value)
                                                                                        calculateAmountItem(items[idx])
                                                                                        setItems([...items])
                                                                                    }}
                                                                                    onFocus={()=>{
                                                                                        items[idx].discount = inputFloat('')
                                                                                        calculateAmountItem(items[idx])
                                                                                        setItems([...items])
                                                                                    }}
                                                                                />
                                                                                <div className={classes.counterbtnBasket} onClick={() => {
                                                                                    items[idx].discount = checkFloat(checkFloat(items[idx].discount) + 1)
                                                                                    calculateAmountItem(items[idx])
                                                                                    setItems([...items])
                                                                                }}>+
                                                                                </div>
                                                                            </div>
                                                                            <div className={classes.typeShowBasket} onClick={()=>{
                                                                                items[idx].discountType = items[idx].discountType==='%'?'сом':'%'
                                                                                calculateAmountItem(items[idx])
                                                                                setItems([...items])
                                                                            }}>
                                                                                {item.discountType}
                                                                            </div>
                                                                        </div>
                                                                        :
                                                                        null
                                                                }
                                                            </div>
                                                            :
                                                            null
                                                    }
                                                    {
                                                        'Продажа'===type?
                                                            <div className={classes.column}>
                                                                <div className={classes.showBasket} style={{color: item.extraShow||item.extra&&item.extra!=='0'?'#10183D':'black', ...item.extraShow||item.extra?{margin: '5px 0 10px 0'}:{margin: '5px 0 5px 0'}, textAlign: 'end'}} onClick={()=>{
                                                                    items[idx].extraShow = !items[idx].extraShow
                                                                    setItems([...items])
                                                                }}>
                                                                    Наценка
                                                                </div>
                                                                {
                                                                    item.extraShow||item.extra&&item.extra!=='0'?
                                                                        <div className={classes.row} style={{justifyContent: 'flex-end'}}>
                                                                            <div className={classes.counterBasket}>
                                                                                <div className={classes.counterbtnBasket} onClick={() => {
                                                                                    if(items[idx].extra>0) {
                                                                                        items[idx].extra = checkFloat(items[idx].extra - 1)
                                                                                        calculateAmountItem(items[idx])
                                                                                        setItems([...items])
                                                                                    }
                                                                                }}>–</div>
                                                                                <input
                                                                                    type={isMobileApp?'number':'text'}
                                                                                    className={classes.counternmbrBasket}
                                                                                    value={item.extra}
                                                                                    onChange={(event) => {
                                                                                        items[idx].extra = inputFloat(event.target.value)
                                                                                        calculateAmountItem(items[idx])
                                                                                        setItems([...items])
                                                                                    }}
                                                                                    onFocus={()=>{
                                                                                        items[idx].extra = inputFloat('')
                                                                                        calculateAmountItem(items[idx])
                                                                                        setItems([...items])
                                                                                    }}
                                                                                />
                                                                                <div className={classes.counterbtnBasket} onClick={() => {
                                                                                    items[idx].extra = checkFloat(checkFloat(items[idx].extra) + 1)
                                                                                    calculateAmountItem(items[idx])
                                                                                    setItems([...items])
                                                                                }}>+
                                                                                </div>
                                                                            </div>
                                                                            <div className={classes.typeShowBasket} onClick={()=>{
                                                                                items[idx].extraType = items[idx].extraType==='%'?'сом':'%'
                                                                                calculateAmountItem(items[idx])
                                                                                setItems([...items])
                                                                            }}>
                                                                                {item.extraType}
                                                                            </div>
                                                                        </div>
                                                                        :
                                                                        null
                                                                }
                                                            </div>
                                                            :
                                                            null
                                                    }
                                                </div>
                                                {
                                                    item.amountEnd!==item.amountStart?
                                                        <>
                                                        <br/>
                                                        <div className={classes.row}>
                                                            <div className={classes.nameFieldBasket}>
                                                                Итого:&nbsp;
                                                            </div>
                                                            <div className={classes.valueFieldBasket}>
                                                                {item.amountEnd} сом
                                                            </div>
                                                        </div>
                                                        </>
                                                        :
                                                        <br/>
                                                }
                                                <Divider/>
                                                <br/>
                                            </div>
                                        </LazyLoad>
                                    )
                                })
                            }
                            </>
                            :
                            ['Аванс', 'Погашение кредита', 'Возврат аванса'].includes(type)?
                                <>
                                {
                                    type==='Погашение кредита'&&client?
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                Кредит клиента:&nbsp;
                                            </div>
                                            <div className={classes.value}>
                                                {consignation}
                                            </div>
                                        </div>
                                        :
                                        null
                                }
                                {
                                    type==='Погашение кредита'&&sale?
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                Кредит операции:&nbsp;
                                            </div>
                                            <div className={classes.value}>
                                                {sale.amountEnd - sale.paid}
                                            </div>
                                        </div>
                                        :
                                        null
                                }
                                {
                                    type==='Возврат аванса'&&client?
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                Аванс клиента:&nbsp;
                                            </div>
                                            <div className={classes.value}>
                                                {prepayment}
                                            </div>
                                        </div>
                                        :
                                        null
                                }
                                {
                                    type==='Возврат аванса'&&usedPrepayment?
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                Аванс операции:&nbsp;
                                            </div>
                                            <div className={classes.value}>
                                                {usedPrepayment}
                                            </div>
                                        </div>
                                        :
                                        null
                                }
                                {
                                    ['Аванс','Возврат аванса'].includes(type)?
                                        <TextField variant='standard'
                                            label='Обоснование (не обязательно)'
                                            value={comment}
                                            className={classes.input}
                                            onChange={(event)=>{
                                                setComment(event.target.value)
                                            }}
                                        />
                                        :
                                        null
                                }
                                <TextField variant='standard'
                                    type={isMobileApp?'number':'text'}
                                    label='Сумма'
                                    value={allAmount?allAmount:''}
                                    onFocus={()=>setAllAmount('')}
                                    className={classes.input}
                                    onChange={(event)=>{
                                        setAllAmount(inputFloat(event.target.value))
                                    }}
                                />
                                </>
                                :
                                null
                    }
                    <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD}>
                        <div className={classes.row}>
                            <div className={classes.nameFieldBasket} style={{margin: 0}}>
                                Итого:&nbsp;
                            </div>
                            <div className={classes.valueFieldBasket}>
                                {allAmount?allAmount:0} сом
                            </div>
                        </div>
                        <Button color='primary' onClick={async ()=>{
                            if('Возврат аванса'===type&&allAmount>usedPrepayment)
                                showSnackBar('Сумма слишком велика')
                            else {
                                if (allAmount > 0) {
                                    if (!type.includes('Возврат') || sale) {
                                        if (['Аванс', 'Погашение кредита', 'Возврат аванса'].includes(type)) {
                                            allAmount = checkFloat(allAmount)
                                            items = [{
                                                name: comment.length ? comment : type,
                                                unit: 'шт',
                                                count: 1,
                                                price: allAmount,
                                                amountStart: allAmount,
                                                discount: '',
                                                discountType: '%',
                                                extra: '',
                                                extraType: '%',
                                                amountEnd: allAmount,
                                                nds: 0,
                                                nsp: 0
                                            }]
                                        }
                                        else if(['Продажа', 'Покупка'].includes(type)&&!items.length){
                                            allAmount = checkFloat(allAmount)

                                            let ndsType = legalObject.ndsType
                                            let nspType = legalObject.nspType
                                            let allPrecent = 100+ndsTypes[ndsType]+nspTypes[nspType]
                                            allNds = checkFloat(allAmount / allPrecent * ndsTypes[ndsType])
                                            allNsp = checkFloat(allAmount / allPrecent * nspTypes[nspType])

                                            items = [{
                                                name: comment.length ? comment : '',
                                                unit: 'шт',
                                                count: 1,
                                                price: allAmount,
                                                amountStart: allAmount,
                                                discount: '',
                                                discountType: '%',
                                                extra: '',
                                                extraType: '%',
                                                amountEnd: allAmount,
                                                nds: allNds,
                                                nsp: allNsp,
                                                ndsType,
                                                nspType
                                            }]
                                        }
                                        let consignation = 0
                                        if (sale && sale.type === 'Кредит' && type === 'Возврат продажи')
                                            consignation = checkFloat(sale.amountEnd - sale.paid)
                                        let cashbox
                                        if (['Покупка', 'Возврат аванса', 'Возврат продажи'].includes(type))
                                            cashbox = await getCashbox({_id: data.cashbox})
                                        setMiniDialog('Оплата', <Buy sale={sale}
                                                                     _setComment={setComment}
                                                                     ndsPrecent={ndsTypes[legalObject.ndsType]}
                                                                     nspPrecent={nspTypes[legalObject.nspType]}
                                                                     amountStart={allAmount}
                                                                     client={client}
                                                                     items={items} setType={setType}
                                                                     allNsp={allNsp} allNds={allNds} type={type}
                                                                     consignation={consignation}
                                                                     setItems={setItems} setSale={setSale}
                                                                     cashbox={cashbox} setClient={setClient}
                                                                     usedPrepayment={usedPrepayment}/>)
                                        showMiniDialog(true)

                                    }
                                    else
                                        showSnackBar('Укажите операцию')
                                }
                                else
                                    showSnackBar('Сумма слишко мала')
                            }
                        }}>
                            Оплатить
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </App>
    )
})

Selnew.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(store.getState().user.profile.role!=='кассир')
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        }
        else {
            Router.push('/')
        }

    let workShifts = await getWorkShifts({filter: 'active'}, ctx.req ? await getClientGqlSsr(ctx.req) : undefined)
    if(!workShifts.length||((new Date()-workShifts[0].start)/1000/60/60)>24) {
        if (ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        }
        else {
            Router.push('/')
        }
    }

    store.getState().app.legalObject = await getLegalObject({_id: store.getState().user.profile.legalObject}, ctx.req?await getClientGqlSsr(ctx.req):undefined)

    let quickItems = await getItems({quick: true}, ctx.req?await getClientGqlSsr(ctx.req):undefined)

    return {
        data: {
            quickItems,
            cashbox: workShifts[0].cashbox._id,

        }
    };
})

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Selnew);