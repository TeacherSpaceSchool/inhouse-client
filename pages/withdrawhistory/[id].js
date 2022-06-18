import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React, {useRef, useState, useEffect} from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import {getWithdrawHistory} from '../../src/gql/withdrawHistory'
import saleStyle from '../../src/styleMUI/list'
import { bindActionCreators } from 'redux'
import * as appActions from '../../src/redux/actions/app'
import { useRouter } from 'next/router'
import Router from 'next/router'
import { urlMain } from '../../src/const'
import { getClientGqlSsr } from '../../src/apollo'
import {pdDDMMYYHHMM} from '../../src/lib'
import { connectPrinterByBluetooth, printEsPosData } from '../../src/printer'
import Button from '@mui/material/Button';
import dynamic from 'next/dynamic'
import { wrapper } from '../../src/redux/configureStore'
const Pdf = dynamic(import('react-to-pdf'), { ssr: false });
import Link from 'next/link';

const Receipt = React.memo((props) => {
    const {classes} = saleStyle();
    const { data } = props;
    const { isMobileApp, printer } = props.app;
    const { profile } = props.user;
    const { setPrinter } = props.appActions;
    const router = useRouter()
    const receiptRef = useRef(null);
    let [readyPrint, setReadyPrint] = useState(data.list);
    useEffect(() => {
        setReadyPrint(process.browser&&receiptRef.current&&data.object)
    }, [process.browser, receiptRef.current]);
    return (
        <App pageName={data.object!==null?`Чек №${data.object.number}`:'Ничего не найдено'}>
            <Head>
                <title>{data.object!==null?`Чек №${data.object.number}`:'Ничего не найдено'}</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content={data.object!==null?`Чек №${data.object.number}`:'Ничего не найдено'} />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/withdrawhistory/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/withdrawhistory/${router.query.id}`}/>
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
                            <div style={{textAlign: 'left', marginBottom: 5}}><span style={{fontWeight: 400}}>Операция: Изъятие из кассы</span></div>
                            <div style={{textAlign: 'left', marginBottom: 5}}><span style={{fontWeight: 400}}>ЧЕК №{data.object.number}</span></div>
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
                            <div style={{textAlign: 'center', height: 12, marginTop: 10, marginBottom: 10}}>**********************************************</div>
                            <div style={{textAlign: 'right', marginBottom: 5, fontWeight: 'bold'}}>ИТОГО: {data.object.amount}</div>
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
                                            {message: `${data.object.branch.name}, ${data.object.branch.address}`, align: 'center'},
                                            {message: `Дата: ${pdDDMMYYHHMM(data.object.createdAt)}`, align: 'left'},
                                            {message: 'Операция: Изъятие из кассы', align: 'left'},
                                            {message: `ЧЕК №${data.object.number}`, align: 'left'},
                                            {message: `ИНН: ${data.object.legalObject.inn}`, align: 'left'},
                                            {message: `НР: ${data.object.legalObject.rateTaxe}`, align: 'left'},
                                            {message: `РНМ: ${data.object.cashbox.rnmNumber}`, align: 'left'},
                                            {message: `Смена №${data.object.workShift.number}`, align: 'left'},
                                            {message: `Кассир: ${data.object.cashier.name}`, align: 'left'},
                                            {message: '********************************', align: 'center'},
                                            {message: `ИТОГО: ${data.object.amountEnd}`, align: 'right', bold: true}
                                        ]
                                        if(data.object.comment)
                                            _data.push({message: `Комментарий: ${data.object.comment}`, align: 'right'})
                                        if(data.object.syncMsg!=='Фискальный режим отключен')
                                            _data.push({message: '***************ФП***************', align: 'center', bold: true})
                                        _data.push({message: 'ККМ SALYK.STORE v1.0', align: 'center', bold: true})
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
    let object = await getWithdrawHistory({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
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
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Receipt);