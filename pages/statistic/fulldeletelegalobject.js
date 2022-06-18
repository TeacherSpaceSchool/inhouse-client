import Head from 'next/head';
import React, { useState } from 'react';
import App from '../../layouts/App';
import pageListStyle from '../../src/styleMUI/list'
import { urlMain } from '../../src/const'
import Router from 'next/router'
import initialApp from '../../src/initialApp'
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { bindActionCreators } from 'redux'
import * as appActions from '../../src/redux/actions/app'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import AutocomplectOnline from '../../components/app/AutocomplectOnline'
import {getLegalObjects, fullDeleteLegalObject} from '../../src/gql/legalObject'
import { connect } from 'react-redux'
import { wrapper } from '../../src/redux/configureStore'

const Fulldeletelegalobject = React.memo((props) => {
    const {classes} = pageListStyle();
    const { showLoad } = props.appActions;
    const { showSnackBar } = props.snackbarActions;
    let [legalObject, setLegalObject] = useState(undefined);
    return (
        <App pageName='Полное удаление налогоплательщика'>
            <Head>
                <title>Полное удаление налогоплательщика</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content='Полное удаление налогоплательщика' />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/statistic/fulldeletelegalobject`} />
                <link rel='canonical' href={`${urlMain}/statistic/fulldeletelegalobject`}/>
            </Head>
            <Card className={classes.page}>
                <CardContent className={classes.column}>
                    <AutocomplectOnline
                        setElement={setLegalObject}
                        getElements={async (search)=>{return await getLegalObjects({search})}}
                        label={'налогоплательщика'}
                    />
                    <Button variant='contained' color='secondary' onClick={async()=>{
                        if(legalObject) {
                            showLoad(true)
                            let res = await fullDeleteLegalObject({_id: legalObject._id})
                            if(res!=='Данные успешно удалены')
                                showSnackBar(res, 'error')
                            else
                                showSnackBar(res, 'success')
                            showLoad(false)
                        }
                        else
                            showSnackBar('Заполните все поля')
                    }} className={classes.button}>
                        Полное удаление налогоплательщика
                    </Button>

                </CardContent>
            </Card>
        </App>
    )
})

Fulldeletelegalobject.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if('superadmin'!==store.getState().user.profile.role)
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        }
        else {
            Router.push('/')
        }
    return {
        data: {}
    };
});

function mapStateToProps (state) {
    return {
        app: state.app
    }
}

function mapDispatchToProps(dispatch) {
    return {
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Fulldeletelegalobject)