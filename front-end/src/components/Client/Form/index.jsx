import React, {useState} from 'react';
import { Formik, Field } from 'formik'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { CardHeader, TextField, Grid, makeStyles } from '@material-ui/core';
import * as Yup from 'yup';
import LayoutLoadingOverlayArea from '../../Layout/Loading/OverlayArea';
import CustomField from '../../Custom/Field';
import ClientService from '../../../services/ClientService';
import { useSnackbar } from 'notistack';
import CustomMessages from '../../Custom/Messages';

ClientForm.propTypes = {

}

ClientForm.defaultProps = {
   
}


export default function ClientForm(props) {

    const [clientFormMessages, setClientFormMessages] = useState([]);
    
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();


    const initialValues = {
        cl_name: '',
        cl_email: '',
        cl_phone: ''
    }

    const validationSchema = Yup.object().shape({
        cl_name: Yup.string().required('Campo obrigatório.'),
        cl_email: Yup.string().required('Campo obrigatório.').email('E-mail inválido.'),
        cl_phone: Yup.string().required('Campo obrigatório.').matches(/^[0-9]+$/, 'Apenas números.'),
    })

    const handleSubmit = async (values, actions) => {
        setClientFormMessages([]);

        const resp = await ClientService.saveClient(values);

        if(!resp.data.error) {
            enqueueSnackbar('Os dados foram salvos com sucesso!', {
                variant: 'success'
            });
            actions.resetForm();
        } else {
            setClientFormMessages(resp.data.data.messages)
        }
    }

    return (
        <Formik 
            initialValues={initialValues} 
            onSubmit={handleSubmit} 
            validationSchema={validationSchema}>
            {formProps => (
                <LayoutLoadingOverlayArea loading={formProps.isSubmitting}>                                                    
                    <Card>
                        <CardHeader title="Cadastrar Cliente"/>
                        <CardContent>
                            {clientFormMessages.length > 0 && (
                                <CustomMessages messages={clientFormMessages}/>
                            )}
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={3}>
                                    <Field fullWidth name="cl_name" label="Nome Completo" component={CustomField} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Field fullWidth name="cl_email" label="E-mail" component={CustomField} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Field fullWidth name="cl_phone" label="Telefone" component={CustomField} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Button 
                                        onClick={formProps.handleSubmit}
                                        fullWidth 
                                        disabled={formProps.isSubmitting}                                                                                         
                                        color="primary" 
                                        variant="contained">
                                            Salvar Dados
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>                        
                    </Card>
                </LayoutLoadingOverlayArea>
            )}
        </Formik>
    );
}