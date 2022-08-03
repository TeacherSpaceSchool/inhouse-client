import initialApp from '../src/initialApp'
import Head from 'next/head';
import React, { useState, useRef, useEffect } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import { getDoc, setDoc } from '../src/gql/doc'
import pageListStyle from '../src/styleMUI/list'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import { useRouter } from 'next/router'
import Router from 'next/router'
import * as userActions from '../src/redux/actions/user'
import * as snackbarActions from '../src/redux/actions/snackbar'
import * as appActions from '../src/redux/actions/app'
import TextField from '@mui/material/TextField';
import Confirmation from '../components/dialog/Confirmation'
import { urlMain } from '../src/const'
import { getClientGqlSsr } from '../src/apollo'
import History from '../components/dialog/History';
import HistoryIcon from '@mui/icons-material/History';
import { wrapper } from '../src/redux/configureStore'

const Doc = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const { isMobileApp } = props.app;
    const { showSnackBar } = props.snackbarActions;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const unsaved = useRef();
    let [wallet, setWallet] = useState(data.object.wallet);
    let [phoneCheckInstallment, setPhoneCheckInstallment] = useState(data.object.phoneCheckInstallment);
    let [name, setName] = useState(data.object.name);
    let [address, setAddress] = useState(data.object.address);
    let [inn, setInn] = useState(data.object.inn);
    let [okpo, setOkpo] = useState(data.object.okpo);
    let [bank, setBank] = useState(data.object.bank);
    let [bik, setBik] = useState(data.object.bik);
    let [court, setCourt] = useState(data.object.court);
    let [account, setAccount] = useState(data.object.account);
    let [director, setDirector] = useState(data.object.director);
    const router = useRouter()
    useEffect(()=>{
        if(!unsaved.current)
            unsaved.current = {}
        else
            unsaved.current[router.query.id] = true
    },[name, address, inn, okpo, bank, bik, account, director])

    return (
        <App unsaved={unsaved} pageName='Реквизиты'>
            <Head>
                <title>Реквизиты</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content='Реквизиты' />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website'/>
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/doc`} />
                <link rel='canonical' href={`${urlMain}/doc`}/>
            </Head>
            <Card className={classes.page}>
                <div className={classes.status}>
                    {
                        data.object&&data.object._id?
                            <HistoryIcon onClick={async()=>{
                                setMiniDialog('История', <History where={data.object._id}/>)
                                showMiniDialog(true)
                            }} style={{ color: '#10183D'}}/>
                            :
                            null
                    }
                </div>
                <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignItems: 'flex-start'}}>
                    <TextField variant='standard'
                               id='name'
                               error={!name}
                               label='Название'
                               value={name}
                               onChange={(event) => setName(event.target.value)}
                               className={classes.input}
                    />
                    <TextField variant='standard'
                               id='wallet'
                               error={!wallet}
                               label='Кошелек'
                               value={wallet}
                               onChange={(event) => setWallet(event.target.value)}
                               className={classes.input}
                    />
                    <TextField variant='standard'
                               id='court'
                               error={!court}
                               label='Суд'
                               value={court}
                               onChange={(event) => setCourt(event.target.value)}
                               className={classes.input}
                    />
                    <TextField variant='standard'
                               id='phoneCheckInstallment'
                               error={!phoneCheckInstallment}
                               label='Телефон проверки'
                               value={phoneCheckInstallment}
                               onChange={(event) => setPhoneCheckInstallment(event.target.value)}
                               className={classes.input}
                    />
                    <TextField variant='standard'
                               id='name'
                               error={!name}
                               label='Название'
                               value={name}
                               onChange={(event) => setName(event.target.value)}
                               className={classes.input}
                    />
                    <TextField variant='standard'
                               id='address'
                               error={!address}
                               label='Адрес'
                               onChange={(event) => setAddress(event.target.value)}
                               value={address}
                               className={classes.input}
                    />
                    <TextField variant='standard'
                               id='inn'
                               error={!inn}
                               label='ИНН'
                               value={inn}
                               onChange={(event) => setInn(event.target.value)}
                               className={classes.input}
                    />
                    <TextField variant='standard'
                               id='okpo'
                               error={!okpo}
                               label='ОКПО'
                               value={okpo}
                               onChange={(event) => setOkpo(event.target.value)}
                               className={classes.input}
                    />
                    <TextField variant='standard'
                               id='bank'
                               error={!bank}
                               label='Банк'
                               value={bank}
                               onChange={(event) => setBank(event.target.value)}
                               className={classes.input}
                    />
                    <TextField variant='standard'
                               id='bik'
                               error={!bik}
                               label='БИК'
                               value={bik}
                               onChange={(event) => setBik(event.target.value)}
                               className={classes.input}
                    />
                    <TextField variant='standard'
                               id='account'
                               error={!account}
                               label='Счет'
                               value={account}
                               onChange={(event) => setAccount(event.target.value)}
                               className={classes.input}
                    />
                    <TextField variant='standard'
                               id='director'
                               error={!director}
                               label='Директор'
                               value={director}
                               onChange={(event) => setDirector(event.target.value)}
                               className={classes.input}
                    />
                    <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD}>
                        {
                            data.edit?
                                <Button color='primary' onClick={()=>{
                                    let res
                                    if (court&&wallet&&phoneCheckInstallment&&name&&address&&inn&&okpo&&bank&&bik&&account&&director) {
                                        const action = async() => {
                                            res = await setDoc({wallet, court, phoneCheckInstallment, name, address, inn, okpo, bank, bik, account, director})
                                            if(res!=='ERROR'&&res) {
                                                unsaved.current = {}
                                                showSnackBar('Успешно', 'success')
                                                Router.reload()
                                            }
                                            else
                                                showSnackBar('Ошибка', 'error')
                                        }
                                        setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                        showMiniDialog(true)
                                    } else
                                        showSnackBar('Заполните все поля')
                                }}>
                                    Сохранить
                                </Button>
                                :
                                null
                        }
                    </div>
                </CardContent>
            </Card>
        </App>
    )
})

Doc.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    return {
        data: {
            edit: store.getState().user.profile.edit&&['admin'].includes(store.getState().user.profile.role),
            object: await getDoc(ctx.req?await getClientGqlSsr(ctx.req):undefined)
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

export default connect(mapStateToProps, mapDispatchToProps)(Doc);