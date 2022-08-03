import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import { pdDDMMYYHHMM } from '../../src/lib'
import Button from '@mui/material/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import {getHistory} from '../../src/gql/history'

const History =  React.memo(
    (props) =>{
        const { classes } = dialogContentStyle();
        const { where } = props;
        const { showMiniDialog } = props.mini_dialogActions;
        let [history, setHistory] = useState([]);
        useEffect(()=>{
            (async()=>{
                setHistory(await getHistory({where}))
            })()
        },[where])
        const { isMobileApp } = props.app;
        const width = isMobileApp? (window.innerWidth-113) : 500
        return (
            <div className={classes.main} style={{width, alignItems: 'baseline'}}>
                {history?history.map((element)=>
                    <div  key={element._id}>
                        <div className={classes.row}>
                            <div className={classes.nameField}>
                                Дата:&nbsp;
                            </div>
                            <div className={classes.value}>
                                {pdDDMMYYHHMM(element.createdAt)}
                            </div>
                        </div>
                        {
                            element.who?
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Кто:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {element.who.role} {element.who.name}
                                    </div>
                                </div>
                                :
                                null
                        }
                        {
                            element.what?
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Что:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {element.what}
                                    </div>
                                </div>
                                :
                                null
                        }
                        <br/>
                    </div>
                ):null}
                <center style={{width: '100%'}}>
                    <Button variant='contained' color='secondary' onClick={()=>{showMiniDialog(false);}} className={classes.button}>
                        Закрыть
                    </Button>
                </center>
            </div>
        );
    }
)

function mapStateToProps (state) {
    return {
        app: state.app
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(History)