import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import contactStyle from '../../src/styleMUI/contact'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import Update from '@mui/icons-material/Update';
import IconButton from '@mui/material/IconButton';
import { urlMain } from '../../src/const'
import { getItems } from '../../src/gql/item'
import { getClients } from '../../src/gql/client'
import { getPrepayments } from '../../src/gql/prepayment'
import { getConsignations } from '../../src/gql/consignation'
import { pdDDMMYYHHMM } from '../../src/lib'
import initialApp from '../../src/initialApp'
import { getReceiveDataByName, putReceiveDataByName } from '../../src/service/idb/receiveData'
import Router from 'next/router'
import { wrapper } from '../../src/redux/configureStore'

const Sync = React.memo(() => {
    const {classes} = contactStyle();
    let [itemSync, setItemSync] = useState(undefined);
    let [clientSync, setClientSync] = useState(undefined);
    let [prepaymentSync, setPrepaymentSync] = useState(undefined);
    let [consignationSync, setConsignationSync] = useState(undefined);
    useEffect(()=>{
        if(process.browser){
            (async()=>{
                setItemSync(await getReceiveDataByName('Товары'))
                setClientSync(await getReceiveDataByName('Клиенты'))
                setPrepaymentSync(await getReceiveDataByName('Авансы'))
                setConsignationSync(await getReceiveDataByName('Кредиты'))
            })()
        }
    },[process.browser])
    return (
        <App pageName='Синхронизация данных'>
            <Head>
                <title>Синхронизация данных</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content='Синхронизация данных' />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/statistic/sync`} />
                <link rel='canonical' href={`${urlMain}/statistic/sync`}/>
            </Head>
            <Card className={classes.page}>
                <CardContent className={classes.column}>
                    <div className={classes.row} style={{alignItems: 'flex-end'}}>
                        <div className={classes.nameField}>
                            Товары:&nbsp;
                        </div>
                        <div className={classes.value} style={{color: itemSync?'#10183D':'red'}}>
                            {itemSync?pdDDMMYYHHMM(itemSync.date):'никогда'}
                        </div>
                        <IconButton onClick={async()=>{
                            itemSync = {
                                name: 'Товары',
                                data: await getItems(),
                                date: new Date()
                            }
                            await putReceiveDataByName(itemSync.name, itemSync.data, itemSync.date)
                            setItemSync({...itemSync})
                        }}>
                            <Update/>
                        </IconButton>
                    </div>
                    <div className={classes.row} style={{alignItems: 'flex-end'}}>
                        <div className={classes.nameField}>
                            Клиенты:&nbsp;
                        </div>
                        <div className={classes.value} style={{color: clientSync?'#10183D':'red'}}>
                            {clientSync?pdDDMMYYHHMM(clientSync.date):'никогда'}
                        </div>
                        <IconButton onClick={async()=>{
                            clientSync = {
                                name: 'Клиенты',
                                data: await getClients({}),
                                date: new Date()
                            }
+                            await putReceiveDataByName(clientSync.name, clientSync.data, clientSync.date)
                            setClientSync({...clientSync})
                        }}>
                            <Update/>
                        </IconButton>
                    </div>
                    <div className={classes.row} style={{alignItems: 'flex-end'}}>
                        <div className={classes.nameField}>
                            Авансы:&nbsp;
                        </div>
                        <div className={classes.value} style={{color: prepaymentSync?'#10183D':'red'}}>
                            {prepaymentSync?pdDDMMYYHHMM(prepaymentSync.date):'никогда'}
                        </div>
                        <IconButton onClick={async()=>{
                            prepaymentSync = {
                                name: 'Авансы',
                                data: await getPrepayments({}),
                                date: new Date()
                            }
                            await putReceiveDataByName(prepaymentSync.name, prepaymentSync.data, prepaymentSync.date)
                            setPrepaymentSync({...prepaymentSync})
                        }}>
                            <Update/>
                        </IconButton>
                    </div>
                    <div className={classes.row} style={{alignItems: 'flex-end'}}>
                        <div className={classes.nameField}>
                            Кредиты:&nbsp;
                        </div>
                        <div className={classes.value} style={{color: consignationSync?'#10183D':'red'}}>
                            {consignationSync?pdDDMMYYHHMM(consignationSync.date):'никогда'}
                        </div>
                        <IconButton onClick={async()=>{
                            consignationSync = {
                                name: 'Кредиты',
                                data: await getConsignations({}),
                                date: new Date()
                            }
                            await putReceiveDataByName(consignationSync.name, consignationSync.data, consignationSync.date)
                            setConsignationSync({...consignationSync})
                        }}>
                            <Update/>
                        </IconButton>
                    </div>
                </CardContent>
            </Card>
        </App>
    )
})

Sync.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(store.getState().user.profile.role!=='кассир')
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    return {
        data: {}

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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sync);