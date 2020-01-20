import React, {useState} from 'react';
import { Formik, Field } from 'formik'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { CardHeader, TextField, Grid, makeStyles, IconButton, MenuItem } from '@material-ui/core';
import * as Yup from 'yup';
import LayoutLoadingOverlayArea from '../../Layout/Loading/OverlayArea';
import CustomField from '../../Custom/Field';
import CustomMessages from '../../Custom/Messages';
import * as PropTypes from 'prop-types';

import { Icon as Iconify, InlineIcon } from '@iconify/react';
import broomIcon from '@iconify/icons-mdi/broom';

PropertyOwnerForm.propTypes = {
    onSubmit: PropTypes.func,
    onClear: PropTypes.func,
    title: PropTypes.string,
    initialValues: PropTypes.object,
    validationSchema: PropTypes.any,
    messages: PropTypes.array,
    fieldsFullWidth: PropTypes.bool,
    headerActions: PropTypes.any
}

PropertyOwnerForm.defaultProps = {
    onSubmit: () => null,
    onClear: null,
    title: null,
    messages: [],
    fieldsFullWidth: false,
    headerActions: null,
    initialValues: {
        po_name: '',
        po_email: '',
        po_transfer_day: ''
    },
    validationSchema: Yup.object().shape({
        po_name: Yup.string().required('Campo obrigatório.'),
        po_email: Yup.string().required('Campo obrigatório.').email('E-mail inválido.'),
        po_transfer_day: Yup.string().required('Campo obrigatório.').matches(/^[0-9]+$/, 'Apenas números.'),
    })

}

const useStyles = makeStyles({
    buttonActionContainer: {
        display: 'flex',    
    },
    buttonSave: {
        flex: 8,
        marginRight: '10px'
    },
    buttonClear: {
        flex: 2
    }
})


export default function PropertyOwnerForm(props) {

    const classes = useStyles();

    const fieldWidthMd = (!!props.fieldsFullWidth) ? 12 : 3;

    function getTransferDays(){
        const days = [];
        for(let i=1; i <= 28;i++) days.push(`${i}`);
        return days;
    }

    return (
        <Formik 
            initialValues={props.initialValues} 
            onSubmit={props.onSubmit} 
            validationSchema={props.validationSchema}>
            {formProps => (
                <LayoutLoadingOverlayArea loading={formProps.isSubmitting}>                                                    
                    <Card>
                        <CardHeader title={props.title} action={props.headerActions}/>
                        <CardContent>
                            {props.messages.length > 0 && (
                                <CustomMessages 
                                    messages={props.messages}
                                />
                            )}
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={fieldWidthMd}>
                                    <Field fullWidth name="po_name" label="Nome Completo" component={CustomField} />
                                </Grid>
                                <Grid item xs={12} md={fieldWidthMd}>
                                    <Field fullWidth name="po_email" label="E-mail" component={CustomField} />
                                </Grid>
                                <Grid item xs={12} md={fieldWidthMd}>
                                    <Field fullWidth select name="po_transfer_day" label="Dia de Repasse" component={CustomField}>
                                        <MenuItem value="" disabled>Selecione ...</MenuItem>
                                        {getTransferDays().map((day, key) => (
                                            <MenuItem value={day} key={key}>{day.padStart(2,'0')}</MenuItem>
                                        ))}
                                    </Field>
                                    {/* <Field fullWidth name="po_transfer_day" label="Dia de Repasse" component={CustomField} /> */}
                                </Grid>
                                <Grid item xs={12} md={fieldWidthMd}>
                                    <div className={classes.buttonActionContainer}>
                                        <Button 
                                            className={classes.buttonSave}
                                            onClick={formProps.handleSubmit}                                         
                                            disabled={formProps.isSubmitting}                                                                                         
                                            color="primary" 
                                            variant="contained">
                                                Salvar Dados
                                        </Button>

                                        {!!props.onClear && (
                                            <Button color="default" className={classes.buttonClear} onClick={props.onClear(formProps)}>
                                                <Iconify icon={broomIcon} style={{fontSize: '24px', color: 'rgba(0, 0, 0, 0.54)'}}/>
                                            </Button>
                                        )}                                        
                                    </div>
                                </Grid>
                            </Grid>
                        </CardContent>                        
                    </Card>
                </LayoutLoadingOverlayArea>
            )}
        </Formik>
    );
}