import { getProfile } from './redux/actions/user'
import { setDevice } from './gql/user'
import { getJWT, checkMobile } from './lib'
import uaParserJs from 'ua-parser-js';
import { getClientGqlSsr } from './apollo'

const initialApp = async (ctx, store)=>{
    let ua
    if (ctx.req) {
        ua = uaParserJs(ctx.req.headers['user-agent'])
        store.getState().app.isMobileApp = ['mobile', 'tablet'].includes(ua.device.type)||checkMobile(ua.ua)||ctx.req.headers['sec-ch-ua-mobile']==='?1'
        store.getState().user.authenticated = getJWT(ctx.req.headers.cookie)
        if (store.getState().user.authenticated) {
            store.getState().user.profile = await getProfile(await getClientGqlSsr(ctx.req))
            if (store.getState().user.profile) {
                let deviceModel
                if(ua.device.model)
                    deviceModel = ua.device.model
                else if(ua.ua){
                    deviceModel = ua.ua.split(' (')
                    if(deviceModel[1]) {
                        deviceModel = deviceModel[1].split('; ')
                        if (deviceModel[2]) {
                            deviceModel = deviceModel[2].split(') ')
                            if (deviceModel[0])
                                deviceModel = deviceModel[0]
                            else
                                deviceModel = ''
                        }
                    }
                }
                setDevice(`${ua.device.vendor ? `${ua.device.vendor}-` : ''}${deviceModel} | ${ua.os.name ? `${ua.os.name}-` : ''}${ua.os.version ? ua.os.version : ''} | ${ua.browser.name ? `${ua.browser.name}-` : ''}${ua.browser.version ? ua.browser.version : ''}`, await getClientGqlSsr(ctx.req))
            }
        }
        else {
            store.getState().user.profile = {}
        }
    }
    store.getState().app.columns = []
    store.getState().app.sort = '-createdAt'
    if(!ctx.pathname.includes(store.getState().app.filterType)) {
        store.getState().app.filterType = undefined
        store.getState().app.filter = {
            ...store.getState().app.filter.store ? {store: store.getState().app.filter.store} : {}
        }
        store.getState().app.search = ''
    }
    store.getState().app.date = undefined
    store.getState().app.load = false
    store.getState().app.drawer = false
    store.getState().mini_dialog.show = false
    store.getState().mini_dialog.showFull = false
    return { ua }

}

export default initialApp