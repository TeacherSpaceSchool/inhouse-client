import React from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import cardCashboxStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import Link from 'next/link';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import * as snackbarActions from '../src/redux/actions/snackbar'
import Confirmation from '../components/dialog/Confirmation'
import { pdDDMMYYHHMM } from '../src/lib'
import Router from 'next/router'
import {generateReportX} from '../src/gql/report'
import SyncOn from '@mui/icons-material/Sync';
import SyncOff from '@mui/icons-material/SyncDisabled';

const CardCashbox = React.memo((props) => {
    const {classes} = cardCashboxStyle();
    const { element, list, onlyShow } = props;
    const { isMobileApp } = props.app;
    const { profile } = props.user;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    return (
        <Card className={isMobileApp?classes.cardM:classes.cardD}>
            {
                !onlyShow&&['admin', 'superadmin', 'оператор'].includes(profile.role)?
                    element.sync?
                        <SyncOn color='primary' className={classes.sync}/>
                        :
                        <SyncOff color='secondary' className={classes.sync}/>
                    :
                    null
            }
            <Link href={list?'/cashbox/[id]':'#'} as={list?`/cashbox/${element._id}`:'#'}>
                <CardActionArea>
                    <CardContent>
                        {
                            element.presentCashier?
                                <div className={classes.status} style={{background: 'green'}}>Работает</div>
                                :
                                null
                        }
                        <h3>
                            {element.name}
                        </h3>
                        <br/>
                        {
                            ['admin', 'superadmin'].includes(profile.role)?
                                <>
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Регистрация:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {pdDDMMYYHHMM(element.createdAt)}
                                    </div>
                                </div>
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
                                РНМ:&nbsp;
                            </div>
                            <div className={classes.value}>
                                {element.rnmNumber}
                            </div>
                        </div>
                        <div className={classes.row}>
                            <div className={classes.nameField}>
                                Оплачен до:&nbsp;
                            </div>
                            <div className={classes.value} style={{color: element.endPayment&&element.endPayment>=new Date()?'green':'red'}}>
                                {element.endPayment?pdDDMMYYHHMM(element.endPayment):'не оплачен'}
                            </div>
                        </div>
                        {
                            element.branch?
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Объект:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {element.branch.name}
                                    </div>
                                </div>
                                :
                                null
                        }
                        <div className={classes.row}>
                            <div className={classes.nameField}>
                                Наличными:&nbsp;
                            </div>
                            <div className={classes.value}>
                                {element.cash} сом
                            </div>
                        </div>
                        {
                            element.presentCashier?
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Кассир:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {element.presentCashier.name}
                                    </div>
                                </div>
                                :
                                null
                        }
                    </CardContent>
                </CardActionArea>
            </Link>
            {
                !onlyShow&&element.presentCashier&&(['управляющий', 'супервайзер'].includes(profile.role)||['admin', 'superadmin'].includes(profile.role)&&profile.add)?
                    <CardActions>
                        <Button color='primary' onClick={async()=>{
                            let report = await generateReportX({cashbox: element._id})
                            if(report)
                                Router.push(`/report/${report}?type=X`)
                            else
                                showSnackBar('Смена просрочена', 'error')
                            /*const action = () => {
                            }
                            setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                            showMiniDialog(true)*/
                        }}>
                            Х-Отчет
                        </Button>
                    </CardActions>
                    :
                    null
            }
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
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardCashbox)