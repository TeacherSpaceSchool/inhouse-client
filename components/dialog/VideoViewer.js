import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import Button from '@mui/material/Button';

const VideoViewer =  React.memo(
    (props) =>{
        const { showFullDialog } = props.mini_dialogActions;
        const { classes } = dialogContentStyle();
        const { video } = props;
        return (
            <div className={classes.column}>
                <iframe style={{height: window.innerHeight-145, width: window.innerWidth-48}} src={video} frameborder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen='allowfullscreen'/>
                <center style={{width: window.innerWidth-48}}>
                    <Button variant='contained' color='secondary' onClick={()=>{showFullDialog(false);}} className={classes.button}>
                            Закрыть
                    </Button>
                </center>
            </div>
        );
    }
)

function mapStateToProps () {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoViewer)