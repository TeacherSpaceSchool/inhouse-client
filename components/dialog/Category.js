import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import Button from '@mui/material/Button';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import * as appActions from '../../src/redux/actions/app'
import LazyLoad from 'react-lazyload';
import { forceCheck } from 'react-lazyload';
import { getCategorys } from '../../src/gql/category'
import CardCategory from '../../components/CardCategory'
import CardCategoryPlaceholder from '../../components/CardPlaceholder'
const height = 194

const Category =  React.memo(
    (props) =>{
        const { showFullDialog } = props.mini_dialogActions;
        const { showLoad } = props.appActions;
        const { classes } = dialogContentStyle();
        const { setCategory, type } = props;
        let [history, setHistory] = useState([]);
        let [list, setList] = useState([]);
        const getList = async ()=>{
            setList(await getCategorys({category: history.length?history[history.length-1]._id:null, type}));
            (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
            forceCheck();
        }
        const toCategory = async (i)=>{
            showLoad(true)
            if(history.length>1)
                history.splice(history.length-i)
            else
                history = []
            await getList()
            setHistory([...history])
            showLoad(false)
        }
        useEffect(()=>{
            (async()=>{
                await getList()
            })()
        },[])
        return (
            <div className={classes.main}>
                <div style={{height: 'calc(100vh - 140px)', width: 'calc(100vw - 48px)', overflowY: 'auto'}}>
                    <Breadcrumbs style={{margin: 20}} aria-label='breadcrumb'>
                        <div style={{cursor: 'pointer', fontWeight: 500, color: !history.length?'#10183D':'#A0A0A0'}} onClick={()=>{
                            if(history.length) {
                                toCategory(2)
                            }
                        }}>
                            {history.length<3 ?
                                'Категории'
                                :
                                history[history.length-3].name
                            }
                        </div>
                        {
                            history.length?
                                <div style={{cursor: 'pointer', fontWeight: 500, color: history.length===1?'#10183D':'#A0A0A0'}} onClick={async()=>{
                                    if(history.length>1) {
                                        toCategory(1)
                                    }
                                }}>
                                    {history.length===1 ?
                                        history[0].name
                                        :
                                        history[history.length-2].name
                                    }
                                </div>
                                :
                                null
                        }
                        {
                            history.length>1?
                                <div style={{fontWeight: 500, color: '#10183D'}} onClick={()=>{}}>
                                    {history[history.length-1].name}
                                </div>
                                :
                                null
                        }
                    </Breadcrumbs>
                    <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
                        {list?list.map((element, idx)=>
                            <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardCategoryPlaceholder height={height}/>}>
                                <CardCategory history={history} setHistory={setHistory} list={list} category={history.length?history[history.length - 1]._id:undefined} idx={idx}  key={element._id} setList={setList} element={element}/>
                            </LazyLoad>
                        ):null}
                    </div>
                </div>
                <center>
                    <Button variant='contained' color='primary' onClick={async()=>{
                        setCategory(history.length?history[history.length - 1]:undefined)
                        showFullDialog(false);
                    }} className={classes.button}>
                        Сохранить
                    </Button>
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
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Category)