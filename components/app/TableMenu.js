import React from 'react';
import { connect } from 'react-redux'
import Menu from '@mui/material/Menu';
import { bindActionCreators } from 'redux'
import * as appActions from '../../src/redux/actions/app'

const TableMenu =  React.memo(
    (props) =>{
        const { menuItems, anchorElQuick, setAnchorElQuick } = props;
        const openQuick = Boolean(anchorElQuick);
        let handleCloseQuick = () => setAnchorElQuick(null);
        return (
            <Menu
                key='Quick'
                id='menu-appbar'
                anchorEl={anchorElQuick}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={openQuick}
                onClose={handleCloseQuick}
                style={{gap: '10px'}}
            >
                {menuItems}
            </Menu>
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
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableMenu);