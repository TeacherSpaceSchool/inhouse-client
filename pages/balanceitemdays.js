import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import {getBalanceItemDays, getBalanceItemDaysCount, getUnloadBalanceItemDays} from '../src/gql/balanceItemDay'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import pageListStyle from '../src/styleMUI/list'
import { urlMain } from '../src/const'
import { cloneObject, pdDDMMYYYY } from '../src/lib'
import Router from 'next/router'
import { forceCheck } from 'react-lazyload';
import { getClientGqlSsr } from '../src/apollo'
import initialApp from '../src/initialApp'
import * as snackbarActions from '../src/redux/actions/snackbar'
import { bindActionCreators } from 'redux'
import { wrapper } from '../src/redux/configureStore'
import Card from '@mui/material/Card';
import Link from 'next/link';
import UnloadUpload from '../components/app/UnloadUpload';

const StoreBalanceItems = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const { isMobileApp, filter } = props.app;
    const initialRender = useRef(true);
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const getList = async ()=>{
        setList(cloneObject(await getBalanceItemDays({
            skip: 0,
            ...filter.warehouse?{warehouse: filter.warehouse._id}:{},
            ...filter.dateStart&&filter.dateStart.length?{dateStart: filter.dateStart}:{},
            ...filter.dateEnd&&filter.dateEnd.length?{dateEnd: filter.dateEnd}:{},
            ...filter.item?{item: filter.item._id}:{},
            ...filter.store?{store: filter.store._id}:{}
        })));
        setCount(await getBalanceItemDaysCount({
            ...filter.warehouse?{warehouse: filter.warehouse._id}:{},
            ...filter.dateStart&&filter.dateStart.length?{dateStart: filter.dateStart}:{},
            ...filter.dateEnd&&filter.dateEnd.length?{dateEnd: filter.dateEnd}:{},
            ...filter.item?{item: filter.item._id}:{},
            ...filter.store?{store: filter.store._id}:{}
        }));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
    }
    useEffect(()=>{
        (async()=>{
            if(initialRender.current)
                initialRender.current = false;
            else
                await getList()
        })()
    },[filter])
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = cloneObject(await getBalanceItemDays({
                skip: list.length,
                ...filter.warehouse?{warehouse: filter.warehouse._id}:{},
                ...filter.dateStart&&filter.dateStart.length?{dateStart: filter.dateStart}:{},
                ...filter.dateEnd&&filter.dateEnd.length?{dateEnd: filter.dateEnd}:{},
                ...filter.item?{item: filter.item._id}:{},
                ...filter.store?{store: filter.store._id}:{}
            }))
            if(addedList&&addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    return (
        <App checkPagination={checkPagination} filterShow={{item: true, store: true, warehouse: true, period: true}} pageName='???????????????? ???? ??????????????'>
            <Head>
                <title>???????????????? ???? ??????????????</title>
                <meta name='description' content='Inhouse.kg | ???????????? ?? ?????????? ????????????' />
                <meta property='og:title' content='???????????????? ???? ??????????????' />
                <meta property='og:description' content='Inhouse.kg | ???????????? ?? ?????????? ????????????' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/balanceitemdays`} />
                <link rel='canonical' href={`${urlMain}/balanceitemdays`}/>
            </Head>
            <div className={classes.tableHead} style={{width: 'fit-content'}}>
                <div className={classes.tableCell} style={{width: 110, justifyContent: 'center'}}>
                    ????????
                </div>
                <div className={classes.tableCell} style={{width: 150, justifyContent: 'center'}}>
                    ??????????????
                </div>
                <div className={classes.tableCell} style={{width: 150, justifyContent: 'center'}}>
                    ??????????
                </div>
                <div className={classes.tableCell} style={{width: isMobileApp?200:300, justifyContent: 'center'}}>
                    ????????????
                </div>
                <div className={classes.tableCell} style={{width: 150, justifyContent: 'center'}}>
                    ??????????????????
                </div>
                <div className={classes.tableCell} style={{width: 150, justifyContent: 'center'}}>
                    ??????????????
                </div>
                <div className={classes.tableCell} style={{width: 200, justifyContent: 'center'}}>
                    ????????????
                </div>
            </div>
            <Card className={classes.page} style={{width: 'fit-content'}}>
                <div className={classes.table}>
                    {list&&list.map((element) =>
                        <div className={classes.tableRow}>
                            <div className={classes.tableCell} style={{width: 110, justifyContent: 'center'}}>
                                {pdDDMMYYYY(element.date)}
                            </div>
                            <div className={classes.tableCell} style={{width: 150, justifyContent: 'center'}}>
                                {element.store.name}
                            </div>
                            <div className={classes.tableCell} style={{width: 150, justifyContent: 'center'}}>
                                {element.warehouse.name}
                            </div>
                            <div className={classes.tableCell} style={{width: isMobileApp?200:300, justifyContent: 'center'}}>
                                <Link href='/item/[id]' as={`/item/${element.item._id}`}>
                                    <a>
                                        {element.item.name}
                                    </a>
                                </Link>
                            </div>
                            <div className={classes.tableCell} style={{width: 150, justifyContent: 'center'}}>
                                {element.item.category.name}
                            </div>
                            <div className={classes.tableCell} style={{width: 150, justifyContent: 'center'}}>
                                {element.item.factory.name}
                            </div>
                            <div className={classes.tableCell} style={{flexDirection: 'column', width: 200, justifyContent: 'center'}}>
                                <div className={classes.row}>
                                    <div className={classes.value}>
                                        ???? ????????????:&nbsp;
                                    </div>
                                    <div>
                                        {element.startAmount}
                                    </div>
                                </div>
                                <div className={classes.row}>
                                    <div className={classes.value}>
                                        ???? ??????????:&nbsp;
                                    </div>
                                    <div>
                                        {element.endAmount}
                                    </div>
                                </div>
                                <div className={classes.row}>
                                    <div className={classes.value}>
                                        ??????????????????:&nbsp;
                                    </div>
                                    <div>
                                        {element.plus}
                                    </div>
                                </div>
                                <div className={classes.row}>
                                    <div className={classes.value}>
                                        ????????:&nbsp;
                                    </div>
                                    <div>
                                        {element.minus}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
            <div className='count'>
                {`??????????: ${count}`}
            </div>
            <UnloadUpload unload={()=>getUnloadBalanceItemDays({
                ...filter.warehouse?{warehouse: filter.warehouse._id}:{},
                ...filter.dateStart&&filter.dateStart.length?{dateStart: filter.dateStart}:{},
                ...filter.dateEnd&&filter.dateEnd.length?{dateEnd: filter.dateEnd}:{},
                ...filter.item?{item: filter.item._id}:{},
                ...filter.store?{store: filter.store._id}:{}
            })}/>
        </App>
    )
})

StoreBalanceItems.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', '????????????????/????????????????', '??????????????????????', '????????????????'].includes(store.getState().user.profile.role))
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
        data: {
            list: cloneObject(await getBalanceItemDays({
                skip: 0,
                ...store.getState().app.filter.store?{store: store.getState().app.filter.store._id}:{},
            },  ctx.req?await getClientGqlSsr(ctx.req):undefined)),
            count: await getBalanceItemDaysCount({
                ...store.getState().app.filter.store?{store: store.getState().app.filter.store._id}:{},
            }, ctx.req?await getClientGqlSsr(ctx.req):undefined),
        }
    };
})

function mapStateToProps (state) {
    return {
        app: state.app,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreBalanceItems);