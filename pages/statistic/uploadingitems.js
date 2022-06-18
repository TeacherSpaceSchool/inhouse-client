import Head from 'next/head';
import React, { useState, useRef } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import pageListStyle from '../../src/styleMUI/list'
import * as userActions from '../../src/redux/actions/user'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import { urlMain } from '../../src/const'
import initialApp from '../../src/initialApp'
import Router from 'next/router'
import { uploadingItems } from '../../src/gql/statistic'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import Confirmation from '../../components/dialog/Confirmation'
import { wrapper } from '../../src/redux/configureStore'

const UploadingItems = React.memo((props) => {
    const {classes} = pageListStyle();
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { legalObject, isMobileApp } = props.app;
    const { showSnackBar } = props.snackbarActions;
    let [document, setDocument] = useState(undefined);
    let documentRef = useRef(null);
    let handleChangeDocument = ((event) => {
        if(event.target.files[0].size/1024/1024<50){
            setDocument(event.target.files[0])
        } else {
            showSnackBar('Файл слишком большой')
        }
    })
    return (
        <App cityShow pageName='Загрузка товаров' filterShow={{legalObject: true}}>
            <Head>
                <title>Загрузка товаров</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content='Загрузка товаров' />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/statistic/uploadingitems`} />
                <link rel='canonical' href={`${urlMain}/statistic/uploadingitems`}/>
            </Head>
            <Card className={classes.page}>
                <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignItems: 'flex-start'}}>
                    <div className={classes.row}>
                        Формат xlsx: название товара, цена товара, единица измерения товара, штрихкод товара, тип товара (товар, услуга), признак маркировки (да, нет), UUID товара.
                    </div>
                    <Button color='primary' onClick={()=>{documentRef.current.click()}}>
                        {document?document.name:'Прикрепить файл'}
                    </Button>
                    <br/>
                    {
                        legalObject&&legalObject._id&&document?
                            <Button variant='contained' color='primary' onClick={async()=>{
                                const action = async() => {
                                    let res = await uploadingItems({
                                        legalObject: legalObject._id,
                                        document
                                    });
                                    if(res==='OK')
                                        showSnackBar('Все данные загруженны')
                                }
                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                showMiniDialog(true)
                            }}>
                                Загрузить
                            </Button>
                            :
                            null
                    }
                </CardContent>
            </Card>
            <input
                ref={documentRef}
                accept='*/*'
                style={{ display: 'none' }}
                id='contained-button-file'
                type='file'
                onChange={handleChangeDocument}
            />
        </App>
    )
})

UploadingItems.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', 'superadmin'].includes(store.getState().user.profile.role)||!store.getState().user.profile.add)
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    store.getState().app.legalObject = undefined
    return {
        data: { }
    }
});

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadingItems);