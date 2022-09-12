import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React, { useState, useRef, useEffect } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import { getRefund, setRefund, getUnloadRefunds } from '../../src/gql/refund'
import { getWarehouses } from '../../src/gql/warehouse'
import pageListStyle from '../../src/styleMUI/list'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import { useRouter } from 'next/router'
import Router from 'next/router'
import * as userActions from '../../src/redux/actions/user'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import * as appActions from '../../src/redux/actions/app'
import TextField from '@mui/material/TextField';
import Confirmation from '../../components/dialog/Confirmation'
import { urlMain } from '../../src/const'
import { getClientGqlSsr } from '../../src/apollo'
import History from '../../components/dialog/History';
import HistoryIcon from '@mui/icons-material/History';
import { wrapper } from '../../src/redux/configureStore'
import { pdDDMMYYHHMM } from '../../src/lib'
import Link from 'next/link';
import AcceptRefund from '../../components/dialog/AcceptRefund'
import Menu from '@mui/material/Menu';

const colors = {
    'обработка': 'orange',
    'принят': 'green',
    'отмена': 'red',
    'доставлен': 'green',
    'возврат': 'red',
    'активна': 'orange',
    'оплачен': 'green',
    'перерасчет': 'red',
    'отгружен': 'blue',
}

const Refund = React.memo((props) => {
    const {classes} = pageListStyle();
    const { data } = props;
    const { isMobileApp } = props.app;
    const { showSnackBar } = props.snackbarActions;
    const { profile } = props.user;
    const unsaved = useRef();
    let [edit, setEdit] = useState(false);
    let [comment, setComment] = useState(data.object.comment);
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const router = useRouter()
    useEffect(()=>{
        if(!unsaved.current)
            unsaved.current = {}
        else if(edit)
            unsaved.current[router.query.id] = true
    },[edit])
    const [anchorElQuick, setAnchorElQuick] = useState(null);
    const openQuick = Boolean(anchorElQuick);
    let handleMenuQuick = (event) => {
        setAnchorElQuick(event.currentTarget);
    }
    let handleCloseQuick = () => {
        setAnchorElQuick(null);
    }
    return (
        <App unsaved={unsaved} pageName={data.object!==null?router.query.id==='new'?'Добавить':`Возврат №${data.object.number}`:'Ничего не найдено'}>
            <Head>
                <title>{data.object!==null?router.query.id==='new'?'Добавить':`Возврат №${data.object.number}`:'Ничего не найдено'}</title>
                <meta name='description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:title' content={data.object!==null?router.query.id==='new'?'Добавить':`Возврат №${data.object.number}`:'Ничего не найдено'} />
                <meta property='og:description' content='Inhouse.kg | МЕБЕЛЬ и КОВРЫ БИШКЕК' />
                <meta property='og:type' content='website'/>
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/refund/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/refund/${router.query.id}`}/>
            </Head>
            <Card className={classes.page}>
                <div className={classes.status}>
                    {
                        ['admin'].includes(profile.role)&&data.object&&data.object._id?
                            <HistoryIcon onClick={async()=>{
                                setMiniDialog('История', <History where={data.object._id}/>)
                                showMiniDialog(true)
                            }} style={{ color: '#10183D'}}/>
                            :
                            null
                    }
                </div>
                <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignItems: 'flex-start'}}>
                    {
                        data.object?
                            <>
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Возврат №:
                                </div>
                                <div className={classes.value}>
                                    {data.object.number}
                                </div>
                            </div>
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Статус:
                                </div>
                                <div className={classes.value} style={{color: colors[data.object.status], fontWeight: 'bold'}}>
                                    {data.object.status}
                                </div>
                                {
                                    data.object.paymentConfirmation?
                                        <>
                                        &nbsp;
                                        <Link
                                            href={{
                                                pathname: '/moneyflows',
                                                query: {refund: router.query.id}
                                            }}
                                            as={
                                                `/moneyflows?refund=${router.query.id}`
                                            }>
                                            <div className={classes.value} style={{color: 'green', fontWeight: 'bold', cursor: 'pointer'}}>
                                                оплачен
                                            </div>
                                        </Link>
                                        </>
                                        :
                                        null
                                }
                            </div>
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Создан:
                                </div>
                                <div className={classes.value}>
                                    {pdDDMMYYHHMM(data.object.createdAt)}
                                </div>
                            </div>
                            <Link href={`/${data.object.sale.order?'order':'sale'}/[id]`} as={`/${data.object.sale.order?'order':'sale'}/${data.object.sale._id}`}>
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Продажа:
                                    </div>
                                    <div className={classes.value}>
                                        №{data.object.sale.number}
                                    </div>
                                </div>
                            </Link>
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Магазин:
                                </div>
                                <div className={classes.value}>
                                    {data.object.store.name}
                                </div>
                            </div>
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Менеджер:
                                </div>
                                <div className={classes.value}>
                                    <Link href='/user/[id]' as={`/user/${data.object.manager._id}`} >
                                        {data.object.manager.name}
                                    </Link>
                                </div>
                            </div>
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Клиент:
                                </div>
                                <div className={classes.value}>
                                    <Link href='/client/[id]' as={`/client/${data.object.client._id}`}>
                                        {data.object.client.name}
                                    </Link>
                                </div>
                            </div>
                            {
                                data.object.discount?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Уценка:&nbsp;</div>
                                        <div className={classes.value}>{data.object.discount} сом</div>
                                    </div>
                                    :
                                    null
                            }
                            <div className={classes.row}>
                                <div className={classes.nameField}>Итого:&nbsp;</div>
                                <div className={classes.value}>{`${data.object.amount} сом`}</div>
                            </div>
                            {
                                edit?
                                    <TextField
                                        id='comment'
                                        variant='standard'
                                        label='Комментарий'
                                        className={classes.input}
                                        margin='normal'
                                        value={comment}
                                        onChange={(event)=>{setComment(event.target.value)}}
                                    />
                                    :
                                    comment?
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>Комментарий:&nbsp;</div>
                                            <div className={classes.value}>{data.object.comment}</div>
                                        </div>
                                        :
                                        null
                            }
                            <div style={{height: 10}}/>
                            <div className={classes.nameField}>Позиции({data.object.itemsRefund.length}):</div>
                            {data.object.itemsRefund.map((itemRefund, idx)=>
                                <div className={classes.column} key={`itemsRefund${idx}`}>
                                    <Link href='/item/[id]' as={`/item/${itemRefund.item}`} >
                                        <div className={classes.nameField} style={{color: 'black', marginBottom: 5}}>
                                            {idx+1}) {itemRefund.name}
                                        </div>
                                    </Link>
                                    <div className={classes.value} style={{fontWeight: 400, color: 'black', marginBottom: itemRefund.characteristics.length?5:10}}>
                                        {itemRefund.price} сом * {itemRefund.count} {itemRefund.unit} = {itemRefund.amount} сом
                                    </div>
                                    {
                                        itemRefund.characteristics.length?
                                            <div className={classes.value} style={{fontWeight: 400, wordBreak: 'break-word'}}>
                                                {itemRefund.characteristics.map((characteristic)=>`${characteristic[0]}: ${characteristic[1]}; `)}
                                            </div>
                                            :
                                            null
                                    }
                                </div>
                            )}
                            {
                                data.object.status==='обработка'?
                                    <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD}>
                                        {
                                            ['admin', 'менеджер', 'менеджер/завсклад', 'завсклад'].includes(profile.role)?
                                                edit?
                                                    <>
                                                    <Button color='primary' onClick={()=>{
                                                        setEdit(false)
                                                    }}>
                                                        Просмотр
                                                    </Button>
                                                    <Button color='primary' onClick={()=>{
                                                        const action = async () => {
                                                            let element = {_id: router.query.id}
                                                            if (comment !== data.object.comment) element.comment = comment
                                                            let res = await setRefund(element)
                                                            if (res && res !== 'ERROR') {
                                                                showSnackBar('Успешно', 'success')
                                                                Router.reload()
                                                            }
                                                            else
                                                                showSnackBar('Ошибка', 'error')
                                                        }
                                                        setMiniDialog('Вы уверены?', <Confirmation
                                                            action={action}/>)
                                                        showMiniDialog(true)
                                                    }}>
                                                        Сохранить
                                                    </Button>
                                                    </>
                                                    :
                                                    <>
                                                    {
                                                        ['admin', 'менеджер', 'менеджер/завсклад'].includes(profile.role)?
                                                            <Button color='primary' onClick={()=>{
                                                                setEdit(true)
                                                            }}>
                                                                Редактировать
                                                            </Button>
                                                            :
                                                            null
                                                    }
                                                    {
                                                        isMobileApp?
                                                            <>
                                                            <Menu
                                                                key='Quick'
                                                                id='menu-appbar'
                                                                anchorEl={anchorElQuick}
                                                                anchorOrigin={{
                                                                    vertical: 'bottom',
                                                                    horizontal: 'right',
                                                                }}
                                                                transformOrigin={{
                                                                    vertical: 'bottom',
                                                                    horizontal: 'right',
                                                                }}
                                                                open={openQuick}
                                                                onClose={handleCloseQuick}
                                                            >
                                                                {
                                                                    ['admin', 'завсклад', 'менеджер/завсклад'].includes(profile.role)?
                                                                        [
                                                                            <Button color='primary' onClick={async()=>{
                                                                                const warehouses = await getWarehouses({store: data.object.store._id})
                                                                                const acceptRefund = {}
                                                                                for(let i = 0; i <data.object.itemsRefund.length; i++) {
                                                                                    acceptRefund[data.object.itemsRefund[i].item] = []
                                                                                    for(let i1 = 0; i1 <warehouses.length; i1++) {
                                                                                        acceptRefund[data.object.itemsRefund[i].item].push({
                                                                                            _id: warehouses[i1]._id,
                                                                                            name: warehouses[i1].name,
                                                                                            count: ''
                                                                                        })
                                                                                    }
                                                                                }
                                                                                unsaved.current = {}
                                                                                setMiniDialog('Распределение', <AcceptRefund _acceptRefund={acceptRefund} items={data.object.itemsRefund} _id={data.object._id}/>)
                                                                                showMiniDialog(true)
                                                                            }}>
                                                                                Принять
                                                                            </Button>,
                                                                            <br/>
                                                                        ]
                                                                        :
                                                                        null
                                                                }
                                                                <Button color='primary' onClick={()=>getUnloadRefunds({_id: router.query.id})}>
                                                                    Выгрузить
                                                                </Button>
                                                            </Menu>
                                                            <Button color='primary' onClick={handleMenuQuick}>
                                                                Функции
                                                            </Button>
                                                            </>
                                                            :
                                                            <>
                                                                {
                                                                    ['admin', 'завсклад', 'менеджер/завсклад'].includes(profile.role)?
                                                                        <Button color='primary' onClick={async()=>{
                                                                            const warehouses = await getWarehouses({store: data.object.store._id})
                                                                            const acceptRefund = {}
                                                                            for(let i = 0; i <data.object.itemsRefund.length; i++) {
                                                                                acceptRefund[data.object.itemsRefund[i].item] = []
                                                                                for(let i1 = 0; i1 <warehouses.length; i1++) {
                                                                                    acceptRefund[data.object.itemsRefund[i].item].push({
                                                                                        _id: warehouses[i1]._id,
                                                                                        name: warehouses[i1].name,
                                                                                        count: ''
                                                                                    })
                                                                                }
                                                                            }
                                                                            unsaved.current = {}
                                                                            setMiniDialog('Распределение', <AcceptRefund _acceptRefund={acceptRefund} items={data.object.itemsRefund} _id={data.object._id}/>)
                                                                            showMiniDialog(true)
                                                                        }}>
                                                                            Принять
                                                                        </Button>
                                                                        :
                                                                        null
                                                                }
                                                                <Button color='primary' onClick={()=>getUnloadRefunds({_id: router.query.id})}>
                                                                    Выгрузить
                                                                </Button>
                                                            </>
                                                    }
                                                    {
                                                        ['admin', 'менеджер', 'менеджер/завсклад'].includes(profile.role)&&!data.object.paymentConfirmation?
                                                            <Button className={classes.rightBottomButton} color='secondary' onClick={()=>{
                                                                const action = async() => {
                                                                    let element = {_id: router.query.id, status: 'отмена'}
                                                                    let res = await setRefund(element)
                                                                    if(res&&res!=='ERROR') {
                                                                        showSnackBar('Успешно', 'success')
                                                                        Router.reload()
                                                                    }
                                                                    else
                                                                        showSnackBar('Ошибка', 'error')
                                                                }
                                                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                                                showMiniDialog(true)
                                                            }}>
                                                                Отменить
                                                            </Button>
                                                            :
                                                            null
                                                    }
                                                    </>
                                                :
                                                null
                                        }
                                    </div>
                                    :
                                    null
                            }
                            </>
                            :
                            'Ничего не найдено'
                    }
                </CardContent>
            </Card>
        </App>
    )
})

Refund.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', 'управляющий',  'кассир', 'менеджер', 'менеджер/завсклад', 'завсклад'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    let object = await getRefund({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
    return {
        data: {
            object
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

export default connect(mapStateToProps, mapDispatchToProps)(Refund);