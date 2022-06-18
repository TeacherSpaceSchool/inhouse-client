import React, {useState, useEffect, useRef} from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import cardStyle from '../../src/styleMUI/card'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../src/redux/actions/mini_dialog'
import Info from '@mui/icons-material/Info';

const AutocomplectOnline = React.memo((props) => {
    const {classes} = cardStyle();
    const {setElement, getElements, label, defaultValue, autoRef, dialogAddElement, size, variant, redirect, minLength, error, disabled} = props;
    const focus = useRef(false);
    const [inputValue, setInputValue] = React.useState(defaultValue?defaultValue.name?defaultValue.name:defaultValue.number?defaultValue.number:'':'');
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
                if(elements.length<300)
                    setElements(elements)
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
                        setElements(await getElements(inputValue))
                        if (!open)
                            setOpen(true)
                        setLoading(false)
                    }, 500)

                }
            }
        })()
    }, [inputValue]);
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
            getOptionLabel={option => `${option.name?option.name:option.number}${option.rnmNumber?`/${option.rnmNumber}`:''}`}
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
                    setInputValue(!newValue?'':newValue.name?newValue.name:newValue.number)
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
                    <TextField {...params} label={`Выбрать ${label}`} fullWidth error={error} variant={variant?variant:'standard'/*'outlined'*/}
                               onChange={handleChange}
                               onClick={()=>{
                                   if(minLength===0&&!open)
                                       setOpen(true)
                               }}
                               InputProps={{
                                   ...params.InputProps,
                                   endAdornment: (
                                       <React.Fragment>
                                           {loading ? <CircularProgress color='inherit' size={20} /> : null}
                                           {params.InputProps.endAdornment}
                                       </React.Fragment>
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