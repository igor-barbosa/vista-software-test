import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useSnackbar } from 'notistack';

import PropertiesService from '../../services/PropertiesService';
import PropertiesForm from '../../components/Properties/Form';
import propertiesActions from '../../redux/properties/actions';
import PropertiesTable from '../../components/Properties/Table';


export default function PropertiesManagementPage(){

    const dispatch = useDispatch();
    const actions = bindActionCreators(propertiesActions, dispatch);

    const [formMessages, setFormMessages] = useState([]);
    
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleRemove = (id, key) => {
        actions.removeProperty(key);
    }

    const handleFormSave = async (values, form) => {
        setFormMessages([]);
        const resp = await PropertiesService.saveProperty(values);
        if(!resp.data.error) {
            enqueueSnackbar('Os dados foram salvos com sucesso!', {
                variant: 'success'
            });
            form.resetForm();
            actions.addProperty(resp.data.data);
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
            const resp = await PropertiesService.getProperties();
            if(!resp.data.error){
                actions.fetchProperties(resp.data.data);
            } else {
                enqueueSnackbar('Não foi possível carregar os dados.', {
                    variant: 'error'
                }); 
            }
        })();
    }, [])

    return (
        <div>
            <PropertiesForm title="Cadastrar Imóveis" onSubmit={handleFormSave}  messages={formMessages} onClear={handleFormClear} />  
            <br/>            
            <PropertiesTable onRemove={handleRemove} />
        </div>
    )
}