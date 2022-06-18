import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import cardReportStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import Link from 'next/link';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import { pdDDMMYYHHMM } from '../src/lib'
import * as snackbarActions from '../src/redux/actions/snackbar';
import SyncOn from '@mui/icons-material/Sync';
import SyncOff from '@mui/icons-material/SyncDisabled';

const CardReport = React.memo((props) => {
    const { profile } = props.user;
    const {classes} = cardReportStyle();
    const { element } = props;
    const { isMobileApp } = props.app;
    return (
        <Card className={isMobileApp?classes.cardM:classes.cardD}>
            {
                ['admin', 'superadmin', 'оператор'].includes(profile.role)?
                    element.sync?
                        <SyncOn color={element.syncMsg==='Фискальный режим отключен'?'secondary':'primary'} className={classes.sync}/>
                        :
                        <SyncOff color='secondary' className={classes.sync}/>
                    :
                    null
            }
            <Link
                href={{pathname: '/report/[id]', query: {type: element.type}}}
                as={`/report/${element._id}?type=${element.type}`}
            >
                <CardActionArea>
                    <CardContent>
                        <div className={classes.row}>
                            <div className={classes.nameField}>
                                Номер:&nbsp;
                            </div>
                            <div className={classes.value}>
                                {element.number}
                            </div>
                        </div>
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
                        {
                            element.workShift?
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Смена:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {element.workShift.number}
                                    </div>
                                </div>
                                :
                                null
                        }
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
                                Дата:&nbsp;
                            </div>
                            <div className={classes.value}>
                                {`${pdDDMMYYHHMM(element.start)}${element.end?` - ${pdDDMMYYHHMM(element.end)}`:''}`}
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
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardReport)