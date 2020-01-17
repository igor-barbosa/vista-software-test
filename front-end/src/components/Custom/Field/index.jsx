import React from 'react';
import { TextField } from '@material-ui/core';

export default function CustomField({ field, form, ...props}){
    const isTouched = !!form.touched[field.name];
    const hasError = !!form.errors[field.name];
    const error = form.errors[field.name];

    const showError = hasError && (isTouched || form.submitCount > 0);

    return (
        <TextField {...field} {...props} error={showError} helperText={showError && error} />
    );
}