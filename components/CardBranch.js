import React from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import cardBranchStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import Link from 'next/link';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import { pdDDMMYYHHMM } from '../src/lib'
import SyncOn from '@mui/icons-material/Sync';
import SyncOff from '@mui/icons-material/SyncDisabled';

const CardBranch = React.memo((props) => {
    const {classes} = cardBranchStyle();
    const { element, list } = props;
    const { isMobileApp } = props.app;
    const { profile } = props.user;
    return (
        <Card className={isMobileApp?classes.cardM:classes.cardD}>
            {
                ['admin', 'superadmin', 'оператор'].includes(profile.role)?
                    element.sync?
                        <SyncOn color='primary' className={classes.sync}/>
                        :
                        <SyncOff color='secondary' className={classes.sync}/>
                    :
                    null
            }
            <Link href={list?'/branch/[id]':'#'} as={list?`/branch/${element._id}`:'#'}>
                <CardActionArea>
                    <CardContent>
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
                                Тип:&nbsp;
                            </div>
                            <div className={classes.value}>
                                {element.pType}
                            </div>
                        </div>
                        <div className={classes.row}>
                            <div className={classes.nameField}>
                                Деятельность:&nbsp;
                            </div>
                            <div className={classes.value}>
                                {element.bType}
                            </div>
                        </div>
                        <div className={classes.row}>
                            <div className={classes.nameField}>
                                Адрес:&nbsp;
                            </div>
                            <div className={classes.value}>
                                {element.address}
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

export default connect(mapStateToProps, mapDispatchToProps)(CardBranch)