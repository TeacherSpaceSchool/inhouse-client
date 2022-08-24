import React, {useState, useEffect, useRef} from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import cardStyle from '../../src/styleMUI/card'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import Info from '@mui/icons-material/Info';
import {cloneObject} from '../../src/lib';

const AutocomplectOnline = React.memo((props) => {
    const {classes} = cardStyle();
    let {setElement, element, getElements, label, defaultValue, autoRef, dialogAddElement, size, variant, redirect, minLength, error, disabled, freeSolo} = props;
    const [inputValue, setInputValue] = React.useState(defaultValue?defaultValue.name?defaultValue.name:defaultValue.number?defaultValue.number:defaultValue.length?defaultValue:'':'');
    const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
    let searchTimeOut = useRef(null);
    let first = useRef(true);
    const [focus, setFocus] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async()=>{
            if (!focus||inputValue.length<(minLength!=undefined?minLength:3)) {
                if(minLength!==0)
                    setElements([]);
                if (open)
                    setOpen(false)
                if (loading)
                    setLoading(false)
            }
            else {
                if (!loading)
                    setLoading(true)
                if (searchTimeOut.current)
                    clearTimeout(searchTimeOut.current)
                searchTimeOut.current = setTimeout(async () => {
                    if(first.current)
                        first.current = false
                    elements = await getElements(inputValue)
                    if(freeSolo&&inputValue){
                        let isList
                        for(let i = 0; i <elements.length; i++)
                            isList = elements[i].name===inputValue||elements[i].number===inputValue
                        if(!isList)
                            elements = [...elements, {name: inputValue, number: inputValue}]
                    }
                    if(elements.length>300)
                        elements = elements.slice(0, 300)
                    setElements(cloneObject(elements))
                    if (!open&&focus)
                        setOpen(true)
                    setLoading(false)
                }, first.current&&minLength===0?0:500)

            }
        })()
    }, [inputValue, focus]);
    useEffect(() => {
        if(!element&&inputValue&&inputValue!==defaultValue)
            setInputValue('')
        else if(typeof element === 'string'&&inputValue!==element)
            setInputValue(element)
        else if(element&&element.name&&inputValue!==element.name)
            setInputValue(element.name)
        else if(element&&element.number&&inputValue!==element.number)
            setInputValue(element.number)
    }, [element]);
    const handleChange = event => {
        setInputValue(event.target.value);
    };
    let [elements, setElements] = useState([]);
    return (
        <Autocomplete
            disabled={disabled}
            ref={autoRef}
            defaultValue={defaultValue}
            onClose={()=>setOpen(false)}
            onOpen={()=>{
                if (focus&&inputValue.length>=(minLength!=undefined?minLength:3)) 
                    setOpen(true)
            }}
            open={open}
            size={size?size:'medium'}
            inputValue={inputValue}
            className={classes.input}
            options={elements}
            getOptionLabel={option => option.name?option.name:option.number?option.number:option.length?option:''}
            onChange={(event, newValue) => {
                if(focus)
                    setFocus(false)
                if(dialogAddElement&&typeof newValue === 'string') {
                    setTimeout(() => {
                        setMiniDialog('Добавить', dialogAddElement(setElement, setInputValue, newValue.inputValue))
                        showMiniDialog(true)
                    });
                }
                else if(dialogAddElement&&newValue && newValue.inputValue) {
                    setMiniDialog('Добавить', dialogAddElement(setElement, setInputValue, newValue.inputValue))
                    showMiniDialog(true)
                }
                else {
                    setInputValue(!newValue?'':newValue.name?newValue.name:newValue.number?newValue.number:newValue.length?newValue:'')
                    setElement(newValue)
                }
            }}
            filterOptions={(options, params) => {
                if (!options.length&&dialogAddElement&&params.inputValue.length>2) {
                    options.push({
                        inputValue: params.inputValue,
                        name: `Добавить ${params.inputValue}`
                    });
                }
                return options;
            }}
            noOptionsText='Ничего не найдено'
            renderInput={params => (
                <div className={classes.row}>
                    {
                        redirect?
                            <a href={redirect} target='_blank'>
                                <Info style={{marginRight: 5, cursor: 'pointer'}}/>
                            </a>
                            :
                            null
                    }
                    <TextField style={{width: '100%'}} {...params} label={label} fullWidth error={error} variant={variant?variant:'standard'/*'outlined'*/}
                               onChange={handleChange}
                               onClick={()=>{
                                   if(!focus)
                                       setFocus(true)
                               }}
                               onBlur={()=>{
                                   if(focus) {
                                       setFocus(false)
                                       if (!element || (element.name !== inputValue && element.number !== inputValue && element !== inputValue)) {
                                           if (element)
                                               setElement(null)
                                           setInputValue('')
                                       }
                                   }
                               }}
                               InputProps={{
                                   ...params.InputProps,
                                   endAdornment: (
                                       <>
                                           {loading ? <CircularProgress color='inherit' size={20} /> : null}
                                           {params.InputProps.endAdornment}
                                       </>
                                   ),
                               }}
                    />
                </div>
            )}
        />
    )
})

function mapStateToProps () {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AutocomplectOnline);