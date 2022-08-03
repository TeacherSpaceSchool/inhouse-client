import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import { getStores } from '../../src/gql/store'
import { getPositions, getDepartments } from '../../src/gql/user'
import { getFactorys } from '../../src/gql/factory'
import { getCategorys } from '../../src/gql/category'
import { getItems } from '../../src/gql/item'
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
import {getMoneyArticles} from '../../src/gql/moneyArticle';
import {getMoneyRecipients} from '../../src/gql/moneyRecipient';
import TextField from '@mui/material/TextField';

const roles = ['все', 'менеджер', 'завсклад', 'кассир', 'доставщик', 'менеджер/завсклад', 'управляющий', 'юрист', 'сотрудник']
const levels = ['Все', 'Бронза', 'Серебро', 'Золото', 'Платина']
const operations = ['все', 'приход', 'расход']
const currencies = ['все', 'сом', 'доллар', 'рубль', 'тенге', 'юань']

const Filter =  React.memo(
    (props) =>{
        const { classes } = dialogContentStyle();
        const { setFilter } = props.appActions;
        const { filterShow } = props;
        const { filter, isMobileApp } = props.app;
        const { showMiniDialog } = props.mini_dialogActions;
        const width = isMobileApp? (window.innerWidth-113) : 500
        let handleStatus = (event) => {
            let status = event.target.value!=='все'?event.target.value:null
            setFilter({...filter, status})
        };
        let handleRole = (event) => {
            let role = event.target.value!=='все'?event.target.value:null
            setFilter({...filter, role})
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
                    filterShow.debtor?
                        <FormControl>
                            <FormLabel>Задолжность</FormLabel>
                            <RadioGroup
                                row
                                value={filter.debtor}
                                onChange={event => {
                                    setFilter({
                                        ...filter,
                                        debtor: event.target.value
                                    })
                                }}
                            >
                                <FormControlLabel value='all' control={<Radio/>} label='Все'/>
                                <FormControlLabel value='installment' control={<Radio/>} label='Рассрочка'/>
                                <FormControlLabel value='payment' control={<Radio/>} label='Платеж'/>
                            </RadioGroup>
                        </FormControl>
                        :
                        null
                }
                {
                    filterShow.store?
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
                            label={'Касса'}
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
                    filterShow.user?
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
                            minLength={0}
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
                    filterShow.moneyArticle?
                        <AutocomplectOnline
                            element={filter.moneyArticle}
                            setElement={(moneyArticle)=>{
                                setFilter({
                                    ...filter,
                                    moneyArticle
                                })
                            }}
                            defaultValue={filter.moneyArticle}
                            getElements={async (search)=>{
                                return await getMoneyArticles({search})
                            }}
                            minLength={0}
                            label={'Статья'}
                        />
                        :
                        null
                }
                {
                    filterShow.moneyRecipient?
                        <AutocomplectOnline
                            element={filter.moneyRecipient}
                            setElement={(moneyRecipient)=>{
                                setFilter({
                                    ...filter,
                                    moneyRecipient
                                })
                            }}
                            defaultValue={filter.moneyRecipient}
                            getElements={async (search)=>{
                                return await getMoneyRecipients({search})
                            }}
                            minLength={0}
                            label={'Получатель денег'}
                        />
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
                            label={'Партнер'}
                        />
                        :
                        null
                }
                <br/>
                <div>
                    <Button variant='contained' color='primary' onClick={async()=>showMiniDialog(false)} className={classes.button}>
                        Сохранить
                    </Button>
                    <Button variant='contained' color='secondary' onClick={()=>{
                        setFilter({})
                        showMiniDialog(false);
                    }} className={classes.button}>
                        Сбросить
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
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter)