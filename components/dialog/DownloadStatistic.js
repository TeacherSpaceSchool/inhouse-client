import React, {useState} from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import { getStores } from '../../src/gql/store'
import { getPositions, getDepartments } from '../../src/gql/user'
import { getFactorys } from '../../src/gql/factory'
import { getCategorys } from '../../src/gql/category'
import { getPromotions } from '../../src/gql/promotion'
import { getItems, getTypeItems } from '../../src/gql/item'
import { getWarehouses } from '../../src/gql/warehouse'
import * as appActions from '../../src/redux/actions/app'
import Button from '@mui/material/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import AutocomplectOnline from '../app/AutocomplectOnline'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import {getCashboxes} from '../../src/gql/cashbox';
import {getUsers} from '../../src/gql/user';
import {getClients} from '../../src/gql/client';
import {getCpas} from '../../src/gql/cpa';
import TextField from '@mui/material/TextField';
import {cloneObject, pdDatePicker, pdDDMMYYYY} from '../../src/lib'
import * as snackbarActions from '../../src/redux/actions/snackbar'

const roles = ['все', 'менеджер', 'завсклад', 'кассир', 'доставщик', 'менеджер/завсклад', 'управляющий', 'юрист', 'сотрудник']
const levels = ['Все', 'Бронза', 'Серебро', 'Золото', 'Платина']
const operations = ['все', 'приход', 'расход']
const currencies = ['все', 'сом', 'доллар', 'рубль', 'тенге', 'юань']
const statusClients = ['холодный', 'теплый', 'горячий']

