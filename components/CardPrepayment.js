import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import cardStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import CardActionArea from '@mui/material/CardActionArea';
import Link from 'next/link';

const CardPrepayment = React.memo((props) => {
    const {classes} = cardStyle();
    const { element } = props;
    const { isMobileApp } = props.app;
    const { profile } = props.user;
    return (
        <Card className={isMobileApp?classes.cardM:classes.cardD}>
            <CardActionArea>
                <CardContent>
                    <Link href='/client/[id]' as={`/client/${element.client._id}`}>
                        <a>
                            <h3>
                                {element.client.name}
                            </h3>
                        </a>
                    </Link>
                    <br/>
                    {
                        ['superadmin', 'admin'].includes(profile.role)?
                            <Link href='/legalobject/[id]' as={`/legalobject/${element.legalObject._id}`}>
                                <a>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>
                                            Налогоплательщик:&nbsp;
                                        </div>
                                        <div className={classes.value}>
                                            {element.legalObject.name}
                                        </div>
                                    </div>
                                </a>
                            </Link>
                            :
                            null
                    }
                    <div className={classes.row}>
                        <div className={classes.nameField}>
                            Остаток:&nbsp;
                        </div>
                        <div className={classes.value}>
                            {element.balance} сом
                        </div>
                    </div>
                    <div className={classes.row}>
                        <div className={classes.nameField}>
                            Использовано:&nbsp;
                        </div>
                        <div className={classes.value}>
                            {element.used} сом
                        </div>
                    </div>
                    <div className={classes.row}>
                        <div className={classes.nameField}>
                            Оплачено:&nbsp;
                        </div>
                        <div className={classes.value}>
                            {element.prepayment} сом
                        </div>
                    </div>
                </CardContent>
            </CardActionArea>
        </Card>
    );
})

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

export default connect(mapStateToProps)(CardPrepayment)