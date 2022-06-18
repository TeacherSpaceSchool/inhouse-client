import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import cardStyle from '../src/styleMUI/card'
import { pdDDMMYYHHMM } from '../src/lib'
import { connect } from 'react-redux'

const CardFullDeleteLegalObject = React.memo((props) => {
    const {classes} = cardStyle();
    const { element } = props;
    const { isMobileApp } = props.app;
    return (
        <Card className={isMobileApp?classes.cardM:classes.cardD}>
            <CardContent>
                <h3>
                    {element.legalObject}
                </h3>
                <br/>
                <div className={classes.row}>
                    <div className={classes.nameField}>
                        Статус:&nbsp;
                    </div>
                    <div className={classes.value} style={{color: element.status==='Обработка'?'orange':element.status==='Данные успешно удалены'?'green':'red'}}>
                        {element.status}
                    </div>
                </div>
                <div className={classes.row}>
                    <div className={classes.nameField}>
                        Начало:&nbsp;
                    </div>
                    <div className={classes.value}>
                        {pdDDMMYYHHMM(element.createdAt)}
                    </div>
                </div>
                {
                    element.end?
                        <div className={classes.row}>
                            <div className={classes.nameField}>
                                Конец:&nbsp;
                            </div>
                            <div className={classes.value}>
                                {pdDDMMYYHHMM(element.end)}
                            </div>
                        </div>
                        :
                        null
                }
            </CardContent>
        </Card>
    );
})

function mapStateToProps (state) {
    return {
        app: state.app
    }
}

export default connect(mapStateToProps)(CardFullDeleteLegalObject)