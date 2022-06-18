import React, { useEffect, useState } from 'react';
import AppBar from '../components/app/AppBar'
import Dialog from '../components/app/Dialog'
import FullDialog from '../components/app/FullDialog'
import SnackBar from '../components/app/SnackBar'
import Drawer from '../components/app/Drawer'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActions from '../src/redux/actions/user'
import * as appActions from '../src/redux/actions/app'
import CircularProgress from '@mui/material/CircularProgress';
import Router from 'next/router'
import { useRouter } from 'next/router';
import { subscriptionData } from '../src/gql/data';
import { useSubscription } from '@apollo/client';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import * as snackbarActions from '../src/redux/actions/snackbar'
import { start } from '../src/service/idb'
import Lightbox from 'react-awesome-lightbox';
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'

export const mainWindow = React.createRef();
export const alert = React.createRef();
export let containerRef;

const App = React.memo(props => {
    const { setProfile, logout } = props.userActions;
    const { setIsMobileApp, setShowAppBar, setShowLightbox } = props.appActions;
    const { profile, authenticated } = props.user;
    const { load, search, showAppBar, filter, showLightbox, imagesLightbox, indexLightbox } = props.app;
    let { checkPagination, sorts, filters, pageName, dates, searchShow, setList, list, defaultOpenSearch, filterShow } = props;
    const [unread, setUnread] = useState({});
    const { showMiniDialog, showFullDialog } = props.mini_dialogActions;
    const [reloadPage, setReloadPage] = useState(false);
    const { showSnackBar } = props.snackbarActions;
    const { showFull, show  } = props.mini_dialog;
    useEffect( ()=>{
        if(authenticated&&!profile.role)
            setProfile()
        else if(!authenticated&&profile.role)
            logout(false)
    },[authenticated])
    useEffect( ()=>{
        if(mainWindow.current&&mainWindow.current.offsetWidth<900) {
            setIsMobileApp(true)
        }
    },[mainWindow])

    useEffect( ()=>{
        if(process.browser) {
            start()
            window.addEventListener('offline', ()=>{showSnackBar('Нет подключения к УНО и ОФД', 'error')})
        }
    },[process.browser])

    useEffect( ()=>{
        const routeChangeStart = (url)=>{
            setReloadPage(true)
            if (sessionStorage.scrollPostionName&&!(
                    url.includes('item')&&sessionStorage.scrollPostionName.includes('item')
                    ||
                    url.includes('sale')&&sessionStorage.scrollPostionName.includes('sale')
                )) {
                sessionStorage.removeItem('scrollPostionStore')
                sessionStorage.removeItem('scrollPostionName')
                sessionStorage.removeItem('scrollPostionLimit')
            }
        }
        const routeChangeComplete = (url) => {
            setReloadPage(false)
            if(!url.includes('item')&&sessionStorage.history)
                sessionStorage.removeItem('history')
            if(sessionStorage.scrollPostionName&&sessionStorage.scrollPostionName === url) {
                let appBody = (document.getElementsByClassName('App-body'))[0]
                appBody.scroll({
                    top: parseInt(sessionStorage.scrollPostionStore),
                    left: 0,
                    behavior: 'instant'
                });
                sessionStorage.removeItem('scrollPostionStore')
                sessionStorage.removeItem('scrollPostionName')
                sessionStorage.removeItem('scrollPostionLimit')
            }
        }
        Router.events.on('routeChangeStart', routeChangeStart)
        Router.events.on('routeChangeComplete', routeChangeComplete);
        return () => {
            Router.events.off('routeChangeStart', routeChangeStart)
            Router.events.off('routeChangeComplete', routeChangeComplete)
        }
    },[])

    containerRef = useBottomScrollListener(async()=>{
        if(checkPagination) {
            await setReloadPage(true)
            await checkPagination()
            await setReloadPage(false)
        }
    });

    let subscriptionDataRes = useSubscription(subscriptionData);
    useEffect(()=>{
        if (
            subscriptionDataRes &&
            authenticated &&
            profile.role &&
            subscriptionDataRes.data &&
            subscriptionDataRes.data.reloadData
        ) {
            if(subscriptionDataRes.data.reloadData.message){
                showSnackBar(subscriptionDataRes.data.reloadData.message)
            }

        }
    },[subscriptionDataRes.data])
    const router = useRouter();
    useEffect(() => {
        router.beforePopState(() => {
            if (show || showFull) {
                history.go(1)
                showMiniDialog(false)
                showFullDialog(false)
                return false
            }
            else
                return true
        })
        return () => {
            router.beforePopState(() => {
                return true
            })
        }
    }, [show, showFull]);
    return(
        <div ref={mainWindow} className='App'>
            {
                showAppBar?
                    <>
                    <Drawer unread={unread} setUnread={setUnread}/>
                    <AppBar filterShow={filterShow} unread={unread} defaultOpenSearch={defaultOpenSearch} searchShow={searchShow} dates={dates} pageName={pageName} sorts={sorts} filters={filters}/>
                    </>
                    :
                    null
            }
            <div ref={containerRef} className='App-body'>
                {props.children}
            </div>
            <FullDialog/>
            <Dialog />
            <SnackBar/>
            {load||reloadPage?
                <div className='load'>
                    <CircularProgress/>
                </div>
                :
                null
            }
            {showLightbox?
                <Lightbox
                    images={imagesLightbox.length>1?imagesLightbox:null}
                    image={imagesLightbox.length===1?imagesLightbox[0]:null}
                    startIndex={indexLightbox}
                    onClose={() => {setShowAppBar(true); setShowLightbox(false)}}
                />
                :
                null
            }
            <audio src='/alert.mp3' ref={alert}/>
        </div>
    )
});

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app,
        mini_dialog: state.mini_dialog
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);