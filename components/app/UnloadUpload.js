import React, {useState} from 'react';
import { connect } from 'react-redux'
import Menu from '@mui/material/Menu';
import { bindActionCreators } from 'redux'
import * as appActions from '../../src/redux/actions/app'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import Upload from '../dialog/Upload'
import MenuItem from '@mui/material/MenuItem';
import Fab from '@mui/material/Fab';
import SwapVert from '@mui/icons-material/SwapVert';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import pageListStyle from '../../src/styleMUI/list'

const UnloadUpload =  React.memo(
    (props) =>{
        const {classes} = pageListStyle();
        const { position, upload, uploadText, unload } = props;
        const { showSnackBar } = props.snackbarActions;
        const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
        const [anchorElQuick, setAnchorElQuick] = useState(null);
        const openQuick = Boolean(anchorElQuick);
        let handleMenuQuick = (event) => {
            setAnchorElQuick(event.currentTarget);
        }
        let handleCloseQuick = () => {
            setAnchorElQuick(null);
        }
        return (
            <>
            <Menu
                key='Quick'
                id='menu-appbar'
                anchorEl={anchorElQuick}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={openQuick}
                onClose={handleCloseQuick}
            >
                {
                    upload?
                        <MenuItem onClick={()=>{
                            handleCloseQuick()
                            setMiniDialog('Загрузить', <Upload upload={upload} uploadText={uploadText} />)
                            showMiniDialog(true)
                        }}>
                            Загрузить
                        </MenuItem>
                        :
                        null
                }
                {
                    unload?
                        <MenuItem onClick={async ()=>{
                            handleCloseQuick()
                            let res = await unload()
                            if(res)
                                window.open(res, '_blank');
                            else
                                showSnackBar('Ошибка', 'error')
                        }}>
                            Выгрузить
                        </MenuItem>
                        :
                        null
                }
            </Menu>
            <Fab color='primary' aria-label='add' className={position==='Z'?classes.fabZ:position===4?classes.fab4:position===3?classes.fab3:position===2?classes.fab2:classes.fab} onClick={handleMenuQuick}>
                {upload&&unload?<SwapVert/>:upload?<ArrowUpward/>:<ArrowDownward/>}
            </Fab>
            </>
        );
    }
)

function mapStateToProps (state) {
    return {
        app: state.app,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UnloadUpload);