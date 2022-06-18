import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import cardPaymentStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import Link from 'next/link';
import { pdDDMMYYHHMM } from '../src/lib'

const CardPayment = React.memo((props) => {
    const { profile } = props.user;
    const {classes} = cardPaymentStyle();
    const { element } = props;
    const { isMobileApp } = props.app;
    return (
        <Card className={isMobileApp?classes.cardM:classes.cardD}>
            <Link href='/payment/[id]' as={`/payment/${element._id}`}>
                <CardActionArea>
                    <CardContent>
                        {
                            element.refund?
                                <div className={classes.status} style={{background: 'red'}}>Возврат</div>
                                :
                                <div className={classes.status} style={{background: element.status==='Оплачен'?'green':'orange'}}>{element.status}</div>
                        }
                        <div className={classes.row}>
                            <div className={classes.nameField}>
                                Номер:&nbsp;
                            </div>
                            <div className={classes.value}>
                                {element.number}
                            </div>
                        </div>
                        {
                            element.who?
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Оператор:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {element.who.role} {element.who.name}
                                    </div>
                                </div>
                                :
                                null
                        }
                        {
                            ['admin', 'superadmin'].includes(profile.role)?
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Налогоплательщик:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {element.legalObject.name}
                                    </div>
                                </div>
                                :
                                null
                        }
                        <div className={classes.row}>
                            <div className={classes.nameField}>
                                Платежная система:&nbsp;
                            </div>
                            <div className={classes.value}>
                                {element.paymentSystem}
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
                        <div className={classes.row}>
                            <div className={classes.nameField}>
                                Сумма:&nbsp;
                            </div>
                            <div className={classes.value}>
                                {element.amount}
                            </div>
                        </div>
                        {
                            element.months?
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Месяцы:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {element.months}
                                    </div>
                                </div>
                                :
                                null
                        }
                        {
                            element.days?
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Дни:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {element.days}
                                    </div>
                                </div>
                                :
                                null
                        }
                        <div className={classes.row}>
                            <div className={classes.nameField}>
                                Количество касс:&nbsp;
                            </div>
                            <div className={classes.value}>
                                {element.cashboxes.length}
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

export default connect(mapStateToProps)(CardPayment)