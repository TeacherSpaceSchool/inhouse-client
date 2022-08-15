import Head from 'next/head';
import React, {useState} from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import pageListStyle from '../src/styleMUI/list'
import { urlMain } from '../src/const'
import { pdHHMM, distanceHour } from '../src/lib'
import initialApp from '../src/initialApp'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import * as appActions from '../src/redux/actions/app'
import * as snackbarActions from '../src/redux/actions/snackbar'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { wrapper } from '../src/redux/configureStore'
import {getSalesBonusManager} from '../src/gql/sale'
import {getConsultations, startConsultation, endConsultation} from '../src/gql/consultation'
import { getClientGqlSsr } from '../src/apollo'
import Button from '@mui/material/Button';
import Confirmation from '../components/dialog/Confirmation'
import Link from 'next/link';

const Index = React.memo((props) => {
    const {classes} = pageListStyle();
    const { profile } = props.user;
    const { isMobileApp } = props.app;
    const { data } = props;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    let [consultation, setConsultation] = useState(data.consultation);
    return (
        <App pageName='Главная'>
            <Head>
                <title>Главная</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content='Главная' />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}`} />
                <link rel='canonical' href={`${urlMain}`}/>
            </Head>
            <div className={classes.pageCenter}>
                <Card className={classes.message} style={{width: isMobileApp?300:500, minHeight: isMobileApp?300:500}}>
                    <CardContent>
                        {
                            ['менеджер/завсклад', 'менеджер'].includes(profile.role)?
                                !consultation?
                                    <>
                                    <center>
                                        <img className={classes.logo} src={`${urlMain}/512x512.png`} style={{height: 100}} />
                                    </center>
                                    <div className={classes.row} style={{justifyContent: 'center'}}>
                                        <div className={classes.nameField} style={{marginLeft: 0, fontSize: '1.0625rem'}}>
                                            Продажи:&nbsp;
                                        </div>
                                        <div className={classes.value} style={{fontSize: '1.0625rem'}}>
                                            {data.salesBonusManager[0]}&nbsp;шт
                                        </div>
                                    </div>
                                    <div className={classes.row} style={{justifyContent: 'center'}}>
                                        <div className={classes.nameField} style={{marginLeft: 0, fontSize: '1.0625rem'}}>
                                            Сумма:&nbsp;
                                        </div>
                                        <div className={classes.value} style={{fontSize: '1.0625rem'}}>
                                            {data.salesBonusManager[1]}&nbsp;сом
                                        </div>
                                    </div>
                                    <div className={classes.row} style={{justifyContent: 'center'}}>
                                        <div className={classes.nameField} style={{marginLeft: 0, fontSize: '1.0625rem'}}>
                                            Бонус:&nbsp;
                                        </div>
                                        <div className={classes.value} style={{fontSize: '1.0625rem'}}>
                                            {data.salesBonusManager[2]}&nbsp;сом
                                        </div>
                                    </div>
                                    <br/>
                                    <Button variant='contained' color='primary' onClick={async ()=>{
                                        let res = await startConsultation()
                                        if(res&&res._id!=='ERROR')
                                            setConsultation(res)
                                        else
                                            showSnackBar('Ошибка', 'error')
                                    }}>
                                        Начать консультацию
                                    </Button>
                                    </>
                                    :
                                    <>
                                    <div style={{display: 'flex', fontWeight: 'bold', fontSize: '1.4rem'}}>
                                        Консультация c<div style={{color: distanceHour(consultation.createdAt)>1?'#f00':'#01C801'}}>&nbsp;{pdHHMM(consultation.createdAt)}</div>
                                    </div>
                                    <br/>
                                    <Link
                                        href={{
                                            pathname: '/catalog',
                                            query: {type: 'sale'}
                                        }}
                                        as={
                                            `/catalog?type=sale`
                                        }>
                                        <Button variant='contained' color='primary' style={{width: 225.35, margin: 10}} onClick={()=>{
                                            if(localStorage.type!=='sale') {
                                                localStorage.type = 'sale'
                                                localStorage.basket = JSON.stringify({})
                                            }
                                        }}>
                                            Продажа
                                        </Button>
                                    </Link>
                                    <br/>
                                    <Link
                                        href={{
                                            pathname: '/catalog',
                                            query: {type: 'reservation'}
                                        }}
                                        as={
                                            `/catalog?type=reservation`
                                        }>
                                        <Button variant='contained' color='primary' style={{width: 225.35, margin: 10}} onClick={()=>{
                                            if(localStorage.type!=='reservation') {
                                                localStorage.type = 'reservation'
                                                localStorage.basket = JSON.stringify({})
                                            }
                                        }}>
                                            Бронь
                                        </Button>
                                    </Link>
                                    <br/>
                                    <Link
                                        href={{
                                            pathname: '/catalog',
                                            query: {type: 'order'}
                                        }}
                                        as={
                                            `/catalog?type=order`
                                        }>
                                        <Button variant='contained' color='primary' style={{width: 225.35, margin: 10}} onClick={()=>{
                                            if(localStorage.type!=='order') {
                                                localStorage.type = 'order'
                                                localStorage.basket = JSON.stringify({})
                                            }
                                        }}>
                                            На заказ
                                        </Button>
                                    </Link>
                                    <br/>
                                    <Link href={'/refund/new'} as={'/refund/new'}>
                                        <Button variant='contained' color='secondary' style={{width: 225.35, margin: 10}} onClick={()=>{
                                            if(localStorage.type!=='refund') {
                                                localStorage.type = 'refund'
                                                localStorage.basket = JSON.stringify({})
                                            }
                                        }}>
                                            Возврат
                                        </Button>
                                    </Link>
                                    <br/>
                                    <br/>
                                    <Button variant='contained' color='secondary' onClick={()=>{
                                        const action = async() => {
                                            localStorage.basket = JSON.stringify({})
                                            let res = await endConsultation({})
                                            if(res&&res!=='ERROR')
                                                setConsultation(null)
                                            else
                                                showSnackBar('Ошибка', 'error')
                                        }
                                        setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                        showMiniDialog(true)
                                    }}>
                                        Закрыть консультацию
                                    </Button>
                                    </>
                                :
                                <>
                                <center>
                                    <img className={classes.logo} src={`${urlMain}/512x512.png`} />
                                </center>
                                <br/>
                                Для начала выберите пункт в боковом меню
                                </>
                        }
                    </CardContent>
                </Card>
            </div>
        </App>
    )
})

Index.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    let consultation
    if(['менеджер/завсклад', 'менеджер'].includes(store.getState().user.profile.role))
        consultation = (await getConsultations({active: true}, ctx.req?await getClientGqlSsr(ctx.req):undefined))[0]
    return {
        data: {
            salesBonusManager: await getSalesBonusManager(ctx.req?await getClientGqlSsr(ctx.req):undefined),
            consultation
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
        appActions: bindActionCreators(appActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);