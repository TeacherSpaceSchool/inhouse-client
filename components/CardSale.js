import React from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import cardSaleStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import Link from 'next/link';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import { pdDDMMYYHHMM } from '../src/lib'
import { checkFloat } from '../src/lib';
import SyncOn from '@mui/icons-material/Sync';
import SyncOff from '@mui/icons-material/SyncDisabled';
const colors = {
    'Продажа': 'green',
    'Кредит': 'orange',
    'Возврат': 'red',
    'Погашение кредита': 'green',
    'Аванс': 'green',
    'Возврат аванса': 'red',
    'Покупка': 'blue',
    'Возврат покупки': 'red'
}

const CardSale = React.memo((props) => {
    const {classes} = cardSaleStyle();
    const { element, limit, path } = props;
    const { isMobileApp, search } = props.app;
    const { profile } = props.user;
    return (
        <Card className={isMobileApp?classes.cardM:classes.cardD} onClick={() => {
            if(!search) {
                let appBody = (document.getElementsByClassName('App-body'))[0]
                sessionStorage.scrollPostionStore = appBody.scrollTop
                sessionStorage.scrollPostionName = path
                sessionStorage.scrollPostionLimit = limit
            }
        }}>
            {
                ['admin', 'superadmin', 'оператор'].includes(profile.role)?
                    element.sync?
                        <SyncOn color={element.syncMsg==='Фискальный режим отключен'?'secondary':'primary'} className={classes.sync}/>
                        :
                        <SyncOff color='secondary' className={classes.sync}/>
                    :
                    null
            }
            <Link href='/sale/[id]' as={`/sale/${element._id}`}>
                <CardActionArea>
                    <CardContent>
                        <div className={classes.status} style={{background: colors[element.type]}}>{`${element.type}${element.returned||element.used?` - ${element.returned?'возврат':''} ${element.used?'использован':''}`:''}`}</div>
                        <div className={classes.row}>
                            <div className={classes.nameField}>
                                Номер:&nbsp;
                            </div>
                            <div className={classes.value}>
                                {element.number}
                            </div>
                        </div>
                        <div className={classes.row}>
                            <div className={classes.nameField}>
                                Дата:&nbsp;
                            </div>
                            <div className={classes.value}>
                                {pdDDMMYYHHMM(element.createdAt)}
                            </div>
                        </div>
                        {
                            ['admin', 'superadmin'].includes(profile.role)?
                                <>
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Налогоплательщик:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {element.legalObject.name}
                                    </div>
                                </div>
                                </>
                                :
                                null
                        }
                        <div className={classes.row}>
                            <div className={classes.nameField}>
                                Объект:&nbsp;
                            </div>
                            <div className={classes.value}>
                                {element.branch.name}
                            </div>
                        </div>
                        <div className={classes.row}>
                            <div className={classes.nameField}>
                                Смена:&nbsp;
                            </div>
                            <div className={classes.value}>
                                {element.workShift.number}
                            </div>
                        </div>
                        <div className={classes.row}>
                            <div className={classes.nameField}>
                                Касса:&nbsp;
                            </div>
                            <div className={classes.value}>
                                {element.cashbox.name}
                            </div>
                        </div>
                        <div className={classes.row}>
                            <div className={classes.nameField}>
                                Кассир:&nbsp;
                            </div>
                            <div className={classes.value}>
                                {element.cashier.name}
                            </div>
                        </div>
                        {
                            element.discountItems+element.discount?
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Скидка:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {checkFloat(element.discountItems+element.discount)} сом
                                    </div>
                                </div>
                                :
                                null
                        }
                        {
                            element.extraItems+element.extra?
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Наценка:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {checkFloat(element.extraItems+element.extra)} сом
                                    </div>
                                </div>
                                :
                                null
                        }
                        {
                            element.type==='Кредит'?
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Кредит:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {checkFloat(element.amountEnd-element.paid)} сом
                                    </div>
                                </div>
                                :
                                null
                        }
                        <div className={classes.row}>
                            <div className={classes.nameField}>
                                Итого:&nbsp;
                            </div>
                            <div className={classes.value}>
                                {element.amountEnd} сом
                            </div>
                        </div>
                    </CardContent>
                </CardActionArea>
            </Link>
        </Card>
    );
})

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardSale)