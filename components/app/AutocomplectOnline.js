import React, {useState, useEffect, useRef} from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import cardStyle from '../../src/styleMUI/card'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import Info from '@mui/icons-material/Info';

const AutocomplectOnline = React.memo((props) => {
    const {classes} = cardStyle();
    let {setElement, element, getElements, label, defaultValue, autoRef, dialogAddElement, size, variant, redirect, minLength, error, disabled, freeSolo} = props;
    const focus = useRef(false);
    const [inputValue, setInputValue] = React.useState(defaultValue?defaultValue.name?defaultValue.name:defaultValue.number?defaultValue.number:defaultValue.length?defaultValue:'':'');
    const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
    let searchTimeOut = useRef(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async()=>{
            if(minLength===0){
                if (!loading)
                    setLoading(true)
                elements = await getElements(inputValue)
                if(freeSolo&&inputValue){
                    let isList
                    for(let i = 0; i <elements.length; i++)
                        isList = elements[i].name===inputValue||elements[i].number===inputValue
                    if(!isList)
                        elements = [...elements, {name: inputValue, number: inputValue}]
                }
                if(elements.length<300)
                    setElements(elements)
                else
                    setElements(elements.subarray(0, 300))
                setLoading(false)
            }
            else {
                if (!focus.current||inputValue.length<(minLength?minLength:3)) {
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
                        let elements = await getElements(inputValue)
                        if(freeSolo&&inputValue){
                            let isList
                            for(let i = 0; i <elements.length; i++)
                                isList = elements[i].name===inputValue||elements[i].number===inputValue
                            if(!isList)
                                elements = [...elements, {name: inputValue, number: inputValue}]
                        }
                        setElements(elements)
                        if (!open)
                            setOpen(true)
                        setLoading(false)
                    }, 500)

                }
            }
        })()
    }, [inputValue]);
    useEffect(() => {
        if(!element&&inputValue&&inputValue!==defaultValue)
            setInputValue('')
        else if(typeof element === 'string'&&inputValue!==element)
            setInputValue(element)
    }, [element]);
    const handleChange = event => {
        focus.current = true
        setInputValue(event.target.value);
    };
    let [elements, setElements] = useState([]);
    return (
        <Autocomplete
            disabled={disabled}
            ref={autoRef}
            defaultValue={defaultValue}
            onClose={()=>setOpen(false)}
            open={open}
            size={size?size:'medium'}
            inputValue={inputValue}
            className={classes.input}
            options={elements}
            getOptionLabel={option => option.name?option.name:option.number?option.number:option.length?option:''}
            onChange={(event, newValue) => {
                focus.current = false
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
                if (dialogAddElement&&params.inputValue.length>2) {
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
                                   if(minLength===0&&!open)
                                       setOpen(true)
                               }}
                               onBlur={()=>{
                                   if(!element||(element.name!==inputValue&&element.number!==inputValue&&element!==inputValue)) {
                                       setElement(null)
                                       setInputValue('')
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