const DownloadStatistic =  React.memo(
    (props) =>{
        const { classes } = dialogContentStyle();
        const { isMobileApp } = props.app;
        const { profile } = props.user;
        const { unload, filterShow } = props;
        const { showMiniDialog } = props.mini_dialogActions;
        const { showSnackBar } = props.snackbarActions;
        let [filter, setFilter] = useState(props.app.filter?cloneObject(props.app.filter):{});
        const width = isMobileApp? (window.innerWidth-113) : 500
        let handleStatus = (event) => {
            let status = event.target.value!=='все'?event.target.value:null
            setFilter({...filter, status})
        };
        let handleRole = (event) => {
            let role = event.target.value!=='все'?event.target.value:null
            setFilter({...filter, role})
        };
        let handleStatusClient = (event) => {
            setFilter({...filter, statusClient: event.target.value})
        };
        let handleLevel = (event) => {
            let level = event.target.value!=='Все'?event.target.value:null
            setFilter({...filter, level})
        };
        let handleCurrency = (event) => {
            let currency = event.target.value!=='все'?event.target.value:null
            setFilter({...filter, currency})
        };
        let handleOperation = (event) => {
            let operation = event.target.value!=='все'?event.target.value:null
            setFilter({...filter, operation})
        };
        return (
            <div className={classes.main} style={{width}}>
                {
                    filterShow.timeDif?
                        <FormControl>
                            <FormLabel>Срок</FormLabel>
                            <RadioGroup
                                row
                                value={filter.timeDif}
                                onChange={event => {
                                    setFilter({
                                        ...filter,
                                        timeDif: event.target.value
                                    })
                                }}
                            >
                                <FormControlLabel value='soon' control={<Radio/>} label='Скоро'/>
                                <FormControlLabel value='today' control={<Radio/>} label='Сегодня'/>
                                <FormControlLabel value='late' control={<Radio/>} label='Просрочен'/>
                            </RadioGroup>
                        </FormControl>
                        :
                        null
                }
                {
                    filterShow.date?
                        <TextField
                            id='date'
                            type='date'
                            variant='standard'
                            label='Дата'
                            value={filter.date}
                            onChange={(event) => setFilter({
                                ...filter,
                                date: event.target.value
                            })}
                            className={classes.input}
                        />
                        :
                        null
                }
                {
                    filterShow.period?
                        <div className={classes.row}>
                            <TextField
                                id='date'
                                type='date'
                                variant='standard'
                                value={filter.dateStart}
                                onChange={(event) => {
                                    let dateStart = ''
                                    let dateEnd = filter.dateEnd
                                    if(event.target.value) {
                                        dateStart = new Date(event.target.value)
                                        if(dateEnd) {
                                            dateEnd = new Date(dateEnd)
                                            if (dateEnd < dateStart || pdDDMMYYYY(dateEnd) === pdDDMMYYYY(dateStart))
                                                dateEnd.setDate(dateStart.getDate() + 1)
                                            dateEnd = pdDatePicker(dateEnd)
                                        }
                                        dateStart = pdDatePicker(dateStart)
                                    }
                                    else
                                        dateEnd = ''
                                    setFilter({
                                        ...filter,
                                        dateStart,
                                        dateEnd
                                    })
                                }}
                                style={{marginRight: 10}}
                                className={classes.input}
                            />
                            <TextField
                                id='date'
                                type='date'
                                variant='standard'
                                value={filter.dateEnd}
                                onChange={(event) => {
                                    let dateStart = filter.dateStart
                                    let dateEnd = ''
                                    if(event.target.value) {
                                        dateEnd = new Date(event.target.value)
                                        dateStart = dateStart?new Date(dateStart):new Date(dateEnd)
                                        if(dateEnd<dateStart||pdDDMMYYYY(dateEnd)===pdDDMMYYYY(dateStart))
                                            dateStart.setDate(dateEnd.getDate() - 1)
                                        dateStart = pdDatePicker(dateStart)
                                        dateEnd = pdDatePicker(dateEnd)
                                    }
                                    else
                                        dateStart = ''
                                    setFilter({
                                        ...filter,
                                        dateStart,
                                        dateEnd
                                    })
                                }}
                                className={classes.input}
                            />
                        </div>
                        :
                        null
                }
                {
                    filterShow.delivery?
                        <TextField
                            id='date'
                            type='date'
                            variant='standard'
                            label='Доставка'
                            value={filter.delivery}
                            onChange={(event) => setFilter({
                                ...filter,
                                delivery: event.target.value
                            })}
                            className={classes.input}
                        />
                        :
                        null
                }
                {
                    ['admin',  'управляющий'].includes(profile.role)&&filterShow.store?
                        <AutocomplectOnline
                            element={filter.store}
                            setElement={(store)=>{
                                setFilter({
                                    ...filter,
                                    store,
                                    warehouse: null,
                                    cashbox: null,
                                    user: null
                                })
                            }}
                            defaultValue={filter.store}
                            getElements={async (search)=>{
                                return await getStores({search})
                            }}
                            minLength={0}
                            label={'Магазин'}
                        />
                        :
                        null
                }
                {
                    filterShow.cashbox?
                        <AutocomplectOnline
                            element={filter.cashbox}
                            setElement={(cashbox)=>{
                                setFilter({
                                    ...filter,
                                    cashbox
                                })
                            }}
                            defaultValue={filter.cashbox}
                            getElements={async (search)=>{
                                return await getCashboxes({search, ...filter.store?{store: filter.store._id}:{}})
                            }}
                            minLength={0}
                            label={'Касса/Банк'}
                        />
                        :
                        null
                }
                {
                    filterShow.warehouse?
                        <AutocomplectOnline
                            element={filter.warehouse}
                            setElement={(warehouse)=>{
                                setFilter({
                                    ...filter,
                                    warehouse
                                })
                            }}
                            defaultValue={filter.warehouse}
                            getElements={async (search)=>{
                                return await getWarehouses({search, ...filter.store?{store: filter.store._id}:{}})
                            }}
                            minLength={0}
                            label={'Склад'}
                        />
                        :
                        null
                }
                {
                    ['admin',  'управляющий'].includes(profile.role)&&filterShow.user?
                        <AutocomplectOnline
                            element={filter.user}
                            setElement={(user)=>{
                                setFilter({
                                    ...filter,
                                    user
                                })
                            }}
                            defaultValue={filter.user}
                            getElements={async (search)=>{
                                return await getUsers({
                                    search,
                                    ...filter.store?{store: filter.store._id}:{},
                                    ...filter.department?{department: filter.department.name}:{},
                                    ...filter.position?{position: filter.position.name}:{},
                                    ...filterShow.userRole?{role: filterShow.userRole}:filter.role?{role: filter.role}:{}
                                })
                            }}
                            minLength={0}
                            label={'Сотрудник'}
                        />
                        :
                        null
                }
                {
                    filterShow.client?
                        <AutocomplectOnline
                            element={filter.client}
                            setElement={(client)=>{
                                setFilter({
                                    ...filter,
                                    client
                                })
                            }}
                            defaultValue={filter.client}
                            getElements={async (search)=>{
                                return await getClients({search})
                            }}
                            minLength={0}
                            label={'Клиент'}
                        />
                        :
                        null
                }
                {
                    filterShow.item?
                        <AutocomplectOnline
                            element={filter.item}
                            setElement={(item)=>{
                                setFilter({
                                    ...filter,
                                    item
                                })
                            }}
                            defaultValue={filter.item}
                            getElements={async (search)=>{
                                return await getItems({search})
                            }}
                            label={'Модель'}
                        />
                        :
                        null
                }
                {
                    filterShow.factory?
                        <AutocomplectOnline
                            element={filter.factory}
                            setElement={(factory)=>{
                                setFilter({
                                    ...filter,
                                    factory
                                })
                            }}
                            defaultValue={filter.factory}
                            getElements={async (search)=>{
                                return await getFactorys({search})
                            }}
                            minLength={0}
                            label={'Фабрика'}
                        />
                        :
                        null
                }
                {
                    filterShow.typeItem?
                        <AutocomplectOnline
                            element={filter.typeItem}
                            setElement={(typeItem)=>{
                                setFilter({
                                    ...filter,
                                    typeItem
                                })
                            }}
                            defaultValue={filter.typeItem}
                            getElements={async (search)=>{
                                return await getTypeItems({search})
                            }}
                            minLength={0}
                            label={'Тип товара'}
                        />
                        :
                        null
                }
                {
                    filterShow.category?
                        <AutocomplectOnline
                            element={filter.category}
                            setElement={(category)=>{
                                setFilter({
                                    ...filter,
                                    category
                                })
                            }}
                            defaultValue={filter.category}
                            getElements={async (search)=>{
                                return await getCategorys({search})
                            }}
                            minLength={0}
                            label={'Категория'}
                        />
                        :
                        null
                }
                {
                    filterShow.promotion?
                        <AutocomplectOnline
                            element={filter.promotion}
                            setElement={(promotion)=>{
                                setFilter({
                                    ...filter,
                                    promotion
                                })
                            }}
                            defaultValue={filter.promotion}
                            getElements={async (search)=>{
                                return await getPromotions({search})
                            }}
                            minLength={0}
                            label={'Акция'}
                        />
                        :
                        null
                }
                {
                    filterShow.statusClient?
                        <>
                        <br/>
                        <FormControl className={classes.input}>
                            <InputLabel>Статус клиента</InputLabel>
                            <Select variant='standard' value={filter.statusClient} onChange={handleStatusClient}>
                                {statusClients.map((element)=>
                                    <MenuItem key={element} value={element}>{element}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                        </>
                        :
                        null
                }
                {
                    filterShow.role?
                        <>
                        <br/>
                        <FormControl className={classes.input}>
                            <InputLabel>Роль</InputLabel>
                            <Select variant='standard' value={filter.role} onChange={handleRole}>
                                {roles.map((element)=>
                                    <MenuItem key={element} value={element}>{element}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                        </>
                        :
                        null
                }
                {
                    filterShow.status?
                        <>
                        <br/>
                        <FormControl className={classes.input}>
                            <InputLabel>Статус</InputLabel>
                            <Select variant='standard' value={filter.status} onChange={handleStatus}>
                                {filterShow.status.map((element)=>
                                    <MenuItem key={element} value={element}>{element}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                        </>
                        :
                        null
                }
                {
                    filterShow.level?
                        <>
                        <br/>
                        <FormControl className={classes.input}>
                            <InputLabel>Уровень</InputLabel>
                            <Select variant='standard' value={filter.level} onChange={handleLevel}>
                                {levels.map((element)=>
                                    <MenuItem key={element} value={element}>{element}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                        </>
                        :
                        null
                }
                {
                    filterShow.currency?
                        <>
                        <br/>
                        <FormControl className={classes.input}>
                            <InputLabel>Валюта</InputLabel>
                            <Select variant='standard' value={filter.currency} onChange={handleCurrency}>
                                {currencies.map((element)=>
                                    <MenuItem key={element} value={element}>{element}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                        </>
                        :
                        null
                }
                {
                    filterShow.operation?
                        <>
                        <br/>
                        <FormControl className={classes.input}>
                            <InputLabel>Операция</InputLabel>
                            <Select variant='standard' value={filter.operation} onChange={handleOperation}>
                                {operations.map((element)=>
                                    <MenuItem key={element} value={element}>{element}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                        </>
                        :
                        null
                }
                {
                    filterShow.department?
                        <AutocomplectOnline
                            element={filter.department}
                            setElement={(department)=>{
                                setFilter({
                                    ...filter,
                                    department
                                })
                            }}
                            defaultValue={filter.department}
                            getElements={async (search)=>{
                                return await getDepartments({search})
                            }}
                            minLength={0}
                            label={'Отдел'}
                        />
                        :
                        null
                }
                {
                    filterShow.position?
                        <AutocomplectOnline
                            element={filter.position}
                            setElement={(position)=>{
                                setFilter({
                                    ...filter,
                                    position
                                })
                            }}
                            defaultValue={filter.position}
                            getElements={async (search)=>{
                                return await getPositions({search})
                            }}
                            minLength={0}
                            label={'Должность'}
                        />
                        :
                        null
                }
                {
                    filterShow.cpa?
                        <AutocomplectOnline
                            element={filter.cpa}
                            setElement={(cpa)=>{
                                setFilter({
                                    ...filter,
                                    cpa
                                })
                            }}
                            defaultValue={filter.cpa}
                            getElements={async (search)=>{
                                return await getCpas({search})
                            }}
                            minLength={0}
                            label={'Дизайнер'}
                        />
                        :
                        null
                }
                <br/>
                <div>
                    <Button variant='contained' color='secondary' onClick={()=>{
                        showMiniDialog(false);
                    }} className={classes.button}>
                        Закрыть
                    </Button>
                    <Button variant='contained' color='primary' onClick={async()=>{
                        let res = await unload(filter)
                        if(res)
                            window.open(res, '_blank');
                        else
                            showSnackBar('Ошибка', 'error')
                        showMiniDialog(false)
                    }} className={classes.button}>
                        Выгрузить
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

export default connect(mapStateToProps, mapDispatchToProps)(DownloadStatistic)