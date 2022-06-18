import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React, {useRef, useState, useEffect} from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import {getReport} from '../../src/gql/report'
import reportStyle from '../../src/styleMUI/list'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import * as appActions from '../../src/redux/actions/app'
import { useRouter } from 'next/router'
import Router from 'next/router'
import { urlMain } from '../../src/const'
import { getClientGqlSsr } from '../../src/apollo'
import { checkFloat, pdDDMMYYHHMM } from '../../src/lib'
import Button from '@mui/material/Button';
import { connectPrinterByBluetooth, printEsPosData } from '../../src/printer'
import dynamic from 'next/dynamic'
import SyncOn from '@mui/icons-material/Sync';
import SyncOff from '@mui/icons-material/SyncDisabled';
import ViewText from '../../components/dialog/ViewText';
const Pdf = dynamic(import('react-to-pdf'), { ssr: false });
import Link from 'next/link';
import { wrapper } from '../../src/redux/configureStore'

const Receipt = React.memo((props) => {
    const {classes} = reportStyle();
    const { data } = props;
    const { isMobileApp, printer } = props.app;
    const { profile } = props.user;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { setPrinter } = props.appActions;
    const router = useRouter()
    const receiptRef = useRef(null);
    let [readyPrint, setReadyPrint] = useState(data.list);
    useEffect(() => {
        setReadyPrint(process.browser&&receiptRef.current&&data.object)
    }, [process.browser, receiptRef.current]);
    return (
        <App pageName={data.object!==null?`${data.object.type}-Отчет №${data.object.number}`:'Ничего не найдено'}>
            <Head>
                <title>{data.object!==null?`${data.object.type}-Отчет №${data.object.number}`:'Ничего не найдено'}</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content={data.object!==null?`${data.object.type}-Отчет №${data.object.number}`:'Ничего не найдено'} />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/report/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/report/${router.query.id}`}/>
            </Head>
            {
                ['admin', 'superadmin', 'оператор'].includes(profile.role)&&data.object&&data.object._id&&data.object.type==='Z'?
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
                                data.object.branch?
                                    ['admin', 'superadmin', 'управляющий', 'супервайзер', 'оператор'].includes(profile.role)?
                                        <Link href='/branch/[id]' as={`/branch/${data.object.branch._id}`}>
                                            <a>
                                                <div style={{textAlign: 'center', marginBottom: 5}}><span style={{fontWeight: 400}}>{data.object.branch.name}, {data.object.branch.address}</span></div>
                                            </a>
                                        </Link>
                                        :
                                        <div style={{textAlign: 'center', marginBottom: 5}}><span style={{fontWeight: 400}}>{data.object.branch.name}, {data.object.branch.address}</span></div>
                                    :
                                    null
                            }
                            <div style={{textAlign: 'left', marginBottom: 5}}><span style={{fontWeight: 400}}>Дата: {`${pdDDMMYYHHMM(data.object.start)}${data.object.end?` - ${pdDDMMYYHHMM(data.object.end)}`:''}`}</span></div>
                            <div style={{textAlign: 'left', marginBottom: 5}}><span style={{fontWeight: 400}}>{`${data.object.type}-Отчет №${data.object.number}`}</span></div>
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
                                ['admin', 'superadmin', 'управляющий'].includes(profile.role)?
                                    <>
                                    <div style={{textAlign: 'center', height: 12, marginTop: 10, marginBottom: 10}}>**********************************************</div>
                                    <div style={{textAlign: 'center', marginBottom: 5, fontWeight: 'bold'}}>Необнул. сумма на начало</div>
                                    <div style={{textAlign: 'left', marginBottom: 5, fontWeight: 500}}>&nbsp;&nbsp;Продажа</div>
                                    <div style={{textAlign: 'right', marginBottom: 5}}>Сумма: {checkFloat(data.object.saleAll-data.object.sale)}</div>
                                    <div style={{textAlign: 'left', marginBottom: 5, fontWeight: 500}}>&nbsp;&nbsp;Возврат</div>
                                    <div style={{textAlign: 'right', marginBottom: 5}}>Сумма: {checkFloat(data.object.returnedAll-data.object.returned)}</div>
                                    <div style={{textAlign: 'left', marginBottom: 5, fontWeight: 500}}>&nbsp;&nbsp;Кредит</div>
                                    <div style={{textAlign: 'right', marginBottom: 5}}>Сумма: {checkFloat(data.object.consignationAll-data.object.consignation)}</div>
                                    <div style={{textAlign: 'left', marginBottom: 5, fontWeight: 500}}>&nbsp;&nbsp;Погашение кредита</div>
                                    <div style={{textAlign: 'right', marginBottom: 5}}>Сумма: {checkFloat(data.object.paidConsignationAll-data.object.paidConsignation)}</div>
                                    <div style={{textAlign: 'left', marginBottom: 5, fontWeight: 500}}>&nbsp;&nbsp;Аванс</div>
                                    <div style={{textAlign: 'right', marginBottom: 5}}>Сумма: {checkFloat(data.object.prepaymentAll-data.object.prepayment)}</div>
                                    <div style={{textAlign: 'left', marginBottom: 5, fontWeight: 500}}>&nbsp;&nbsp;Покупка</div>
                                    <div style={{textAlign: 'right', marginBottom: 5}}>Сумма: {checkFloat(data.object.buyAll-data.object.buy)}</div>
                                    <div style={{textAlign: 'left', marginBottom: 5, fontWeight: 500}}>&nbsp;&nbsp;Возврат покупки</div>
                                    <div style={{textAlign: 'right', marginBottom: 5}}>Сумма: {checkFloat(data.object.returnedBuyAll-data.object.returnedBuy)}</div>
                                    </>
                                    :
                                    null
                            }
                            <div style={{textAlign: 'center', height: 12, marginTop: 10, marginBottom: 10}}>**********************************************</div>
                            <div style={{textAlign: 'center', marginBottom: 5, fontWeight: 'bold'}}>Cумма за период</div>
                            <div style={{textAlign: 'left', marginBottom: 5, fontWeight: 500}}>&nbsp;&nbsp;Наличных в кассе</div>
                            <div style={{textAlign: 'right', marginBottom: 5}}>Сумма: {data.object.cashEnd}</div>
                            <div style={{textAlign: 'left', marginBottom: 5, fontWeight: 500}}>&nbsp;&nbsp;Внесено</div>
                            <div style={{textAlign: 'right', marginBottom: 5}}>Сумма: {data.object.deposit}</div>
                            <div style={{textAlign: 'left', marginBottom: 5, fontWeight: 500}}>&nbsp;&nbsp;Изъято</div>
                            <div style={{textAlign: 'right', marginBottom: 5}}>Сумма: {data.object.withdraw}</div>
                            <div style={{textAlign: 'left', marginBottom: 5, fontWeight: 500}}>&nbsp;&nbsp;Наличными</div>
                            <div style={{textAlign: 'right', marginBottom: 5}}>Сумма: {data.object.cash}</div>
                            <div style={{textAlign: 'left', marginBottom: 5, fontWeight: 500}}>&nbsp;&nbsp;Безналичными</div>
                            <div style={{textAlign: 'right', marginBottom: 5}}>Сумма: {data.object.cashless}</div>
                            <div style={{textAlign: 'left', marginBottom: 5, fontWeight: 500}}>&nbsp;&nbsp;Скидка</div>
                            <div style={{textAlign: 'right', marginBottom: 5}}>Сумма: {data.object.discount}</div>
                            <div style={{textAlign: 'left', marginBottom: 5, fontWeight: 500}}>&nbsp;&nbsp;Наценка</div>
                            <div style={{textAlign: 'right', marginBottom: 5}}>Сумма: {data.object.extra}</div>
                            <div style={{textAlign: 'left', marginBottom: 5, fontWeight: 500}}>&nbsp;&nbsp;Продажа</div>
                            <div style={{textAlign: 'right', marginBottom: 5}}>Чеков: {data.object.saleCount} | Сумма: {data.object.sale}</div>
                            <div style={{textAlign: 'left', marginBottom: 5, fontWeight: 500}}>&nbsp;&nbsp;Возврат</div>
                            <div style={{textAlign: 'right', marginBottom: 5}}>Чеков: {data.object.returnedCount} | Сумма: {data.object.returned}</div>
                            <div style={{textAlign: 'left', marginBottom: 5, fontWeight: 500}}>&nbsp;&nbsp;Кредит</div>
                            <div style={{textAlign: 'right', marginBottom: 5}}>Чеков: {data.object.consignationCount} | Сумма: {data.object.consignation}</div>
                            <div style={{textAlign: 'left', marginBottom: 5, fontWeight: 500}}>&nbsp;&nbsp;Погашение кредита</div>
                            <div style={{textAlign: 'right', marginBottom: 5}}>Чеков: {data.object.paidConsignationCount} | Сумма: {data.object.paidConsignation}</div>
                            <div style={{textAlign: 'left', marginBottom: 5, fontWeight: 500}}>&nbsp;&nbsp;Аванс</div>
                            <div style={{textAlign: 'right', marginBottom: 5}}>Чеков: {data.object.prepaymentCount} | Сумма: {data.object.prepayment}</div>
                            <div style={{textAlign: 'left', marginBottom: 5, fontWeight: 500}}>&nbsp;&nbsp;Покупка</div>
                            <div style={{textAlign: 'right', marginBottom: 5}}>Чеков: {data.object.buyCount} | Сумма: {data.object.buy}</div>
                            <div style={{textAlign: 'left', marginBottom: 5, fontWeight: 500}}>&nbsp;&nbsp;Возврат покупки</div>
                            <div style={{textAlign: 'right', marginBottom: 5}}>Чеков: {data.object.returnedBuyCount} | Сумма: {data.object.returnedBuy}</div>
                            {
                                ['admin', 'superadmin', 'управляющий'].includes(profile.role)?
                                    <>
                                    <div style={{textAlign: 'center', height: 12, marginTop: 10, marginBottom: 10}}>**********************************************</div>
                                    <div style={{textAlign: 'center', marginBottom: 5, fontWeight: 'bold'}}>Необнул. сумма на конец</div>
                                    <div style={{textAlign: 'left', marginBottom: 5, fontWeight: 500}}>&nbsp;&nbsp;Продажа</div>
                                    <div style={{textAlign: 'right', marginBottom: 5}}>Сумма: {data.object.saleAll}</div>
                                    <div style={{textAlign: 'left', marginBottom: 5, fontWeight: 500}}>&nbsp;&nbsp;Возврат</div>
                                    <div style={{textAlign: 'right', marginBottom: 5}}>Сумма: {data.object.returnedAll}</div>
                                    <div style={{textAlign: 'left', marginBottom: 5, fontWeight: 500}}>&nbsp;&nbsp;Кредит</div>
                                    <div style={{textAlign: 'right', marginBottom: 5}}>Сумма: {data.object.consignationAll}</div>
                                    <div style={{textAlign: 'left', marginBottom: 5, fontWeight: 500}}>&nbsp;&nbsp;Погашение кредита</div>
                                    <div style={{textAlign: 'right', marginBottom: 5}}>Сумма: {data.object.paidConsignationAll}</div>
                                    <div style={{textAlign: 'left', marginBottom: 5, fontWeight: 500}}>&nbsp;&nbsp;Аванс</div>
                                    <div style={{textAlign: 'right', marginBottom: 5}}>Сумма: {data.object.prepaymentAll}</div>
                                    <div style={{textAlign: 'left', marginBottom: 5, fontWeight: 500}}>&nbsp;&nbsp;Покупка</div>
                                    <div style={{textAlign: 'right', marginBottom: 5}}>Сумма: {data.object.buyAll}</div>
                                    <div style={{textAlign: 'left', marginBottom: 5, fontWeight: 500}}>&nbsp;&nbsp;Возврат покупки</div>
                                    <div style={{textAlign: 'right', marginBottom: 5}}>Сумма: {data.object.returnedBuyAll}</div>
                                    </>
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
                        </div>
                    </center>
                    {
                        readyPrint?
                            <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD}>
                                <Button color='primary' onClick={async ()=>{
                                    if(isMobileApp&&navigator.bluetooth){
                                        let _printer = printer
                                        if(!_printer) {
                                            _printer = await connectPrinterByBluetooth()
                                            setPrinter(_printer)
                                        }
                                        let _data = [
                                            {message: data.object.legalObject.name, align: 'center'},
                                            ...data.object.branch?[{message: `${data.object.branch.name}, ${data.object.branch.address}`, align: 'center'}]:[],
                                            {message: `Дата: ${`${pdDDMMYYHHMM(data.object.start)}${data.object.end?` - ${pdDDMMYYHHMM(data.object.end)}`:''}`}`, align: 'left'},
                                            {message: `${data.object.type}-Отчет №${data.object.number}`, align: 'left'},
                                            {message: `ИНН: ${data.object.legalObject.inn}`, align: 'left'},
                                            {message: `НР: ${data.object.legalObject.rateTaxe}`, align: 'left'},
                                            {message: `РНМ: ${data.object.cashbox.rnmNumber}`, align: 'left'},
                                            {message: `Смена №${data.object.workShift.number}`, align: 'left'},
                                            ...['admin', 'superadmin', 'управляющий'].includes(profile.role)?[
                                                {message: '********************************', align: 'center'},
                                                {message: 'Необнул. сумма на начало', bold: true, align: 'center'},
                                                {message: `  Продажа`, align: 'left'},
                                                {message: `Сумма: ${checkFloat(data.object.saleAll-data.object.sale)}`, align: 'right'},
                                                {message: `  Возврат`, align: 'left'},
                                                {message: `Сумма: ${checkFloat(data.object.returnedAll-data.object.returned)}`, align: 'right'},
                                                {message: `  Кредит`, align: 'left'},
                                                {message: `Сумма: ${checkFloat(data.object.consignationAll-data.object.consignation)}`, align: 'right'},
                                                {message: `  Погашение кредита`, align: 'left'},
                                                {message: `Сумма: ${checkFloat(data.object.paidConsignationAll-data.object.paidConsignation)}`, align: 'right'},
                                                {message: `  Аванс`, align: 'left'},
                                                {message: `Сумма: ${checkFloat(data.object.prepaymentAll-data.object.prepayment)}`, align: 'right'},
                                                {message: `  Покупка`, align: 'left'},
                                                {message: `Сумма: ${checkFloat(data.object.buyAll-data.object.buy)}`, align: 'right'},
                                                {message: `  Возврат покупки`, align: 'left'},
                                                {message: `Сумма: ${checkFloat(data.object.returnedBuyAll-data.object.returnedBuy)}`, align: 'right'},
                                            ]:[],
                                            {message: '********************************', align: 'center'},
                                            {message: `Cумма за период`, align: 'center', bold: true},
                                            {message: `  Наличных в кассе`, align: 'left'},
                                            {message: `Сумма: ${data.object.cashEnd}`, align: 'right'},
                                            {message: `  Внесено`, align: 'left'},
                                            {message: `Сумма: ${data.object.deposit}`, align: 'right'},
                                            {message: `  Изъято`, align: 'left'},
                                            {message: `Сумма: ${data.object.withdraw}`, align: 'right'},
                                            {message: `  Наличными`, align: 'left'},
                                            {message: `Сумма: ${data.object.cash}`, align: 'right'},
                                            {message: `  Безналичными`, align: 'left'},
                                            {message: `Сумма: ${data.object.cashless}`, align: 'right'},
                                            {message: `  Скидка`, align: 'left'},
                                            {message: `Сумма: ${data.object.discount}`, align: 'right'},
                                            {message: `  Наценка`, align: 'left'},
                                            {message: `Сумма: ${data.object.extra}`, align: 'right'},
                                            {message: `  Продажа`, align: 'left'},
                                            {message: `Чеков: ${data.object.saleCount} | Сумма: ${data.object.sale}`, align: 'right'},
                                            {message: `  Возврат`, align: 'left'},
                                            {message: `Чеков: ${data.object.returnedCount} | Сумма: ${data.object.returned}`, align: 'right'},
                                            {message: `  Кредит`, align: 'left'},
                                            {message: `Чеков: ${data.object.consignationCount} | Сумма: ${data.object.consignation}`, align: 'right'},
                                            {message: `  Погашение кредита`, align: 'left'},
                                            {message: `Чеков: ${data.object.paidConsignationCount} | Сумма: ${data.object.paidConsignation}`, align: 'right'},
                                            {message: `  Аванс`, align: 'left'},
                                            {message: `Чеков: ${data.object.prepaymentCount} | Сумма: ${data.object.prepayment}`, align: 'right'},
                                            {message: `  Покупка`, align: 'left'},
                                            {message: `Чеков: ${data.object.buyCount} | Сумма: ${data.object.buy}`, align: 'right'},
                                            {message: `  Возврат покупки`, align: 'left'},
                                            {message: `Чеков: ${data.object.returnedBuyCount} | Сумма: ${data.object.returnedBuy}`, align: 'right'},
                                            ...['admin', 'superadmin', 'управляющий'].includes(profile.role)?[
                                                {message: '********************************', align: 'center'},
                                                {message: `Необнул. сумма на конец`, align: 'center', bold: true},
                                                {message: `  Продажа`, align: 'left'},
                                                {message: `Сумма: ${data.object.saleAll}`, align: 'right'},
                                                {message: `  Возврат`, align: 'left'},
                                                {message: `Сумма: ${data.object.returnedAll}`, align: 'right'},
                                                {message: `  Кредит`, align: 'left'},
                                                {message: `Сумма: ${data.object.consignationAll}`, align: 'right'},
                                                {message: `  Погашение кредита`, align: 'left'},
                                                {message: `Сумма: ${data.object.paidConsignationAll}`, align: 'right'},
                                                {message: `  Аванс`, align: 'left'},
                                                {message: `Сумма: ${data.object.prepaymentAll}`, align: 'right'},
                                                {message: `  Покупка`, align: 'left'},
                                                {message: `Сумма: ${data.object.buyAll}`, align: 'right'},
                                                {message: `  Возврат покупки`, align: 'left'},
                                                {message: `Сумма: ${data.object.returnedBuyAll}`, align: 'right'},
                                            ]:[],
                                            ...data.object.syncMsg!=='Фискальный режим отключен'?[{message: '***************ФП***************', align: 'center', bold: true}]:[],
                                            {message: 'ККМ SALYK.STORE v1.0', align: 'center', bold: true}
                                        ]
                                        printEsPosData(_printer, _data)
                                    }
                                    else {
                                        let printContents = receiptRef.current.innerHTML;
                                        let printWindow = window.open();
                                        printWindow.document.write(printContents);
                                        printWindow.document.write(`<script type="text/javascript">window.onload = function() { window.print(); ${isMobileApp?'setTimeout(window.close, 1000)':'window.close()'}; };</script>`);
                                        printWindow.document.close();
                                        printWindow.focus();
                                    }
                                }}>Печать</Button>
                                <Pdf targetRef={receiptRef} filename={`${data.object.type}-Отчет №${data.object.number}`}
                                     options = {{
                                         format: [receiptRef.current.offsetHeight*0.8, receiptRef.current.offsetWidth*0.75+1]
                                     }}>
                                    {({ toPdf }) => <Button color='primary' onClick={toPdf}>Скачать</Button>}
                                </Pdf>
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
            object: await getReport({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
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
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Receipt);