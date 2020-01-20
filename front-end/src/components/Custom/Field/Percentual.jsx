import React from 'react';
import {TextField, InputAdornment} from '@material-ui/core';
import NumberFormat from 'react-number-format';

function ReactNumberFormatCurrency(props){
    const { inputRef, onChange, onBlur, ...other } = props;

    const handleChange = event => {
        event.target.value = event.target.value.replace(/^(R\$\s)(0+)/, '');
        onChange(event);
    }
    return(
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            allowNegative={false}
            onChange={handleChange}
            onBlur={onBlur}
            displayType={'input'}
            decimalSeparator={','}
            thousandSeparator={'.'}
            decimalScale={2}
            allowNegative={false}
        />
    )
}

export default function CustomFieldPercentual({ field, form, ...props}){
    const isTouched = !!form.touched[field.name];
    const hasError = !!form.errors[field.name];
    const error = form.errors[field.name];

    const showError = hasError && (isTouched || form.submitCount > 0);
    
    return (
        <TextField 
            {...field} 
            {...props} 
            error={showError} 
            helperText={showError && error} 
            inputProps={{
                style: {
                    textAlign: 'right'
                }
            }}
            InputProps={{
                inputComponent: ReactNumberFormatCurrency,
                endAdornment: (
                    <InputAdornment position="end">
                        %
                    </InputAdornment>
                )
            }}
        />
    );
}