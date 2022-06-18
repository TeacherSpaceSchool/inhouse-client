import initialApp from '../../../src/initialApp'
import Head from 'next/head';
import React, {useRef, useState, useEffect} from 'react';
import App from '../../../layouts/App';
import { connect } from 'react-redux'
import {getPayment} from '../../../src/gql/payment'
import reportStyle from '../../../src/styleMUI/list'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../../src/redux/actions/mini_dialog'
import * as appActions from '../../../src/redux/actions/app'
import { useRouter } from 'next/router'
import Router from 'next/router'
import * as userActions from '../../../src/redux/actions/user'
import * as snackbarActions from '../../../src/redux/actions/snackbar'
import { urlMain } from '../../../src/const'
import { getClientGqlSsr } from '../../../src/apollo'
import { pdDDMMYYHHMM } from '../../../src/lib'
import Button from '@mui/material/Button';
import { connectPrinterByBluetooth, printEsPosData } from '../../../src/printer'
import dynamic from 'next/dynamic'
const Pdf = dynamic(import('react-to-pdf'), { ssr: false });
import { wrapper } from '../../../src/redux/configureStore'

const Receipt = React.memo((props) => {
    const {classes} = reportStyle();
    const { data } = props;
    const { isMobileApp, printer } = props.app;
    const { setPrinter } = props.appActions;
    const router = useRouter()
    const receiptRef = useRef(null);
    let [readyPrint, setReadyPrint] = useState(data.list);
    useEffect(() => {
        setReadyPrint(process.browser&&receiptRef.current&&data.object)
    }, [process.browser, receiptRef.current]);
    return (
        <App pageName={data.object!==null?`Оплата №${data.object.number}`:'Ничего не найдено'}>
            <Head>
                <title>{data.object!==null?`Оплата №${data.object.number}`:'Ничего не найдено'}</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content={data.object!==null?`Оплата №${data.object.number}`:'Ничего не найдено'} />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/payment/receipt/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/payment/receipt/${router.query.id}`}/>
            </Head>
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
                            <div style={{textAlign: 'center', marginBottom: 5}}><span style={{fontWeight: 400}}>Оплата №{data.object.number}</span></div>
                            {data.object.who?<div style={{textAlign: 'center', marginBottom: 5}}><span style={{fontWeight: 400}}>Оператор: {data.object.who.role} {data.object.who.name}</span></div>:null}
                            <div style={{textAlign: 'center', marginBottom: 5}}><span style={{fontWeight: 400}}>Дата: {pdDDMMYYHHMM(data.object.createdAt)}</span></div>
                            <div style={{textAlign: 'center', height: 12, marginTop: 10, marginBottom: 10}}>**********************************************</div>
                            <div style={{textAlign: 'left', marginBottom: 5, fontWeight: 500}}>{data.object.legalObject.name}</div>
                            <div style={{textAlign: 'right', marginBottom: 5}}>Количество касс: {data.object.cashboxes.length}</div>
                            <div style={{textAlign: 'right', marginBottom: 5}}>Месяцы: {data.object.months}</div>
                            <div style={{textAlign: 'right', marginBottom: 5}}>Дни: {data.object.days}</div>
                            <div style={{textAlign: 'center', height: 12, marginTop: 10, marginBottom: 10}}>**********************************************</div>
                            <div style={{textAlign: 'right', marginBottom: 5}}>Оплачено: {data.object.paid}</div>
                            <div style={{textAlign: 'right', marginBottom: 5}}>Сдача: {data.object.change}</div>
                            <p style={{textAlign: 'center'}}><span style={{fontWeight: 400}}>ККМ SALYK.STORE v1.0</span></p>
                            {
                                data.object.qr?
                                    <div style={{display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                                        <img width={170} height={170} src={data.object.qr} />
                                    </div>
                                    :
                                    null
                            }
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
                                            {message: `Оплата №${data.object.number}`, align: 'center'},
                                            ...data.object.who?[{message: `Оператор: ${data.object.who.role} ${data.object.who.name}`, align: 'center'}]:[],
                                            {message: `Дата: ${pdDDMMYYHHMM(data.object.createdAt)}`, align: 'center'},
                                            {message: '********************************', align: 'center'},
                                            {message: data.object.legalObject.name, align: 'left'},
                                            {message: `Количество касс: ${data.object.cashboxes.length}`, align: 'right'},
                                            {message: `Месяцы: ${data.object.months}`, align: 'right'},
                                            {message: `Дни: ${data.object.days}`, align: 'right'},
                                            {message: '********************************', align: 'center'},
                                            {message: `Оплачено: ${data.object.paid}`, align: 'right'},
                                            {message: `Сдача: ${data.object.change}`, align: 'right'},
                                            {message: 'ККМ SALYK.STORE v1.0', align: 'center', bold: true},
                                            {image: data.object.qr}
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
    if(!['admin', 'superadmin', 'оператор', 'управляющий', 'кассир', 'супервайзер'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    return {
        data: {
            object: await getPayment({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
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

export default connect(mapStateToProps, mapDispatchToProps)(Receipt);