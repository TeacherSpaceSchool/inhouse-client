import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import cardFileStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'


const CardFile = React.memo((props) => {
    const {classes} = cardFileStyle();
    const { element } = props;
    const { isMobileApp } = props.app;
    return (
        <Card style={{border: `${element.active==='активен'?'green':'red'} solid 1px`}} className={isMobileApp?classes.cardM:classes.cardD}>
            <CardContent>
                <div className={classes.date}>
                    {element.createdAt}
                </div>
                <br/>
                <div className={classes.row}>
                    <div className={classes.nameField}>
                        Файл:&nbsp;
                    </div>
                    <div className={classes.value}>
                        {element.name}
                    </div>
                </div>
                <div className={classes.row}>
                    <div className={classes.nameField}>
                        Путь:&nbsp;
                    </div>
                    <div className={classes.value}>
                        {element.url}
                    </div>
                </div>
                <div className={classes.row}>
                    <div className={classes.nameField}>
                        Размер:&nbsp;
                    </div>
                    <div className={classes.value}>
                        {element.size} MB
                    </div>
                </div>
                <div className={classes.row}>
                    <div className={classes.nameField}>
                        Владелец:&nbsp;
                    </div>
                    <div className={classes.value}>
                        {element.owner}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
})

function mapStateToProps (state) {
    return {
        app: state.app
    }
}

export default connect(mapStateToProps)(CardFile)