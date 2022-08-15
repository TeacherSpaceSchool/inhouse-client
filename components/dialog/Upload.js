import React, {useState, useRef} from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import * as appActions from '../../src/redux/actions/app'
import Button from '@mui/material/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import Confirmation from './Confirmation'
import Router from 'next/router'

const Filter =  React.memo(
    (props) =>{
        const { classes } = dialogContentStyle();
        const { upload, uploadText } = props;
        const { isMobileApp } = props.app;
        const { showSnackBar } = props.snackbarActions;
        const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
        const width = isMobileApp? (window.innerWidth-113) : 500
        let [document, setDocument] = useState(undefined);
        let documentRef = useRef(null);
        let handleChangeDocument = ((event) => {
            if(event.target.files[0].size/1024/1024<50){
                setDocument(event.target.files[0])
            } else {
                showSnackBar('Файл слишком большой')
            }
        })
        return (
            <div className={classes.main} style={{width}}>
                <div className={classes.value} style={{fontWeight: 'normal'}}>
                    {`Первоночально переведите все ячейки xlsx в текстовый тип.\n${uploadText}`}
                </div>
                <br/>
                <Button color={document?'primary':'secondary'} onClick={()=>{documentRef.current.click()}}>
                    {document?document.name:'Прикрепить файл'}
                </Button>
                <br/>
                <div>
                    {
                        document?
                            <Button variant='contained' color='primary' onClick={async()=>{
                                const action = async() => {
                                    let res = await upload({document})
                                    if(res&&res!=='ERROR') {
                                        showSnackBar('Успешно', 'success')
                                        Router.reload()
                                    }
                                    else
                                        showSnackBar('Ошибка', 'error')
                                }
                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                            }} className={classes.button}>
                                Загрузить
                            </Button>
                            :
                            null
                    }
                    <Button variant='contained' color='secondary' onClick={()=>showMiniDialog(false)} className={classes.button}>
                        Отмена
                    </Button>
                </div>
                <input
                    ref={documentRef}
                    accept='.xlsx, .xls, .csv'
                    style={{ display: 'none' }}
                    id='contained-button-file'
                    type='file'
                    onChange={handleChangeDocument}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(Filter)