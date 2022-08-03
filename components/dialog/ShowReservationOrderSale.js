import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import Button from '@mui/material/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'

const ShowReservationOrderSale =  React.memo(
    (props) =>{
        const { classes } = dialogContentStyle();
        const { list, type } = props;
        const { isMobileApp } = props.app;
        const { showMiniDialog, showFullDialog } = props.mini_dialogActions;
        const width = isMobileApp? (window.innerWidth-113) : 500
        return (
            <div className={classes.main} style={{width}}>
                <div className={isMobileApp?classes.fullDialogBody:classes.miniDialogBody}>
                    {
                        list.map(element=> <div key={element._id}>
                            <a href={`/${type}/${element._id}`} target='_blank'>
                                <div className={classes.row}>
                                    <div className={classes.nameField} style={{marginBottom: 0}}>
                                        {type==='order'?'На заказ':type==='reservation'?'Бронь':'Продажа'} №{element.number}:&nbsp;
                                    </div>
                                    <div className={classes.value} style={{marginBottom: 0}}>
                                        {element.amount} сом
                                    </div>
                                </div>
                            </a>
                            {
                                (element.itemsOrder?element.itemsOrder:element.itemsReservation?element.itemsReservation:element.itemsSale).map((item, idx)=>
                                    <div className={classes.row}>
                                        <div className={classes.value} style={{marginBottom: (idx+1)===(element.itemsOrder?element.itemsOrder:element.itemsReservation?element.itemsReservation:element.itemsSale).length?10:0}}>
                                            {item.name}: {item.count} {item.unit}
                                        </div>
                                    </div>
                                )
                            }
                        </div>)
                    }
                </div>
                <div>
                    <Button variant='contained' color='secondary' onClick={()=>{
                        showMiniDialog(false);
                        showFullDialog(false);
                    }} className={classes.button}>
                        Закрыть
                    </Button>
                </div>
            </div>
        );
    }
)

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

export default connect(mapStateToProps, mapDispatchToProps)(ShowReservationOrderSale)