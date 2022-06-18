import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React, {useRef, useState, useEffect} from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import {getSale} from '../../src/gql/sale'
import saleStyle from '../../src/styleMUI/list'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import * as appActions from '../../src/redux/actions/app'
import { useRouter } from 'next/router'
//import Router from 'next/router'
import { urlMain } from '../../src/const'
import { getClientGqlSsr } from '../../src/apollo'
import {checkFloat, pdDDMMYYHHMM} from '../../src/lib'
import { connectPrinterByBluetooth, printEsPosData } from '../../src/printer'
import Button from '@mui/material/Button';
import dynamic from 'next/dynamic'
const Pdf = dynamic(import('react-to-pdf'), { ssr: false });
import SyncOn from '@mui/icons-material/Sync';
import SyncOff from '@mui/icons-material/SyncDisabled';
import ViewText from '../../components/dialog/ViewText';
import SendText from '../../components/dialog/SendText';
import QRShare from '../../components/dialog/QRShare';
import Link from 'next/link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as snackbarActions from '../../src/redux/actions/snackbar'
import { wrapper } from '../../src/redux/configureStore'

const Receipt = React.memo((props) => {
    const {classes} = saleStyle();
    const { data } = props;
    const { isMobileApp, printer } = props.app;
    const { profile } = props.user;
    const { setPrinter } = props.appActions;
    const router = useRouter()
    const { showSnackBar } = props.snackbarActions;
    const receiptRef = useRef(null);
    let [readyPrint, setReadyPrint] = useState(data.list);
    useEffect(() => {
        setReadyPrint(process.browser&&receiptRef.current&&data.object)
    }, [process.browser, receiptRef.current]);
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const [anchorElQuick, setAnchorElQuick] = useState(null);
    const openQuick = Boolean(anchorElQuick);
    let handleMenuQuick = (event) => {
        setAnchorElQuick(event.currentTarget);
    }
    let handleCloseQuick = () => {
        setAnchorElQuick(null);
    }
    return (
        <App pageName={data.object!==null?`Чек №${data.object.number}`:'Ничего не найдено'}>
            <Head>
                <title>{data.object!==null?`Чек №${data.object.number}`:'Ничего не найдено'}</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content={data.object!==null?`Чек №${data.object.number}`:'Ничего не найдено'} />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/sale/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/sale/${router.query.id}`}/>
            </Head>
            {
                ['admin', 'superadmin', 'оператор'].includes(profile.role)&&data.object&&data.object._id?
                    <div className={classes.status}>
                        {
                            data.object.sync?
                                <SyncOn color={data.object.syncMsg==='Фискальный режим отключен'?'secondary':'primary'} onClick={async()=>{
                                    if(profile.statistic) {
                                        setMiniDialog('Синхронизация', <ViewText text={data.object.syncMsg}/>)
                                        showMiniDialog(true)
                                    }
                                }} className={classes.sync}/>
                                :
                                <SyncOff color='secondary' onClick={async()=>{
                                    if(profile.statistic) {
                                        setMiniDialog('Синхронизация', <ViewText text={data.object.syncMsg}/>)
                                        showMiniDialog(true)
                                    }
                                }} className={classes.sync}/>
                        }
                    </div>
                    :
                    null
            }
            {
                data.object!==null?
                    <>
                    <center style={{width: '100%'}}>
                        <div style={{
                            border: '1px black solid',
                            width: 323,
                            fontSize: 14,
                            padding: 10,
                            background: 'white',
                            marginTop: 20
                        }} ref={receiptRef}>
                            {
                                ['admin', 'superadmin'].includes(profile.role)?
                                    <Link href='/legalobject/[id]' as={`/legalobject/${data.object.legalObject._id}`}>
                                        <a>
                                            <h3 style={{textAlign: 'center', marginBottom: 10, marginTop: 10}}>{data.object.legalObject.name}</h3>
                                        </a>
                                    </Link>
                                    :
                                    <h3 style={{textAlign: 'center', marginBottom: 10, marginTop: 10}}>{data.object.legalObject.name}</h3>
                            }
                            {
                                ['admin', 'superadmin', 'управляющий', 'супервайзер', 'оператор'].includes(profile.role)?
                                    <Link href='/branch/[id]' as={`/branch/${data.object.branch._id}`}>
                                        <a>
                                            <div style={{textAlign: 'center', marginBottom: 5}}><span style={{fontWeight: 400}}>{data.object.branch.name}, {data.object.branch.address}</span></div>
                                        </a>
                                    </Link>
                                    :
                                    <div style={{textAlign: 'center', marginBottom: 5}}><span style={{fontWeight: 400}}>{data.object.branch.name}, {data.object.branch.address}</span></div>
                            }
                            <div style={{textAlign: 'left', marginBottom: 5}}><span style={{fontWeight: 400}}>Дата: {pdDDMMYYHHMM(data.object.createdAt)}</span></div>
                            <div style={{textAlign: 'left', marginBottom: 5}}><span style={{fontWeight: 400}}>Операция: {data.object.type}</span></div>
                            <div style={{textAlign: 'left', marginBottom: 5}}><span style={{fontWeight: 400}}>ЧЕК №{data.object.number}</span></div>
                            {
                                data.object.sale?
                                    profile.role?
                                        <Link href='/sale/[id]' as={`/sale/${data.object.sale._id}`}>
                                            <a>
                                                <div style={{textAlign: 'left', marginBottom: 5}}><span style={{fontWeight: 400}}>ЧЕК ОСНОВАНИЯ №{data.object.sale.number}</span></div>
                                            </a>
                                        </Link>
                                        :
                                        <div style={{textAlign: 'left', marginBottom: 5}}><span style={{fontWeight: 400}}>ЧЕК ОСНОВАНИЯ №{data.object.sale.number}</span></div>
                                    :
                                    null
                            }
                            <div style={{textAlign: 'left', marginBottom: 5}}><span style={{fontWeight: 400}}>ИНН: {data.object.legalObject.inn}</span></div>
                            <div style={{textAlign: 'left', marginBottom: 5}}><span style={{fontWeight: 400}}>НР: {data.object.legalObject.rateTaxe}</span></div>
                            {
                                ['admin', 'superadmin', 'управляющий', 'супервайзер', 'оператор'].includes(profile.role)?
                                    <Link href='/cashbox/[id]' as={`/cashbox/${data.object.cashbox._id}`}>
                                        <a>
                                            <div style={{textAlign: 'left', marginBottom: 5}}><span style={{fontWeight: 400}}>РНМ: {data.object.cashbox.rnmNumber}</span></div>
                                        </a>
                                    </Link>
                                    :
                                    <div style={{textAlign: 'left', marginBottom: 5}}><span style={{fontWeight: 400}}>РНМ: {data.object.cashbox.rnmNumber}</span></div>
                            }
                            {
                                ['admin', 'superadmin', 'управляющий', 'супервайзер', 'оператор'].includes(profile.role)?
                                    <Link href='/workshift/[id]' as={`/workshift/${data.object.workShift._id}`}>
                                        <a>
                                            <div style={{textAlign: 'left', marginBottom: 5}}><span style={{fontWeight: 400}}>Смена №{data.object.workShift.number}</span></div>
                                        </a>
                                    </Link>
                                    :
                                    <div style={{textAlign: 'left', marginBottom: 5}}><span style={{fontWeight: 400}}>Смена №{data.object.workShift.number}</span></div>
                            }
                            {
                                ['admin', 'superadmin', 'управляющий', 'супервайзер', 'оператор'].includes(profile.role)?
                                    <Link href='/user/[id]' as={`/user/${data.object.cashier._id}`}>
                                        <a>
                                            <div style={{textAlign: 'left', marginBottom: 5}}><span style={{fontWeight: 400}}>Кассир: {data.object.cashier.name}</span></div>
                                        </a>
                                    </Link>
                                    :
                                    <div style={{textAlign: 'left', marginBottom: 5}}><span style={{fontWeight: 400}}>Кассир: {data.object.cashier.name}</span></div>
                            }
                            {
                                data.object.client?
                                    profile.role?
                                        <Link href='/client/[id]' as={`/client/${data.object.client._id}`}>
                                            <a>
                                                <div style={{textAlign: 'left', marginBottom: 5}}><span style={{fontWeight: 400}}>Покупатель: {data.object.client.name}</span></div>
                                            </a>
                                        </Link>
                                        :
                                        <div style={{textAlign: 'left', marginBottom: 5}}><span style={{fontWeight: 400}}>Покупатель: {data.object.client.name}</span></div>
                                    :
                                    null
                            }
                            <div style={{textAlign: 'center', height: 12, marginTop: 10, marginBottom: 10}}>**********************************************</div>
                            {data.object.items?data.object.items.map((item, idx)=>
                                <div key={`item${idx}`} className={classes.column}>
                                    <div style={{textAlign: 'left', marginBottom: 5}}>{item.name}{item.mark?' | M':''}{item.tnved?` | ${item.tnved}`:''}</div>
                                    <div style={{textAlign: 'right', marginBottom: 5}}>{item.price} * {item.count} {item.unit} = {item.amountStart}</div>
                                    {
                                        item.discount||item.extra?
                                            <>
                                            {
                                                item.discount?
                                                    <div style={{textAlign: 'right', marginBottom: 5}}>{'Продажа'===data.object.type?'Скидка':'Уценка'}: {item.discount}</div>
                                                    :
                                                    null
                                            }
                                            {
                                                item.extra?
                                                    <div style={{textAlign: 'right', marginBottom: 5}}>Наценка: {item.extra}</div>
                                                    :
                                                    null
                                            }
                                            <div style={{textAlign: 'right', marginBottom: 5}}>Итого: {item.amountEnd}</div>
                                            </>
                                            :
                                            null
                                    }
                                </div>
                            ):null}
                            <div style={{textAlign: 'center', height: 12, marginTop: 10, marginBottom: 10}}>**********************************************</div>
                            {
                                data.object.discount?
                                    <div style={{textAlign: 'right', marginBottom: 5}}>{'Продажа'===data.object.type?'Скидка':'Уценка'}: {data.object.discount}</div>
                                    :
                                    null
                            }
                            {
                                data.object.extra?
                                    <div style={{textAlign: 'right', marginBottom: 5}}>Наценка: {data.object.extra}</div>
                                    :
                                    null
                            }
                            <div style={{textAlign: 'right', marginBottom: 5}}>НДС{data.object.ndsPrecent?` ${data.object.ndsPrecent}%`:''}: {data.object.nds}</div>
                            <div style={{textAlign: 'right', marginBottom: 5}}>НСП{data.object.nspPrecent?` ${data.object.nspPrecent}%`:''}: {data.object.nsp}</div>
                            <div style={{textAlign: 'right', marginBottom: 5, fontWeight: 'bold'}}>ИТОГО: {data.object.amountEnd}</div>
                            <div style={{textAlign: 'right', marginBottom: 5}}>{data.object.type==='Возврат'?'Наличными':data.object.typePayment}: {data.object.paid}</div>
                            {
                                data.object.usedPrepayment?
                                    <div style={{textAlign: 'right', marginBottom: 5}}>Авансом: {data.object.usedPrepayment}</div>
                                    :
                                    null
                            }
                            {
                                data.object.type==='Кредит'||data.object.type==='Возврат'&&data.object.paid<data.object.amountEnd?
                                    <div style={{textAlign: 'right', marginBottom: 5}}>Кредитом: {checkFloat(data.object.amountEnd-data.object.paid)}</div>
                                    :
                                    null
                            }
                            <div style={{textAlign: 'right', marginBottom: 5}}>Сдача: {data.object.change}</div>
                            {
                                data.object.comment?
                                    <div style={{textAlign: 'right', marginBottom: 5}}>Комментарий: {data.object.comment}</div>
                                    :
                                    null
                            }
                            {
                                data.object.syncMsg!=='Фискальный режим отключен'?
                                    <p style={{textAlign: 'center'}}><span style={{fontWeight: 400}}>*********************ФП*********************</span></p>
                                    :
                                    null
                            }
                            <p style={{textAlign: 'center'}}><span style={{fontWeight: 400}}>ККМ SALYK.STORE v1.0</span></p>
                            {
                                data.object.qr?
                                    <>
                                    <div style={{display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                                        <img width={170} height={170} src={data.object.qr} />
                                    </div>
                                    <p style={{textAlign: 'center'}}>Информационный портал ГНС:<br/>kkm.salyk.kg</p>
                                    </>
                                    :
                                    null
                            }
                        </div>
                    </center>
                    {
                        readyPrint?
                            <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD}>
                                {
                                    profile.role?
                                        <>
                                        <Button color='primary' onClick={async ()=>{
                                            if(isMobileApp&&navigator.bluetooth){
                                                let _printer = printer
                                                if(!_printer) {
                                                    _printer = await connectPrinterByBluetooth()
                                                    setPrinter(_printer)
                                                }

                                                let _data = [
                                                    {message: data.object.legalObject.name, align: 'center'},
                                                    {message: `${data.object.branch.name}, ${data.object.branch.address}`, align: 'center'},
                                                    {message: `Дата: ${pdDDMMYYHHMM(data.object.createdAt)}`, align: 'left'},
                                                    {message: `Операция: ${data.object.type}`, align: 'left'},
                                                    {message: `ЧЕК №${data.object.number}`, align: 'left'},
                                                    ...data.object.sale?[{message: `ЧЕК ОСНОВАНИЯ №${data.object.sale.number}`, align: 'left'}]:[],
                                                    {message: `ИНН: ${data.object.legalObject.inn}`, align: 'left'},
                                                    {message: `НР: ${data.object.legalObject.rateTaxe}`, align: 'left'},
                                                    {message: `РНМ: ${data.object.cashbox.rnmNumber}`, align: 'left'},
                                                    {message: `Смена №${data.object.workShift.number}`, align: 'left'},
                                                    {message: `Кассир: ${data.object.cashier.name}`, align: 'left'},
                                                    ...data.object.client?[{message: `Покупатель: ${data.object.client.number}`, align: 'left'}]:[],
                                                    {message: '********************************', align: 'center'},
                                                ]
                                                for(let i=0; i<data.object.items.length; i++) {
                                                    _data.push({message: `${data.object.items[i].name}${data.object.items[i].mark?' | M':''}${data.object.items[i].tnved?` | ${data.object.items[i].tnved}`:''}`, align: 'left'})
                                                    _data.push({message: `${data.object.items[i].price} * ${data.object.items[i].count} ${data.object.items[i].unit} = ${data.object.items[i].amountStart}`, align: 'right'})
                                                    if(data.object.items[i].discount||data.object.items[i].extra){
                                                        if(data.object.items[i].discount)
                                                            _data.push({message: `${'Продажа'===data.object.type?'Скидка':'Уценка'}: ${data.object.items[i].discount}`, align: 'right'})
                                                        if(data.object.items[i].extra)
                                                            _data.push({message: `Наценка: ${data.object.items[i].extra}`, align: 'right'})
                                                        _data.push({message: `Итого: ${data.object.items[i].amountEnd}`, align: 'right'})
                                                    }
                                                }
                                                _data.push({message: '********************************', align: 'center'})
                                                if(data.object.discount)
                                                    _data.push({message: `${'Продажа'===data.object.type?'Скидка':'Уценка'}: ${data.object.discount}`, align: 'right'})
                                                if(data.object.extra)
                                                    _data.push({message: `Наценка: ${data.object.extra}`, align: 'right'})
                                                _data.push({message: `НДС${data.object.ndsPrecent?` ${data.object.ndsPrecent}%`:''}: ${data.object.nds}`, align: 'right'})
                                                _data.push({message: `НСП${data.object.nspPrecent?` ${data.object.nspPrecent}%`:''}: ${data.object.nsp}`, align: 'right'})
                                                _data.push({message: `ИТОГО: ${data.object.amountEnd}`, align: 'right', bold: true})
                                                _data.push({message: `${data.object.type==='Возврат'?'Наличными':data.object.typePayment}: ${data.object.paid}`, align: 'right'})
                                                if(data.object.usedPrepayment)
                                                    _data.push({message: `Авансом: ${data.object.usedPrepayment}`, align: 'right'})
                                                if(data.object.type==='Кредит'||data.object.type==='Возврат'&&data.object.paid<data.object.amountEnd)
                                                    _data.push({message: `Кредитом: ${checkFloat(data.object.amountEnd-data.object.paid)}`, align: 'right'})
                                                _data.push({message: `Сдача: ${data.object.change}`, align: 'right'})
                                                if(data.object.comment)
                                                    _data.push({message: `Комментарий: ${data.object.comment}`, align: 'right'})
                                                if(data.object.syncMsg!=='Фискальный режим отключен')
                                                    _data.push({message: '***************ФП***************', align: 'center', bold: true})
                                                _data.push({message: 'ККМ SALYK.STORE v1.0', align: 'center', bold: true})

                                                _data.push({image: data.object.qr})
                                                _data.push({message: 'Информационный портал ГНС:', align: 'center'})
                                                _data.push({message: 'kkm.salyk.kg', align: 'center'})

                                                await printEsPosData(_printer, _data)
                                            }
                                            else {
                                                let printContents = receiptRef.current.innerHTML;
                                                let printWindow = window.open();
                                                printWindow.document.write(printContents);
                                                printWindow.document.write(`<script type="text/javascript">window.onload = function() { window.print(); window.close()};</script>`);
                                                printWindow.document.close();
                                                printWindow.focus();
                                            }
                                        }}>Печать</Button>
                                        <Pdf targetRef={receiptRef} filename={`Чек №${data.object.number}`}
                                             options = {{
                                                 format: [receiptRef.current.offsetHeight*0.8, receiptRef.current.offsetWidth*0.75]
                                             }}>
                                            {({ toPdf }) => <Button color='primary' onClick={toPdf}>Скачать</Button>}
                                        </Pdf>
                                        <Menu
                                            key='Quick'
                                            id='menu-appbar'
                                            anchorEl={anchorElQuick}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                            }}
                                            transformOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                            }}
                                            open={openQuick}
                                            onClose={handleCloseQuick}
                                        >
                                            <MenuItem onClick={async()=>{
                                                setMiniDialog('Поделиться QR', <QRShare value={`${urlMain}/sale/${router.query.id}`}/>)
                                                showMiniDialog(true)
                                                handleCloseQuick()
                                            }}>
                                                QR
                                            </MenuItem>
                                            <MenuItem onClick={async()=>{
                                                setMiniDialog('Отправить на WhatsApp', <SendText type='whatsapp' text={`${urlMain}/sale/${router.query.id}`}/>)
                                                showMiniDialog(true)
                                                handleCloseQuick()
                                            }}>
                                                WhatsApp
                                            </MenuItem>
                                            <MenuItem onClick={async()=>{
                                                setMiniDialog('Отправить по почте', <SendText type='mail' title={`Чек №${data.object.number}`} text={`${urlMain}/sale/${router.query.id}`}/>)
                                                showMiniDialog(true)
                                                handleCloseQuick()
                                            }}>
                                                Почта
                                            </MenuItem>
                                            {
                                                navigator.share&&isMobileApp?
                                                    <MenuItem onClick={async()=>{
                                                        await navigator.share({
                                                            url: `${urlMain}/sale/${router.query.id}`,
                                                        })
                                                        handleCloseQuick()
                                                    }}>
                                                        Поделиться
                                                    </MenuItem>
                                                    :
                                                    null
                                            }
                                            {
                                                navigator.clipboard?
                                                    <MenuItem onClick={async()=>{
                                                        await navigator.clipboard.writeText(`${urlMain}/sale/${router.query.id}`)
                                                        handleCloseQuick()
                                                        showSnackBar('Ссылка скопирована', 'success')
                                                    }}>
                                                        Копировать
                                                    </MenuItem>
                                                    :
                                                    null
                                            }
                                        </Menu>
                                        <Button onClick={handleMenuQuick} color='primary'>
                                            Отправить
                                        </Button>
                                        </>
                                        :
                                        <Pdf targetRef={receiptRef} filename={`Чек №${data.object.number}`}
                                             options = {{
                                                 format: [receiptRef.current.offsetHeight*0.8, receiptRef.current.offsetWidth*0.75]
                                             }}>
                                            {({ toPdf }) => <Button color='primary' onClick={toPdf}>Скачать</Button>}
                                        </Pdf>
                                }
                            </div>
                            :
                            null
                    }
                    </>
                    :
                    null
            }
        </App>
    )
})

Receipt.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    /*if(!['admin', 'superadmin', 'управляющий', 'кассир', 'супервайзер'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')*/
    let object = await getSale({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
    return {
        data: {
            object
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
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Receipt);