import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useSnackbar } from 'notistack';

import ContractsService from '../../services/ContractsService';
import ContractsForm from '../../components/Contracts/Form';
import contractsActions from '../../redux/contracts/actions';
import ContractsTable from '../../components/Contracts/Table';
//import PropertiesTable from '../../components/Properties/Table';


export default function ContractsManagementPage(){

    const dispatch = useDispatch();
    const actions = bindActionCreators(contractsActions, dispatch);

    const [formMessages, setFormMessages] = useState([]);
    
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleRemove = (id, key) => {
        actions.removeContract(key);
    }

    const handleFormSave = async (values, form) => {
        setFormMessages([]);
        const resp = await ContractsService.saveContract(values);
        if(!resp.data.error) {
            enqueueSnackbar('Os dados foram salvos com sucesso!', {
                variant: 'success'
            });
            form.resetForm();
            actions.addContract(resp.data.data);
        } else {
            setFormMessages(resp.data.data.messages)
        }
    }

    const handleFormClear = ({resetForm}) => () => {
        resetForm();
        setFormMessages([]);
    }


    useEffect(() => {
        (async () => {
            const resp = await ContractsService.getContracts();
            if(!resp.data.error){
                actions.fetchContracts(resp.data.data);
            } else {
                enqueueSnackbar('Não foi possível carregar os dados.', {
                    variant: 'error'
                }); 
            }
        })();
    }, [])

    return (
        <div>
            <ContractsForm 
                title="Novo Contrato" 
                onSubmit={handleFormSave}  
                messages={formMessages} 
                onClear={handleFormClear} 
            />  
            <br/>            
            <ContractsTable 
                onRemove={handleRemove}
            />
        </div>
    )
}