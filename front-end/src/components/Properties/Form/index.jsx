import React, { useState, useEffect } from 'react';
import { Formik, Field } from 'formik'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { CardHeader, Grid, makeStyles, TextField, MenuItem } from '@material-ui/core';
import * as Yup from 'yup';
import LayoutLoadingOverlayArea from '../../Layout/Loading/OverlayArea';
import CustomField from '../../Custom/Field';
import CustomMessages from '../../Custom/Messages';
import * as PropTypes from 'prop-types';

import { Icon as Iconify } from '@iconify/react';
import broomIcon from '@iconify/icons-mdi/broom';
import PropertyOwnerService from '../../../services/PropertyOwnerService';

PropertiesForm.propTypes = {
    onSubmit: PropTypes.func,
    onClear: PropTypes.func,
    title: PropTypes.string,
    initialValues: PropTypes.object,
    validationSchema: PropTypes.any,
    messages: PropTypes.array,
    fieldsFullWidth: PropTypes.bool,
    headerActions: PropTypes.any
}

PropertiesForm.defaultProps = {
    onSubmit: () => null,
    onClear: null,
    title: null,
    messages: [],
    fieldsFullWidth: false,
    headerActions: null,
    initialValues: {
        pro_po_id: '',
        pro_cep: '',
        pro_number: '',
        pro_street: '',
        pro_neighborhood: '',
        pro_city: '',
        pro_state: '',
        pro_country: 'Brasil',
        pro_complement: ''
    },
    validationSchema: Yup.object().shape({
        pro_po_id: Yup.string().required('Campo obrigatório.'),
        pro_cep: Yup.string().required('Campo obrigatório.'),
        pro_number: Yup.string().required('Campo obrigatório.').matches(/^[0-9]+$/, 'Apenas números.'),
        pro_street: Yup.string().required('Campo obrigatório.'),
        pro_neighborhood: Yup.string().required('Campo obrigatório.'),
        pro_city: Yup.string().required('Campo obrigatório.'),
        pro_state: Yup.string().required('Campo obrigatório.'),
        pro_complement: Yup.string().required('Campo obrigatório.'),
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


export default function PropertiesForm(props) {

    const classes = useStyles();

    const fieldWidthMd = (!!props.fieldsFullWidth) ? 12 : 3;

    const [propertyOwners, setPropertyOwners] = useState({
        loading: false,
        data: []
    });

    useEffect(() => {
        (async () => {
            const resp = await PropertyOwnerService.getPropertyOwners();
            if(!resp.data.error){
                setPropertyOwners({ loading: false, data: resp.data.data });
            } else {
                setPropertyOwners({ loading: false, data: [] });
            }
        })()
    }, []);

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
                                <Grid item xs={12} md={12}>
                                    <Field fullWidth select name="pro_po_id" label="Proprietário" component={CustomField}>
                                        <MenuItem value="" disabled>Selecione ...</MenuItem>
                                        {propertyOwners.data.map((propertyOwner, key) => (
                                            <MenuItem value={propertyOwner.po_id} key={key}>{propertyOwner.po_name}</MenuItem>
                                        ))}
                                    </Field>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Field fullWidth name="pro_cep" label="CEP" component={CustomField} />
                                </Grid>                                
                                <Grid item xs={12} md={4}>
                                    <Field fullWidth name="pro_street" label="Rua" component={CustomField} />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <Field fullWidth name="pro_number" label="Nº" component={CustomField} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Field fullWidth name="pro_complement" label="Complemento" component={CustomField} />
                                </Grid>
                                <Grid item xs={12} md={5}>
                                    <Field fullWidth name="pro_neighborhood" label="Bairro" component={CustomField} />
                                </Grid>
                                <Grid item xs={12} md={5}>
                                    <Field fullWidth name="pro_city" label="Cidade" component={CustomField} />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <Field fullWidth name="pro_state" label="Estado" component={CustomField} />
                                </Grid>                                
                                <Grid item xs={12} md={9}/>
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