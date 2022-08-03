import React, {useState} from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import { getUsers } from '../../src/gql/user'
import { getClients } from '../../src/gql/client'
import Button from '@mui/material/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import AutocomplectOnline from '../app/AutocomplectOnline'
import { inputFloat, checkFloat } from '../../src/lib'
import * as snackbarActions from '../../src/redux/actions/snackbar'
import TextField from '@mui/material/TextField';

const SetBookings =  React.memo(
    (props) =>{
        const { classes } = dialogContentStyle();
        const { element, setElement } = props;
        const { filter, isMobileApp } = props.app;
        const { showMiniDialog } = props.mini_dialogActions;
        let [bookings, setBookings] = useState(element.bookings);
        const width = isMobileApp? (window.innerWidth-113) : 500
        const { showSnackBar } = props.snackbarActions;
        return (
            <div className={classes.main} style={{width}}>
                {
                    bookings.map((booking, idx) =>
                        <div className={classes.column} key={`setBooking${idx}`}>
                            <div className={![undefined, 'обработка', 'в пути'].includes(element.status)||isMobileApp?classes.column:classes.row}>
                                {
                                    [undefined, 'обработка', 'в пути'].includes(element.status)?
                                        <AutocomplectOnline
                                            error={!booking.manager}
                                            element={booking.manager}
                                            setElement={(manager)=>{
                                                bookings[idx].manager = manager
                                                setBookings([...bookings])
                                            }}
                                            defaultValue={booking.manager}
                                            getElements={async (search)=>{
                                                return await getUsers({search, ...filter.store?{store: filter.store._id}:{}, role: 'менеджер'})
                                            }}
                                            minLength={0}
                                            label={'Менеджер'}
                                        />
                                        :
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                Менеджер:&nbsp;
                                            </div>
                                            <div className={classes.value}>
                                                {bookings[idx].manager.name}
                                            </div>
                                        </div>
                                }
                                {
                                    [undefined, 'обработка', 'в пути'].includes(element.status)?
                                        <AutocomplectOnline
                                            element={booking.client}
                                            setElement={(client)=>{
                                                bookings[idx].client = client
                                                setBookings([...bookings])
                                            }}
                                            defaultValue={booking.client}
                                            getElements={async (search)=>{
                                                return await getClients({search})
                                            }}
                                            minLength={0}
                                            label={'Клиент'}
                                        />
                                        :
                                        bookings[idx].client&&bookings[idx].client.name?
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>
                                                    Клиент:&nbsp;
                                                </div>
                                                <div className={classes.value}>
                                                    {bookings[idx].client.name}
                                                </div>
                                            </div>
                                            :
                                            null
                                }
                            </div>
                            <div className={![undefined, 'обработка', 'в пути'].includes(element.status)||isMobileApp?classes.column:classes.row}>
                                {
                                    [undefined, 'обработка', 'в пути'].includes(element.status)?
                                        <TextField
                                            id='amount'
                                            error={!booking.amount}
                                            variant='standard'
                                            type={isMobileApp?'number':'text'}
                                            label='Количество'
                                            onChange={(event) => {
                                                bookings[idx].amount = inputFloat(event.target.value)
                                                setBookings([...bookings])
                                            }}
                                            value={bookings[idx].amount}
                                            className={classes.input}
                                        />
                                        :
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                {element.item.name}:&nbsp;
                                            </div>
                                            <div className={classes.value}>
                                                {booking.amount} {element.item.unit}
                                            </div>
                                        </div>
                                }
                                {
                                    [undefined, 'обработка', 'в пути'].includes(element.status)?
                                        <Button size='small' color='secondary' onClick={()=>{
                                            bookings.splice(idx, 1);
                                            setBookings([...bookings])
                                        }} className={classes.button}>
                                            Удалить
                                        </Button>
                                        :
                                        null
                                }
                            </div>
                            <br/>
                        </div>
                    )
                }
                {
                    [undefined, 'обработка', 'в пути'].includes(element.status)?
                        <Button onClick={async()=>{
                            setBookings([
                                {
                                    manager: null,
                                    client: null,
                                    amount: ''
                                },
                                ...bookings
                            ])
                        }} size='small' color='primary'>
                            Добавить бронь
                        </Button>
                        :
                        null
                }
                <div>
                    {
                        [undefined, 'обработка', 'в пути'].includes(element.status)?
                            <Button variant='contained' color='primary' onClick={async()=>{
                                let check = true
                                for(let i = 0; i <bookings.length; i++){
                                    bookings[i].amount = checkFloat(bookings[i].amount)
                                    if(!bookings[i].amount||!bookings[i].manager) {
                                        check = false
                                        break
                                    }
                                }
                                if(check) {
                                    setElement(bookings)
                                    showMiniDialog(false)
                                }
                                else
                                    showSnackBar('Заполните все поля')
                            }} className={classes.button}>
                                Сохранить
                            </Button>
                            :
                            null
                    }
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
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetBookings)