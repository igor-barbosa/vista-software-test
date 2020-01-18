import React, { useState, useEffect } from 'react';
import ClientForm from '../../components/Client/Form';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useSnackbar } from 'notistack';

import clientsActions from '../../redux/clients/actions';
import ClientTable from '../../components/Client/Table';
import ClientService from '../../services/ClientService';


export default function ClientsManagementPage(){

    const dispatch = useDispatch();
    const actions = bindActionCreators(clientsActions, dispatch);

    const [clientFormMessages, setClientFormMessages] = useState([]);
    
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleRemoveClient = (id, key) => {
        actions.removeClient(key);
    }

    const handleSaveClient = async (values, form) => {
        setClientFormMessages([]);
        const resp = await ClientService.saveClient(values);
        if(!resp.data.error) {
            enqueueSnackbar('Os dados foram salvos com sucesso!', {
                variant: 'success'
            });
            form.resetForm();
            actions.addClient(resp.data.data);
        } else {
            setClientFormMessages(resp.data.data.messages)
        }
    }

    const handleFormClear = ({resetForm}) => () => {
        resetForm();
        setClientFormMessages([]);
    }


    useEffect(() => {
        (async () => {
            const resp = await ClientService.getClients();
            if(!resp.data.error){
                actions.fetchClients(resp.data.data);
            } else {
                enqueueSnackbar('Não foi possível carregar os dados.', {
                    variant: 'error'
                });
            }
        })();
    }, [])

    return (
        <div>
            <ClientForm 
                title="Cadastrar Cliente"
                onSubmit={handleSaveClient} 
                messages={clientFormMessages}
                onClear={handleFormClear}
            />
            <br/>            
            <ClientTable 
                onRemoveClient={handleRemoveClient}
            />
        </div>
    )
}