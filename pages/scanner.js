import Head from 'next/head';
import React from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import pageListStyle from '../src/styleMUI/list'
import { urlMain } from '../src/const'
import initialApp from '../src/initialApp'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import * as appActions from '../src/redux/actions/app'
import * as snackbarActions from '../src/redux/actions/snackbar'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ControlCamera from '../icons/barcode-scanner.svg';
import Router from 'next/router'
import { openScanner } from '../src/lib';
import { wrapper } from '../src/redux/configureStore'

const Scanner = React.memo((props) => {
    const {classes} = pageListStyle();
    const { setShowAppBar, setShowLightbox, setImagesLightbox, setIndexLightbox } = props.appActions;
    return (
        <App pageName='Сканер'>
            <Head>
                <title>Сканер</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content='Сканер' />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/scanner`} />
                <link rel='canonical' href={`${urlMain}/scanner`}/>
            </Head>
            <Card className={classes.page}>
                <CardContent className={classes.column}>
                    <center>
                        <h3>
                            Скачайте сканер под вашу операционную систему
                        </h3>
                    </center>
                    <br/>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <b>Android</b>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className={classes.column}>
                                <div className={classes.value}>1) <a href='https://play.google.com/store/apps/details?id=com.salyk.scanner' style={{color: '#10183D', fontWeight: 'bold'}}>Скачать SALYK.SCANNER c Google Play</a></div>
                                <div className={classes.row} style={{alignItems: 'center', marginBottom: 10}}>
                                    <div className={classes.value} style={{marginBottom: 0}}>2) Во время работы SALYK.STORE, нажмите на иконку:</div>
                                    <ControlCamera style={{height: 30}} onClick={()=>{
                                        openScanner({_idx: 0, path: 'scanner'})
                                    }}/>
                                </div>
                                <div className={classes.value}>3) Наведите сканнер на штрихкод</div>
                                <div className={classes.value}>4) Поставьте галочку напротив "Запомнить выбор" и нажмите на иконку SALYK.STORE</div>
                                <img style={{width: 300, objectFit: 'contain'}} src='/usescanner.jpg'
                                     onClick={() => {
                                         setShowAppBar(false)
                                         setShowLightbox(true)
                                         setImagesLightbox(['/usescanner.jpg'])
                                         setIndexLightbox(0)
                                     }}
                                />
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </CardContent>
            </Card>
        </App>
    )
})

Scanner.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!store.getState().user.profile.role)
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
        appActions: bindActionCreators(appActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scanner);