import React, { useState, useEffect, useRef } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import * as userActions from '../../src/redux/actions/user'
import * as appActions from '../../src/redux/actions/app'
import appbarStyle from '../../src/styleMUI/appbar'
import QrCodeScanner from '@mui/icons-material/QrCodeScanner';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import Paper from '@mui/material/Paper';
import Cancel from '@mui/icons-material/Cancel';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import Search from '@mui/icons-material/SearchRounded';
import Sort from '@mui/icons-material/SortRounded';
import FilterList from '@mui/icons-material/FilterListRounded';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Badge from '@mui/material/Badge';
import Sign from '../dialog/Sign'
import Filter from '../dialog/Filter'
import Confirmation from '../dialog/Confirmation'
import dynamic from 'next/dynamic';
const Scan = dynamic(import('../dialog/Scan'), { ssr: false });

const MyAppBar = React.memo((props) => {
    const initialRender = useRef(true);
    const {classes} = appbarStyle();
    const { sorts, pageName, searchShow, unread, filterShow, qrScannerShow} = props
    const { drawer, search, filter, sort, isMobileApp } = props.app;
    const { showDrawer, setSearch, setSort } = props.appActions;
    const { authenticated } = props.user;
    const { setMiniDialog, showMiniDialog, setFullDialog, showFullDialog } = props.mini_dialogActions;
    const { logout } = props.userActions;
    const [anchorElMobileMenu, setAnchorElMobileMenu] = React.useState(null);
    const openMobileMenu = Boolean(anchorElMobileMenu);
    let handleMobileMenu = (event) => {
        setAnchorElMobileMenu(event.currentTarget);
    }
    let handleCloseMobileMenu = () => {
        setAnchorElMobileMenu(null);
    }
    const [anchorElSort, setAnchorElSort] = useState(null);
    const openSort = Boolean(anchorElSort);
    let handleMenuSort = (event) => {
        setAnchorElSort(event.currentTarget);
    }
    let handleCloseSort = () => {
        setAnchorElSort(null);
    }
    const [openSearch, setOpenSearch] = useState(search&&searchShow);
    let handleSearch = (event) => {
        setSearch(event.target.value)
    };
    useEffect(()=>{
        if(!initialRender.current) {
            if (!openSearch&&search)
                setOpenSearch(true)
        }
    },[search])
    useEffect(()=>{
        if(initialRender.current) {
            initialRender.current = false;
        } else {
            if (document.getElementById('search'))
                document.getElementById('search').focus();
        }
    },[openSearch])
    return (
        <div className={classes.root}>
            <AppBar position='fixed' className='appBar'>
                <Toolbar>
                    <IconButton
                        edge='start'
                        aria-owns='menu-appbar'
                        aria-haspopup='true'
                        onClick={() => {showDrawer(!drawer)}}
                        color='inherit'
                    >
                        <Badge variant='dot' invisible={openSearch||!isMobileApp||!unread.orders&&!unread.returneds} color='secondary'>
                            <MenuIcon/>
                        </Badge>
                    </IconButton>
                    <Typography onClick={() => {showDrawer(!drawer)}} variant='h6' className={classes.title}>
                        {pageName}
                    </Typography>
                    {isMobileApp?
                        openSearch?
                            <Paper className={classes.searchM}>
                                <Input className={classes.searchField}
                                       value={search}
                                       id='searchM'
                                       onChange={handleSearch}
                                       endAdornment={
                                           <InputAdornment position='end'>
                                               <IconButton aria-label='Search' onClick={()=>{setSearch('');setOpenSearch(false)}}>
                                                   <Cancel />
                                               </IconButton>
                                           </InputAdornment>
                                       }/>
                            </Paper>
                            :
                            <>
                            {
                                qrScannerShow||filterShow||searchShow||sorts?
                                    <IconButton
                                        style={{background: JSON.stringify(filter)!=='{}'?'rgba(255, 255, 255, 0.2)':'transparent'}}
                                        aria-owns={openMobileMenu ? 'menu-appbar' : undefined}
                                        aria-haspopup='true'
                                        onClick={handleMobileMenu}
                                        color='inherit'
                                    >
                                        <Search />
                                    </IconButton>
                                    :
                                    null
                            }
                            <Menu
                                id='menu-appbar'
                                anchorEl={anchorElMobileMenu}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                open={openMobileMenu}
                                onClose={handleCloseMobileMenu}
                            >
                                {
                                    searchShow?
                                        <MenuItem key='search' onClick={()=>{
                                            setOpenSearch(true);
                                            handleCloseMobileMenu();
                                            setTimeout(()=>{
                                                if(document.getElementById('searchM'))
                                                    document.getElementById('searchM').focus()
                                            })
                                        }}>
                                            <div style={{display: 'flex'}}>
                                                <Search/>&nbsp;Поиск
                                            </div>
                                        </MenuItem>
                                        :
                                        null
                                }
                                {
                                    qrScannerShow?
                                        <MenuItem key='search' onClick={()=>{
                                            setFullDialog('Сканер', <Scan/>)
                                            showFullDialog(true)
                                            handleCloseMobileMenu();
                                        }}>
                                            <div style={{display: 'flex'}}>
                                                <QrCodeScanner/>&nbsp;Сканер
                                            </div>
                                        </MenuItem>
                                        :
                                        null
                                }
                                {filterShow?
                                    <MenuItem key='filterMenu' style={{background: JSON.stringify(filter)!=='{}'?'rgba(0, 0, 0, 0.1)':'transparent'}} onClick={()=>{
                                        handleCloseMobileMenu()
                                        setMiniDialog('Фильтр', <Filter filterShow={filterShow}/>)
                                        showMiniDialog(true)
                                    }}>
                                        <div style={{display: 'flex'}}>
                                            <FilterList/>&nbsp;Фильтр
                                        </div>
                                    </MenuItem>
                                    :null
                                }
                                {sorts&&sorts.length>0?
                                    [
                                        <MenuItem key='sortMenu' onClick={handleMenuSort}>
                                            <div style={{display: 'flex'}}>
                                                <Sort/>&nbsp;Сортировка
                                            </div>
                                        </MenuItem>,
                                        <Menu
                                            key='sort'
                                            id='menu-appbar'
                                            anchorEl={anchorElSort}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                            open={openSort}
                                            onClose={handleCloseSort}
                                        >
                                            {sorts.map((elem, idx)=><MenuItem key={'sort'+idx} onClick={()=>{sort===`-${elem.field}`?setSort(elem.field):setSort(`-${elem.field}`);handleCloseSort();handleCloseMobileMenu()}}>{sort===`-${elem.field}`?<ArrowDownward />:sort===elem.field?<ArrowUpward />:<div style={{width: '24px'}}/>}{elem.name}</MenuItem>)}
                                        </Menu>
                                    ]
                                    :null
                                }
                            </Menu>
                            {
                                authenticated?
                                    <Tooltip title='Выйти'>
                                        <IconButton
                                            aria-owns='menu-appbar'
                                            aria-haspopup='true'
                                            color='inherit'
                                            onClick={()=>{
                                                const action = async() => {
                                                    logout(true)
                                                }
                                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                                showMiniDialog(true)
                                            }}
                                        >
                                            <LogoutIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    :
                                    <Tooltip title='Войти'>
                                        <IconButton
                                            aria-owns='menu-appbar'
                                            aria-haspopup='true'
                                            color='inherit'
                                            onClick={()=>{
                                                setMiniDialog('Вход', <Sign isMobileApp={isMobileApp}/>)
                                                showMiniDialog(true)
                                            }}
                                        >
                                            <LoginIcon/>
                                        </IconButton>
                                    </Tooltip>
                            }
                            </>
                        :
                        openSearch?
                            <Paper className={classes.searchD}>
                                <Input className={classes.searchField}
                                       value={search}
                                       id='searchD'
                                       onChange={handleSearch}
                                       endAdornment={
                                           <InputAdornment position='end'>
                                               <IconButton aria-label='Search' onClick={()=>{setSearch('');setOpenSearch(false)}}>
                                                   <Cancel />
                                               </IconButton>
                                           </InputAdornment>
                                       }/>
                            </Paper>
                            :
                            <>
                            {filterShow?
                                <>
                                <Tooltip title='Фильтр'>
                                    <IconButton
                                        style={{background: JSON.stringify(filter)!=='{}'?'rgba(255, 255, 255, 0.2)':'transparent'}}
                                        aria-haspopup='true'
                                        color='inherit'
                                        onClick={()=>{
                                            setMiniDialog('Фильтр', <Filter filterShow={filterShow}/>)
                                            showMiniDialog(true)
                                        }}
                                    >
                                        <FilterList/>
                                    </IconButton>
                                </Tooltip>
                                &nbsp;
                                </>
                                :null
                            }
                            {sorts&&sorts.length>0?
                                <>
                                <Tooltip title='Сортировка'>
                                    <IconButton
                                        aria-owns={openSort ? 'menu-appbar' : undefined}
                                        aria-haspopup='true'
                                        onClick={handleMenuSort}
                                        color='inherit'
                                    >
                                        <Sort />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    id='menu-appbar'
                                    anchorEl={anchorElSort}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={openSort}
                                    onClose={handleCloseSort}
                                    key='sort'
                                >
                                    {sorts.map((elem, idx)=><MenuItem key={'sort'+idx} onClick={()=>{sort===`-${elem.field}`?setSort(elem.field):setSort(`-${elem.field}`);handleCloseSort();}}>{sort===`-${elem.field}`?<ArrowDownward />:sort===elem.field?<ArrowUpward />:<div style={{width: '24px'}}/>}{elem.name}</MenuItem>)}
                                </Menu>
                                &nbsp;
                                </>
                                :null
                            }
                            {
                                qrScannerShow?
                                    <Tooltip title='Сканер'>
                                        <IconButton
                                            aria-owns={openSearch ? 'menu-appbar' : undefined}
                                            aria-haspopup='true'
                                            onClick={()=>{
                                                setFullDialog('Сканер', <Scan/>)
                                                showFullDialog(true)
                                            }}
                                            color='inherit'
                                        >
                                            <QrCodeScanner />
                                        </IconButton>
                                    </Tooltip>
                                    :
                                    null
                            }
                            {
                                searchShow?
                                    <Tooltip title='Поиск'>
                                        <IconButton
                                            aria-owns={openSearch ? 'menu-appbar' : undefined}
                                            aria-haspopup='true'
                                            onClick={()=>{
                                                setOpenSearch(true)
                                                setTimeout(()=>{
                                                    if(document.getElementById('searchD'))
                                                        document.getElementById('searchD').focus()
                                                })
                                            }}
                                            color='inherit'
                                        >
                                            <Search />
                                        </IconButton>
                                    </Tooltip>
                                    :
                                    null
                            }
                            {
                                authenticated?
                                    <Tooltip title='Выйти'>
                                        <IconButton
                                            aria-owns='menu-appbar'
                                            aria-haspopup='true'
                                            color='inherit'
                                            onClick={()=>{
                                                const action = async() => {
                                                    logout(true)
                                                }
                                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                                showMiniDialog(true)
                                            }}
                                        >
                                            <LogoutIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    :
                                    <Tooltip title='Войти'>
                                        <IconButton
                                            aria-owns='menu-appbar'
                                            aria-haspopup='true'
                                            color='inherit'
                                            onClick={()=>{
                                                setMiniDialog('Вход', <Sign isMobileApp={isMobileApp}/>)
                                                showMiniDialog(true)
                                            }}
                                        >
                                            <LoginIcon/>
                                        </IconButton>
                                    </Tooltip>
                            }
                            </>
                    }
                </Toolbar>
            </AppBar>
        </div>
    )
})

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        appActions: bindActionCreators(appActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch),
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAppBar);
