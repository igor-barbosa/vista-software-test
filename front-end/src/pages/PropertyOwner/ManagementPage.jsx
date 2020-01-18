import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useSnackbar } from 'notistack';

//import ClientTable from '../../components/Client/Table';
import PropertyOwnerService from '../../services/PropertyOwnerService';
import PropertyOwnerForm from '../../components/PropertyOwner/Form';
import propertyOwnerActions from '../../redux/property-owner/actions';
import PropertyOwnerTable from '../../components/PropertyOwner/Table';


export default function PropertyOwnerManagementPage(){

    const dispatch = useDispatch();
    const actions = bindActionCreators(propertyOwnerActions, dispatch);

    const [formMessages, setFormMessages] = useState([]);
    
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleRemove = (id, key) => {
        actions.removePropertyOwner(key);
    }

    const handleFormSave = async (values, form) => {
        setFormMessages([]);
        const resp = await PropertyOwnerService.savePropertyOwner(values);
        if(!resp.data.error) {
            enqueueSnackbar('Os dados foram salvos com sucesso!', {
                variant: 'success'
            });
            form.resetForm();
            actions.addPropertyOwner(resp.data.data);
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
            const resp = await PropertyOwnerService.getPropertyOwners();
            if(!resp.data.error){
                actions.fetchPropertyOwners(resp.data.data);
            } else {
                enqueueSnackbar('Não foi possível carregar os dados.', {
                    variant: 'error'
                }); 
            }
        })();
    }, [])

    return (
        <div>
            <PropertyOwnerForm
                title="Cadastrar Proprietário"
                onSubmit={handleFormSave} 
                messages={formMessages}
                onClear={handleFormClear}
            />  
            <br/>            
            <PropertyOwnerTable
                onRemove={handleRemove}
            />          
        </div>
    )
}