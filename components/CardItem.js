import React from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import cardItemStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import Link from 'next/link';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import * as appActions from '../src/redux/actions/app'
import { pdDDMMYYHHMM } from '../src/lib'
import { getItems, getItemsCount } from '../src/gql/item'

const CardItem = React.memo((props) => {
    const {classes} = cardItemStyle();
    const { element, setList, history, setHistory, setCount, legalObject, limit, path } = props;
    const { isMobileApp, search, filter } = props.app;
    const { showLoad } = props.appActions;
    const { profile } = props.user;
    return (
            <Card className={isMobileApp?classes.cardM:classes.cardD} onClick={() => {
                if(element.price!=undefined&&!search) {
                    let appBody = (document.getElementsByClassName('App-body'))[0]
                    sessionStorage.scrollPostionStore = appBody.scrollTop
                    sessionStorage.scrollPostionName = path
                    sessionStorage.scrollPostionLimit = limit
                }
            }}>
               <CardActionArea>
                   {
                       element.price!=undefined?
                           <Link href='/item/[id]' as={`/item/${element._id}`}>
                               <CardContent>
                                   <h3>
                                       {element.name}
                                   </h3>
                                   <br/>
                                   <div className={classes.row}>
                                       <div className={classes.nameField}>
                                           Цена:&nbsp;
                                       </div>
                                       <div className={classes.value}>
                                           {element.price} сом
                                       </div>
                                   </div>
                                   {
                                       ['admin', 'superadmin'].includes(profile.role)?
                                           <>
                                           <div className={classes.row}>
                                               <div className={classes.nameField}>
                                                   Регистрация:&nbsp;
                                               </div>
                                               <div className={classes.value}>
                                                   {pdDDMMYYHHMM(element.createdAt)}
                                               </div>
                                           </div>
                                           <div className={classes.row}>
                                               <div className={classes.nameField}>
                                                   Налогоплательщик:&nbsp;
                                               </div>
                                               <div className={classes.value}>
                                                   {element.legalObject.name}
                                               </div>
                                           </div>
                                           </>
                                           :
                                           null
                                   }
                               </CardContent>
                           </Link>
                           :
                           <CardContent onClick={async ()=>{
                               showLoad(true)
                               sessionStorage.history = JSON.stringify([...history, element])
                               setHistory([...history, element])
                               setList(await getItems({legalObject, skip: 0, search, category: element._id, type: filter}))
                               setCount(await getItemsCount({legalObject, category: element._id, type: filter}));
                               showLoad(false)
                           }}>
                               <h3>
                                   {element.name}
                               </h3>
                           </CardContent>
                   }
                </CardActionArea>
            </Card>
    );
})

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardItem)