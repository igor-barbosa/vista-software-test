import React, {useState} from 'react';
import { Formik, Field } from 'formik'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { CardHeader, Grid, makeStyles } from '@material-ui/core';
import * as Yup from 'yup';
import LayoutLoadingOverlayArea from '../../Layout/Loading/OverlayArea';
import CustomField from '../../Custom/Field';
import CustomMessages from '../../Custom/Messages';
import * as PropTypes from 'prop-types';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { Icon as Iconify } from '@iconify/react';
import broomIcon from '@iconify/icons-mdi/broom';
import ContractsService from '../../../services/ContractsService';

ContractsForm.propTypes = {
    onSubmit: PropTypes.func,
    onClear: PropTypes.func,
    title: PropTypes.string,
    initialValues: PropTypes.object,
    validationSchema: PropTypes.any,
    messages: PropTypes.array,
    fieldsFullWidth: PropTypes.bool,
    headerActions: PropTypes.any
}

ContractsForm.defaultProps = {
    onSubmit: () => null,
    onClear: null,
    title: null,
    messages: [],
    fieldsFullWidth: false,
    headerActions: null,
    initialValues: {
        ct_pro_id: '',
        propertyOwner: '',
        ct_cl_id: '',
        ct_start_date: '',
        ct_end_date: '',
        ct_administration_fee: '',
        ct_rent_amount: '',
        ct_condo_value: '',
        ct_IPTU: ''
    },
    validationSchema: Yup.object().shape({
        ct_pro_id: Yup.string().required('Campo obrigatório.'),
        propertyOwner: Yup.string(),
        ct_cl_id: Yup.string().required('Campo obrigatório.'),
        ct_start_date: Yup.string().required('Campo obrigatório.'),
        ct_end_date: Yup.string().required('Campo obrigatório.'),
        ct_administration_fee: Yup.string().required('Campo obrigatório.'),
        ct_rent_amount: Yup.string().required('Campo obrigatório.'),
        ct_condo_value: Yup.string().required('Campo obrigatório.'),
        ct_IPTU: Yup.string().required('Campo obrigatório.'),
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


export default function ContractsForm(props) {

    const classes = useStyles();

    const [monthlyPayments, setMonthlyPayments] = useState({
        list: [],
        messages: [],
        loading: false,
        compare: ''
    });

    const handleCalculateMonthlyPayments = (form) => async () => {
        setMonthlyPayments({
            ...monthlyPayments,
            loading: true,
            messages: []
        });

        const resp = await ContractsService.calculateMonthlyPayments(form.values)
        if(!resp.data.error){
            setMonthlyPayments({
                list: resp.data.data,
                loading: false,
                messages: [],
                compare: JSON.stringify(form.values)
            })
        } else {
            setMonthlyPayments({
                ...monthlyPayments,
                loading: false,
                messages: resp.data.data.messages
            });
        }
    }

    const hasPermissionForGenerateContract = (form) => JSON.stringify(form.values) === monthlyPayments.compare

    const customMessages = (() => {
        if(props.messages.length){
            return props.messages
        } else if(monthlyPayments.messages.length){
            return monthlyPayments.messages;
        } else {
            return [];
        }
    })();

    const handleClear = (formProps) => () => {
        
        const form = {...formProps};
        form.resetForm = () => {
            setMonthlyPayments({
                list: [],
                messages: [],
                loading: false,
                compare: ''
            })
            formProps.resetForm();
        }

        props.onClear(form)();
        
        
    }

    const handleSubmit = (values, formProps) => {
        
        const form = {...formProps};
        form.resetForm = () => {
            setMonthlyPayments({
                list: [],
                messages: [],
                loading: false,
                compare: ''
            })
            formProps.resetForm();
        }
        
        props.onSubmit(values, form);
    }


    return (
        <Formik 
            initialValues={props.initialValues} 
            onSubmit={handleSubmit} 
            validationSchema={props.validationSchema}>
            {formProps => (
                <LayoutLoadingOverlayArea loading={formProps.isSubmitting || monthlyPayments.loading}>                                                    
                    <Card>
                        <CardHeader title={props.title} action={props.headerActions}/>
                        <CardContent>
                            {customMessages.length > 0 && (
                                <CustomMessages 
                                    messages={customMessages}
                                />
                            )}
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <Field fullWidth name="ct_pro_id" label="Imóvel" component={CustomField} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Field fullWidth name="propertyOwner" disabled label="Proprietário" component={CustomField} />
                                </Grid>                                
                                <Grid item xs={12} md={4}>
                                    <Field fullWidth name="ct_cl_id" label="Cliente" component={CustomField} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Field fullWidth name="ct_start_date" label="Início do contrato" component={CustomField} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Field fullWidth name="ct_end_date" label="Fim do contrato" component={CustomField} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Field fullWidth name="ct_administration_fee" label="Taxa de administração" component={CustomField} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Field fullWidth name="ct_rent_amount" label="Aluguel" component={CustomField} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Field fullWidth name="ct_condo_value" label="Condomínio" component={CustomField} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Field fullWidth name="ct_IPTU" label="IPTU" component={CustomField} />
                                </Grid>                            

                                
                                <Grid item xs={12}>                                    
                                    {monthlyPayments.list.length > 0 && (
                                        <TableContainer component={Paper}>
                                            <Table className={classes.table} size="small" aria-label="a dense table">
                                                <TableHead>
                                                <TableRow>
                                                    <TableCell align="center">Parc.</TableCell>                                                    
                                                    <TableCell align="center">Vencimento</TableCell>                                                    
                                                    <TableCell align="center">Aluguel</TableCell>                                                    
                                                    <TableCell align="center">Condomínio</TableCell>                                                    
                                                    <TableCell align="center">IPTU</TableCell>                                                    
                                                    <TableCell align="center">Taxa de Admin.</TableCell>                                                    
                                                </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                {monthlyPayments.list.map(row => (
                                                    <TableRow key={row.mp_order}>
                                                        <TableCell align="center">{row.mp_order}/{monthlyPayments.list.length}</TableCell>
                                                        <TableCell align="center">{row.mp_date.split('-').reverse().join('/')}</TableCell>
                                                        <TableCell align="center">{row.mp_rent_amount}</TableCell>
                                                        <TableCell align="center">{row.mp_condo_value}</TableCell>
                                                        <TableCell align="center">{row.mp_IPTU}</TableCell>
                                                        <TableCell align="center">{row.mp_administration_fee}</TableCell>
                                                    </TableRow>
                                                ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )}
                                </Grid>
                                
                                <Grid item xs={12} md={12}>
                                    <div className={classes.buttonActionContainer}>
                                        {monthlyPayments.list.length > 0 && (
                                            <Button 
                                                className={classes.buttonSave}
                                                onClick={formProps.handleSubmit}                                         
                                                disabled={formProps.isSubmitting || !hasPermissionForGenerateContract(formProps)}                                                                                                                                     
                                                color="primary" 
                                                variant="contained">
                                                    Gerar Contrato
                                            </Button>
                                        )}
                                        
                                        <Button 
                                            className={classes.buttonSave}                                            
                                            onClick={handleCalculateMonthlyPayments(formProps)}
                                            disabled={formProps.isSubmitting}                                                                                         
                                            color="primary" 
                                            variant="contained">
                                                Calcular Parcelas
                                        </Button>
                                        
                                        {!!props.onClear && (
                                            <Button color="default" className={classes.buttonClear} onClick={handleClear(formProps)}>
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