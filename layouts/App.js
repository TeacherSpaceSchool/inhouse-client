import React, { useEffect, useState, useRef } from 'react';
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
import * as snackbarActions from '../src/redux/actions/snackbar'
import Lightbox from 'react-awesome-lightbox';
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import TableMenu from '../components/app/TableMenu'

export const mainWindow = React.createRef();
export const alert = React.createRef();
export let containerRef;

const App = React.memo(props => {
    let { checkPagination, qrScannerShow, sorts, pageName, searchShow, setList, list, filterShow, menuItems, anchorElQuick, setAnchorElQuick, unsaved, full } = props;

    const { setProfile, logout } = props.userActions;
    const { setIsMobileApp, setShowAppBar, setShowLightbox } = props.appActions;
    const { profile, authenticated } = props.user;
    const { load, search, showAppBar, filter, sort, showLightbox, imagesLightbox, indexLightbox } = props.app;
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
            window.addEventListener('offline', ()=>{showSnackBar('Нет подключения к интернету', 'error')})
            window.addEventListener('unload', ()=>{
                sessionStorage.scrollPositionStore = undefined
                sessionStorage.scrollPositionName = undefined
                sessionStorage.scrollPositionLimit = undefined
            })
        }
    },[process.browser])
    useEffect( ()=>{
        const routeChangeStart = (url)=>{
            setReloadPage(true)
            if(sessionStorage.scrollPositionName&&
                !(
                    url.includes('client')&&sessionStorage.scrollPositionName==='client'
                    ||
                    url.includes('cpa')&&sessionStorage.scrollPositionName==='cpa'
                    ||
                    url.includes('item')&&sessionStorage.scrollPositionName==='item'
                    ||
                    url.includes('task')&&sessionStorage.scrollPositionName==='task'
                    ||
                    url.includes('user')&&sessionStorage.scrollPositionName==='user'
                    ||
                    url.includes('order')&&sessionStorage.scrollPositionName==='order'
                    ||
                    url.includes('sale')&&sessionStorage.scrollPositionName==='sale'
                    ||
                    url.includes('reservation')&&sessionStorage.scrollPositionName==='reservation'
                    ||
                    url.includes('refund')&&sessionStorage.scrollPositionName==='refund'
                ))
            {
                sessionStorage.scrollPositionStore = undefined
                sessionStorage.scrollPositionName = undefined
                sessionStorage.scrollPositionLimit = undefined
            }
        }
        const routeChangeComplete = (url) => {
            if(sessionStorage.scrollPositionName&&(
                    url.includes('/clients')&&sessionStorage.scrollPositionName==='client'
                    ||
                    url.includes('/cpas')&&sessionStorage.scrollPositionName==='cpa'
                    ||
                    url.includes('/items')&&sessionStorage.scrollPositionName==='item'
                    ||
                    url.includes('/tasks')&&sessionStorage.scrollPositionName==='task'
                    ||
                    url.includes('/users')&&sessionStorage.scrollPositionName==='user'
                    ||
                    url.includes('/orders')&&sessionStorage.scrollPositionName==='order'
                    ||
                    url.includes('/sales')&&sessionStorage.scrollPositionName==='sale'
                    ||
                    url.includes('/reservations')&&sessionStorage.scrollPositionName==='reservation'
                    ||
                    url.includes('/refunds')&&sessionStorage.scrollPositionName==='refund'
                ))
            {
                let appBody = (document.getElementsByClassName('App-body'))[0]
                appBody.scroll({
                    top: parseInt(sessionStorage.scrollPositionStore),
                    left: 0,
                    behavior: 'instant'
                });
                sessionStorage.scrollPositionStore = undefined
                sessionStorage.scrollPositionName = undefined
                sessionStorage.scrollPositionLimit = undefined
            }
            setReloadPage(false)
        }
        Router.events.on('routeChangeStart', routeChangeStart)
        Router.events.on('routeChangeComplete', routeChangeComplete);
        return () => {
            Router.events.off('routeChangeStart', routeChangeStart)
            Router.events.off('routeChangeComplete', routeChangeComplete)
        }
    },[])
    const tic = useRef(true)
    containerRef = useRef();
    useEffect(() => {
        if(checkPagination&&containerRef.current) {
            const scrollHandle = async () => {
                if(containerRef.current.clientHeight<containerRef.current.scrollHeight) {
                    const scrolledTop = containerRef.current.scrollHeight - (containerRef.current.offsetHeight + containerRef.current.scrollTop)
                    if (tic.current && scrolledTop <= 100) {
                        tic.current = false
                        await setReloadPage(true)
                        await checkPagination()
                        await setReloadPage(false)
                        tic.current = true
                    }
                }
            }
            containerRef.current.addEventListener('scroll', scrollHandle);
            return () => {
                if(containerRef.current)
                    containerRef.current.removeEventListener('scroll', scrollHandle);
            }
        }
    }, [filter, search, sort, list])

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
                    <Drawer full={full} unsaved={unsaved} unread={unread} setUnread={setUnread}/>
                    <AppBar qrScannerShow={qrScannerShow} filterShow={filterShow} unread={unread} searchShow={searchShow} pageName={pageName} sorts={sorts}/>
                    </>
                    :
                    null
            }
            <div ref={containerRef} className={full?'App-body-f':'App-body'} style={['/catalog', '/refund/new'].includes(router.pathname)?{paddingBottom: 0}:{}}>
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
            <TableMenu menuItems={menuItems} anchorElQuick={anchorElQuick} setAnchorElQuick={setAnchorElQuick}/>
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