import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import cardUserStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import Link from 'next/link';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import { onoffUser  } from '../src/gql/user'
import { pdDDMMYYHHMM  } from '../src/lib'
import Confirmation from '../components/dialog/Confirmation'
import NotificationsActive from '@mui/icons-material/NotificationsActive';
import NotificationsOff from '@mui/icons-material/NotificationsOff';

const CardUser = React.memo((props) => {
    const {classes} = cardUserStyle();
    const { element, list } = props;
    const { isMobileApp } = props.app;
    const { profile } = props.user;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    let [status, setStatus] = useState(element!==undefined?element.status:'');
    return (
        <Card className={isMobileApp?classes.cardM:classes.cardD}>
            {
                ['admin', 'superadmin'].includes(profile.role)?
                    element.notification?
                        <NotificationsActive style={{color: '#10183D', fontSize: '1.5rem'}} className={classes.status}/>
                        :
                        <NotificationsOff  style={{color: 'red', fontSize: '1.5rem'}} className={classes.status}/>
                    :
                    null
            }
            <Link href={'/user/[id]'} as={`/user/${element._id}`}>
                <CardActionArea>
                    <CardContent>
                        <h3>
                            {element.name}
                        </h3>
                        <br/>
                        {element.legalObject&&['admin', 'superadmin'].includes(profile.role)?
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
                        {element.branch?
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
                                Роль:&nbsp;
                            </div>
                            <div className={classes.value}>
                                {element.role}
                            </div>
                        </div>
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
                        {['admin', 'superadmin'].includes(profile.role)?
                            <>
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Регистрация:&nbsp;
                                </div>
                                <div className={classes.value}>
                                    {pdDDMMYYHHMM(element.createdAt)}
                                </div>
                            </div>
                            {element.updatedAt?
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Изменен:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {pdDDMMYYHHMM(element.updatedAt)}
                                    </div>
                                </div>
                                :
                                null
                            }
                            {
                                element.lastActive?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Активность:&nbsp;
                                        </div>
                                        <div className={classes.value}>
                                            {pdDDMMYYHHMM(element.lastActive)}
                                        </div>
                                    </div>
                                    :
                                    null
                            }
                            </>
                            :
                            null
                        }
                    </CardContent>
                </CardActionArea>
            </Link>
            {
                ['admin', 'superadmin'].includes(profile.role)&&list&&profile.add?
                    <CardActions>
                        {
                            !element.del?
                                <>
                                <Button onClick={async()=>{
                                    const action = async() => {
                                        await onoffUser(element._id)
                                        setStatus(status==='active'?'deactive':'active')
                                    }
                                    setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                    showMiniDialog(true)
                                }} color={status==='active'?'primary':'secondary'}>
                                    {status==='active'?'Отключить':'Включить'}
                                </Button>
                                </>
                                :
                                null
                        }
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
        user: state.user,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardUser)