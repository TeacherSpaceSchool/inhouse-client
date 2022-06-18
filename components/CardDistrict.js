import React from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import cardDistrictStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import { pdDDMMYYHHMM } from '../src/lib'
import Link from 'next/link';

const CardDistrict = React.memo((props) => {
    const {classes} = cardDistrictStyle();
    const { element } = props;
    const { isMobileApp } = props.app;
    const { profile } = props.user;
    return (
        <Card className={isMobileApp?classes.cardM:classes.cardD}>
            <Link href='/district/[id]' as={`/district/${element._id}`}>
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
                        {
                            element.supervisors.length?
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Супервайзеры:&nbsp;
                                    </div>
                                    <div>
                                        {element.supervisors.map((supervisor, idx)=>
                                            idx<4?
                                                <div key={`supervisor${idx}`} className={classes.value}>
                                                    {supervisor.name}
                                                </div>
                                                :
                                                idx===4?
                                                    '...'
                                                    :
                                                    null
                                        )}
                                    </div>
                                </div>
                                :
                                null
                        }
                        <div className={classes.row}>
                            <div className={classes.nameField}>
                                Объектов:&nbsp;
                            </div>
                            <div className={classes.value}>
                                {element.branchs.length}
                            </div>
                        </div>
                        <div className={classes.row}>
                            <div className={classes.nameField}>
                                Кассиров:&nbsp;
                            </div>
                            <div className={classes.value}>
                                {element.cashiers.length}
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

export default connect(mapStateToProps, mapDispatchToProps)(CardDistrict)