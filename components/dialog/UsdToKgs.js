import React, { useState } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import Button from '@mui/material/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import TextField from '@mui/material/TextField';
import { inputFloat, checkFloat } from '../../src/lib'
import { kgsFromUsdItem } from '../../src/gql/item'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import * as appActions from '../../src/redux/actions/app'

const UsdToKgs =  React.memo(
    (props) =>{
        let { priceUSD, primeCostUSD, setPriceKGS, setPrimeCostKGS, getList } = props;
        const { showLoad } = props.appActions;
        const { classes } = dialogContentStyle();
        const { isMobileApp } = props.app;
        const { showSnackBar } = props.snackbarActions;
        const { showMiniDialog } = props.mini_dialogActions;
        const width = isMobileApp? (window.innerWidth-113) : 500
        let [usdToKgs, setUsdToKgs] = useState('');
        return (
            <div className={classes.main} style={{width}}>
                <TextField
                    id='usdToKgs'
                    error={!usdToKgs}
                    variant='standard'
                    type={isMobileApp?'number':'text'}
                    label='Курс доллара'
                    onChange={(event) => setUsdToKgs(inputFloat(event.target.value))}
                    value={usdToKgs}
                    className={classes.input}
                />
                <div>
                    <Button variant='contained' color='primary' onClick={async()=>{
                        if(usdToKgs) {
                            usdToKgs = checkFloat(usdToKgs)
                            if (usdToKgs!=undefined && primeCostUSD!=undefined) {
                                let priceKGS = checkFloat(priceUSD * usdToKgs)
                                setPriceKGS(priceKGS?priceKGS:'')
                                let primeCostKGS = checkFloat(primeCostUSD * usdToKgs)
                                setPrimeCostKGS(primeCostKGS?primeCostKGS:'')
                                showMiniDialog(false)
                            }
                            else {
                                await showLoad(true)
                                let res = await kgsFromUsdItem({USD: usdToKgs, ceil: false})
                                if(res==='OK') {
                                    if(getList)
                                        await getList()
                                    await showLoad(false)
                                    showSnackBar('Успешно', 'success')
                                    showMiniDialog(false)
                                }
                                else {
                                    await showLoad(false)
                                    showSnackBar('Ошибка', 'error')
                                }
                            }
                        }
                        else
                            showSnackBar('Укажите курс доллара')
                    }} className={classes.button}>
                        Рассчитать
                    </Button>
                    <Button variant='contained' color='secondary' onClick={()=>showMiniDialog(false)} className={classes.button}>
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
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UsdToKgs)