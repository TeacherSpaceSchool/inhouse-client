import React from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import cardClientStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import { pdDDMMYYHHMM } from '../src/lib'
import Link from 'next/link';

const CardClient = React.memo((props) => {
    const {classes} = cardClientStyle();
    const { element } = props;
    const { isMobileApp } = props.app;
    const { profile } = props.user;
    return (
        <Card className={isMobileApp?classes.cardM:classes.cardD}>
            <Link href='/client/[id]' as={`/client/${element._id}`}>
                <CardActionArea>
                    <CardContent>
                        <h3>
                            {element.name}
                        </h3>
                        <br/>
                        <div className={classes.row}>
                            <div className={classes.nameField}>
                                Регистрация:&nbsp;
                            </div>
                            <div className={classes.value}>
                                {pdDDMMYYHHMM(element.createdAt)}
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
                            element.inn?
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        ИНН:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {element.inn}
                                    </div>
                                </div>
                                :
                                null
                        }
                        {
                            element.address.length?
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Адрес:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {element.address}
                                    </div>
                                </div>
                                :
                                null
                        }
                        {
                            element.phone.length?
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Телефон:&nbsp;
                                    </div>
                                    <div>
                                        {element.phone.map((phone, idx)=>
                                            idx<4?
                                                <div key={`phone${idx}`} className={classes.value}>
                                                    {phone}
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
                        {
                            element.email.length?
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Email:&nbsp;
                                    </div>
                                    <div>
                                        {element.email.map((email, idx)=>
                                            idx<4?
                                                <div key={`email${idx}`} className={classes.value}>
                                                    {email}
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

export default connect(mapStateToProps, mapDispatchToProps)(CardClient)